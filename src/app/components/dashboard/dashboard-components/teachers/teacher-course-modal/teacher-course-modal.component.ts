import { FormBuilder, Validators } from '@angular/forms';
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
  public coursesCate: object;
  public isDetailModeFlag: boolean = true;
  public disableCourseDivFlag: boolean = false;
  public oneOnoneWage: number = null;
  public groupWage: number = null;
  public coursesByTeacher;
  public isSuccess:boolean = false;
  public loadingGifFlag:boolean = false;
  public isError:boolean = false;

  @Input() command;
  @Input() whichTeacher;
  //all courses that provided by this school
  @Input() courses;
  //all courses that all teachers current teaching.
  @Input() teachingCourses;
  @Input() level;
  @Input() duration;


  @ViewChildren('courseCheck') courseCheckBox;

  constructor(public activeModal: NgbActiveModal,
    public coursesService: CoursesService,
    public teacherService: TeachersService,
    public fb: FormBuilder,
    public lookUps: LookUpsService) { }

  ngOnInit() {
    this.getCourseCategory();
    this.getCoursesByTeacher();
  
    //this.formatCourses();

    //console.log(this.courses)
    return



  }


  ////////////////////////////////////////////methods called by Html/////////////////////////////////////////////////////////////
  getFullName() {
    return this.whichTeacher.FirstName + ' ' + this.whichTeacher.LastName;
  }

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

  // compare(id) {
  //   return function (obj1, obj2) {
  //     let value1 = obj1[id];
  //     let value2 = obj2[id];
  //     return value1 - value2;
  //   }
  // }



  //获取老师工资
  getTeacherSalary(coursesByTeacher) {
    console.log(coursesByTeacher)
    for (let i of coursesByTeacher) {
      //one on one salary
      if (i.Course.isGroup == 1) {
        console.log(i)
        this.oneOnoneWage = i.HourlyWage;
        console.log('a', this.oneOnoneWage)
      }
      else if (i.Course.isGroup == 0) {
        console.log(i)
        this.groupWage = i.HourlyWage;
        console.log('b', this.groupWage)
      }
    }
    this.formGroupAssemble();
  }

  // formatCourses() {
  //   //console.log(this.courses)
  //   let array = [];
  //   for (let i of this.courses) {
  //     if(array.indexOf(i.CourseId) == -1){
  //       array.push({CourseId: i.CourseId,CourseName: i.CourseName})
  //     }
  //   }
  //   this.courses = array;
  //   console.log(array)
  // }

  //名字相同的课程整合到一起 比如pinao大类
  a() {
    let array = [];
    for (let i of this.teachingCourses) {
      console.log(i)
    }
    return array;
  }

  //有用 把这个学校所有的课程按cate分类  html
  //eg：把所有跟钢琴有关的课程放在钢琴下面
  displayCourse(cate) {
    let array = []
    for (let i of this.courses) {
      if (i.CourseCategory.CourseCategoryName == cate) {
        array.push(i)
      }
    }
    // //console.log(array)
    return array;
  }

  //挑出指定老师上的课程  html
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


  //点击课程类的名字 会出现下拉菜单 指定相应的课程 html
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
        break;
      case 1:
        this.isDetailModeFlag = false;
        break;
    }
  }

  onSubmit() {
    //dataToSubmit = JSON.stringify(dataToSubmit);
    console.log(this.oneOnoneWage)
    for (let i in this.CourseForm.controls) {
      this.CourseForm.controls[i].touched = true;
    }
    if(this.CourseForm.status == 'VALID'){
      this.loadingGifFlag = true;
      this.isError = false;
      let dataToSubmit = this.prepareData();
      this.submitToServer(dataToSubmit);
    }
    else{
      this.isError = true;
      return
    }
  }

  submitToServer(dataToSubmit){
    this.teacherService.updateTeacherCourse(dataToSubmit).subscribe(
      (res) => {
        this.loadingGifFlag = false;
        this.isSuccess = true;
        //console.log(res)
      },
      (err) => {
        this.loadingGifFlag = false;
        alert(err)
      }
    )
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
          console.log( 'a----',teacherCourse.HourlyWage)
        }
        //2: group
        else if (i.nativeElement.id == 2) {
          let wage = document.getElementById('group');
          teacherCourse.HourlyWage = (Number(wage['value']))
          console.log( 'b----',teacherCourse.HourlyWage)
        }
        
        objToSubmit.TeacherCourses.push(teacherCourse)
      }
    }
    console.log(objToSubmit)
    return objToSubmit;

  }

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
    if (isGroup == 0) {
      return 'One To One'
    }
    if (isGroup == 1) {
      return 'Group'
    }
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