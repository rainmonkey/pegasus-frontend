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
  @Input() whichLearner: { LearnerId: any; };
  @Input() addCourseCopy: any;
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
  learnerGroupCourse: any;
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
  selectCourse(value: any,check: any){
      
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
        this.tempGroupCourseObj['LearnerId']=this.whichLearner.LearnerId;
       
        this.learnerGroupCourse.push(this.tempGroupCourseObj);
      
      }
    }  
  }
  submit(){
    this.canAddGroup=true;
    this.confirmGroupCourse();
    let checkGroup=[];
    this.Course.forEach((element: { isChecked: boolean; }) => {
      if(element.isChecked == true){
        checkGroup.push(1)
      }   
    });
    if(checkGroup.length !==0){
      if(this.learnerGroupCourse){
        this.fdobj['LearnerGroupCourses']=this.learnerGroupCourse;
      }
      // this.fd.delete('details');
      // this.fd.append('details',JSON.stringify(this.fdobj));
      this.openConfirm();
      console.log(this.fdobj['LearnerGroupCourses']);
      console.log(this.fd);

    }
    else{
      this.canAddGroup=false;
    }

  }
 
  openConfirm(){
    Swal.fire({
      title:'Are you sure?',
      text:'Do you want to submit the grooup course?',
      type:'warning',
      showCancelButton:true,
      confirmButtonText:'Yes, add it',
      cancelButtonText:'Cancel'

    }).then((result)=>{
      console.log(this.fdobj);
      if(result.value){
        this.registrationService.addGroupCourse( this.fdobj).subscribe(
          val=>{
            console.log(val);
            console.log("post success")
            Swal.fire('Add Successful!')
          },error=>{
            Swal.fire("Ops!",
            "Learner had already add this course")
            console.log('error');
          }
        )
        
      }
      else if(
        result.dismiss === Swal.DismissReason.cancel
      ){
        Swal.fire("Cancel add the course")
      }

    })
  }
      
 
  
}
