import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import tinymce from 'tinymce/tinymce';
import { EditorService } from '../editor-service/editor.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'board-game-companion-app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  title = 'angular-richtexteditor'
  id = ""
  constructor(private edtservice: EditorService, private router:Router, private route: ActivatedRoute){
    //this.router.getCurrentNavigation()?.currentState.extras.state?.author

		const data = this.router.getCurrentNavigation()?.extras.state;
    console.log(data)

    if (data?.['id'] && data?.['filename']){
      this.id = data?.['id']
      this.getFile(data?.['id'], data?.['filename'])
    }

    //this.router.getCurrentNavigation()?.extras.state?.filename
  }
  private formsbjct: Subject<any> = new AsyncSubject();

  public editForm = new FormGroup({
    //title: new FormControl("", Validators.required), 
    body: new FormControl("", Validators.required),
    FileName: new FormControl("", Validators.required)
  })
  
  onUpload(): void{
    console.log('this download button works');
    const content = this.editForm.get("body")?.value;
    const fname = this.editForm.get("FileName")?.value;
    this.edtservice.postScript(this.id, fname, content).subscribe(data=>{console.log(data)});
    
    console.log(content);

    //setting the body
    //this.editForm.get("body")?.patchValue("The dog is out of the house");
    //const content = tinymce.get("editorTextarea").getContent();
    //localStorage.setItem("content", content);
  }

  onCreate(): void{
    console.log("This is the button to push script content to script");
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
