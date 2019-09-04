import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/http/courses.service';
import { LearnerRegistrationService } from 'src/app/services/http/learner-registration.service';
import { LearnerRegistrationConfirmModalComponent } from '../../learner-registration/learner-registration-confirm-modal/learner-registration-confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-groupcourse',
  templateUrl: './groupcourse.component.html',
  styleUrls: ['./groupcourse.component.css']
})
export class GroupcourseComponent implements OnInit {
  @Input() whichLearner;
  @Input() addCourseCopy;
  @Output() toLearnerListEvent: EventEmitter<any> = new EventEmitter;
  isGroupCourse: boolean;
  isCustomCourse: boolean;
  GroupCourse: any;
  Course: any;
  beginDate:any=this.getDate();
  canAddGroup: boolean=true;
  modalRefConfirm: any;
  
  fd: any=new FormData;
  groupCourseForSubmit: any[];
  learnerGroupCourse: any[];
  tempGroupCourseObj: any;
  fdobj={};
  constructor(private fb:FormBuilder,private courseservice:CoursesService,
    private registrationService: LearnerRegistrationService,
    private modalService:NgbModal,
    ) { }

  ngOnInit() {
    this.getDate();
    this.getCourse();
     this.GroupCourse=this.fb.group({
       groupCourse:['',Validators.required],
       beginDate:[this.getDate()],

     })
  }
  getDate(){
    const Dates = new Date();
    const Year = Dates.getFullYear();
    const Month = (Dates.getMonth()+1) <10 ?
              '0'+(Dates.getMonth()+1):(Dates.getMonth()+1);
    const Day = (Dates.getDate())< 10 ?
              '0'+(Dates.getDate()):(Dates.getDate());
    console.log(Year+'-'+Month);
    return Year+'-'+Month+'-'+Day;
    
  }
  chooseGroup(){
    this.isGroupCourse=true;
    this.isCustomCourse=false;

  }
  chooseCustom(){
    this.isCustomCourse=true;
    this.isGroupCourse=false;

  }
  getCourse(){
    this.registrationService.getGroupCourse().subscribe(res=>{
      this.Course=res['Data'];
      
      for(let course of this.Course){
        course.comments=null;
        course.isChecked=false;
        course.beginDate=this.getDate().slice(0,10);
        
      }
      console.log(this.Course);
    })
    
  }
  selectCourse(value,check){
      
    for(let i=0;i<this.Course.length;i++){
      
      if(this.Course[i].GroupCourseInstanceId==Number(value)){
        
        this.Course[i].isChecked = check;
      }
    }
  
    this.canAddGroup=true;

  }
  confirmGroupCourse(){
    let tem={};
    this.groupCourseForSubmit=[];
    this.learnerGroupCourse=[];
    for(let groupcourse of this.Course){
      if(groupcourse.isChecked){
        this.tempGroupCourseObj={};
        this.tempGroupCourseObj['GroupCourseInstanceId']=groupcourse.GroupCourseInstanceId;
        this.tempGroupCourseObj['Comment'] = groupcourse.comments;
        this.tempGroupCourseObj['BeginDate'] = groupcourse.beginDate;
        this.learnerGroupCourse.push(this.tempGroupCourseObj);
        tem={...this.tempGroupCourseObj};
        if(this.whichLearner)
          tem['LearnerId']=this.whichLearner.LearnerId;
          console.log(this.whichLearner.LearnerId);
          this.groupCourseForSubmit.push(tem);
        
      }
    }  
  }
  submit(){
    this.canAddGroup=true;
    this.confirmGroupCourse();
    let checkGroup=[];
    this.Course.forEach(element => {
      if(element.isChecked == true){
        checkGroup.push(1)
      }   
    });
    if(checkGroup.length !==0){
      if(this.learnerGroupCourse){
        this.fdobj['LearnerGroupCourse']=this.learnerGroupCourse;
      }
      this.fd.delete('details');
      this.fd.append('details',JSON.stringify(this.fdobj));
      this.openConfirm();
      console.log(this.fdobj);

    }
    else{
      this.canAddGroup=false;
    }

  }
  openConfirm(){
    Swal.fire({
      title:'Are you sure?',
      text:'Do you want to submit the group course?',
      type:'warning',
      showCancelButton:true,
      confirmButtonColor:'#d33',
      confirmButtonText:'Yes, add it'
    }).then((result)=>{
      if(result.value){
        this.registrationService.addGroupCourse(this.fd);
             
      }

    })

  }
  // openConfirm() {
  //   console.log(this.addCourseCopy)
  //   this.modalRefConfirm = this.modalService.open(LearnerRegistrationConfirmModalComponent,{backdrop:'static', keyboard:false});
  //   this.modalRefConfirm.componentInstance.fdObj = this.fd;
  //   this.modalRefConfirm.componentInstance.fdObj = this.fd;
  //   if (this.whichLearner && !this.addCourseCopy){
  //     this.modalRefConfirm.componentInstance.command = 2;  //edit
  //     this.modalRefConfirm.componentInstance.learnerId = this.whichLearner.LearnerId;
  //   } else if (this.addCourseCopy){
  //     this.modalRefConfirm.componentInstance.command = 3; //add
  //     this.modalRefConfirm.componentInstance.groupCourse = this.groupCourseForSubmit;
  //     this.modalRefConfirm.componentInstance.isGroupCourse = this.isGroupCourse;
  //     this.modalRefConfirm.componentInstance.learnerId = this.whichLearner.LearnerId;
  //     this.modalRefConfirm.componentInstance.addCourse = this.addCourseCopy;
  //   }
  //   else
  //     this.modalRefConfirm.componentInstance.command = 1;   //post
  //   this.modalRefConfirm.componentInstance.clickConfirm.subscribe(res=>{
  //       console.log(res)
  //       if (res == true) {
  //         this.toLearnerListEvent.emit(true);
  //       }
  //     })
  // }

}
