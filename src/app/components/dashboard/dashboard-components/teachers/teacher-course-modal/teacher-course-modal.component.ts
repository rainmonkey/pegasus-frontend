import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from 'src/app/services/http/courses.service';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { LookUpsService } from 'src/app/services/http/look-ups.service';

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
  public courseAfterFormat: any;
  public level:any;
  public duration:any;
  public group:any;

  @Input() command;
  @Input() whichTeacher;

  @ViewChildren('courseCheck') courseCheckBox;

  constructor(public activeModal: NgbActiveModal,
    public coursesService: CoursesService,
    public teacherService: TeachersService,
    public fb: FormBuilder,
    public lookUps: LookUpsService) { }

  ngOnInit() {
    //this.CourseForm = this.fb.group(this.formGroupAssemble());
    this.getCoursesCategory();
    this.getCourses();
    this.getTeacherCourse();
    this.lookUp4();
    this.lookUp8();


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
        console.log(this.courses)
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

  //挑出指定老师上的课程
  formatTeacherCourses() {
    //console.log(this.teacherCourses)
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
    //console.log(this.teacherCourses)
  }

  //名字相同的课程整合到一起 比如pinao大类
  a(){
    let array = [];
    for(let i of this.teacherCourses){
      console.log(i)
    }
    return array;
  }

  formatCourses() {
    //console.log(this.courses)
    let array = [];
    //获得目前学校提供的所有的课程的categories
    for (let i of this.courses) {
      if (array.indexOf(i.CourseCategory.CourseCategoryName) == -1) {
        array.push(i.CourseCategory.CourseCategoryName)
      }
    }
    this.courseAfterFormat = array;
    //console.log(array)
  }

  displayCourse(cate) {
    let array = []
    for (let i of this.courses) {
      if (i.CourseCategory.CourseCategoryName == cate) {
        array.push(i)
      }
    }
    //console.log(array)
    return array;
  }

  toggleCourseOptions(event, i) {
    let dropDownObj = document.getElementById(i);
    //console.log(dropDownObj)
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
    0: currentMode is detail
    1: curentMOde is edit
  */
  switchMode(currentMode) {
    switch (currentMode) {
      case 0:
        this.isDetailModeFlag = true;
        return;
      case 1:
        this.isDetailModeFlag = false;
        return;
    }
  }

  onSubmit() {
    let dataToSubmit = this.prepareData();
    //dataToSubmit = JSON.stringify(dataToSubmit);
    //console.log(dataToSubmit)
    this.teacherService.updateTeacherCourse(dataToSubmit).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  prepareData() {
    //console.log(this.courseCheckBox._results)
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
        //console.log(teacherCourse)
        objToSubmit.TeacherCourses.push(teacherCourse)
      }
    }
    return objToSubmit;
    //console.log(objToSubmit)
  }

  setDefaultCourseSelection(id) {
    for (let i of this.teacherCourses) {
      if (i.CourseId == id) {
        return true;
      }
    }
    return false;
  }

  lookUp4() {
    this.lookUps.getLookUps(4).subscribe(
      (res) => {
       
          this.level = res.Data;
      
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
      }
    )
  }


  lookUp8() {
    this.lookUps.getLookUps(8).subscribe(
      (res) => {
       
          this.duration = res.Data;
      
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
      }
    )
  }

  lookupLevel(id){
    //console.log(this.level)
    for(let i of this.level){
     if(i.PropValue == id){
       return i.PropName;
     }
    }
  }

  lookupDuration(id){
    //console.log(this.duration)
    for(let i of this.duration){
      if(i.PropValue == id){
        return i.PropName;
      }
    }
  }

  lookupGroup(isGroup){
    if(isGroup == 0){
      return 'One To One'
    }
    if(isGroup == 1){
      return 'Group'
    }
  }



}