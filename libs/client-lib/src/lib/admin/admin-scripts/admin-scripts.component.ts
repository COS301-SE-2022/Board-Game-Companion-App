import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { myScript } from '../../shared/models/scripts/my-script';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-admin-scripts',
  templateUrl: './admin-scripts.component.html',
  styleUrls: ['./admin-scripts.component.scss'],
})
export class AdminScriptsComponent{
  selectedYear = (new Date()).getFullYear();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  constructor(private readonly scriptService:ScriptService){}

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 5
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  barChartType: ChartType = 'bar';

  barChartData: ChartData<'bar'> = {
    labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  initData(): void{
    //const myScripts:myScript[] = this.scriptService.getAllMyScripts
  }

  selectYear(year:number): void{
    this.selectedYear = year;
  }

  getYears(): number[]{
    const result:number[] = [];
    const currentYear = (new Date()).getFullYear();

    for(let year = 2022; year <= currentYear; year++)
      result.push(year);

    return result;
  }
}
