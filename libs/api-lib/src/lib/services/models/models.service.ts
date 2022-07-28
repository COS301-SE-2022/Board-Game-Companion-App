import { Injectable } from '@nestjs/common';
// import * as tf from '@tensorflow/tfjs-node';
// import fs = require('fs');

@Injectable()
export class ModelsService {

    
    // async test(){
    //     const textData = fs.readFileSync("templates/main.txt","utf8");
    //     const data = JSON.parse(textData);
    //     const inputFeatures = ["r","g","b"];
    //     const label = "label";

    //     this.create(data,inputFeatures,label);
    // }

    // async create(data:any[],inputFeatures:string[],label:string){
    //     const convertedData = this.convertToTensor(data,inputFeatures,label);

    //     let model:tf.Sequential = this.createModel(inputFeatures,convertedData.labels.length);

    //     const xs = convertedData.inputs;
    //     const ys = tf.oneHot(convertedData.outputs,convertedData.labels.length);

    //     model = await this.train(model,xs,ys);

    //     await model.save("uploads/testModel");

    //     return {passed:true};
    // }

    // createModel(inputFeatures:string[],labels:number):tf.Sequential{
    //     const model:tf.Sequential = tf.sequential();

    //     model.add(tf.layers.dense({
    //         inputShape: [inputFeatures.length], 
    //         units: 16,
    //         activation: 'sigmoid', 
    //         useBias: true
    //     }));

    //     model.add(tf.layers.dense({
    //         units: labels, 
    //         activation: 'softmax'
    //     }));


    //     return model;
    // }

    // convertToTensor(data:any[],inputFeatures:string[],label:string){
    //     return tf.tidy(()=>{
    //         //console.log(data);
            
    //         tf.util.shuffle(data);

    //         const inputs = data.map(obj => {
    //             const result:any[] = [];
                
    //             inputFeatures.forEach((value)=>{
    //                 if(obj[value] !== undefined && obj[value] !== null)
    //                     result.push(obj[value]);
    //             })

    //             return result;
    //         })

    //         const labels = [...new Set(data.map(item => item[label]))];
    //         const labelsTensor = tf.tensor1d(labels);

    //         const outputs = data.map(obj => labels.indexOf(obj[label]))

    //         const inputTensor = tf.tensor2d(inputs,[data.length,inputFeatures.length]);
    //         const outputTensor = tf.tensor1d(outputs,"int32");
    //         const inputMaximum = inputTensor.max();
    //         //inputMax.print();
    //         const inputMinimum = inputTensor.min();
    //         //inputMin.print();
    //         const outputMaximum = outputTensor.max();
    //         //outputMax.print();
    //         const outputMinimum = outputTensor.min();
    //         //outputMin.print();

    //         const normalizedInputs = inputTensor.sub(inputMinimum).div(inputMaximum.sub(inputMinimum));
    //         //normalizedInputs.print();
    //         const normalizedOutputs = outputTensor.sub(outputMinimum).div(outputMaximum.sub(outputMinimum));
    //         //normalizedOutputs.print();

    //         return { 
    //             labels: labels,
    //             labelsTensor: labelsTensor,
    //             inputs: normalizedInputs,
    //             outputs: normalizedOutputs,
    //             inputMax: inputMaximum,
    //             inputMin: inputMinimum,
    //             outputMax: outputMaximum,
    //             outputMin: outputMinimum
    //         }
    //     });
    // }

    // async train(model:tf.Sequential,inputs:tf.Tensor,outputs:tf.Tensor):Promise<tf.Sequential>{
    //     model.compile({
    //         optimizer: tf.train.sgd(0.2),
    //         loss: 'categoricalCrossEntropy',
    //         metrics: ['accuracy']
    //     })

    //     const options = {
    //         batchSize: 20,
    //         epochs: 32,
    //         shuffle: true
    //     }
        
    //     await model.fit(inputs,outputs,options);
        
    //     return model;
    // }
}
