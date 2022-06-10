import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  constructor(private route: ActivatedRoute,private readonly scriptService:ScriptService, private router:Router) {}
  scriptID = "";
  file = "test";
  folder = "42a58303-990e-4230-94c6-a9f5dd629500"
  hours = "hours";
  h:number = 0;
  min = "min";
  m:number = 0;
  
  

  
  
  
  back()
  {
   //Timer
    let c = JSON.parse(localStorage.getItem("sessions")||"")
    let name = "#" + (c.length + 1);
    c.push(name);
    localStorage.setItem("sessions", JSON.stringify(c))
    let session = []
    session.push("tictactoe10")
    this.scriptID = this.route.snapshot.paramMap.get('my_object')||"";
    session.push(this.scriptID)
    session.push("2")
    session.push("N/A")
    this.hours = this.h + this.hours + " "
    this.min = this.m + this.min
    session.push(this.hours + this.min)
    session.push("Win")
    const now = new Date();
    session.push(now.toLocaleDateString())
    localStorage.setItem(name, JSON.stringify(session))
    
    this.router.navigate(['scripts']);
  }

  
  ngOnInit(): void {

    

 
  setInterval(() => {
    this.m++
    if(this.m === 60)
    {
      this.h++
      this.m = 0
    }
  }, 1000);

    //get id
    this.scriptID = this.route.snapshot.paramMap.get('my_object')||"";
    
    //get path
    
    
    try
    {
      this.scriptService.getScriptById(this.scriptID).subscribe({
        next:async(value)=>{
          
          
          let path = value.files[0].path.replace(".module.ts","");
          path = path.replace("libs/uploads/src/lib/scripts/files/","")

          import(`libs/uploads/src/lib/scripts/files/${path}.module`).then(module=>
            {
              
              module[Object.keys(module)[0]].play();
            });

            
            
            
        }});
        

    }
    catch(error)
    {
      console.log(error);
    }

    
      
      
  }
}
