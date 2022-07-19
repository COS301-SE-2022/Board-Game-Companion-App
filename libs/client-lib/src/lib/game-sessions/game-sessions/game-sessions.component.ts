import { Component, OnInit } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { fetchSessionResults } from '../../shared/models/fetch-session-results';
import { Router } from '@angular/router';


@Component({
  selector: 'board-game-companion-app-game-sessions',
  templateUrl: './game-sessions.component.html',
  styleUrls: ['./game-sessions.component.scss'],
})
export class GameSessionsComponent implements OnInit {

  constructor(private router:Router){}

  listResults: fetchSessionResults[] = new Array<fetchSessionResults>();
  public search = "";

  viewSession(n:string)
  {
    this.router.navigate(['session', {my_object: n}] )
  }

  
  ngOnInit(): void 
  {
    if(localStorage.getItem("sessions") !== null || localStorage.getItem("sessions") !== '[]')
    {
      const  names:string[] = JSON.parse(localStorage.getItem("sessions")||"");
      for(let i=0; i<names.length;i++)
      {
        const session:string[] = JSON.parse(localStorage.getItem(names[i])||""); 
        const id:string = names[i];
        const game:string = session[0];
        const script:string = session[1];
        const num:string = session[2];
        const score:string = session[3];
        const time:string = session[4];
        const result:string = session[5];
        const date:string = session[6];
        this.listResults.push(new fetchSessionResults(game,script,time,date,num,score,result,id));
        
      }
    }
  }

  Onsearch(): void
  {
    if(this.listResults.length!=0)
    {
      let temp: fetchSessionResults[] = new Array<fetchSessionResults>();
      temp = this.listResults;
      this.listResults = new Array<fetchSessionResults>();
      this.listResults = temp.filter( (res) => res.getBoardGame().toLowerCase() === this.search.toLowerCase());
      console.log("search on: "+ this.search.toUpperCase());
    }
  }
}
