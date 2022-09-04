import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { myScript } from '../../shared/models/scripts/my-script';
import { ModelsService } from '../../shared/services/models/models.service';
import { EditorService } from '../../shared/services/editor/editor.service';

@Component({
  selector: 'board-game-companion-app-editor-models',
  templateUrl: './editor-models.component.html',
  styleUrls: ['./editor-models.component.scss'],
})
export class EditorModelsComponent implements OnInit{
  networks:any = [];
  scriptNetworks:any = [];
  @Input()current!:myScript;
  @Output()updateScriptModelsEvent = new EventEmitter<myScript>();
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly modelsService:ModelsService,private readonly editorService:EditorService){}

  save(){
    const temp = this.scriptNetworks.map((value:any) => value._id);

    this.editorService.updateScriptModels(this.current._id,temp).subscribe({
      next:(value:myScript) => {
        this.current = value;
        this.updateScriptModelsEvent.emit(value);
        this.notifications.add({type:'success',message:'Successfully updated the neural network models the script is able to access.'});
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
