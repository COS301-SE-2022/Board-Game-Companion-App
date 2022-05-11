import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HomeComponent, LoginComponent],
  exports: [HomeComponent, LoginComponent],
})
export class PagesModule {}
