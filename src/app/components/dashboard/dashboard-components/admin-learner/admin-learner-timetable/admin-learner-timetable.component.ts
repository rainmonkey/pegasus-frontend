import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';
import { ModelTemplateComponent } from 'src/app/shared/components/model-template/model-template.component';


@Component({
  selector: 'app-admin-learner-timetable',
  templateUrl: './admin-learner-timetable.component.html',
  styleUrls: ['./admin-learner-timetable.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminLearnerTimetableComponent implements OnInit {
  @Input() whichLearner;
  public calendar
  eventsModel;
  options: OptionsInput;
  existHoliday: any
  courseArray = []
  selectDate = []

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;

  constructor(
    private learnersService: LearnersService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getExistCourse();
    this.initFullCalendar(this);

  }

  initFullCalendar(pointer) {
    let that = pointer;
    this.options = {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      firstDay:1,
      eventTextColor: '#ffffff',
      eventClick: (info) => {
        console.log(info)
        that.checkLearner(info)
      },
    };
  }

  getExistCourse() {
    this.learnersService.getLearnerByIdTimePick(this.whichLearner).subscribe(
      (event) => {
        console.log(event);
        //@ts-ignore
        this.eventsModel = this.putInfo(event.Data);
      },
      (err) => {
        alert('something wrong');
      }
    )
  }

  putInfo(data) {
    this.courseArray = [];
    for (let i of data) {
      var extendedProps = {lessonId:i.LessonId};
     if (i.IsCanceled){
      this.courseArray.push({ "title": i.TeacherFirstName +' '+ i.BranchAbbr, "date": i.BeginTime,"endtime": i.EndTime,  'color':'grey' ,"extendedProps":extendedProps})}else if(i.IsConfirm){
        this.courseArray.push({ "title": i.TeacherFirstName +' '+ i.BranchAbbr, "date": i.BeginTime, "endtime": i.EndTime,'color':'green',"extendedProps":extendedProps })
      }else{
        this.courseArray.push({ "title": i.TeacherFirstName +' '+ i.BranchAbbr, "date": i.BeginTime,"endtime": i.EndTime,"extendedProps":extendedProps})
      }
    }
    return this.courseArray;
  }

  checkLearner(info) {
    const modalRef = this.modalService.open(ModelTemplateComponent,{ backdrop: 'static', keyboard: false })
    let that = this;
    modalRef.componentInstance.learnerCourseTimeTable = info;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
    )
  }
}
