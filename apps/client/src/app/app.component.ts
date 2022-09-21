import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'board-game-companion-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';
  headerHeight = 8;
  contentHeight = 84;
  footerHeight = 8;
  
  constructor(private router:Router,private readonly swUpdate:SwUpdate){
    // swUpdate.versionUpdates.pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')).subscribe(event => {
    //   if(promptUser(event))
    //     document.location.reload();
    // });
  }

  ngOnInit():void{
    console.log('app');
  }
}
