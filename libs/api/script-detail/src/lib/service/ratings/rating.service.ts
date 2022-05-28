import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from '../../schema/rating.schema';
import { scriptDto } from '../../model/dto/scriptDto';

@Injectable()
export class RatingService {}
