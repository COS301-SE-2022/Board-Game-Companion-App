import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { empty, script } from '../../shared/models/script';
import { ModelsService } from '../../shared/services/models/models.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-editor-models',
  templateUrl: './editor-models.component.html',
  styleUrls: ['./editor-models.component.scss'],
})
export class EditorModelsComponent implements OnInit{
  networks:any = [];
  scriptNetworks:any = [];
  @Input()current:script = empty;

  constructor(private readonly modelsService:ModelsService,private readonly scriptService:ScriptService){}

  save(){
    const temp = this.networks.map((value:any) => value._id);

    this.scriptService.updateScriptModels(this.current._id,temp).subscribe({
      next:(value:script) => {
        this.current = value;
      },
      error: (err) => {
        console.log(err);
      }
    })
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

  remove(network:any){
    this.scriptNetworks = this.scriptNetworks.filter((value:any) => value._id !== network._id);
    this.networks.push(network);
  }

}
