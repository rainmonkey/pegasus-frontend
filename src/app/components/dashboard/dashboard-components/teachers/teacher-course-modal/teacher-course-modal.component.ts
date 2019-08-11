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
  @Input() teacherLevel;
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
    this.formGroupAssemble();
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
        if(cate == 'Piano'){
          if(i.TeacherLevel == this.whichTeacher.Level){
            array.push(i)
          }
        }
        else{
          array.push(i)
        }
      }
    }
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

  selectAll(cate){
      for(let i of this.courseCheckBox._results){
        if(cate == i.nativeElement.name){
          i.nativeElement.checked = true;
        }
      }
  }

  selectNone(cate){
      for(let i of this.courseCheckBox._results){
        if(cate == i.nativeElement.name){
          i.nativeElement.checked = false;
        }
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

  lookupTeacherLevel(level){
    for (let i of this.teacherLevel){
      if(i.PropValue == level){
        return i.PropName;
      }
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
    // this.getTeacherSalary(array);
    this.coursesByTeacher = array;
  }

  /*
    get this teacher's salary
  */
  getTeacherSalary(course) {
    console.log(this.whichTeacher)
    if(this.whichTeacher.TeacherWageRates.length >0 ){
      if(course == 'piano'){
        return this.whichTeacher.TeacherWageRates[0].PianoRates;
      }
      else if(course == 'theory'){
        return this.whichTeacher.TeacherWageRates[0].TheoryRates;
      }
      else if(course == 'others'){
        return this.whichTeacher.TeacherWageRates[0].OthersRates;
      }
      else if(course == 'group'){
        return this.whichTeacher.TeacherWageRates[0].GroupRates;
      }
    }
    else{
      return '--';
    }
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
      "Courses": [],
      "TeacherWageRates":{}
    }
    //添加course Id
    for (let i of this.courseCheckBox._results) {
      if (i.nativeElement.checked == true) {
        objToSubmit.Courses.push((Number(i.nativeElement.value)))
      }
    }
    //添加 wage
    for(let i in this.CourseForm.value){
      this.CourseForm.value[i] =  Number(this.CourseForm.value[i]);
    }

    objToSubmit.TeacherWageRates = (this.CourseForm.value);

    console.log(objToSubmit)
    return objToSubmit;

  }

  submitToServer(dataToSubmit) {
    if(this.whichTeacher.TeacherWageRates.length==0){
      this.teacherService.updateTeacherCoursePost(dataToSubmit).subscribe(
        (res) => {
          this.onsubmit = false;
          this.isSuccess = true;
        },
        (err) => {
          this.onsubmit = false;
          console.log(err)
          alert(err)
        }
      )
    } 
    else{
      this.teacherService.updateTeacherCoursePut(dataToSubmit).subscribe(
        (res) => {
          this.onsubmit = false;
          this.isSuccess = true;
        },
        (err) => {
          this.onsubmit = false;
          console.log(err)
          alert(err)
        }
      )
    }
  }

  formGroupAssemble() {
    let groupObj;
      if(this.whichTeacher.TeacherWageRates == null){
        groupObj = {
          PianoRates: [{ value:null, disabled: false }, Validators.required],
          TheoryRates: [{ value: null, disabled: false }, Validators.required],
          OthersRates:[{ value: null, disabled: false }, Validators.required],
          GroupRates:[{ value: null, disabled: false }, Validators.required],
        }
      }
      else{
        groupObj = {
          PianoRates: [{ value: this.whichTeacher.TeacherWageRates.PianoRates, disabled: false }, Validators.required],
          TheoryRates: [{ value: this.whichTeacher.TeacherWageRates.TheoryRates, disabled: false }, Validators.required],
          OthersRates:[{ value: this.whichTeacher.TeacherWageRates.OthersRates, disabled: false }, Validators.required],
          GroupRates:[{ value: this.whichTeacher.TeacherWageRates.GroupRates, disabled: false }, Validators.required],
        }
      }
      this.CourseForm = this.fb.group(groupObj);
    
  }
}