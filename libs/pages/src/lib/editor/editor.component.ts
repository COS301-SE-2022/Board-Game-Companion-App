import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import tinymce from 'tinymce/tinymce';

@Component({
  selector: 'board-game-companion-app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  title = 'angular-richtexteditor'
  private formsbjct: Subject<any> = new AsyncSubject();

  public editForm = new FormGroup({
    //title: new FormControl("", Validators.required), 
    body: new FormControl("", Validators.required)
  })

  /*myLoad():void {
    var myContent = localStorage.getItem("myContent");
    document.getElementById("myTextarea").value = myContent;
  }*/

  /*Download to local storage*
  onDownload(): void{
    const content = tinymce.get("editorTextarea").getContent();
    localStorage.setItem("content", content);
  } */

/*public customToolbar: Object ={
  items: ['Bold', 'Italic', 'Undo', 'Redo']
}*/
}
