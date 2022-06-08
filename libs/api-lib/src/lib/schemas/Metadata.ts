import * as mongoose from 'mongoose';

export const MetadataSchema = new mongoose.Schema({
  author: String,
  downloads: String,
  ratings: String,
  filename: String
});

export interface Metadata {
    author: string;
    downloads: string;
    ratings: string;
    filename: string
}