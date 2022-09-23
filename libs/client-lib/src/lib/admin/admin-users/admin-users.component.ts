import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../shared/services/admin/admin.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { user } from '../../shared/models/general/user';
import { moderator } from '../../shared/models/admin/moderator';

@Component({
  selector: 'board-game-companion-app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    }
  };
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ 'Collection Owners', 'Script Authors', 'Script Downloaders'],
    datasets: [ {
      data: [ 0, 0, 0 ]
    } ]
  };
  pieChartType: ChartType = 'pie';
  email = "";
  searchValue = "";
  moderators:moderator[] = []

  constructor(private readonly adminService:AdminService){}

  ngOnInit(): void {
    this.initData();
  }

  checkInputOnEnter(value:any): void{

    if(value.key === "Enter"){
      value?.preventDefault();
      this.addModerator();
    }
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

  search(): void{
    if(this.searchValue === ""){
      this.notifications.add({type:"warning",message:"Search value is empty."});
      return;
    }

    this.adminService.search(this.searchValue).subscribe({
      next:(value) => {
        console.log(value);
      },
      error:() => {
        this.notifications.add({type:"danger",message:"Search Failed."});
      }
    })
  }

  addModerator(): void{
    if(this.email === ""){
      this.notifications.add({type:"danger",message:"Email is empty."});
      return;
    }

    this.adminService.create(this.email).subscribe({
      next:(value:moderator) => {
        this.moderators.push(value);
        this.email = "";
        this.notifications.add({type:"success",message:`Successfully created new moderator with email '${this.email}'`})
      },
      error:()=>{
        this.notifications.add({type:"warning",message:`Failed to create moderator with email '${this.email}'`});
        this.email = "";
      }
    })
  }

  removeModerator(value:moderator):void{
    this.adminService.remove(value._id).subscribe({
      next:(response:moderator) => {
        this.moderators = this.moderators.filter((val:moderator) => val._id !== response._id);
        this.notifications.add({type:"success",message:`Successfully removed moderator with email '${this.email}'`});
      },
      error:() => {
        this.notifications.add({type:"warning",message:`Failed to remove moderator with email '${value.email}'`});
      }
    })
  }

  loadModerators(): void{
    this.adminService.getAll().subscribe({
      next:(value:moderator[]) =>{
        this.moderators = value;
      },
      error:() =>{
        this.notifications.add({type:"warning",message:"Failed to load moderator details."});
      }
    });
  }

  initData(): void{
    this.adminService.countCollectionOwners().subscribe({
      next:(value:number) => {
        this.pieChartData.datasets[0].data[0] = value;
        this.chart?.update();
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count collections"});
      }
    })

    this.adminService.countScriptAuthors().subscribe({
      next:(value:number) => {
        this.pieChartData.datasets[0].data[1] = value;
        this.chart?.update();
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count script authors"});
      }
    })

    this.adminService.countDownloaders().subscribe({
      next:(value:number) => {
        this.pieChartData.datasets[0].data[2] = value;
        this.chart?.update();
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count downloaders"});
      }
    })
  }
}
