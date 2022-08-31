import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { find } from '../../shared/models/find';
import { replace } from '../../shared/models/replace';
import { empty, script } from '../../shared/models/script';

@Component({
  selector: 'board-game-companion-app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})
export class EditorToolBarComponent implements OnInit{
  constructor(private readonly router: Router) {

  }

  @Input() current:script = empty;
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
  @Output() toggleDisplayEvent = new EventEmitter<boolean>();
  @Output() themeEvent = new EventEmitter();
  sideBar = true;
  console = true;
  showReplace = false;
  VDSL = false;
  

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

  toggleDisplay(): void{
    this.VDSL = !this.VDSL;
    this.toggleDisplayEvent.emit(this.VDSL);
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

  find(value:find): void{
    this.findEvent.emit(value);
  }

  findNext(): void{
    this.findNextEvent.emit();
  }

  findPrevious(): void{
    this.findPreviousEvent.emit();
  }

  replace(value:replace): void{
    this.replaceEvent.emit(value);
  }

  replaceAll(value:replace): void{
    this.replaceAllEvent.emit(value);
  }

}
