import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import tinymce from 'tinymce/tinymce';
import { EditorService } from '../editor-service/editor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Body } from '@nestjs/common';


@Component({
  selector: 'board-game-companion-app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit{
  title = 'angular-richtexteditor'
  id = ""
  texteditor : any;
  lineCountCache = 0;
  lineNum : any;
  constructor(private edtservice: EditorService, private router:Router, private route: ActivatedRoute){
    //this.router.getCurrentNavigation()?.currentState.extras.state?.author
    const data = this.router.getCurrentNavigation()?.extras.state;

    if (data?.['id'] && data?.['filename']){
      this.id = data?.['id']
      this.getFile(data?.['id'], data?.['filename'])
    }
    console.log(data)

    //this.router.getCurrentNavigation()?.extras.state?.filename
  }
  
  private formsbjct: Subject<any> = new AsyncSubject();

  public editForm = new FormGroup({
    //title: new FormControl("", Validators.required), 
    body: new FormControl("", Validators.required),
    FileName: new FormControl("", Validators.required)
  })
  
  ngOnInit(): void {
    this.texteditor = document.getElementById('editorTextarea');
    this.lineNum = document.getElementById('lineNumber');
		


    this.texteditor?.addEventListener('scroll', () => {
      if (this.lineNum){
        this.lineNum.scrollTop = this.texteditor.scrollTop;
        this.lineNum.scrollLeft = this.texteditor.scrollLeft;
      } 
    });
    
    throw new Error('Method not implemented.');
  }
  addTab(event:any): void{
    console.log(this.texteditor);
    event.preventDefault();
    let val =  this.texteditor?.value;
    const selectionStart =  this.texteditor?.selectionStart ;
    const selectionEnd =  this.texteditor?.selectionEnd ;
    //let val = this.editForm.get("body")?.value;
    val = val?.slice(0, selectionStart) + '\t' + val?.slice(selectionEnd);
    this.texteditor?.setSelectionRange(selectionStart+2, selectionStart+2)
    this.editForm.get("body")?.setValue(val)
  }

  addLine(event:any): void{
    const lineCount = this.texteditor.value.split('\n').length;
      const outarr = [];
      if (this.lineCountCache != lineCount) {
         for (let x = 0; x < lineCount; x++) {
            outarr[x] = (x + 1) + '.';
         }
         this.lineNum.value = outarr.join('\n');
      }
      this.lineCountCache = lineCount;
  }
  
  onUpload(): void{
    console.log('this Upload button works');
    const content = this.editForm.get("body")?.value;
    console.log(content);


    const fname = this.editForm.get("FileName")?.value;
    this.edtservice.postScript(this.id, fname, content).subscribe(data=>{console.log(data)});
    
    

    //setting the body
    //this.editForm.get("body")?.patchValue("The dog is out of the house");
    //const content = tinymce.get("editorTextarea").getContent();
    //localStorage.setItem("content", content);
  }

  onCreate(): void{
    console.log("This is the button to push script content to script");
   
    const content = this.editForm.get("body")?.value;

    console.log(content);
  }

  onExecute():void{
    this.router.navigate(['scriptExecutor', {my_object: this.id}]);
  }
  
  //recieve JSONvar 
  getFile(id:string, filename:string):void{
    
    this.editForm.get("FileName")?.patchValue(filename);
    this.edtservice.getScript(id,filename).subscribe((data: any)=>{this.editForm.get("body")?.patchValue(data.content)});
    //
  }
  

  

}
