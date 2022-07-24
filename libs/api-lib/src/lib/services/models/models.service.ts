import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node'

@Injectable()
export class ModelsService {

    createModel(inputFeatures:string[],outputLabel:string[]):tf.Sequential{
        const model:tf.Sequential = tf.sequential();

        model.add(tf.layers.dense({inputShape: [inputFeatures.length], units: inputFeatures.length, useBias: true}));
        model.add(tf.layers.dense({units: outputLabel.length, activation: 'softmax'}));
        return model;
    }

    convertToTensor(data:any[],inputFeatures:string[],outputLabels:string[]){
        return tf.tidy(()=>{
            console.log(data);
            
            tf.util.shuffle(data);

            const inputs = data.map(obj => {
                const result:any[] = [];
                
                inputFeatures.forEach((value)=>{
                    if(obj[value] !== undefined && obj[value] !== null)
                        result.push(obj[value]);
                })

                return result;
            })

            const outputs = data.map(obj => {
                const result:any[] = [];

                outputLabels.forEach((value)=>{
                    if(obj[value] !== undefined && obj[value] !== null)
                        result.push(obj[value]);
                })

                return result;
            })

            const inputTensor = tf.tensor(inputs);
            const outputTensor = tf.tensor(outputs);
            const inputMax = inputTensor.max();
            //inputMax.print();
            const inputMin = inputTensor.min();
            //inputMin.print();
            const outputMax = outputTensor.max();
            //outputMax.print();
            const outputMin = outputTensor.min();
            //outputMin.print();

            const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
            //normalizedInputs.print();
            const normalizedOutputs = outputTensor.sub(outputMin).div(outputMax.sub(outputMin));
            //normalizedOutputs.print();

            return { 
                inputs: normalizedInputs,
                outputs: normalizedOutputs,
                inputMax,
                inputMin,
                outputMax,
                outputMin
            }
        });
    }

    train(model:tf.Sequential,inputFeatures:string[],outputLabel:string[]){
        model.compile({
            optimizer: tf.train.adam(),
            loss: 'sparseCategoricalCrossentropy',
            metrics: ['accuracy']
        })
    }
}
