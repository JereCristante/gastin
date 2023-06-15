import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DolarService } from '../Services/dolar.service';
import { coin } from '../interfaces/DolarInterface';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  dolarBlue!:coin;
  dolarOficial!:coin;
  lastUpdate!:Date;
  constructor(private dS:DolarService) {
    this.dS.getDolar().subscribe(
      data=> {
        this.dolarBlue=data.blue;
        this.dolarOficial=data.oficial;
        this.lastUpdate=data.last_update;
      },
      error => {
            alert(error.error);
            console.log(error);
      }
    );
   }

  ngOnInit() {
    
  }
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }
}
