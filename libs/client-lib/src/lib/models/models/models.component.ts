import { Component, OnInit } from '@angular/core';
import { beginTraining } from '../../shared/models/beginTraining';


@Component({
  selector: 'board-game-companion-app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  
})
export class ModelsComponent implements OnInit {
  tab = 0;
  beginTrainingModel!:beginTraining;

  ngOnInit(): void{
    console.log("models")
  }

  changeTab(value:number): void{
    this.tab = value;
  }

  beginTraining(value:beginTraining):void{
    this.beginTrainingModel = value;
    this.changeTab(0);
  }
}
