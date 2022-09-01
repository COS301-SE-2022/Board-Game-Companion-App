import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { script, empty } from '../../shared/models/scripts/script';
import { BggSearchService, MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-update-scripts',
  templateUrl: './update-scripts.component.html',
  styleUrls: ['./update-scripts.component.scss'],
  
})
export class UpdateScriptComponent implements OnInit {
  @Input()current:script = empty;
  @Output()updateScriptEvent = new EventEmitter<script>();
  scriptFiles:string[] = ["main"];
  scriptfile = "";
  maxfiles = 3;
  errorMessage = "";
  warningMessage = "";
  error = false;
  warning = false;
  boardgame = "";
  scriptname = "";
  months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  constructor(private readonly searchService:BggSearchService,private readonly scriptService:ScriptService){}

  ngOnInit(): void {

    console.log("update script");      
  }

  display(value:number):void{
    alert(value);
  }

  setStatus(val:number): void{
    this.current.status.value = val;
    
    if(this.current.status.value === 1){
      this.current.status.message = this.current.name + " has been in progress since " +this.formatDate(new Date()) + ".";
    }else if(this.current.status.value === 2){
      this.current.status.message = this.current.name + " was published on the following date '" +this.formatDate(new Date()) + "'.";
    }
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

  validateAndSave(): void{
    if(this.current.name === "")
      this.errorOccured("Script name missing.");
    else{
      this.save();
    }
  }

  save(): void{
    const fileinput:HTMLInputElement = <HTMLInputElement>document.getElementById("update-image-input") || new HTMLInputElement();
    const files = fileinput.files || [];
    let data:any;

    
    if(files.length !== 0){
      console.log(files[0]);
      data = {
        id : this.current._id,
        name : this.current.name,
        public : this.current.public,
        export : this.current.export,
        status : this.current.status,
        icon : files[0]
      }
    }else{
      data = {
        id : this.current._id,
        name : this.current.name,
        public : this.current.public,
        export : this.current.export,
        status: this.current.status
      }     
    }


    this.scriptService.updateScriptInfo(data).subscribe({
      next:(value)=>{
        this.updateScriptEvent.emit(value);   
        document.getElementById("import-script-cancel")?.click;
      },
      error:(e)=>{
        console.log(e);
        this.errorOccured(e);
      },
      complete:()=>{
        console.log("complete")
      }      
  });
  }

  errorOccured(message:string): void{
    this.errorMessage = message;
    this.error = true;

    setInterval(()=>{
      this.error = false;
    },5000);
  
  }

  warningOccured(message:string): void{
    this.warningMessage = message;
    this.warning = true;

    setInterval(()=>{
      this.warning = false;
    },5000);
  
  }

  loadImage(event:any): void{
    const files = event.target.files;

    if(!files || files.length == 0)
      return;
    
    const file = files[0];
    const filereader = new FileReader();

    const display = document.getElementById("update-icon");
    
    if(display){
      filereader.readAsDataURL(file);

      filereader.onloadend = ()=>{
        display.setAttribute('src',<string>filereader.result);
      };
    }
  }

  
}
