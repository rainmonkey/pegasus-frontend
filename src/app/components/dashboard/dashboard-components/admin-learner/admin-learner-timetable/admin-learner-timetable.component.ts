import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';


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
    console.log(this.fullcalendar);
    let that = pointer;
    this.options = {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      eventTextColor: '#ffffff',
    };
  }

  getExistCourse() {
    this.learnersService.getLearnerById(this.whichLearner).subscribe(
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
    for (let i of data.One2oneCourseInstance) {
      this.courseArray.push({ 'id': i.Course.CourseId, "title": i.Course.CourseName, "date": i.BeginDate })
    }
    for (let i of data.LearnerGroupCourse) {
      this.courseArray.push({ 'id': i.GroupCourseInstance.Course.CourseCategoryId, 'title': i.GroupCourseInstance.Course.CourseName, 'date': i.GroupCourseInstance.BeginDate

      })
    }
    return this.courseArray;
  }
}
