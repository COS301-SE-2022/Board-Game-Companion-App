import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';


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

  onUpload():void{
    console.log("This is upload")
  }

/*public customToolbar: Object ={
  items: ['Bold', 'Italic', 'Undo', 'Redo']
}*/
}
