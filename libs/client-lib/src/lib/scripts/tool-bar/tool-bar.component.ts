import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { script ,empty} from '../../shared/models/script';

@Component({
  selector: 'board-game-companion-app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  
})
export class ToolBarComponent implements OnInit {
  @Output()viewEvent = new EventEmitter<boolean>();
  @Input()current = -1;

  ngOnInit(): void {

    console.log("toolbar");      
  }

  ngOnChanges(): void{
    console.log(this.current);
  }

  changeView(view:boolean): void{
    this.viewEvent.emit(view);
  }
   
}
