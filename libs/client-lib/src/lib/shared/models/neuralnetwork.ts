import * as tf from '@tensorflow/tfjs'

export interface neuralnetwork{
    name:string;
    created?:Date;
    size?:Date;
    model?: tf.Sequential,
    xs?: tf.Tensor,
    ys?: tf.Tensor,
    optimizer?: tf.Optimizer,
    epochs?: number,
    progress?: number,
    loss?: number,
    accuracy?: number,
    upload?: boolean,
    labels?: any[],
    min?: number[],
    max?: number[]
}