import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import { layer } from '../../models/neuralnetwork/layer';
import { optimizerArgs } from '../../models/neuralnetwork/optimizerArgs';
import { user } from '../../models/general/user';
import { StorageService } from '../storage/storage.service';
import { feature } from '../../models/neuralnetwork/feature';
import { neuralnetwork } from '../../models/neuralnetwork/neuralnetwork';

@Injectable()
export class ModelsService {
  private api = "";

  constructor(private readonly httpClient:HttpClient,private readonly storageService:StorageService){
    this.api = "https://board-game-companion-app.herokuapp.com/api/";
    //this.api = "http://localhost:3333/api/"
}

  alreadyStored(model:string): Promise<boolean>{
    let param = new HttpParams();
    param = param.set("userName",sessionStorage.getItem("name") as string);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);  
    param = param.set("modelName",model);

    return new Promise((resolve,reject) => {
        this.httpClient.get<boolean>(this.api + "models/stored",{params: param}).subscribe({
            next: (value:boolean) => {
                resolve(value);
            },
            error: (error) => {
                reject()
            }
        })
    })
  }

  getAll(): Observable<neuralnetwork[]>{
    let param = new HttpParams();
    param = param.set("userName",sessionStorage.getItem("name") as string);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);  

    return this.httpClient.get<neuralnetwork[]>(this.api + "models/all",{params:param});
  }

  getModel(id:string): Observable<neuralnetwork>{
    let param = new HttpParams();
    param = param.set("id",id);  

    return this.httpClient.get<neuralnetwork>(this.api + "models/retrieve-by-id",{params:param});
  }

  getModelByName(name:string): Observable<neuralnetwork>{
    let param = new HttpParams();
    param = param.set("name",name);
    param = param.set("userName",sessionStorage.getItem("name") as string);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);

    return this.httpClient.get<any>(this.api + "models/retrieve-by-name",{params:param});
  }

  getModels(idList:string[]):Observable<any>{
    let param = new HttpParams();
    param = param.set("userName",sessionStorage.getItem("name") as string);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);  
    param = param.set("idList",JSON.stringify(idList));

    return this.httpClient.get<any>(this.api + "models/retrieve-subset",{params:param}); 
  }

  getModelsByIdOnly(idList:string[]):Observable<any>{
    let param = new HttpParams();
    param = param.set("idList",JSON.stringify(idList));

    return this.httpClient.get<any>(this.api + "models/retrieve-subset-by-id-only",{params:param});
  }

  remove(id: string): Observable<boolean>{
    let param = new HttpParams();
    param = param.set("id",id);
    return this.httpClient.delete<boolean>(this.api + "models/remove",{params:param});
  }


  setLayer(nodes:number,activation:string,inputshape?:number[]){
    
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
        model.add(this.setLayer(layers[count].nodes,layers[count].activation))
    }

    model.add(tf.layers.dense({
        units: labels, 
        activation: 'softmax'
    }));


    return model;
  }

  convertToTensors(data:any[],features:feature[],label:string){
     return tf.tidy(()=>{
            
            tf.util.shuffle(data);

            const inputs = data.map(obj => {
                const result:any[] = [];
                
                features.map(value => value.value).forEach((value)=>{
                    if(obj[value] !== undefined && obj[value] !== null)
                        result.push(obj[value]);
                })

                return result;
            })

            const labels = [...new Set(data.map(item => item[label]))];
            
            const outputs = data.map(obj => labels.indexOf(obj[label]))
            
            const inputTensor = tf.tensor2d(inputs,[data.length,features.length]);
            const outputTensor = tf.tensor1d(outputs,'int32');
            //const outputTensor = tf.oneHot(tf.tensor1d(outputs,'int32'),labels.length);

            inputTensor.print();
            outputTensor.print();

            const inputMaximum = tf.tensor1d(features.map(value => value.maximum));
            const inputMinimum = tf.tensor1d(features.map(value => value.minimum));


            const normalizedInputs = inputTensor.sub(inputMinimum).div(inputMaximum.sub(inputMinimum));

            return { 
                labels: labels,
                inputs: normalizedInputs,
                outputs: outputTensor,
                inputMax: inputMaximum,
                inputMin: inputMinimum
            }
        });    
    }

    getOptimizationFunction(optimizer:number,values:optimizerArgs):tf.Optimizer{

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
