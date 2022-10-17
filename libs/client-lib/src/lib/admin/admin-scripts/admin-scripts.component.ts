import { Component, OnInit, ViewChildren,ViewChild,QueryList } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { myScript } from '../../shared/models/scripts/my-script';
import { oldScript } from '../../shared/models/scripts/old-script';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-admin-scripts',
  templateUrl: './admin-scripts.component.html',
  styleUrls: ['./admin-scripts.component.scss'],
})
export class AdminScriptsComponent implements OnInit{
  selectedYear = (new Date()).getFullYear();
  @ViewChildren(BaseChartDirective) chart!: QueryList<BaseChartDirective>;
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
    labels: [ 'Downloads', 'In Progress', 'Flagged', 'Released','Old Versions' ],
    datasets: [ {
      data: [ 0, 0, 0, 0, 0 ]
    } ]
  };
  pieChartType: ChartType = 'pie';
  section = 0;
  
  constructor(private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    this.initData();
  }

  
  tab(value:number): void{
    this.section = value;
  }

  initData(): void{
    this.scriptService.getAllDownloadScripts().subscribe({
      next:(value:downloadScript[]) => {
        value.forEach((script:downloadScript) => {
          const vDate = new Date(script.dateDownloaded);

          if(this.selectedYear === vDate.getFullYear())
            this.barChartData.datasets[0].data[vDate.getMonth()] += 1;
        });

        this.pieChartData.datasets[0].data[0] = value.length;

        this.chart.forEach((element) => {
          element.update();
        })
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to retreive all the downloaded script"})
      }
    })

    this.scriptService.getAllMyScript().subscribe({
      next:(value:myScript[]) => {
        let inProgress = 0;
        let Flagged = 0;

        value.forEach((script:myScript) => {
          const vDate = new Date(script.created);

          if(this.selectedYear === vDate.getFullYear())
            this.barChartData.datasets[1].data[vDate.getMonth()] += script.status.value === 1 ? 1 : 0;
        
          inProgress += script.status.value === 1 ? 1 : 0;
          Flagged += script.status.value === 0 ? 1 : 0;
        });

        this.pieChartData.datasets[0].data[1] = inProgress;
        this.pieChartData.datasets[0].data[2] = Flagged;

        this.chart.forEach((element) => {
          element.update();
        })
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

        this.pieChartData.datasets[0].data[3] = value.length;

        this.chart.forEach((element) => {
          element.update();
        })
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to count all the released scripts."})
      }
    })

    this.scriptService.getOldScripts().subscribe({
      next:(value:oldScript[]) =>{
        this.pieChartData.datasets[0].data[4] = value.length;
        this.chart.forEach((element) => {
          element.update();
        })
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count all the old scripts"})
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
