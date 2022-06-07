import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnInit {
  showComments = false;
  constructor() {}

  ngOnInit(): void {}
}
