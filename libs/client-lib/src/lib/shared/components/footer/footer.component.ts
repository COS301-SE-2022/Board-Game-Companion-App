import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'board-game-companion-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit {
  showFooter = false;

  ngOnInit(): void {
    document.addEventListener('editor-page',(event)=>{
      this.showFooter = false;
    })

    document.addEventListener('editor-exit',(event)=>{
      this.showFooter = true;
    })



    

  }
}
  
  

