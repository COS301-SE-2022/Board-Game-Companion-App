// import mongoose from "mongoose";
import * as mongoose from 'mongoose';

export const collectionSchema = new mongoose.Schema({
  owner: String,
  name: String,
  description: String,
  boardgames: [String]
});

export interface collection{
    owner: string,
    name: string,
    description: string,
    boardgames: string[]
}