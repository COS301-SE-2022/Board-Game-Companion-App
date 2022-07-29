import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptDetailComponent } from './script-detail/script-detail.component';
import { CommentComponent } from './comment/comment.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { ScriptDetailService } from './script-detail-service/script-detail.service';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ScriptDetailComponent,
    CommentComponent,
    CommentSectionComponent,
    CommentFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{path:'',component:ScriptDetailComponent}])
  ],
  providers: [
    ScriptDetailService
  ]
})
export class ScriptDetailModule { }
