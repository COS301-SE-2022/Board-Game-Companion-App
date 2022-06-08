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
  @Output()removeScript = new EventEmitter<script>();

  @Input()current:script = empty;

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

  updateScript(value:script): void{
    this.current.name = value.name;
    this.current.status = value.status;
    this.current.public = value.public;
    this.current.export = value.export;
  }

  copy(value:script):script{
    return JSON.parse(JSON.stringify(this.current));
  }
}
