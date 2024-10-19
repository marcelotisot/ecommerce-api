import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly usersService: UsersService,
    private readonly ProductsService: ProductsService,
  ) {}

  // Paginacion
  findAllReviews(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.reviewRepository.find({
      take: limit,
      skip: offset,

      where: { deleted: false }
    });

  }

  async createReview(createReviewDto: CreateReviewDto) {
    
    const { userId, productId, comment } = createReviewDto;

    const user = await this.usersService.findUserById( userId );
    const product = await this.ProductsService.findProductById( productId );

    const review = this.reviewRepository.create({
      user, product, comment
    });

    return this.reviewRepository.save( review ); 
  }

  async findReviewById(id: string) {
    const review = await this.reviewRepository.findOneBy({id});

    if (!review) 
      throw new NotFoundException(`Review with id ${id} not found`);

    return review;
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto) {

    const { comment } = updateReviewDto;

    const review = await this.reviewRepository.preload({
      id: id,
      comment: comment
    });

    if (!review) 
      throw new NotFoundException(`Review with id ${id} not found`);

    return this.reviewRepository.save(review);

  }

  async deleteReview(id: string) {
    const review = await this.findReviewById(id);
    review.deleted = true;
    await this.reviewRepository.save(review);
  }
}
