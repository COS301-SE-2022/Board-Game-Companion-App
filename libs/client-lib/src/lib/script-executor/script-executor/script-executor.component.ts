import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  constructor(private route: ActivatedRoute,private readonly scriptService:ScriptService) {}

  scriptID = "";
  file = "test";
  folder = "42a58303-990e-4230-94c6-a9f5dd629500"
  ngOnInit(): void {

    //get id
    this.scriptID = this.route.snapshot.paramMap.get('my_object')||"";
    
    //get path
    
    
    try
    {
      this.scriptService.getScriptById(this.scriptID).subscribe({
        next:(value)=>{
          
          console.log(value.files)
          let path = value.files[0].path.replace(".module.ts","");
          path = path.replace("uploads/scripts/files/","")
          console.log(path);

          //import(path+".module").then(module=>
          //  {
           //   module.ScriptExecutorModule.play();
           // });
        }});
        

    }
    catch(error)
    {
      console.log(error);
    }

    
      
      
  }
}
