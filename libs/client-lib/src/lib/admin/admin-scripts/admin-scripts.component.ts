import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { myScript } from '../../shared/models/scripts/my-script';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-admin-scripts',
  templateUrl: './admin-scripts.component.html',
  styleUrls: ['./admin-scripts.component.scss'],
})
export class AdminScriptsComponent implements OnInit{
  selectedYear = (new Date()).getFullYear();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 2
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
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Downloads'},
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'In Progress'},
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Released'}
    ]
  };

  
  constructor(private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    this.initData();
  }

  initData(): void{
    this.scriptService.getAllDownloadScripts().subscribe({
      next:(value:downloadScript[]) => {
        value.forEach((script:downloadScript) => {
          const vDate = new Date(script.dateDownloaded);

          if(this.selectedYear === vDate.getFullYear())
            this.barChartData.datasets[1].data[vDate.getMonth() - 1] += 1;
        });

        
        this.chart?.update();
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to retreive all the downloaded script"})
      }
    })

    this.scriptService.getAllMyScript().subscribe({
      next:(value:myScript[]) => {
        value.forEach((script:myScript) => {
          const vDate = new Date(script.created);

          if(this.selectedYear === vDate.getFullYear())
            this.barChartData.datasets[1].data[vDate.getMonth() - 1] += script.status.value === 1 ? 1 : 0;
        });

        
        this.chart?.update();
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to retreive all the in progress script"})
      }
    })

    this.scriptService.getAutomataScripts().subscribe({
      next:(value:automataScript[]) => {
        value.forEach((script:automataScript) => {
          const vDate = new Date(script.dateReleased);

          if(this.selectedYear === vDate.getFullYear())
            this.barChartData.datasets[2].data[vDate.getMonth()] += 1;
        });

        
        this.chart?.update();
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to retreive all the released script"})
      }
    })
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
