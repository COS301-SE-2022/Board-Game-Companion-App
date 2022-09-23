import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../shared/services/admin/admin.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

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
        position: 'left',
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

  constructor(private readonly adminService:AdminService){}

  ngOnInit(): void {
    this.initData();
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
