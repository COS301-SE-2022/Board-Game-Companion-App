import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class ModelsService {


    async create(data:any[],inputFeatures:string[],outputLabel:string[]){
        let model:tf.Sequential = this.createModel(inputFeatures,outputLabel);
        const convertedData = this.convertToTensor(data,inputFeatures,outputLabel);
        model = await this.train(model,convertedData.inputs,convertedData.outputs);
        await model.save("uploads/testModel");
        return {passed:true};
    }

    createModel(inputFeatures:string[],outputLabel:string[]):tf.Sequential{
        const model:tf.Sequential = tf.sequential();
        console.log(inputFeatures);
        console.log(outputLabel); 

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
            const inputMaximum = inputTensor.max();
            //inputMax.print();
            const inputMinimum = inputTensor.min();
            //inputMin.print();
            const outputMaximum = outputTensor.max();
            //outputMax.print();
            const outputMinimum = outputTensor.min();
            //outputMin.print();

            const normalizedInputs = inputTensor.sub(inputMinimum).div(inputMaximum.sub(inputMinimum));
            //normalizedInputs.print();
            const normalizedOutputs = outputTensor.sub(outputMinimum).div(outputMaximum.sub(outputMinimum));
            //normalizedOutputs.print();

            return { 
                inputs: normalizedInputs,
                outputs: normalizedOutputs,
                inputMax: inputMaximum,
                inputMin: inputMinimum,
                outputMax: outputMaximum,
                outputMin: outputMinimum
            }
        });
    }

    async train(model:tf.Sequential,inputs:tf.Tensor,outputs:tf.Tensor):Promise<tf.Sequential>{
        model.compile({
            optimizer: tf.train.adam(),
            loss: 'sparseCategoricalCrossentropy',
            metrics: ['accuracy']
        })

        const options = {
            batchSize: 20,
            epochs: 32,
            shuffle: true
        }
        
        await model.fit(inputs,outputs,options);
        
        return model;
    }
}
