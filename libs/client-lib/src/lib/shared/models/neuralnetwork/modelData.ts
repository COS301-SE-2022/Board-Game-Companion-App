import * as tf from '@tensorflow/tfjs'


export interface modelData{
    name: string,
    model?: tf.Sequential,
    trainXs?: tf.Tensor,
    trainYs?: tf.Tensor,
    testXs?: tf.Tensor,
    testYs?: tf.Tensor,
    optimizer?: tf.Optimizer,
    epochs?:number
    labels:any[],
    min: tf.Tensor,
    max: tf.Tensor
}