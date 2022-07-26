import * as mongoose from 'mongoose';
import { user } from '../models/general/user';

export const collectionSchema = new mongoose.Schema({
  owner: {name:"",email:""},
  name: String,
  description: String,
  boardgames: [String]
});

export interface collection{
    owner: user,
    name: string,
    description: string,
    boardgames: string[]
}