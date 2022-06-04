import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-create-scripts',
  templateUrl: './create-scripts.component.html',
  styleUrls: ['./create-scripts.component.scss'],
  
})
export class CreateScriptComponent implements OnInit {

  scriptFiles:string[] = ["main"];
  scriptfile = "";
  maxfiles = 3;
  errorMessage = "";
  warningMessage = "";
  error = false;
  warning = false;

  ngOnInit(): void {

    console.log("create script");      
  }

  checkKeyPress(event:KeyboardEvent){
    if(event.key === "Enter"){
      event.preventDefault();
      this.addScriptFile();
    }
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

  addScriptFile(): void{

    if(this.scriptfile === "")
      this.errorOccured("Empty script file name.");
    else if(this.containsScriptFile(this.scriptfile))
      this.errorOccured("File already created.");
    else if(this.scriptFiles.length == this.maxfiles)
      this.warningOccured("A maximum " + this.maxfiles + " initial files allowed.")
    else  
      this.scriptFiles.push(this.scriptfile);
    
  }

  containsScriptFile(name:string): boolean{
    let result = false;

    for(let count = 0; count < this.scriptFiles.length && !result; count++){
      if(this.scriptFiles[count] === name){
        result = true;
      }
    }
    
    return result;
  }

  removeScriptFile(name:string): void{
    if(name !== ""){
      const temp:string[] = [];
      
      for(let count = 0; count < this.scriptFiles.length; count++){
        if(this.scriptFiles[count] !== name){
          temp.push(this.scriptFiles[count]);
        }
      }

      this.scriptFiles = temp;
    }
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
