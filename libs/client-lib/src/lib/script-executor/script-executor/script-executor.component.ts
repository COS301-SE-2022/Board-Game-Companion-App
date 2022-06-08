import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  scriptID = "./test.module";
  url = "http://localhost:3333/uploads/scripts/files/42a58303-990e-4230-94c6-a9f5dd629500/test.module.ts";
  ngOnInit(): void {

    //get id
    this.scriptID = this.route.snapshot.paramMap.get('my_object')||"./test.module";
    try
    {
      


      import("./test.module").then(module=>
      {
        module.ScriptExecutorModule.play();
      });
    }
    catch(error)
    {
      console.log(error);
    }

    
      
      
  }
}
