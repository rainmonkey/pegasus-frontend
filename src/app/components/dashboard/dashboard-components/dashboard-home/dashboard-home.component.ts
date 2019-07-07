import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { AppSettingsService } from 'src/app/settings/app-settings.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/http/users.service';
import { DashboardService } from '../../../../services/http/dashboard.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard-home.component.css']
})

export class DashboardHomeComponent implements OnInit, AfterViewInit {
  notices: { notice: string; origin: string; }[];
  messages;
  // toDoForm: FormGroup;
  noticeForm: FormGroup;
  userName:string;
  formError:string;
  pageloading:boolean=true;
  lookUpList:Subscription;

  @ViewChild('popOver') public popover: NgbPopover;
  toDoList: { id: number; task: string; origin: string; priority: number; link: string; created_date: string; }[];

  constructor(
    public title: Title,
    private formBuilder: FormBuilder,
    public tableService: NgbootstraptableService,
    private settingService: AppSettingsService,
    private userService: UsersService,
    private dashboardService: DashboardService
  ) {

    this.title.setTitle('Home');
    this.notices=[
      {
        notice:'Work Harder',
        origin:'Edwin'
      },
      {
        notice:'党中央是大脑和中枢 党中央必须有定于一尊、一锤定音的权威',
        origin:'党'
      },
      {
        notice:'紧密团结在习近平同志为核心的党中央周围奋力夺取新时代中国特色 ',
        origin:'党'
      },
      {
        notice:'最近中共中央会议的主要议题是“党内民主”。中国高层领导人将党内民主称为党的“生命线”和中国共产党（CCP）是否能够在未来保持其至高无上的地位的主要 ',
        origin:'党'
      },
      {
        notice:'中共中央印发了《中国共产党党员教育管理工作条例》（以下简称《条例》），并发出通知，要求各地区各部门认真遵照执行 ',
        origin:'党'
      }
    ]
  }

  // Fires when the component is ready for use when all queries and inputs have been resolved
  ngOnInit(): void {
    // Subscribe for all the to dos
    this.getToDoList();
    let orgString = localStorage.getItem('OrgId').slice(1,-1);
    this.dashboardService.getStatistic(orgString).subscribe(
      res=>{
        this.messages = res.Data;
      }
    )

    this.userName = localStorage.getItem('userFirstName')
    this.pageloading=false

    // this.tableService.sorting(this.toDoList, 'priority')

    // Get Lookup list


  }

  getToDoList(){
    this.userService.getToDoList().subscribe(
      (res)=>{
        // console.log(res)
        this.toDoList = res['Data']
      },
      (err)=>console.warn(err)
    )
  }

  markToDoAsCompletedAPI(taskID){
    this.userService.updateToDoList(taskID).subscribe(
      (res)=>console.log(res),
      (err)=>console.warn(err)
    )
  }

  // Called after component’s views are initialized
  ngAfterViewInit(): void {
    this.lookUpList = this.settingService.currentLookUpSettings.subscribe(
      (res)=>{})
  }

  // newTaskFormBuilder(){
  //   this.toDoForm = this.formBuilder.group({
  //     task:['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
  //   })
  // }
  newNoticeFormBuilder(): void {
    this.noticeForm = this.formBuilder.group({
      notice:['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
    })
  }

  newNoticeSubmit(): void {
    console.log(this.noticeForm)
    if(this.noticeForm.dirty && this.noticeForm.valid){
      this.noticeForm.value['origin'] = this.userName

      this.sendToBackend()

      this.notices.push(this.noticeForm.value)
      this.popover.close()
    }
    else{
      this.formError = "Please enter your task."
    }
  }

  // Popover manupulation
  openOrClosePopOver(position): void {
    if (!this.popover.isOpen()){ this.popover.open(), this.popover.placement = position};
  }

  sendToBackend(){

  }

  completedTask(taskID){
    // First prepare to delete this on the Backend
    this.markToDoAsCompletedAPI(taskID)
    // Then takeout the object from the observable here for quick view
    this.toDoList.forEach((item, key)=>{
      if(item['ListId'] == taskID){
        this.toDoList.splice(key, 1)
      }
    })
  }

  // This is called just before the component is destoryed
  ngOnDestory(){
    this.lookUpList.unsubscribe()
  }

}
