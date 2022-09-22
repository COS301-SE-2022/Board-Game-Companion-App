import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'board-game-companion-app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
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
  ngOnInit(): void {
    console.log("admin")
  }

}
