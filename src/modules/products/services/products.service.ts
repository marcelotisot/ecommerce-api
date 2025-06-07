import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../../modules/categories/services/categories.service';
import { PaginatedResult, PaginationDto } from '../../../common';
import { envs } from '../../../config';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Product ,ProductImage } from '../entities';

@Injectable()
export class ProductsService {

  private s3: S3Client;
  private bucketName = envs.awsS3BucketName; 

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly categoriesService: CategoriesService
  ) {
    // AWS S3 Client Config
    this.s3 = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: envs.awsAccessKeyId,
        secretAccessKey: envs.awsSecretAccessKey
      }
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoriesService.findOne(createProductDto.categoryId);

    const product = this.productRepository.create({
      ...createProductDto,
      category
    });

    return this.productRepository.save(product); 
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Product>> {
    
    const { page = 1, limit = 10} = paginationDto;
    
    const skip = ( page - 1 ) * limit;

    const [products, total] = await this.productRepository.findAndCount({

      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
      
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: products,

      meta: {
        total: total,
        per_page: Number(limit),
        current_page: Number(page),
        last_page: lastPage
      }
    }

  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if(updateProductDto.categoryId) {

      const category = await this.categoriesService.findOne(
        updateProductDto.categoryId
      
      );
      product.category = category;

    }
    
    return this.productRepository.save(product);

  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);

    await this.productRepository.softRemove(product);

    return { message: 'Product deleted' };
  }

  /**
   * Subir imagenes del producto a AWS S3
   * @param productId 
   * @param file 
   * @returns url de la imagen almacenada en el bucket de AWS S3
   */
  async uploadProductImage(productId: string, file: Express.Multer.File): Promise<string> {

    // Obtenemos y validamos existencia del producto
    const product = await this.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const fileExt = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.s3.send(command);

    const url =`https://${this.bucketName}.s3.amazonaws.com/${fileName}`;

    // Creamos y asociamos la imagen al producto
    const productImage = this.productImageRepository.create({
      product, 
      url
    });

    await this.productImageRepository.save(productImage);
    
    return url;

  }

}
