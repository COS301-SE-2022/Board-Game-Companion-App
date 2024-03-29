import { file } from '../general/file';

export interface neuralnetwork{
    _id: string;
    name: string;
    created: Date;
    labels: string[];
    min: number[];
    max: number[];
    loss: number;
    accuracy: number;
    model?: file;
    weights?: file;
}