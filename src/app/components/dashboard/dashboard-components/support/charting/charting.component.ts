import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { SessionsService } from 'src/app/services/http/sessions.service';
import { DashboardService } from '../../../../../services/http/dashboard.service';

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
  assignChartData = [];
  public chartData: ChartDataSets[] = [
    {
      label: "lessons For Recent 14 Days",
      fill: true,
      lineTension: 0,
      backgroundColor: "transparent",
      borderColor: '#f15765',
      pointBorderColor: '#da4c59',
      pointHoverBackgroundColor: '#da4c59',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      borderWidth: 1,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 0,
      data: [],
      spanGaps: false
  }
  ];
  public chartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    legend:{
      display:true,
      position:'top',
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

    },
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  // recent course data
  recentCourse;

  constructor(
    public sessionService: SessionsService,
    private dashBoardService: DashboardService
  ) { }
  getStatistic(){
    let brunch = localStorage.getItem('OrgId').slice(1,-1);
    this.dashBoardService.getStatistic(brunch).subscribe(
      res=>{
        console.log(res)
        this.recentCourse = res.Data.lessonsForRecent14Days;
        this.chartLabels = Object.keys(this.recentCourse);
        this.assignChartData = Object.values(this.recentCourse);
        this.chartData[0].data = this.assignChartData;
        console.log(this.assignChartData)
        console.log(this.recentCourse)
      }
    )
  }
  ngOnInit() {
    this.getStatistic();
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
