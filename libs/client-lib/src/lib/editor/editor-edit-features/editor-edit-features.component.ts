import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { find } from '../../shared/models/editor/find';
import { replace } from '../../shared/models/editor/replace';

@Component({
  selector: 'board-game-companion-app-editor-edit-features',
  templateUrl: './editor-edit-features.component.html',
  styleUrls: ['./editor-edit-features.component.scss'],
})
export class EditorEditFeaturesComponent implements OnInit{
  @Output() findEvent = new EventEmitter<find>();
  @Output() replaceEvent = new EventEmitter<replace>();
  @Output() findNextEvent = new EventEmitter();
  @Output() findPreviousEvent = new EventEmitter();
  @Output() replaceAllEvent = new EventEmitter<replace>();
  @Input()showReplace = false;
  caseSensitive = false;
  wrap = true;
  regEx = false;
  wholeWord = false;
  findText = "";
  replaceWithText = "";

  ngOnInit(): void {
      this.findText = "";
      this.replaceWithText = "";
  }

  find(): void{
    const find:find = {
      caseSensitive: this.caseSensitive,
      regularExpression: this.regEx,
      wholeWord: this.wholeWord,
      wrap: this.wrap,
      text: this.findText
    }

    this.findEvent.emit(find);
  }

  findNext(): void{
    this.findNextEvent.emit();
  }

  findPrevious(): void{
    this.findPreviousEvent.emit();
  }

  replace(): void{
    const replace:replace = {
      caseSensitive: this.caseSensitive,
      regularExpression: this.regEx,
      wholeWord: this.wholeWord,
      wrap: this.wrap,
      text: this.findText,
      replace: this.replaceWithText
    }

    this.replaceEvent.emit(replace);
  }

  replaceAll(): void{
    const replace:replace = {
      caseSensitive: this.caseSensitive,
      regularExpression: this.regEx,
      wholeWord: this.wholeWord,
      wrap: this.wrap,
      text: this.findText,
      replace: this.replaceWithText
    }
    this.replaceAllEvent.emit(replace);
  }

}
