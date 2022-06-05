import { Component, OnInit } from '@angular/core';
import { script } from '../../shared/models/script';

@Component({
  selector: 'board-game-companion-app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss'],
  
})
export class ScriptComponent implements OnInit {
  scripts:script[] = [];
  
  ngOnInit(): void {
  
    console.log("script");      
  }
   
}
