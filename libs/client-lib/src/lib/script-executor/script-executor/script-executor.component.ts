import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { Router } from '@angular/router';
import { script } from '../../shared/models/script';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  current:script;
  code = "";
  replay = false;

  constructor(private readonly scriptService:ScriptService, private router:Router) {
    this.current = this.router.getCurrentNavigation()?.extras.state?.['value'];
  }
  
  ngOnInit(): void {
      this.scriptService.getFileData(this.current.build.location).subscribe({
        next:(val)=>{
           this.code = val;
           this.play();       
        },
        error:(e)=>{
          console.log(e)
        },
        complete:()=>{
          console.log("complete")
        }  
      })
  }

  play(): void{
    this.replay = false;
    const code = new Function(this.code);
    code();
    this.replay = true;
  }

}
