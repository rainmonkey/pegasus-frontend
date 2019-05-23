import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';


@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard-home.component.css']
})

export class DashboardHomeComponent implements OnInit, AfterViewInit {
  notices: { notice: string; origin: string; }[];

  // toDoForm: FormGroup;
  noticeForm: FormGroup;
  userName:string;
  formError:string;
  pageloading:boolean=true;

  @ViewChild('popOver') public popover: NgbPopover;
  toDoList: { id: number; task: string; origin: string; priority: number; link: string; created_date: string; }[];

  constructor(
    public title: Title,
    private formBuilder: FormBuilder,
    public tableService: NgbootstraptableService
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
    this.toDoList=[
      {
        id:1,
        task:"Update our Tutors information.",
        origin: 'Mao',
        priority: 1,
        link: 'tutors/list',
        created_date: ''
      },
      {
        id:2,
        task:"Update our courses information .",
        origin: 'Mao',
        priority: 2,
        link: 'courses/list',
        created_date: ''
      },
      {
        id:3,
        task:"Talk to our learners for feedback.",
        origin: 'Mao',
        priority: 4,
        link: "learner/list",
        created_date: ''
      },
      {
        id:4,
        task:"Check on Sarah's session with Mark.",
        origin: 'Mao',
        priority: 1,
        link: "sessions/list",
        created_date: ''
      }
    ]
  }

  // Fires when the component is ready for use when all queries and inputs have been resolved
  ngOnInit(): void {
    // Subscribe for all the to dos

    this.userName = localStorage.getItem('userFirstName')
    this.pageloading=false
    
    this.tableService.sorting(this.toDoList, 'priority')
  }

  // Called after component’s views are initialized
  ngAfterViewInit(): void {

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

  ignoreTask(taskID){
    // First prepare to delete this on the Backend

    // Then takeout the object from the observable here for quick view
    this.toDoList.forEach((item, key)=>{
      if(item['id'] == taskID){
        this.toDoList.splice(key, 1)
      }
    })
  }

  // This is called just before the component is destoryed
  ngOnDestory(){

  }

}