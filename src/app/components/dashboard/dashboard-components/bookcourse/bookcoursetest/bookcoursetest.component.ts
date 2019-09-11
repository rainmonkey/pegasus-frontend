import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import {CoursesService} from '../../../../../services/http/courses.service'
import {LookUpsService} from '../../../../../services/http/look-ups.service'
import { LearnersService } from 'src/app/services/http/learners.service';
import { of } from 'rxjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationModalComponent } from '../../learner-registration/learner-registration-modal/learner-registration-modal.component';
import { LearnerRegistrationConfirmModalComponent } from '../../learner-registration/learner-registration-confirm-modal/learner-registration-confirm-modal.component';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { AdminLearnerPeriodCourseChangeModalComponent } from '../../admin-learner/admin-learner-period-course-change-modal/admin-learner-period-course-change-modal.component';
import { LearnerRegistrationService } from 'src/app/services/http/learner-registration.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-bookcoursetest',
  templateUrl: './bookcoursetest.component.html',
  styleUrls: ['./bookcoursetest.component.css']
})
export class BookcoursetestComponent implements OnInit {
  modalRefTimePicker: any;
  modalRefConfirm: any;
  customCourse: any;
  teaList=[];
  toDatePickCourseDuration: { "DurationName": any; "Duration":any };
 
  @Input() whichLearner;
  @Input() addCourse;
  @Output() addCourseCopy;
  @Output() toLearnerListEvent: EventEmitter<any> = new EventEmitter;
  AddCourseForm: any;
  
  Categories: any;
  Classes: any;
 
  courseLevel: any;
  // LevelName: any;
  Location: any;
  tempTeacherLevel=[];
   
  
  TeacherLevel=[];
  Level:any;
  Teacher: any;
  hourStep=1;
  minuteStep=15;
  category:any;
  course:any;
  beginDate: string=this.getDate();
  location: string;
  level: string;
  endDate: string;
  teacherName: string;
  avaliableDay: string;
  courseTime: string;
  isGroupCourse: boolean;
  isCustomCourse: boolean=true;
  haveSpecificRoom:boolean=false;
  Rooms: any;
  registrationForm: any;
  oneOnOneCourse: any[];
  roomNumber:any;
  fdobj={};
  fd:any = new FormData;
  AddCourse: boolean=true;
  temp: any;
 
  get customCourses(){
    return this.registrationForm.get('customCourse') as FormArray
  }
  

  constructor(private fb:FormBuilder,private courseservice:CoursesService,
    private lookupservice:LookUpsService,private learnerservice:LearnersService,
    private teacherservice:TeachersService,
    private modalService: NgbModal,private learnerRegistration:LearnerRegistrationService,
    ) { }

