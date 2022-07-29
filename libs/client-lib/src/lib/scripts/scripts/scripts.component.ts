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
  creationStore:script[] = [];
  downloadStore:script[] = [];
  otherScripts:script[] = [];
  currentScript:script = empty;
  gridView = true;
  months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  searchValue = "";
  selectedSort = "";
  page = 1;
  hover = "";
  items = [{ title: 'Profile' }, { title: 'Log out' }];
  
  constructor(private readonly scriptService:ScriptService,private readonly router:Router){}
  
  ngOnInit(): void {
    this.loadAllScripts();
  }

  play(value:script): void{
    this.router.navigate(['script-exec'], { state: { value: value } });
  }

  test(): void{
    console.log("test");
  }

  loadAllScripts(): void{
    this.scriptService.getScriptsCreatedByMe({name:sessionStorage.getItem("name") as string,email:sessionStorage.getItem("email") as string}).subscribe({
      next:(value)=>{
        this.creationStore = value;
        this.scripts = this.scripts.concat(value);
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });

    this.scriptService.getScriptsDownloadedByMe({name:"Joseph",email:"u18166793@tuks.co.za"}).subscribe({
      next:(value)=>{
        this.otherScripts = value;
        this.scripts = this.scripts.concat(value);
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });

    this.scriptService.getOther({name:sessionStorage.getItem("name") as string,email: sessionStorage.getItem('email') as string}).subscribe({
      next:(value)=>{
        this.downloadStore = value;
        this.scripts = this.scripts.concat(value);
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
        for(let count = 0;  count < this.creationStore.length; count++){
          if(this.creationStore[count]._id === value._id)
            this.creationStore[count] = value;

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
      this.scripts = this.creationStore;
      return;
    }

    if(value.toLowerCase() === "you")
      value = sessionStorage.getItem("name") as string;

    for(let count = 0; count < this.creationStore.length; count++){
      if(this.creationStore[count].name.toLowerCase().indexOf(value.toLowerCase()) !== -1 || 
          this.creationStore[count].owner.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        temp.push(this.creationStore[count]);
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

  onSort(): void
  {
    
    console.log(this.selectedSort);
    // this.listResults = new Array<fetchSessionResults>();
    // this.ngOnInit();
    if(this.selectedSort ==="alphabetical")
    {
      // sort game sessions alphabetically
        console.log("alphabet sort");
        this.scripts.sort(function(resultA, resultB) 
        {
          const nameA = resultA.name.toUpperCase(); // ignore upper and lowercase
          const nameB = resultB.name.toUpperCase(); // ignore upper and lowercase

          if (nameA < nameB) 
          {
            return -1;
          }
          if (nameA > nameB)
          {
            return 1;
          }

        return 0;
      });
    }
    else if(this.selectedSort==="date")
    {
      // console.log("date sort");
      this.scripts.sort(function(resultA,resultB)
      {
        // console.log(resultB.lastupdate > resultA.lastupdate);
        console.log(new Date(resultB.lastupdate),new Date(resultA.lastupdate));
        return +new Date(resultB.lastupdate) - +new Date(resultA.lastupdate);
      });
    }
  }
   
}
