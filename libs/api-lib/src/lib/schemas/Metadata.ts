import * as mongoose from 'mongoose';

export const MetadataSchema = new mongoose.Schema({
  author: String,

  downloads: Number,
  ratings: Number,
  filename: String,
  script: String

});

export interface Metadata {
    author: string;

    downloads: number;
    ratings: number;
    filename: string;
    script: string;

}