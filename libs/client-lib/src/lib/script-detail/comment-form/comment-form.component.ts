import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { comment } from '../../shared/models/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { script } from '../../shared/models/script';

@Component({
  selector: 'board-game-companion-app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  @Input()script = "";
  @Input()formType = "";
  @Input()width = 0;
  @Output()newComment = new EventEmitter<comment>();

  content = "";
  name = "Joseph";
  image = "https://mdbootstrap.com/img/new/standard/city/043.jpg";
  

  constructor(private readonly commentService:CommentService) {}

  ngOnInit(): void {
    console.log("comment-form");
  }

  recordComment(): void{
    const formData: FormData = new FormData();
    formData.append("name",this.name);
    formData.append("image",this.image);
    formData.append("content",this.content);
    formData.append("script",this.script);

    this.commentService.saveComment(formData).subscribe({
      next:(value)=>{
        this.newComment.emit(value);
        this.clear();
      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{
        console.log("complete")
      }      
  })
  }

  clear(): void{
    this.content = "";
  }
}
