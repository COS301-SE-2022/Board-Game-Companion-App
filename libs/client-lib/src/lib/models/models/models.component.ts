import { Component, OnInit, ViewChild } from '@angular/core';
import { beginTraining } from '../../shared/models/beginTraining';
import { modelData } from '../../shared/models/modelData';
import { ModelsService } from '../../shared/services/models/models.service';
import { GeneralComponent } from '../general/general.component';


@Component({
  selector: 'board-game-companion-app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  
})
export class ModelsComponent implements OnInit {
  tab = 0;
  @ViewChild(GeneralComponent,{static:true}) general: GeneralComponent = new GeneralComponent(this.modelService);

  constructor(private readonly modelService:ModelsService){}

  ngOnInit(): void{
    console.log("models")
  }

  changeTab(value:number): void{
    this.tab = value;
  }

  train(value:modelData):void{
    this.general.train(value);
    this.changeTab(0);
  }
}
