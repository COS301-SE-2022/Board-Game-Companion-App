import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModelsService } from '../../shared/services/models/models.service';

@Component({
  selector: 'board-game-companion-app-editor-models',
  templateUrl: './editor-models.component.html',
  styleUrls: ['./editor-models.component.scss'],
})
export class EditorModelsComponent implements OnInit{
  networks:any = [];

  constructor(private readonly modelsService:ModelsService){}

  apply(){
    console.log("void")
  }

  ngOnInit(): void {
    this.modelsService.getAll().subscribe({
      next:(value: any) => {
        this.networks = value;
      },
      error:(err) => {
        console.log(err)
      }
    })    
  }
}
