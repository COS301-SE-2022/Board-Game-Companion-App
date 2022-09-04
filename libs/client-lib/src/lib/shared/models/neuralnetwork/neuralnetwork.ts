import { modelData } from './modelData';

export interface neuralnetwork{
    created?:Date,
    loss?: number,
    accuracy?: number,
    setup: modelData
}