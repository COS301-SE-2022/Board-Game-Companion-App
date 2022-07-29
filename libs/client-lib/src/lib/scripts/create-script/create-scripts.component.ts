import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { script } from '../../shared/models/script';
import { BggSearchService, MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-create-scripts',
  templateUrl: './create-scripts.component.html',
  styleUrls: ['./create-scripts.component.scss'],
  
})
export class CreateScriptComponent implements OnInit {
  @Output()newScript = new EventEmitter<script>();
  maxfiles = 3;
  errorMessage = "";
  warningMessage = "";
  error = false;
  warning = false;
  boardgames:string[] = [];
  boardgamesMap:Map<string,string> = new Map();
  boardgame = "";
  scriptname = "";
  description = "";

  constructor(private readonly searchService:BggSearchService,private readonly scriptService:ScriptService){}

  ngOnInit(): void {

    console.log("create script");      
  }

  validateAndSave(): void{
    if(this.scriptname === "")
      this.errorOccured("Script name missing.");
    else if(this.boardgame === "")
      this.errorOccured("Board game missing.");
    else if(this.description === "")
      this.errorOccured("Description missing.");
    else{
      const temp = this.getboardGameId();
    
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

    formData.append("userName",sessionStorage.getItem("name") || "Joseph");
    formData.append("userEmail",sessionStorage.getItem("email") || "u18166793@tuks.co.za");
    formData.append("name",this.scriptname);
    formData.append("boardGameId",boardGameId);
    formData.append("description",this.description);
    formData.append("icon",files[0]);

    this.scriptService.saveScript(formData).subscribe({
      next:(value)=>{
        console.log(value.toString());
        document.getElementById('cancel-save-script')?.click();
        this.newScript.emit(value);
      },
      error:(e)=>{
        console.log(e);
        this.errorOccured(e.message);
      },
      complete:()=>{
        console.log("complete")
      }      
  });
  }

  getboardGameId():string{
    let result = "";
    const temp = this.boardgamesMap.get(this.boardgame);

    if(temp !== undefined){
      result = temp;
    }

    return result;
  }

  getBoardGameSuggestions():void{

    this.searchService.getBoardGameByName(this.boardgame,false).subscribe({
      next:(value)=>{
        console.log(value.toString());
        const temp:MostActive[] = this.searchService.parseGetBoardGameByName(value.toString());
        this.loadBoardGameSuggestions(temp,this.boardgame);
      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{
        console.log("complete")
      }
    })
  }

  loadBoardGameSuggestions(values:MostActive[],name:string):void{
    this.boardgamesMap.clear();
    this.boardgames = [];
    

    for(let count = 0; count < values.length; count++){
      if(values[count].name.toLowerCase().indexOf(name.toLowerCase()) !== -1){
        this.boardgamesMap.set(values[count].name,values[count].id);
        this.boardgames.push(values[count].name);
      }
    }

    console.log(this.boardgames);
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
