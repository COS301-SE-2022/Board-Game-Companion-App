import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { script ,empty} from '../../shared/models/script';

@Component({
  selector: 'board-game-companion-app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  
})
export class ToolBarComponent implements OnInit {
  @Output()viewEvent = new EventEmitter<boolean>();
  @Output()newScript = new EventEmitter<script>();
  @Output()removeScript = new EventEmitter<string>();

  @Input()current = "";

  ngOnInit(): void {

    console.log("toolbar");      
  }

  ngOnChanges(): void{
    console.log(this.current);
  }

  changeView(view:boolean): void{
    this.viewEvent.emit(view);
  }

  propagateScript(value:script): void{
    this.newScript.emit(value);
  }
   
  removeCurrentScript(): void{
    this.removeScript.emit(this.current);
  }
}
