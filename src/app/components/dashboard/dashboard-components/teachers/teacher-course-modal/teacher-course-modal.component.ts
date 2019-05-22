import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from 'src/app/services/http/courses.service';
import { TeachersService } from 'src/app/services/http/teachers.service';

@Component({
  selector: 'app-teacher-course-modal',
  templateUrl: './teacher-course-modal.component.html',
  styleUrls: ['./teacher-course-modal.component.css',
    '../../../../../shared/css/teacher-global.css']
})
export class TeacherCourseModalComponent implements OnInit {
  public CourseForm;
  //list of all courses categories provided
  public coursesCate;
  public teacherCourses;
  public courses;
  public isDetailModeFlag: boolean = true;
  public disableCourseDivFlag: boolean = false;

  @Input() command;
  @Input() whichTeacher;

  constructor(public activeModal: NgbActiveModal,
    public coursesService: CoursesService,
    public teacherService: TeachersService) { }

  ngOnInit() {
    this.getCoursesCategory();
    this.getTeacherCourse();
    this.getCourses();
  }


  ////////////////////////////////////////////methods called by Html/////////////////////////////////////////////////////////////
  getFullName() {
    return this.whichTeacher.FirstName + ' ' + this.whichTeacher.LastName;
  }

  ////////////////////////////////////////////methods called by other methods////////////////////////////////////////////////////
  getCoursesCategory() {
    this.coursesService.getCourseCategories().subscribe(
      (res) => {
        this.coursesCate = res.Data;
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
        console.log(err)
      }
    )
  }

  getCourses() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.courses = res.Data;
        this.courses.sort(this.compare('CourseId'));
        this.formatCourses();
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
        console.log(err)
      }
    )
  }

  /*
  
  */
  getTeacherCourse() {
    this.teacherCourses;
    this.teacherService.getTeacherCourse().subscribe(
      (res) => {
        this.teacherCourses = res.Data;
        this.teacherCourses.sort(this.compare('CourseId'));
        this.formatTeacherCourses();
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
        console.log(err)
      }
    )
  }

  compare(id) {
    return function (obj1, obj2) {
      let value1 = obj1[id];
      let value2 = obj2[id];
      return value1 - value2;
    }
  }

  formatTeacherCourses() {
    let array = [];
    for (let i of this.teacherCourses) {
      if (i.TeacherId == this.whichTeacher.TeacherId) {
        array.push(i)
      }
    }
    if (array.length == 0) {
      this.disableCourseDivFlag = true;
    }
    else {
      this.disableCourseDivFlag = false;
    }
    this.teacherCourses = array;
  }

  formatCourses() {
    //console.log(this.courses)
    let array = [];
    for (let i of this.courses) {
      if(array.indexOf(i.CourseId) == -1){
        array.push({CourseId: i.CourseId,CourseName: i.CourseName})
      }
    }
    this.courses = array;
    console.log(array)
  }
}
