import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { empty, script } from '../../shared/models/script';
import { ModelsService } from '../../shared/services/models/models.service';

@Component({
  selector: 'board-game-companion-app-editor-models',
  templateUrl: './editor-models.component.html',
  styleUrls: ['./editor-models.component.scss'],
})
export class EditorModelsComponent implements OnInit{
  networks:any = [];
  scriptNetworks:any = [];
  @Input()current:script = empty;

  constructor(private readonly modelsService:ModelsService){}

  apply(){
    console.log("void")
  }

  ngOnInit(): void {
    this.modelsService.getAll().subscribe({
      next:(value: any) => {
        const temp = value;

        temp.forEach((network:any) => {
          if(this.current.models.includes(network._id))
            this.scriptNetworks.push(network);
          else
            this.networks.push(network);
        })
      },
      error:(err) => {
        console.log(err)
      }
    })    
  }

  add(network:any){
    this.networks = this.networks.filter((value:any) => value._id !== network._id);
    this.scriptNetworks.push(network);
  }

}