  ngOnInit() {
    
    this.addCourseCopy=this.addCourse;
    this.getCategories();
    this.getLocation();
    this.getDate();
    console.log(this.whichLearner);
    console.log(this.getDate())
    console.log(this.location);
    this.AddCourseForm = this.fb.group({
      Category:['',Validators.required],
      Course:['',Validators.required],
      Location:['',Validators.required],
      TeacherLevel:['',Validators.required],
      TeacherName:['',Validators.required],
      RoomNumber:['',Validators.required],
      beginDate:[this.getDate()],
      endDate:[''],
      DayOfWeek:['',Validators.required],
      beginTime:[''],

    })
    
  }
  chooseGroup(){
    this.isGroupCourse=true;
    this.isCustomCourse=false;

  }
  chooseCustom(){
    this.isCustomCourse=true;
    this.isGroupCourse=false;

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
  getCategories(){
    this.courseservice.getCourseCategories().subscribe(res=>{
      this.Categories=res.Data;
    
    },
    err=>{
      console.log(err);
    })
  }
  unique(TempTeacherLevel){
    let result={};
    let finalResult=[];
    for(let i=0;i<TempTeacherLevel.length;i++){
      result[TempTeacherLevel[i].TeacherLevelName]=TempTeacherLevel[i];
    }
    // console.log(result)
     for(let item in result){
      //  console.log(item);
      //  console.log(result[item]);
       finalResult.push(result[item]);

     }
     return finalResult;

  }
  getClass(id){
   
    // this.TeacherLevel=[];
    this.courseservice.getCourseNames().subscribe(res=>{
    this.Classes=res.Data;
    console.log(this.category);
   
    this.Classes=this.Classes.filter(item=>item.CourseCategoryId==Number(id));
    
 
    
    // console.log(this.whichLearner.LearnerLevel);
    if(this.category==1){
       this.Classes=this.Classes.filter(item=>item.Level==Number(this.whichLearner.LearnerLevel));
    }
    this.Classes=this.Classes.filter(item=>item.CourseType==1)
  
    console.log(this.Classes);
    for(let i=0;i<this.Classes.length;i++){
      this.tempTeacherLevel[i]={"TeacherLevelName":this.Classes[i].TeacherLevelName,"TeacherLevel":this.Classes[i].TeacherLevel}      
      
    }
    // this.toDatePickCourseDuration={"Duration":}
    
    this.TeacherLevel=this.unique(this.tempTeacherLevel);
    console.log(this.TeacherLevel);
   
  },
    err=>{
      console.log(err);
    })   
  }
  

  getLocation(){
    this.courseservice.getOrgs().subscribe(res=>{
      this.Location=res["Data"];
      console.log(this.Location);
      
    })

  }
  getTeachers(){
    // this.learnerservice.GetTeacherByOrgDayOfWeek(this.AddCourseForm.get('Location').value,
    //  this.AddCourseForm.get('DayOfWeek').value).subscribe(res=>{
    //         this.Teacher=res["Data"];
    //         console.log(this.Teacher)
      
    //         },err=>{
    //                 console.log(err);
    //                })
    
    console.log(this.course);
     this.learnerRegistration.getTeacherFilter(this.course).subscribe(res=>{
       this.temp=res.Data;
      //  console.log(this.temp);
       for(let i=0;i<this.temp.length;i++){
        //  console.log(this.temp[i]);
        //  console.log(this.temp[i].OrgId);
         if(this.temp[i].OrgId==this.location){
           console.log(this.temp[i].Level);
           for(let j=0;j<this.temp[i].Level.length;j++){
             if(this.temp[i].Level[j].levelId==this.level){
               console.log(this.temp[i].Level[j])
               console.log(this.temp[i].Level[j].teacher)
               this.Teacher=this.temp[i].Level[j].teacher
             }
           }
         }
       }

     })
    
  }
  selectTeacher(event){
    // console.log(this.Teacher);
    
    this.haveSpecificRoom=false;
    this.teaList=this.Teacher;
    this.teaList=this.teaList.filter(item=>item.TeacherId==Number(event));
    // console.log(this.teaList);
    for(let i=0 ;i<this.Classes.length;i++){
      if(this.Classes[i].CourseId==this.course){
        this.toDatePickCourseDuration={"DurationName":this.Classes[i].DurationName,"Duration":this.Classes[i].Duration}
      }
    }
    this.teaList=this.teaList.concat(this.toDatePickCourseDuration);
    console.log(this.teaList);
    if(this.teaList[0].RoomId==null){
      return this.haveSpecificRoom=true;
    }
    console.log(this.haveSpecificRoom);
    console.log(this.teaList[0].RoomId);
    


  }
  

  getRoom(event){
    this.teacherservice.getRooms().subscribe(res=>{
      this.Rooms=res['Data'];
      this.Rooms=this.Rooms.filter(item=>item.OrgId==Number(event));
      console.log(this.Rooms);
    })


  }
  reset(){
    this.category='';
    this.course='';
    this.location='';
    this.level='';
    this.beginDate=this.getDate();
    this.endDate=''
    this.teacherName='';
    this.avaliableDay='';
    this.courseTime='';
  }
  open(){
    this.modalRefTimePicker = this.modalService.open(LearnerRegistrationModalComponent, { windowClass: 'my-class' });
    this.customCourse={'location':this.location,"beginDate":this.beginDate,"DayOfWeek":this.avaliableDay};


    // console.log(this.beginDate);
    console.log(this.location);
    console.log(this.avaliableDay);
    console.log(this.beginDate);
    
    this.modalRefTimePicker.componentInstance.customCourse = this.customCourse;
    this.modalRefTimePicker.componentInstance.teaList = this.teaList;
    this.modalRefTimePicker.componentInstance.beginTimeTo.subscribe(
      (res) =>{
         this.getTimePickerInfo(res);
       },
       (err) => {
        console.log(err)
       }

     )

  }
  getTimePickerInfo(time){
    console.log(time)
    let timeArray = time.BeginTime.split(':');
    let dayOfWeek = time.DayOfWeek
    let day
    switch (dayOfWeek){
      case 'Monday':
        day = '1';
        break;
      case 'Tuesday':
        day = '2';
        break;
      case 'Wednesday':
        day = '3';
        break;
      case 'Thursday':
        day = '4';
        break;
      case 'Friday':
        day = '5';
        break;
      case 'Saturday':
        day = '6';
        break;
      case 'Sunday':
        day = '7';
        break;
    }
    let timeTrans: NgbTimeStruct = { hour: Number(timeArray[0]), minute: Number(timeArray[1]), second: 0 };
    this.AddCourseForm.patchValue({beginTime:timeTrans})
  }

  submit(){
    this.AddCourse=true;
    if(this.category==null||this.course==null|| this.location==null||this.level==null||
    this.avaliableDay==null||this.teacherName==null||this.beginDate==null||this.courseTime==null){
       this.AddCourse=false;
       alert('Please Select All Questions')
    }
    else{
      this.confirmCustomCourse();
      console.log(this.oneOnOneCourse);
      if(this.oneOnOneCourse.length !==0){
        this.fdobj['OneToOneCourseInstance']=this.oneOnOneCourse;
        console.log(this.fdobj);
        this.fd.delete('details');
        this.fd.append('details',JSON.stringify(this.fdobj));
        this.openConfirm();
        console.log(this.fd);
      }  
    }
    
    

  }
  confirmCustomCourse(){
    
    // console.log(cs);
    this.oneOnOneCourse=[];
    let tempObj={};
    tempObj['OrgId']=this.location;
    tempObj['CourseId']=parseInt(this.course);
    tempObj['TeacherId']=parseInt(this.teacherName);
    tempObj['RoomId']=parseInt(this.roomNumber);
    tempObj['BeginDate']=this.beginDate;
    let tempShceduleObj={};
    tempShceduleObj['DayOfWeek']=parseInt(this.avaliableDay);
    tempShceduleObj['BeginTime']=this.courseTime['hour']+':'+this.courseTime['minute']+':'+this.courseTime['second'];
    tempObj['Schedule']=tempShceduleObj;
    if(this.whichLearner){
      tempObj['LearnerId']=Number(this.whichLearner.LearnerId);
      this.oneOnOneCourse.push(tempObj);
    } 
  }
  openConfirm() {
    
    this.modalRefConfirm = this.modalService.open(LearnerRegistrationConfirmModalComponent,{backdrop:'static', keyboard:false});
    this.modalRefConfirm.componentInstance.fdObj = this.fd;
    if (this.whichLearner && !this.addCourse){
      this.modalRefConfirm.componentInstance.command = 2;  //edit
      this.modalRefConfirm.componentInstance.learnerId = this.whichLearner.LearnerId;
    } else if (this.addCourse){
      this.modalRefConfirm.componentInstance.command = 3; //add
      this.modalRefConfirm.componentInstance.oneOnOneCourse = this.oneOnOneCourse;
      this.modalRefConfirm.componentInstance.learnerId = this.whichLearner.LearnerId;
      this.modalRefConfirm.componentInstance.addCourse = this.addCourse;
    }
    else
      this.modalRefConfirm.componentInstance.command = 1;   //post
      this.modalRefConfirm.componentInstance.clickConfirm.subscribe(res=>{
        console.log(res)
        if (res == true) {
          this.toLearnerListEvent.emit(true);
        }

       
      })
  }


}
