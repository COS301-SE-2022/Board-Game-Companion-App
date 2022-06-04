import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  
})
export class ToolBarComponent implements OnInit {
  
  ngOnInit(): void {
  
    console.log("toolbar");      
  }
   
}
