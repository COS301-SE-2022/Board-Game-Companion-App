import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { disableDebugTools } from '@angular/platform-browser';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';


@Component({
  selector: 'board-game-companion-app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private route: ActivatedRoute, private router:Router,private readonly scriptService: ScriptService) {}
  name = "";
  id = "";
  game = "";
  script = "";
  num = "";
  score = "";
  time = "";
  result = "";
  date = "";
  gameId = "";
  img = "";
  //filter:automataScript = undefined

  getDetails(id:string): void{
    this.router.navigate(['board-game-details'], { state: { value: id } });
  }

  /* showInfo(value:automataScript){
    this.router.navigate(['script-detail'], { state: { value: value } });
  } */

  ngOnInit(): void 
  {
    this.name = this.route.snapshot.paramMap.get('my_object')||"";
    if(localStorage.getItem(this.name||"") !== null)
    {
      const session:string[] = JSON.parse(localStorage.getItem(this.name)||""); 
      this.id= this.name;
      this.game = session[0];
      this.script = session[1];
      this.num = session[2];
      this.score = session[3];
      this.time = session[4];
      this.result = session[5];
      this.date = session[6];
      this.gameId = session[7];
      if(session[8])
      {
        const elem = document.getElementById("gameHistory")
        const history = session[8];
        const playerAtHistory = session[9];
        let cPlayer = "";
        if(elem)
        {
          for(let i = 0; i< history.length;i++)
          {
            console.log(playerAtHistory[i])
            if(cPlayer != playerAtHistory[i])
            {
              
              elem.innerHTML += "<div style=\"border:1px solid black;\" class= \"bg-green-700 text-center font-bold\">" +playerAtHistory[i]+"</div>";
              cPlayer = playerAtHistory[i];
            }
            elem.innerHTML += "<div class= \"bg-grey-200\">" +history[i]+"</div>";
          }
        }
      }


      this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.gameId)
      .subscribe(
        data=>{
          //
          const res:string = data.toString();
          const parseXml = new window.DOMParser().parseFromString(res, "text/xml");
          parseXml.querySelectorAll("thumbnail").forEach(imgUrl=>{
            this.img = imgUrl.innerHTML;
          });

        });
    }
  }
}