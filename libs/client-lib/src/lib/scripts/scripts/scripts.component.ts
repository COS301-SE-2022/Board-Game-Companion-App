import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss'],
  
})
export class ScriptComponent implements OnInit {
   
  ngOnInit(): void {
  
    console.log("script");      
  }
   
}
