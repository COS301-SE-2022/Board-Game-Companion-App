import { Component, OnInit,Input } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { BggSearchService, MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-update-scripts',
  templateUrl: './update-scripts.component.html',
  styleUrls: ['./update-scripts.component.scss'],
  
})
export class UpdateScriptComponent implements OnInit {
  @Input()current:script = empty;
  scriptFiles:string[] = ["main"];
  scriptfile = "";
  maxfiles = 3;
  errorMessage = "";
  warningMessage = "";
  error = false;
  warning = false;
  boardgames:string[] = [];
  boardgamesMap:Map<string,string> = new Map();
  boardgame = "";
  scriptname = "";

  constructor(private readonly searchService:BggSearchService,private readonly scriptService:ScriptService){}

  ngOnInit(): void {

    console.log("create script");      
  }

  display(value:number):void{
    alert(value);
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
    const fileinput:HTMLInputElement = <HTMLInputElement>document.getElementById("image-input") || new HTMLInputElement;

    if(this.scriptname === "")
      this.errorOccured("Script name missing.");
    else if(this.boardgame === "")
      this.errorOccured("Board game missing.");
    else if(fileinput.files?.length == 0)
      this.errorOccured("Select script icon.");
    else{
      const temp = ''//this.getboardGameId();
    
      if(temp === ""){

        this.searchService.getBoardGameByName(this.boardgame,true).subscribe({
          next:(value)=>{
            console.log(value.toString());
            const response:MostActive[] = this.searchService.parseGetBoardGameByName(value.toString());
            
            if(response.length !== 1)
              this.errorOccured("Could not find board game '" + this.boardgame + "'.");
            else{
              this.save(response[0].id);
            }
          },
          error:(e)=>{
            console.log(e)
          },
          complete:()=>{
            console.log("complete")
          }          
        });

      }else{
        this.save(temp);
      } 
    }
  }

  save(boardGameId:string): void{
    const formData:FormData = new FormData();
    const fileinput:HTMLInputElement = <HTMLInputElement>document.getElementById("image-input") || new HTMLInputElement;
    const files = fileinput.files || [];

    formData.append("user",localStorage.getItem("user") || "Joseph");
    formData.append("name",this.scriptname);
    formData.append("boardGameId",boardGameId);
    formData.append("files",JSON.stringify(this.scriptFiles));
    console.log("file: " + files[0].name);
    formData.append("icon",files[0]);

    this.scriptService.saveScript(formData).subscribe({
      next:(value)=>{
        console.log(value.toString());
      },
      error:(e)=>{
        console.log(e)
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

    const display = document.getElementById("icon");
    
    if(display){
      filereader.readAsDataURL(file);

      filereader.onloadend = ()=>{
        display.setAttribute('src',<string>filereader.result);
      };
    }
  }

  
}
