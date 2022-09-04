import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { script } from '../../shared/models/scripts/script';
import { comment, empty } from '../../shared/models/comments/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { automataScript } from '../../shared/models/scripts/automata-script';

@Component({
  selector: 'board-game-companion-app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnInit {
  showComments = false;
  comments:comment[] = [];
  @Input()currentScript!:automataScript;
  @Output()incrementCommentCounter = new EventEmitter();
  constructor(private readonly commentService:CommentService,private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    console.log("comment-section");
    console.log(this.currentScript);
  }

  ngOnChanges(){
    this.commentService.getComments(this.currentScript.comments).subscribe({
      next:(value)=>{
        console.log(value); 
        this.comments = value;
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    })
  }

  addNewComment(value:comment): void{
    this.scriptService.addComment(this.currentScript._id,value._id)
    this.comments.unshift(value);
    document.getElementById(value._id)?.focus();
    this.incrementCommentCounter.emit();
  }
}
