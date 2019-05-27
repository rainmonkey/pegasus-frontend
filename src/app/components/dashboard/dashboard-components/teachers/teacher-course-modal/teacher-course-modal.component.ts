import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, ViewChildren, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from 'src/app/services/http/courses.service';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { LookUpsService } from 'src/app/services/http/look-ups.service';

@Component({
  selector: 'app-teacher-course-modal',
  templateUrl: './teacher-course-modal.component.html',
  styleUrls: ['./teacher-course-modal.component.css',
              '../teacher-panel/teacher-panel.component.css']
})
export class TeacherCourseModalComponent implements OnInit {
  public CourseForm;
  //list of all courses categories provided
  public coursesCate: object;
  public isDetailModeFlag: boolean = true;
  public disableCourseDivFlag: boolean = false;
  public oneOnoneWage: number = null;
  public groupWage: number = null;
  public coursesByTeacher;
  public isSuccess: boolean = false;
  public loadingGifFlag: boolean = false;
  public onsubmit:boolean = false;
  public isError: boolean = false;

  @Input() command;
  @Input() whichTeacher;
  //all courses that provided by this school
  @Input() courses;
  //all courses that all teachers current teaching.
  @Input() teachingCourses;
  @Input() level;
  @Input() duration;
  @Output() switch: EventEmitter<any> = new EventEmitter(); 

  @ViewChildren('courseCheck') courseCheckBox;

  constructor(public activeModal: NgbActiveModal,
    public coursesService: CoursesService,
    public teacherService: TeachersService,
    public fb: FormBuilder,
    public lookUps: LookUpsService) { }

  ngOnInit() {
    this.getCourseCategory();
    this.getCoursesByTeacher();
  }


  ////////////////////////////////////////////methods called by Html/////////////////////////////////////////////////////////////
  getFullName() {
    return this.whichTeacher.FirstName + '   ' + this.whichTeacher.LastName;
  }

  // 把这个学校所有的课程按cate分类  html
  //eg：把所有跟钢琴有关的课程放在钢琴下面
  displayCourse(cate) {
    let array = []
    for (let i of this.courses) {
      if (i.CourseCategory.CourseCategoryName == cate) {
        if(i.TeacherLevel == this.whichTeacher.Level){
          array.push(i)
        }
      }
    }
    console.log(array)
    return array;
  }

  //click course cate, show the drop down selections
  toggleCourseOptions(event, i) {
    let dropDownObj = document.getElementById(i);
    //set [flag] attr to element, to switch between show and hide
    event.target.attributes.flag = !event.target.attributes.flag;

    if (event.target.attributes.flag == true) {
      dropDownObj.style.display = 'block';
    }
    else {
      dropDownObj.style.display = 'none';
    }
  }

  /*
  switch mode to detail or edit
   0: currentMode is detail
   1: curentMOde is edit
 */
  switchMode(currentMode) {
    switch (currentMode) {
      case 0:
        this.isDetailModeFlag = true;
        break;
      case 1:
        this.isDetailModeFlag = false;

        break;
    }
  }

  /*
    setDefaultCourseSelection 
  */
  setDefaultCourseSelection(id) {
    for (let i of this.coursesByTeacher) {
      if (i.CourseId == id) {
        return true;
      }
    }
    return false;
  }

  lookupLevel(id) {
    //console.log(this.level)
    for (let i of this.level) {
      if (i.PropValue == id) {
        return i.PropName;
      }
    }
  }

  lookupDuration(id) {
    //console.log(this.duration)
    for (let i of this.duration) {
      if (i.PropValue == id) {
        return i.PropName;
      }
    }
  }

  lookupGroup(isGroup) {
    if (isGroup == 1) {
      return 'One To One'
    }
    if (isGroup == 2) {
      return 'Group'
    }
  }
  
  ////////////////////////////////////////////methods called by other methods/////////////////////////////////////////////////////////////
  /*
    get course categories of this school form server.
    eg: Pinao Guitar...
  */
  getCourseCategory() {
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

  /*
   get courses that taught by specific teacher
  */
  getCoursesByTeacher() {
    //console.log(this.teacherCourses)
    let array = [];
    for (let i of this.teachingCourses) {
      if (i.TeacherId == this.whichTeacher.TeacherId) {
        array.push(i)
      }
    }
    //如果该老师没有任何课程 这一模块就不显示
    if (array.length == 0) {
      this.disableCourseDivFlag = true;
    }
    else {
      this.disableCourseDivFlag = false;
    }
    this.getTeacherSalary(array);
    this.coursesByTeacher = array;
  }

  /*
    get this teacher's salary
  */
  getTeacherSalary(coursesByTeacher) {
    for (let i of coursesByTeacher) {
      //one on one salary
      if (i.Course.CourseType == 1) {
        this.oneOnoneWage = i.HourlyWage;
      }
      else if (i.Course.CourseType == 2) {
        this.groupWage = i.HourlyWage;
      }
    }
    this.formGroupAssemble();
  }

  onSubmit() {
    for (let i in this.CourseForm.controls) {
      this.CourseForm.controls[i].touched = true;
    }
    if (this.CourseForm.status == 'VALID') {
      this.onsubmit = true;
      this.isError = false;
      let dataToSubmit = this.prepareData();
      this.submitToServer(dataToSubmit);
    }
    else {
      this.isError = true;
      return
    }
  }

  prepareData() {
    let objToSubmit = {
      "TeacherId": this.whichTeacher.TeacherId,
      "TeacherCourses": []
    }
    for (let i of this.courseCheckBox._results) {
      //添加course Id
      if (i.nativeElement.checked == true) {
        let teacherCourse = { "CourseId": null, "HourlyWage": null };
        teacherCourse.CourseId = (Number(i.nativeElement.value));

        //添加工资
        // 1: one to one 
        if (i.nativeElement.id == 1) {
          let wage = document.getElementById('one');
          teacherCourse.HourlyWage = (Number(wage['value']))
        }
        //2: group
        else if (i.nativeElement.id == 2) {
          let wage = document.getElementById('group');
          teacherCourse.HourlyWage = (Number(wage['value']))
        }

        objToSubmit.TeacherCourses.push(teacherCourse)
      }
    }
    return objToSubmit;

  }

  submitToServer(dataToSubmit) {
    this.teacherService.updateTeacherCourse(dataToSubmit).subscribe(
      (res) => {
        this.onsubmit = false;
        this.isSuccess = true;
      },
      (err) => {
        this.onsubmit = false;
        alert(err)
      }
    )
  }

  formGroupAssemble() {
    let groupObj;

    groupObj = {
      oneOnoneWage: [{ value: this.oneOnoneWage, disabled: false }, Validators.required],
      groupWage: [{ value: this.groupWage, disabled: false }, Validators.required]
    }

    this.CourseForm = this.fb.group(groupObj);
  }
}