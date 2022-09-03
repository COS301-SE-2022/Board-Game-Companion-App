import { Component, OnInit, Output, EventEmitter,ViewChild } from '@angular/core';
import { script } from '../../shared/models/scripts/script';
import { BggSearchService, MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { myScript } from '../../shared/models/scripts/my-script';


@Component({
  selector: 'board-game-companion-app-create-scripts',
  templateUrl: './create-scripts.component.html',
  styleUrls: ['./create-scripts.component.scss'],
  
})
export class CreateScriptComponent implements OnInit {
  @Output()newScript = new EventEmitter<myScript>();
  errorMessage = "";
  warningMessage = "";
  error = false;
  warning = false;
  boardgames:string[] = [];
  boardgamesMap:Map<string,string> = new Map();
  boardgame = "";
  scriptname = "";
  description = "";
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly searchService:BggSearchService,private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    console.log("create script");      
  }

  validateAndSave(): void{
    if(this.scriptname === "")
      this.notifications.add({type:"danger",message:"Script name is missing."});
    else if(this.boardgame === "")
      this.notifications.add({type:"danger",message:"Board game missing."});
    else if(this.description === "")
      this.notifications.add({type:"danger",message:"Script description missing."});
    else{
      const temp = this.getboardGameId();
    
      if(temp === ""){

        this.searchService.getBoardGameByName(this.boardgame,true).subscribe({
          next:(value)=>{
            console.log(value.toString());
            const response:MostActive[] = this.searchService.parseGetBoardGameByName(value.toString());
            
            if(response.length !== 1)
              this.notifications.add({type:"danger",message:"Could not find board game '" + this.boardgame + "'."});
            else{
              this.scriptService.checkName(this.scriptname).subscribe({
                next:(value:boolean) => {
                  if(!value)
                    this.save(response[0].id);
                  else
                    this.notifications.add({type:"danger",message:`Script with name ${this.scriptname} already exists.`})
                },
                error:() => {
                  this.notifications.add({type:"danger",message:"Something went wrong when validating the script name.Try create a script later or contact the administrator if the error persists."})
                }
              })
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
        this.scriptService.checkName(this.scriptname).subscribe({
          next:(value:boolean) => {
            if(!value)
              this.save(temp);
            else
              this.notifications.add({type:"danger",message:`Script with name ${this.scriptname} already exists.`})
          },
          error:() => {
            this.notifications.add({type:"danger",message:"Something went wrong when validating the script name.Try create a script later or contact the administrator if the error persists."})
          }
        })
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
        this.notifications.add({type:"primary",message:"Created new script " + value.name + "."});
      },
      error:(e)=>{
        console.log(e);
        this.notifications.add({type:"danger",message:"Could not save script, error on the server."})
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
