import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ModelsService } from '../../shared/services/models/models.service';

@Component({
  selector: 'board-game-companion-app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
  
})
export class ConfigureComponent implements OnInit {
  @Output()trainEvent = new EventEmitter();
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  optimizer = 0;
  name = "";
  learningRate = "";
  rho = "";
  initialAccumulatorValue = "";
  beta1 = "";
  beta2 = "";
  epsilon = "";
  decay = "";
  momentum = "";
  useNesterov = false;
  centered = false;
  epochs = 32;
  type = "classification"

  constructor(private readonly modelService:ModelsService){}

  ngOnInit(): void{
    this.epochs = 32;
  }

  getOptimizer(): number{
    return this.optimizer;
  }

  getInitialAccumulatorValue(): string{
    return this.initialAccumulatorValue;
  }

  getName(): string{
    return this.name;
  }

  getType(): string{
    return this.type;
  }

  getRho(): string{
    return this.rho;
  }

  getLearningRate(): string{
    return this.learningRate;
  }

  getBeta1(): string{
    return this.beta1;
  }

  getBeta2(): string{
    return this.beta2;
  }

  getEpsilon(): string{
    return this.epsilon;
  }

  getDecay(): string{
    return this.decay;
  }

  getMomentum(): string{
    return this.momentum;
  }

  getUseNesterov(): boolean{
    return this.useNesterov;
  }

  getCentered(): boolean{
    return this.centered;
  }

  getEpoch(): number{
    return this.epochs;
  }

  setOptimizer(value:number):void{
    this.optimizer = value;
    this.learningRate = "";
    this.rho = "";
    this.initialAccumulatorValue = "";
    this.beta1 = "";
    this.beta2 = "";
    this.epsilon = "";
    this.decay = "";
    this.momentum = "";
  }

  validate():boolean{
    let result = true;

    if(this.getName() === ""){
      this.notifications.add({type:"danger",message:"The name of the neural network is missing"})
      result = false;
    }

    if(this.getLearningRate() !== "" && isNaN(parseFloat(this.getLearningRate())) === true ){
      this.notifications.add({type:"danger",message:"Learning rate must be a number"});
      result = false;
    }

    if(this.getRho() !== "" && isNaN(parseFloat(this.getRho())) === true ){
      this.notifications.add({type:"danger",message:"Decay rate must be a number"});
      result = false;
    }

    if(this.getDecay() !== "" && isNaN(parseFloat(this.getDecay())) === true ){
      this.notifications.add({type:"danger",message:"Decat rate must be a number"});
      result = false;
    }

    if(this.getEpsilon() !== "" && isNaN(parseFloat(this.getEpsilon())) === true ){
      this.notifications.add({type:"danger",message:"Epsilon must be a number"});
      result = false;
    }

    if(this.getBeta1() !== "" && isNaN(parseFloat(this.getBeta1())) === true ){
      this.notifications.add({type:"danger",message:"Beta1 must be a number"});
      result = false;
    }

    if(this.getBeta2() !== "" && isNaN(parseFloat(this.getBeta2())) === true ){
      this.notifications.add({type:"danger",message:"beta2 must be a number"});
      result = false;
    }

    if(this.getInitialAccumulatorValue() !== "" && isNaN(parseFloat(this.getInitialAccumulatorValue())) === true ){
      this.notifications.add({type:"danger",message:"Initial accumulator value must be a number"});
      result = false;
    }

    if(this.getMomentum() !== "" && isNaN(parseFloat(this.getMomentum())) === true ){
      this.notifications.add({type:"danger",message:"Momentum must be a number."});
      result = false;
    }

    return result;
  }

  async train(): Promise<void>{
    if(!this.validate())
      return;
    
    const nameCheck = await this.modelService.modelAreadyExists(this.name);

    if(nameCheck){
      this.notifications.add({type:"danger",message:`Model with name ${this.name} already exists.`})
      return;
    }

    let result = true;

    switch(this.optimizer){
      case 1:{
        if(this.learningRate === ""){
          this.notifications.add({type:"danger",message:"Learning rate is required."});
          result = false;
        }
      }break;
      case 4:{
        if(this.learningRate === ""){
          this.notifications.add({type:"danger",message:"Learning rate is required."});
          result = false;
        }

        if(this.momentum === ""){
          this.notifications.add({type:"danger",message:"Momentum rate is required."});
          result = false;
        }
      }break;
      case 5:{
        if(this.learningRate === ""){
          this.notifications.add({type:"danger",message:"Learning rate is required."});
          result = false;
        }
      }break;
      case 6:{
        if(this.learningRate === ""){
          this.notifications.add({type:"danger",message:"Learning rate is required."});
          result = false;
        }
      }break;
    }

    if(result)
      this.trainEvent.emit();

  }
}
