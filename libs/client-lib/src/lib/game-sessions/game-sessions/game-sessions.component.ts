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
  public selected = "";
  viewSession(n:string)
  {
    this.router.navigate(['session', {my_object: n}] )
  }

  
  ngOnInit(): void 
  {
        
    if(localStorage.getItem("sessions") !== null && localStorage.getItem("sessions") !== '[]')
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
    if(this.search!=="")
    {
      console.log("search .");
      this.listResults = new Array<fetchSessionResults>();
      this.ngOnInit();
      if(this.listResults.length!=0)
      {
        let temp: fetchSessionResults[] = new Array<fetchSessionResults>();
        temp = this.listResults;
        this.listResults = new Array<fetchSessionResults>();
        this.listResults = temp.filter( (res) => res.getBoardGame().toLowerCase().includes(this.search.toLowerCase()));
        console.log("search on: "+ this.search.toUpperCase());
      }
    }
  }

  onSort(): void
  {
    console.log(this.selected);
    // this.listResults = new Array<fetchSessionResults>();
    // this.ngOnInit();
    if(this.selected ==="alphabetical")
    {
      // sort game sessions alphabetically
        console.log("alphabet sort");
        this.listResults.sort(function(resultA, resultB) 
        {
          const gameA = resultA.getBoardGame().toUpperCase(); // ignore upper and lowercase
          const gameB = resultB.getBoardGame().toUpperCase(); // ignore upper and lowercase

          if (gameA < gameB) 
          {
            return -1;
          }
          if (gameA > gameB)
          {
            return 1;
          }

        return 0;
      });
    }
    else if(this.selected ==="score")
    {
      console.log("score sort");
      this.listResults.sort(function(resultA,resultB)
      {
        return +resultA.getScore() - +resultB.getScore(); 
      });

    }
    else if(this.selected==="date")
    {
      console.log("date sort");
      this.listResults.sort(function(resultA,resultB)
      {
        console.log(+new Date(resultB.getDate()) - +new Date(resultA.getDate()))
        return +new Date(resultB.getDate()) - +new Date(resultA.getDate());
      });
    }
  }
}
