import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { selection } from '../../shared/models/selection';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';

@Component({
  selector: 'board-game-companion-app-editor-text-side-bar',
  templateUrl: './editor-text-side-bar.component.html',
  styleUrls: ['./editor-text-side-bar.component.scss'],
})
export class EditorTextSideBarComponent implements OnInit,OnChanges{
  showEntities = true;
  showModels = false;
  models:string[] = [];
  @Input() current:script = empty;
  @Output() selectionEvent = new EventEmitter<selection>();
  @Output() removeEvent = new EventEmitter<selection>();

  constructor(private readonly modelService:ModelsService,private readonly storageService:StorageService){}

  ngOnInit(){
    if(this.current._id !== '')
      this.getModels();
  }

  ngOnChanges(){
    this.getModels();
  } 

  highlight(value:selection){
    this.selectionEvent.emit(value);
  }

  remove(value:selection){
    this.removeEvent.emit(value);
  }

  getModels(): void{
    this.modelService.getModels(this.current.models).subscribe({
      next:(value:any) => {
        this.models = value.map((value:any) => value.name);
        this.models.forEach((value:any) => {

        })
      },
      error:(err) => {
        console.log(err);
      }
    })
  }
}
