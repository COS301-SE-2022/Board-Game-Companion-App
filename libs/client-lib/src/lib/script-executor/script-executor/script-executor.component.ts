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
  folder = "42a58303-990e-4230-94c6-a9f5dd629500"
  hours = "hours";
  h = 0;
  min = "min";
  m = 0;
  s = 0;
  sec = "sec";

  constructor(private readonly scriptService:ScriptService, private router:Router) {
    this.current = this.router.getCurrentNavigation()?.extras.state?.['value'];
  }

  back()
  {
    //Timer
    if(localStorage.getItem("sessions") !== null)
    {
      let c = JSON.parse(localStorage.getItem("sessions")||"")
      let name = "#" + (c.length + 1);
      c.push(name);
      localStorage.setItem("sessions", JSON.stringify(c))
      let session = []
      session.push("tictactoe10")
      session.push(this.current._id)
      session.push("2")
      session.push("N/A")
      this.hours = this.h + this.hours + " "
      this.min = this.m + this.min + " "
      this.sec = this.s + this.sec 
      session.push(this.hours + this.min + this.sec)
      session.push("Win")
      const now = new Date();
      session.push(now.toLocaleDateString())
      const script = localStorage.getItem(this.current._id)
      if(script != null)
      session.push(script[3])
      localStorage.setItem(name, JSON.stringify(session))
    }
    else
    {
      let c = [];
      let name = "#1";
      c.push(name);
      localStorage.setItem("sessions", JSON.stringify(c))
      let session = []
      session.push("tictactoe10")
      session.push(this.current._id)
      session.push("2")
      session.push("N/A")
      this.hours = this.h + this.hours + " "
      this.min = this.m + this.min + " "
      this.sec = this.s + this.sec
      session.push(this.hours + this.min + this.sec)
      session.push("Win")
      const now = new Date();
      session.push(now.toLocaleDateString())
      const script = localStorage.getItem(this.current._id)
      if(script != null)
      session.push(script[3])
      localStorage.setItem(name, JSON.stringify(session))
    }

    this.router.navigate(['scripts']);
  }
  
  ngOnInit(): void {

    setInterval(() => {
      this.s++
      if(this.s === 60)
      {
        
        this.m++
      }
      if(this.m == 60)
      {
        this.h++
      }
    }, 1000);

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
