import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  Query 
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('all')
  findAllReviews(@Query() paginationDto: PaginationDto) {
    return this.reviewsService.findAllReviews(paginationDto);
  }

  @Post('create')
  @Auth() // Debe estar autenticado / enviar el token
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get('find/:id')
  findReviewById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findReviewById(id);
  }

  @Patch('update/:id')
  @Auth()
  updateReview(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewsService.updateReview(id, updateReviewDto);
  }

  @Delete('delete/:id')
  @Auth()
  deleteReview(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
