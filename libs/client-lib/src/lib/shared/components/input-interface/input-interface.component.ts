import { Component, EventEmitter, Input, OnInit, OnChanges ,Output, SimpleChanges } from '@angular/core';
import { inputParameters } from '../../models/scripts/inputParameters';

@Component({
  selector: 'board-game-companion-app-input-interface',
  templateUrl: './input-interface.component.html',
  styleUrls: ['./input-interface.component.scss'],
})
export class InputInterfaceComponent implements OnInit,OnChanges{
  @Input()parameters:inputParameters[] = []
  @Input()show = false;
  @Output()submitEvent = new EventEmitter<any[]>();
  result:any[] = [];

  ngOnInit(): void {
    console.log("input-interface");
  }

  ngOnChanges(): void {
    this.result = new Array(this.parameters.length);
    
    for(let count = 0; count < this.result.length; count++){
      if(this.parameters[count].type === "text" || this.parameters[count].type === "option")
        this.result[count] = "";
      
      if(this.parameters[count].type === "boolean")
        this.result[count] = false;
    }

  }

  sequence(value:number): number[] {
    const result:number[] = []

    for(let count = 0; count < value; count++)
      result.push(count);

    return result;
  }

  submit(): void{
    this.submitEvent.emit(this.result);
  }

  onEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.submit();
    }
  }
}
