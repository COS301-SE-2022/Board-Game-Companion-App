import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { find } from '../../shared/models/find';
import { replace } from '../../shared/models/replace';

@Component({
  selector: 'board-game-companion-app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})
export class EditorToolBarComponent implements OnInit{
  constructor(private readonly router: Router) {

  }
  @Input() height = 0;
  @Output() executeEvent = new EventEmitter();
  @Output() undoEvent = new EventEmitter();
  @Output() redoEvent = new EventEmitter();
  @Output() copyEvent = new EventEmitter();
  @Output() cutEvent = new EventEmitter();
  @Output() pasteEvent = new EventEmitter();
  @Output() findEvent = new EventEmitter<find>();
  @Output() replaceEvent = new EventEmitter<replace>();
  @Output() findNextEvent = new EventEmitter();
  @Output() findPreviousEvent = new EventEmitter();
  @Output() replaceAllEvent = new EventEmitter<replace>();
  @Output() toggleSideBarEvent = new EventEmitter<boolean>();
  @Output() toggleConsoleEvent = new EventEmitter<boolean>();
  @Output() themeEvent = new EventEmitter();
  showReplace = false;
  caseSensitive = false;
  wrap = true;
  regEx = false;
  wholeWord = false;
  findText = "";
  replaceWithText = "";
  sideBar = true;
  console = true;

  

  ngOnInit(): void {
    this.console = true;
  }

  themeChange(): void{
    this.themeEvent.emit();
  }

  exit(): void{
    document.dispatchEvent(new Event('editor-exit'));
    this.router.navigate(['/scripts'])
  }

  viewModels(): void{
    document.dispatchEvent(new Event('editor-exit'));
    this.router.navigate(['/models'])   
  }

  toggleSideBar(): void{
    this.sideBar = !this.sideBar;
    this.toggleSideBarEvent.emit(this.sideBar);
  }

  toggleConsole(): void{
    this.console = !this.console;
    this.toggleConsoleEvent.emit(this.console);
  }

  execute(): void {
    this.executeEvent.emit();
  };


  moveTo(path:string):void{
    if(path == "home")
    {
      this.router.navigate(['/script-detail']);
    }
    
  }

  undo(): void{
    this.undoEvent.emit();
  }

  redo(): void{
    this.redoEvent.emit();
  }

  copy(): void{
    this.copyEvent.emit();
  }

  cut(): void{
    this.cutEvent.emit();
  }

  paste(): void{
    this.pasteEvent.emit();
  }

  findClick(): void{
    this.findText = "";
    this.showReplace = false;
  }

  replaceClick(): void{
    this.findText = "";
    this.replaceWithText = "";
    this.showReplace = true;
    //alert(this.showReplace);
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
