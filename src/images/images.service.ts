import { 
  BadRequestException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Image } from './entities/image.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class ImagesService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly configService: ConfigService,
    private readonly datasource: DataSource
  ) {}

  
  async uploadImages( files: Express.Multer.File[], uploadImageDto: UploadImageDto ) {

    const { productId } = uploadImageDto;

    if ( !files )
      throw new BadRequestException('Make sure that the file is an image');

    const product = await this.productRepo.findOne({
      where: { id: productId }
    });

    if ( !product )
      throw new NotFoundException(`Product with id ${productId} not found`);

    // Transacciones
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();

    for (const file of files) {
      const imageUrl = `${ this.configService.get('HOST_API') }/images/${ file.filename }`;

      const image = queryRunner.manager.create( Image, { url: imageUrl } );

      await queryRunner.manager.save( image );

      product.images.push(image);
    }

    await queryRunner.manager.save( product );
    await queryRunner.commitTransaction();

    return {
      ok: true,
      message: 'Las imagenes fueron cargadas correctamente'
    };

  }
  
}
