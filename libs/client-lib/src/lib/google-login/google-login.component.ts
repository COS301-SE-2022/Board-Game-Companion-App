import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService } from 'libs/api-lib/src/lib/services/GoogleAuth/google-auth.service';

@Component({
  selector: 'board-game-companion-app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {
  constructor(private readonly gapi: GoogleAuthService) {}

  ngOnInit(): void {}
  signUserIn()
  {
    //
    this.gapi.signIn();
  }
  
  
  
}
