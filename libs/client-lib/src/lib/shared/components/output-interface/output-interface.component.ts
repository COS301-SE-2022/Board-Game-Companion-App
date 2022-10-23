import { Component, EventEmitter, Input, OnInit ,Output } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-output-interface',
  templateUrl: './output-interface.component.html',
  styleUrls: ['./output-interface.component.scss'],
})
export class OutputInterfaceComponent implements OnInit{
  @Input()output = "";
  @Input()show = false;
  @Output()okayEvent = new EventEmitter<any[]>();
  @Output()stopExecutionEvent = new EventEmitter();
  result:any[] = [];

  ngOnInit(): void {
    console.log("input-interface");
  }

  stopExecution(): void{
    this.stopExecutionEvent.emit();
  }

  okay(): void{
    this.okayEvent.emit(this.result);
  }
}
