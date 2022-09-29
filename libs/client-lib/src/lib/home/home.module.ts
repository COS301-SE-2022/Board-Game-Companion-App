import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { Carousel1Component } from './carousel1/carousel1.component';
import { Carousel2Component } from './carousel2/carousel2.component';
import { SharedModule } from '../shared/shared.module';
import { OnlineStatusModule } from 'ngx-online-status';

@NgModule({
  declarations: [
    HomeComponent,
    CarouselComponent,
    Carousel1Component,
    Carousel2Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    OnlineStatusModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
})
export class HomeModule {}
