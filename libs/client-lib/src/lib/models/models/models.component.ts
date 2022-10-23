import { Component, OnInit, ViewChild } from '@angular/core';
import { beginTraining } from '../../shared/models/neuralnetwork/beginTraining';
import { modelData } from '../../shared/models/neuralnetwork/modelData';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { GeneralComponent } from '../general/general.component';


@Component({
  selector: 'board-game-companion-app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  
})
export class ModelsComponent implements OnInit {
  tab = 0;
  @ViewChild(GeneralComponent,{static:false}) general: GeneralComponent = new GeneralComponent(this.modelService,this.storageService);
  searchValue = ""
  constructor(private readonly modelService:ModelsService,private readonly storageService:StorageService){}

  ngOnInit(): void{
    this.tab = 0;
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

  changeTab(value:number): void{
    this.tab = value;
  }

  train(value:modelData):void{
    this.general.train(value);
    this.changeTab(0);
  }

  search(): void{
    this.general.search(this.searchValue);
  }
}
