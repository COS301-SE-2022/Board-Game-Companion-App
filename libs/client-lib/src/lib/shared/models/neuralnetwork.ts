import { modelData } from './modelData';

export interface neuralnetwork{
    created?:Date,
    loss?: number,
    accuracy?: number,
    upload?: boolean,
    setup: modelData
}