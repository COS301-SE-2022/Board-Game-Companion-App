import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  hover = "";
  items = [{ title: 'Profile' }, { title: 'Log out' }];
  
  constructor(private readonly scriptService:ScriptService,private readonly router:Router){}

  ngOnInit(): void {
    this.loadAllScripts();
  }

  test(): void{
    console.log("test");
  }

  loadAllScripts(): void{
    this.scriptService.getAllMyScripts("Joseph").subscribe({
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

    result = (val.getDate() < 10 ? "0": "") + val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += (val.getHours() < 10 ? "0" : "") + val.getHours() + ":" + (val.getMinutes() < 10 ? "0" : "") + val.getMinutes() + ":" + (val.getSeconds() < 10 ? "0" : "") + val.getSeconds();

    return result;
  }

  toggleStatus(focus:script):void{
    if(focus.status.value === 0)
      focus.status.value = 1;
    else if(focus.status.value === 1)
      focus.status.value = 2;
    else if(focus.status.value === 2)
      focus.status.value = 1;

    this.scriptService.updateStatus(focus._id,focus.status.value,"").subscribe({
      next:(value)=>{
        for(let count = 0;  count < this.store.length; count++){
          if(this.store[count]._id === value._id)
            this.store[count] = value;

          if(count < this.scripts.length && this.scripts[count]._id === value._id)
            this.scripts[count] = value
        }
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }      
    })
  }

  toggleView():void {
    this.gridView = !this.gridView;
  }

  selected(value:script): void{
    this.currentScript = value;
  }

  search(): void{
    const temp:script[] = [];
    let value = this.searchValue;

    if(value === ""){
      this.scripts = this.store;
      return;
    }

    if(value.toLowerCase() === "you")
      value = "Joseph";

    for(let count = 0; count < this.store.length; count++){
      if(this.store[count].name.toLowerCase().indexOf(value.toLowerCase()) !== -1 || 
          this.store[count].owner.toLowerCase().indexOf(value.toLowerCase()) !== -1)
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

  insertScript(value:script){
    this.scripts.push(value);
  }

  currentHover(value:script): void{
    this.hover = value._id;
  }

  showInfo(value:script){
    this.router.navigate(['script-detail'], { state: { value: value } });
  }

  showEditor(value:script){
    this.router.navigate(['editor'],{ state: { value: value } });
  }

  convertBytes(value:number): string{
    const decimals = 2;
    const kilo = 1024;
    const deci = decimals < 0 ? 0 : decimals;
    const ranges = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if(value === 0)
      return '0 B';
    const i = Math.floor(Math.log(value) / Math.log(kilo));

    return parseFloat((value / Math.pow(kilo, i)).toFixed(deci)) + ' ' + ranges[i];
  }

  clearHover(): void{
    this.hover = "";
  }
   
}
