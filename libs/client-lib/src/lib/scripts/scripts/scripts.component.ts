import { Component, OnInit } from '@angular/core';
import { empty, script } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss'],
  
})
export class ScriptsComponent implements OnInit {
  scripts:script[] = [];
  currentScript = "";
  gridView = true;
  months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  constructor(private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    this.loadAllScripts();
  }

  loadAllScripts(): void{
    this.scriptService.retrieveAllScript().subscribe({
      next:(value)=>{
        this.scripts = value;
        for(let count = 0; count < this.scripts.length; count++){
          console.log(this.scriptService.getApiUrl() + this.replaceBackSlash(this.scripts[count].icon));
        }
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });
  }

  replaceBackSlash(input:string):string{
    let result = "";

    for(let count = 0; count < input.length; count++){
      if(input[count] === "\\")
        result += "/";
      else
        result += input[count];
    }
    return result;
  }

  formatDate(date:Date):string{
    let result = "";
    
    const val = new Date(date);

    result = val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();

    return result;
  }

  selected(id:string): void{
    this.currentScript = id;

  }

  changeView(event:boolean): void{
    this.gridView = event;
  }

  containerClick(event:any): void{
    if(event.target.id == "wrapper")
      this.currentScript = "";
  }

  newScript(value:script): void{
    this.scripts.push(value);
  }

  removeScript(id:string): void{
    this.scriptService.removeScript(id).subscribe({
      next:(value)=>{
        const temp:script[] = [];

        for(let count = 0; count < this.scripts.length; count++){
          if(this.scripts[count]._id !== id)
            temp.push(this.scripts[count]);
        }

        this.currentScript = "";
        this.scripts = temp;
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }
    });
  }
   
}
