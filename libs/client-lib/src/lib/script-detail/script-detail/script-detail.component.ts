import { Component, OnInit } from '@angular/core';
import { script ,ScriptDetailService} from '../script-detail-service/script-detail.service';
@Component({
  selector: 'board-game-companion-app-script-detail',
  templateUrl: './script-detail.component.html',
  styleUrls: ['./script-detail.component.scss'],
})
export class ScriptDetailComponent implements OnInit {
  constructor(private readonly sciptDetailService:ScriptDetailService) {}

  ngOnInit(): void {
    this.sciptDetailService.getScriptById("6290eb263876756f2c6f2c1e").subscribe({
      next:(v)=>{console.log(v)},
      error:(e)=>{console.log(e)},
      complete:()=>{console.log("complete")}
    })
  }
}
