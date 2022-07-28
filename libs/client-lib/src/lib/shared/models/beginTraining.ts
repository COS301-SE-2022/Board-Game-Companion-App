import * as tf from '@tensorflow/tfjs'

export interface beginTraining{
    name: string,
    model: tf.Sequential,
    xs: tf.Tensor,
    ys: tf.Tensor,
    optimizer: tf.Optimizer,
    epochs:number
    dataDivider:number[]
}