import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
  
})
export class ConfigureComponent implements OnInit {
  @Output()trainEvent = new EventEmitter();
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
  missing:string[] = []
  trainMessage:string[] = []
  epochs = 32;

  ngOnInit(): void{
    console.log("models")
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
    this.missing = [];
    this.trainMessage = [];
    this.learningRate = "";
    this.rho = "";
    this.initialAccumulatorValue = "";
    this.beta1 = "";
    this.beta2 = "";
    this.epsilon = "";
    this.decay = "";
    this.momentum = "";
  }

  train(): void{
    this.trainEvent.emit();
  }
}
