import { Component, Input, Output, EventEmitter } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { selection } from '../../shared/models/selection';

@Component({
  selector: 'board-game-companion-app-editor-text-side-bar',
  templateUrl: './editor-text-side-bar.component.html',
  styleUrls: ['./editor-text-side-bar.component.scss'],
})
export class EditorTextSideBarComponent {
  showEntities = true;
  showModels = false;
  @Input() current:script = empty;
  @Output() selectionEvent = new EventEmitter<selection>();
  @Output() removeEvent = new EventEmitter<selection>();

  highlight(value:selection){
    this.selectionEvent.emit(value);
  }

  remove(value:selection){
    this.removeEvent.emit(value);
  }
}
