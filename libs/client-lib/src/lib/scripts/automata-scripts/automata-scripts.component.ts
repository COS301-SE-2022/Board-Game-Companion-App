import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { Router } from '@angular/router';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { automataScript } from '../../shared/models/scripts/automata-script';

@Component({
  selector: 'board-game-companion-app-automata-scripts',
  templateUrl: './automata-scripts.component.html',
  styleUrls: ['./automata-scripts.component.scss'],
})
export class AutomataScriptComponent implements OnInit{
  scripts:automataScript[] = [];
  filter:automataScript[] = [];
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  showOffline = false;
  page = 1;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();


  constructor(private readonly scriptService:ScriptService,
              private readonly router:Router,
              private networkService: OnlineStatusService,
              ){
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                  
                  if(this.status === OnlineStatusType.ONLINE && this.filter.length === this.scripts.length){
                    this.getAutomataScripts();
                  }
                });

  }

  ngOnInit(): void{
    this.getAutomataScripts();
  }

  getAutomataScripts():void{
    if(this.status === OnlineStatusType.OFFLINE){
      if(this.scripts.length === 0)
        this.showOffline = true;

      return;
    }

    this.scriptService.getAutomataScripts().subscribe({
      next: (value: automataScript[]) => {
        console.log(value);
        this.filter = this.scripts = value;
      },
      error: () => {
        this.notifications.add({type:"danger",message:"An error occurred while trying to retrieve the scripts.You can try again later, or contact the developer if the error persists."})
      }
    })  
  }


  search(value:string): void{
    if(value===""){
      this.filter = this.scripts;
      return;
    }

    this.filter = this.scripts.filter((script:automataScript) => script.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }

  showInfo(value:automataScript){
    this.router.navigate(['script-detail'], { state: { value: value } });
  }

  showEditor(value:automataScript){
    this.router.navigate(['editor'],{ state: { value: value } });
  }

  play(value:automataScript): void{
    this.router.navigate(['script-exec'], { state: { value: value } });
  }
}
