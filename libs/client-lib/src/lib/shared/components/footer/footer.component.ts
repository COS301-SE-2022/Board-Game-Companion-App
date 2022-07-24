import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CompilerService } from 'libs/api-lib/src/lib/services/compiler/compiler.service';
@Component({
  selector: 'board-game-companion-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers:[CompilerService]
})

export class FooterComponent implements OnInit {
  showFooter = true;
 constructor(private readonly CS:CompilerService){}

  ngOnInit(): void {
    document.addEventListener('editor-page',(event)=>{
      this.showFooter = false;
    })

    document.addEventListener('editor-exit',(event)=>{
      this.showFooter = true;
    })



    console.log(this.CS.parse("state{var x = 0} player p1{turn(){}}"))

  }
}
  
  

