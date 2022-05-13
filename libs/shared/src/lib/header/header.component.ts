import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private readonly router:Router) {}

  ngOnInit(): void {}

  moveTo(path:string):void{
    if(path == "collection")
    {
      this.router.navigate(['/home']);
    }
    else{
      this.router.navigate(['/' + path]);
    }
  }
}
