import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const createdReview = new this.reviewModel({
      ...createReviewDto,
      userId,
    });
    return createdReview.save();
  }

  async findByRestaurant(restaurantId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ restaurantId })
      .populate('userId', 'name')
      .populate('restaurantId', 'name')
      .exec();
  }
}