import Swal from 'sweetalert2';

import { Input } from '@angular/core';
import { SessionsService } from './../../../services/http/sessions.service';
import { Component, OnInit } from '@angular/core';
import { LearnersService } from './../../../services/http/learners.service';
// import { LearnersService } from '/app';


@Component({
  selector: 'app-makeup-lesson',
  templateUrl: './makeup-lesson.component.html',
  styleUrls: ['./makeup-lesson.component.css']
})
export class MakeupLessonComponent implements OnInit {
  @Input() learnerId;
  @Input() courseId;
  @Input() lessonId;
  lessonQuantity:number;
  quarterQuantity:number;
  isLoading=false;

  constructor(private sessionsService:SessionsService,
      private learnersService:LearnersService 
  ){}

  ngOnInit() {
    let that = this;
    this.sessionsService.GetRemainingByLearnerAndCourse(this.learnerId,this.courseId)
      .subscribe(res=>{
        let data=res.Data;
        that.processData(data);
      },
      err=>{
        console.log(err)
      });
  }
  processData(data){
    if (!data) return;
    if (data.length==0){
      this.lessonQuantity=0;
      this.quarterQuantity=0;
      return;
    }    
    let sum=0,duration;
    data.forEach(e => {
      sum+=e.remaining;
      duration=e.duration;
    });
    this.lessonQuantity = Math.floor(sum/(duration+1));
    this.quarterQuantity =sum%(duration+1);
    console.log(this.lessonQuantity,this.quarterQuantity);
  }
  doMakeup(isAfter){
    Swal.fire({
      title: 'Please confirm it?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      if (result.value) {
      // console.log(this.learnerCourseTimeTable);
      // console.log(this.learnerCourseTimeTable.event.extendedProps.lessonId);
      // let { lessonId } =this.learnerCourseTimeTable.event.extendedProps;
      let userId = localStorage.getItem('staffId');
      this.learnersService.makeUpSplitLesson(this.lessonId,isAfter,userId).subscribe(
        (event) => {
          console.log(event);
          //@ts-ignore
          //this.eventsModel = this.putInfo(event.Data);
          Swal.fire({
            title: 'Your Operation Has Been Successfully Completed!',
            type: 'success',
            showConfirmButton: true,
          });
          // this.activeModal.close('Close click')
        },
        (err) => {
          let errMsg = err.error.ErrorMessage?err.error.ErrorMessage:"Something error!"
          Swal.fire('error!', errMsg,'error')
          }
      )
    }})
  }
}
