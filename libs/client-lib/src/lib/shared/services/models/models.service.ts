import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';

export interface args{
    learningRate?:number;
    rho?:number;
    initialAccumulatorValue?:number;
    beta1?:number;
    beta2?:number;
    epsilon?:number;
    decay?:number;
    momentum?:number;
    useNesterov?:boolean;
    centered?:boolean;
}

export interface layer{
    index: number;
    activation: string;
    nodes: number;
}

@Injectable()
export class ModelsService {
  private api = "";

  constructor(private readonly httpClient:HttpClient){
    this.api = "http://localhost:3333/api/"
  }

  uploadModel(model:tf.Sequential):Promise<tf.io.SaveResult>{
    return model.save(this.api + "models/save-files");
  }

  uploadMetaData(name:string,created:Date,labels:any[],max:number[],min:number[]){
      //return this.httpClient.post<>(this.api + "models/")
  }


  setLayer(nodes:number,activation:string,inputshape?:number[]){
    
    console.log(nodes);
    
    if(activation === "elu"){        
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "elu",
            useBias: true
        })
    }else if(activation === "hardSigmoid"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "hardSigmoid",
            useBias: true
        })
    }else if(activation === "linear"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "linear",
            useBias: true
        })        
    }else if(activation === "relu"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "relu",
            useBias: true
        })
    }else if(activation === "relu6"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "relu6",
            useBias: true
        })
    }else if(activation === "selu"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "selu",
            useBias: true
        })
    }else if(activation === "sigmoid"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "sigmoid",
            useBias: true
        })
    }else if(activation === "softmax"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "softmax",
            useBias: true
        })
    }else if(activation === "softplus"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "softplus",
            useBias: true
        })
    }else if(activation === "tanh"){
        return tf.layers.dense({
            inputShape: inputshape,
            units: nodes,
            activation: "tanh",
            useBias: true
        })
    }

    return tf.layers.dense({
        inputShape: inputshape,
        units: nodes,
        activation: "softmax",
        useBias: true
    })
  }

  createModel(inputs:number,labels:number,layers:layer[]):tf.Sequential{
    const model:tf.Sequential = tf.sequential();

    model.add(this.setLayer(layers[0].nodes,layers[0].activation,[inputs]))

    for(let count = 1; count < layers.length; count++){
        model.add(this.setLayer(layers[0].nodes,layers[0].activation))
    }

    model.add(tf.layers.dense({
        units: labels, 
        activation: 'softmax'
    }));


    return model;
  }

  convertToTensors(data:any[],features:string[],label:string){
     return tf.tidy(()=>{
            
            tf.util.shuffle(data);

            const inputs = data.map(obj => {
                const result:any[] = [];
                
                features.forEach((value)=>{
                    if(obj[value] !== undefined && obj[value] !== null)
                        result.push(obj[value]);
                })

                return result;
            })

            const labels = [...new Set(data.map(item => item[label]))];
            const labelsTensor = tf.tensor1d(labels);

            const outputs = data.map(obj => labels.indexOf(obj[label]))

            const inputTensor = tf.tensor2d(inputs,[data.length,features.length]);
            const outputTensor = tf.tensor1d(outputs,"int32");
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
            console.log(labels);
            
            return { 
                labels: labels,
                labelsTensor: labelsTensor,
                inputs: normalizedInputs,
                outputs: normalizedOutputs,
                inputMax: inputMaximum,
                inputMin: inputMinimum,
                outputMax: outputMaximum,
                outputMin: outputMinimum
            }
        });    
    }

    getOptimizationFunction(optimizer:number,values:args):tf.Optimizer{

        if(optimizer === 0){
            return tf.train.adadelta(values.learningRate,values.rho,values.epsilon);
        }else if(optimizer === 1){
            return tf.train.adagrad(values.learningRate as number,values.initialAccumulatorValue);
        }else if(optimizer === 2){
            return tf.train.adam(values.learningRate,values.beta1,values.beta2,values.epsilon);
        }else if(optimizer === 3){
            return tf.train.adamax(values.learningRate,values.beta1,values.beta2,values.epsilon,values.decay);
        }else if(optimizer === 4){
            return tf.train.momentum(values.learningRate as number,values.momentum as number,values.useNesterov);
        }else if(optimizer === 5){
            return tf.train.rmsprop(values.learningRate as number,values.decay,values.momentum,values.epsilon,values.centered);
        }

        return tf.train.sgd(values.learningRate || 0.2);
    }

    train(model:tf.Sequential,inputs:tf.Tensor,outputs:tf.Tensor,optimizer:tf.Optimizer,options:tf.ModelFitArgs):Promise<tf.History>{
        model.compile({
            optimizer: optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        })
        
        
        return model.fit(inputs,outputs,options);
    }

}
