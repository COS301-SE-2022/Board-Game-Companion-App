import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptDetailComponent } from './script-detail/script-detail.component';
import { CommentComponent } from './comment/comment.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { ScriptDetailService } from './script-detail-service/script-detail.service';

@NgModule({
  declarations: [
    ScriptDetailComponent,
    CommentComponent,
    CommentSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:ScriptDetailComponent}])
  ],
  providers: [
    ScriptDetailService
  ]
})
export class ScriptDetailModule { }
