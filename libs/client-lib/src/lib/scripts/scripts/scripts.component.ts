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
  store:script[] = [];
  currentScript:script = empty;
  gridView = true;
  months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  searchValue = "";
  page = 1;
  constructor(private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    this.loadAllScripts();
  }

  test(): void{
    console.log("test");
  }

  loadAllScripts(): void{
    this.scriptService.retrieveAllScript().subscribe({
      next:(value)=>{
        this.store = this.scripts = value;

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

  toggleView():void {
    this.gridView = !this.gridView;
  }

  selected(value:script): void{
    this.currentScript = value;
  }

  search(value:string): void{
    const temp:script[] = [];
    
    if(value === ""){
      this.scripts = this.store;
      return;
    }

    for(let count = 0; count < this.store.length; count++){
      if(this.store[count].name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        temp.push(this.store[count]);
    }

    this.scripts = temp;
  }

  changeView(event:boolean): void{
    this.gridView = event;
  }

  containerClick(event:any): void{
    if(event.target.id == "wrapper")
      this.currentScript = empty;
  }

  newScript(value:script): void{
    this.scripts.push(value);
  }

  removeScript(value:script): void{
    this.scriptService.removeScript(value._id).subscribe({
      next:(val)=>{
        const temp:script[] = [];

        for(let count = 0; count < this.scripts.length; count++){
          if(this.scripts[count]._id !== value._id)
            temp.push(this.scripts[count]);
        }

        this.currentScript = empty;
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
