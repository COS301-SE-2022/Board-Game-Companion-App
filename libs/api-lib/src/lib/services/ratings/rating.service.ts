import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from '../../schemas/rating.schema';
import { scriptDto } from '../../models/dto/scriptDto';

@Injectable()
export class RatingService {}
