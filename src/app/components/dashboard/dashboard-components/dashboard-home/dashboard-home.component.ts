import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormControlName
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { NgbootstraptableService } from "src/app/services/others/ngbootstraptable.service";
import { AppSettingsService } from "src/app/settings/app-settings.service";
import { Subscription } from "rxjs";
import { UsersService } from "src/app/services/http/users.service";
import { DashboardService } from "../../../../services/http/dashboard.service";
import { SessionsService } from 'src/app/services/http/sessions.service';
import { ChartDataSets, ChartOptions, Chart, ChartType, ChartData } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
@Component({
  selector: "app-dashboard-home",
  templateUrl: "./dashboard-home.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./dashboard-home.component.css"]
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {
  notices: { notice: string; origin: string }[];
  messages;
  // toDoForm: FormGroup;
  // monthFormat=[];
  dayFormat = [];
  monthFormat = [];
  noticeForm: FormGroup;
  userName: string;
  formError: string;
  pageloading: boolean = true;
  lookUpList: Subscription;

  @ViewChild("popOver") public popover: NgbPopover;
  toDoList: {
    id: number;
    task: string;
    origin: string;
    priority: number;
    link: string;
    created_date: string;
  }[];

  constructor(
    public title: Title,
    private formBuilder: FormBuilder,
    public tableService: NgbootstraptableService,
    private settingService: AppSettingsService,
    private userService: UsersService,
    private dashboardService: DashboardService,
    public sessionService: SessionsService,
    private dashBoardService: DashboardService
  ) {
    this.title.setTitle("Home");
    this.notices = [
      {
        notice: "Work Harder",
        origin: "Edwin"
      },
      {
        notice: "党中央是大脑和中枢 党中央必须有定于一尊、一锤定音的权威",
        origin: "党"
      },
      {
        notice: "紧密团结在习近平同志为核心的党中央周围奋力夺取新时代中国特色 ",
        origin: "党"
      },
      {
        notice:
          "最近中共中央会议的主要议题是“党内民主”。中国高层领导人将党内民主称为党的“生命线”和中国共产党（CCP）是否能够在未来保持其至高无上的地位的主要 ",
        origin: "党"
      },
      {
        notice:
          "中共中央印发了《中国共产党党员教育管理工作条例》（以下简称《条例》），并发出通知，要求各地区各部门认真遵照执行 ",
        origin: "党"
      }
    ];
  }

  // Fires when the component is ready for use when all queries and inputs have been resolved
  ngOnInit(): void {
    this.getStatistic()
    // Subscribe for all the to dos
    this.getToDoList();
    let orgString = localStorage.getItem("OrgId").slice(1, -1);
    this.dashboardService.getStatistic(orgString).subscribe(res => {
      console.log(res);
      this.messages = res.Data;
    });

    this.userName = localStorage.getItem("userFirstName");
    this.pageloading = false;

    // this.tableService.sorting(this.toDoList, 'priority')

    // Get Lookup list
  }
  // get to do list from user service
  getToDoList() {
    this.userService.getToDoList().subscribe(
      res => {
        console.log(res);
        this.toDoList = res["Data"];
        this.getDate(res["Data"]);
      },
      err => console.warn(err)
    );
  }
  // get date of to do list
  getDate(date) {
    let dateFormat = [];
    let dateSing = [];
    date.forEach(list => {
      //@ts-ignore
      dateFormat.push(list.TodoDate.slice(0, 10));
    });
    dateFormat.forEach(x => {
      dateSing.push(x.split("-")[1]);
      this.dayFormat.push(x.split("-")[2]);
      this.changeNumberToMonth(dateSing);
      console.log(this.monthFormat, this.dayFormat);
    });
  }

  changeNumberToMonth(array) {
    let array2 = [
      "Jun",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    this.monthFormat = array.map(v => {
      return array2[v - 1];
    });
  }

  markToDoAsCompletedAPI(taskID) {
    this.userService
      .updateToDoList(taskID)
      .subscribe(res => console.log(res), err => console.warn(err));
  }

  // Called after component’s views are initialized
  ngAfterViewInit(): void {
    this.lookUpList = this.settingService.currentLookUpSettings.subscribe(
      res => {}
    );
  }

  // newTaskFormBuilder(){
  //   this.toDoForm = this.formBuilder.group({
  //     task:['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
  //   })
  // }
  newNoticeFormBuilder(): void {
    this.noticeForm = this.formBuilder.group({
      notice: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200)
        ]
      ]
    });
  }

  newNoticeSubmit(): void {
    console.log(this.noticeForm);
    if (this.noticeForm.dirty && this.noticeForm.valid) {
      this.noticeForm.value["origin"] = this.userName;

      this.sendToBackend();

      this.notices.push(this.noticeForm.value);
      this.popover.close();
    } else {
      this.formError = "Please enter your task.";
    }
  }

  // Popover manupulation
  openOrClosePopOver(position): void {
    if (!this.popover.isOpen()) {
      this.popover.open(), (this.popover.placement = position);
    }
  }

  sendToBackend() {}

  completedTask(taskID) {
    // First prepare to delete this on the Backend
    this.markToDoAsCompletedAPI(taskID);
    // Then takeout the object from the observable here for quick view
    this.toDoList.forEach((item, key) => {
      if (item["ListId"] == taskID) {
        this.toDoList.splice(key, 1);
      }
    });
  }

    //--------------------------------lessons For Recent 14 Days--------------------------------
    chart={
      title:'Lessions Graph',
      subTitle:'Number of lessions'
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
      maintainAspectRatio: true,
      legend:{
        display:true,
        position:'top',
        labels:{
          boxWidth:12,
        }
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{
          gridLines: {
            display: false
        }
        }],
        yAxes: [
          {
            gridLines: {
              display: false
          },
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
    //------------------------------------------newEnrolledStudentsForRecent8Weeks-----------------------------
    barChart={
      title:'Students Graph',
      subTitle:'Number of new students'
    }
    public barChartOptions: ChartOptions = {
      responsive:true,
      maintainAspectRatio: true,
            scales:
            {
                xAxes: [{
                  gridLines: {
                    display: false
                },
                    display: true
                }],
                yAxes: [{
                  gridLines: {
                    display: false
                },
                    display: true
                }],
            },
            legend: {
                display: false
            }
    };
    public barChartLabels: Label[] = ["week 8", "week 7", "week 6", "week 5", "week 4", "week 3", "week 2", "week 1"];
    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartPlugins = [];
    barChartData: ChartDataSets[] =
    [
                {
                    label: "new Enrolled Students For Recent 8 Weeks",
                    backgroundColor: [
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)'
                    ],
                    borderColor: [
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)',
                        'rgb(121, 106, 238)'
                    ],
                    data: []
                }
      ];

    getStatistic(){
      let brunch = localStorage.getItem('OrgId').slice(1,-1);
      this.dashBoardService.getStatistic(brunch).subscribe(
        res=>{
          this.recentCourse = res.Data.lessonsForRecent14Days;
          this.transformLabelDate();
          this.assignChartData = Object.values(this.recentCourse);
          this.chartData[0].data = this.assignChartData;
          let barValue = res.Data.newEnrolledStudentsForRecent8Weeks;
          //@ts-ignore
          this.barChartData[0].data = Object.values(barValue);
        }
      )
    }
    transformLabelDate(){
      let fullDateArray = Object.keys(this.recentCourse);
      let simpleDateArray = fullDateArray.map(date =>{
        return date.substring(0,date.length-5)
      });
      this.chartLabels = simpleDateArray;
    }



  // This is called just before the component is destoryed
  ngOnDestory() {
    this.lookUpList.unsubscribe();
  }
}
