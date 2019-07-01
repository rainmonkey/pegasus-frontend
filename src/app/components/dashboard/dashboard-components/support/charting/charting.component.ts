import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { SessionsService } from 'src/app/services/http/sessions.service';

@Component({
  selector: 'app-charting',
  templateUrl: './charting.component.html',
  styleUrls: ['./charting.component.css']
})
export class ChartingComponent implements OnInit {
  chart={
    title:'Sessions Graph',
    subTitle:'Number of sessions in schools'
  }
  public chartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Pakuranga' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Epsom' }
  ];
  public chartLabels: Label[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    legend:{
      display:true,
      position:'bottom',
      labels:{
        boxWidth:12,
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
            position: 'bottom'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(66, 134, 244)',
      backgroundColor: 'rgba(86, 147, 247,0.3)',
    },
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(
    public sessionService: SessionsService
  ) { }


  ngOnInit() {
  //   let beginDate = '2019-04-29'
  //   let endDate = '2019-05-10'
  //   this.sessionService.getReceptionistLessonBetweenDate('2019-04-29', '2019-05-10').subscribe(
  //     (res) => {
  //       console.log(res)
  //     },
  //     (error) => {
  //       console.log('Error!', error);
  //     });
  }
}
