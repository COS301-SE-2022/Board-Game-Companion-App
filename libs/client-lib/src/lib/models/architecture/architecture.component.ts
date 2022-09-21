import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { layer } from '../../shared/models/neuralnetwork/layer';

@Component({
  selector: 'board-game-companion-app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss'],
  
})
export class ArchitectureComponent implements OnInit {
  hiddenLayers:layer[] = []
  activation = "none";
  nodes = 1;  
  @Output()checkEvent = new EventEmitter();

  ngOnInit(): void{
    // console.log("models")
  }

  getHiddenLayers():layer[]{
    return this.hiddenLayers;
  }

  removeLayer(value:layer): void{
    const temp:layer[] = [];

    this.hiddenLayers.forEach((each:layer)=>{
      if(each.index != value.index)
        temp.push(each);
    })

    this.hiddenLayers = temp;
    this.checkEvent.emit();
  }

  setActivation(value:string): void{
    this.activation = value;
  }

  setActivationByIndex(index:number,value:string):void{
    this.hiddenLayers[index - 1].activation = value;
  }

  addLayer(): void{
    this.hiddenLayers.push({
      index: this.hiddenLayers.length + 1,
      nodes: this.nodes,
      activation: this.activation
    })

    this.checkEvent.emit();
  }
}
