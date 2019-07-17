import { TrialModalComponent } from './../trial-modal/trial-modal.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from 'src/app/services/http/courses.service';
import { LookUpsService } from 'src/app/services/http/look-ups.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trial-search',
  templateUrl: './trial-search.component.html',
  styleUrls: ['./trial-search.component.css',
    '../../teachers/teacher-panel/teacher-panel.component.css']
})
export class TrialSearchComponent implements OnInit {
  public iconName: Array<string> = ['piano.svg', 'drum.png', 'guitar.png', 'violin.png', 'cello.png', 'voice.png', 'theory.png', 'aural.svg'];
  public styleFlowControl = {
    "Categories": { "clicked": false, "display": true, "id": 1 },
    "Orgs": { "clicked": false, "display": false, "id": 2 },
    "Teachers": { "clicked": false, "display": false, "id": 3 },
  }
  public filters: object = { "CategoriesId": null, "OrgsId": null, "OrgsName": null, "CategoriesName": null }
  public previousCloseBtn: any = null;
  public coursesTeachingByCate;
  public termPeriod;
  public timeSlot: Array<any> = [];
  public teachersLevel;
  public teacherExistsFlag: boolean = true
  public waitingDataFlag: boolean = true

  @Input() courses;
  @Input() coursesCate;
  @Input() orgs;
  @Input() teachers;
  @Input() groupCoursesInstance;
  @Input() teachingCourses;
  @Input() LearnerId;
  @Input() learners;
  //arrange
  @Input() arrangeCourseCategory;
  @Input() arrangeCourseDetails
  @Input() arrangeCourseInstance;

  @Output() childEvent = new EventEmitter();

  constructor(private modalService: NgbModal,
    private coursesService: CoursesService,
    private lookupsService: LookUpsService) { }

  ngOnInit() {
    this.getSemesterPeriod();
    this.getTeachersLevels();
  }

  /*
    display courses categories tabs in HTML
  */
  displayCoursesCateTabs() {
    if (this.coursesCate !== undefined) {
      this.waitingDataFlag = false
      if (this.arrangeCourseDetails) {
        this.coursesCate = this.coursesCate.filter(data => data.CourseCategoryId == this.arrangeCourseDetails.CourseCategoryId)
        return this.coursesCate
      }
      //but don't return the last one, beacuse last one is OtherThings not usefull.
      return this.coursesCate.slice(0, -1);
    }
  }

  /*
    display instruments icons in each tab.
  */
  displayInstrumentsIcon(index) {
    let iconLocalSrc: string = '../../../../../../assets/images/shared/';
    return iconLocalSrc + this.iconName[index];

  }

  /*
    display orgnazations tabs in HTML
  */
  displayOrgTabs() {
    if (this.styleFlowControl.Orgs.display == true) {
      return this.orgs;
    }
  }

  /*
    display teachers tabs passing all filters
  */
  displayTeachers() {
    let array: Array<any> = [];
    //先从teacher api里寻找在指定org教课的老师
    for (let i of this.teachers) {
      for (let j of i.AvailableDays) {
        if (j.OrgId == this.filters['OrgsId']) {
          array.push(i)
        }
      }
    }
    //再从teachingcourse里寻找教指定乐器的老师
    let array1: Array<any> = [];
    if (this.arrangeCourseDetails) {
      for (let i of this.teachingCourses) {
        for (let j of array) {
          if (j.TeacherId == i.TeacherId && i.CourseId == this.arrangeCourseDetails.CourseId) {
            array1.push(j)
          }
        }
      }
    }
    else{
      for (let i of this.teachingCourses) {
        for (let j of array) {
          if (j.TeacherId == i.TeacherId && i.Course.CourseCategory.CourseCategoryId == this.filters["CategoriesId"]) {
            array1.push(j)
          }
        }
      }
     }
    let hash = {};
    let result = array1.reduce(function(item, next) {
      hash[next.TeacherId] ? '' : hash[next.TeacherId] = true && item.push(next);
      return item;
    }, [])

    // if (this.arrangeCourseDetails) {
    //   result = result.filter(data => data.Level == this.arrangeCourseDetails.Level)
    // }

    if (result.length == 0) {
      this.teacherExistsFlag = false
    }

    return result;
  }

  /*
    get semester period for each semester
      -->send request to server, data is used for modal component
  */
  getSemesterPeriod() {
    this.coursesService.getoioi().subscribe(
      (res) => {
        this.termPeriod = res.Data;
        //console.log(this.termPeriod)
      },
      (err) => {
        //alert('Sorry, something went wrong in server.')
        Swal.fire({  type: 'error',  title: 'Oops...', text: 'Sorry, something went wrong'+err.error.ErrorMessage });
      }
    )
  };

  getTeachersLevels() {
    this.lookupsService.getLookUps(1).subscribe(
      (res) => {
        this.teachersLevel = res.Data;
      }
    )
  }

  /*
    (onclick event handler) select the tab that user clicked
      --> when user click a tab, select this tab and show some animations
  */
  selectTab(event, className, nextClass, index, filterId, filterName) {
    // console.log(event, className, nextClass, index, filterId, filterName)
    //only no tab select, mouse click event work.
    if (this.styleFlowControl[className].clicked == false) {
      //set true flag means that this tab has already selected. if continue cliking on this tab, no click event occur, nothing happend.
      this.styleFlowControl[className].clicked = true;
      let obj: any = document.getElementsByClassName(className);
      for (let i of obj) {
        //tabs are not the one user selected, styles declare here.
        if (Number(i.id) !== index) {
          i.firstChild.classList.add("t_s_tabs_disable");
          i.firstChild.classList.remove("t_s_tabs");
          i.style.opacity = '0.3';
          i.style.transition = 'opacity 0.5s linear';
        }
        //tab that selected, styles decalre here.
        else {
          //get the filter options(id) and save it.
          this.filters[className + 'Id'] = filterId;
          this.filters[className + 'Name'] = filterName;
          let targetObj = event.currentTarget;
          setTimeout(() => {
            //★★★★★ event.currentTarget: 获取的是目标元素的父节点(如果目标元素是父节点则获取它自己) ★★★★★//
            targetObj.firstChild.style.display = 'block';
            if (nextClass !== null) {
              this.styleFlowControl[nextClass].display = true;
            }
            // if(className =='Teachers'){
            //   this.popUpModal(i,event);
            // }
          }, 500)
        }
      }
    }
    //if one tab has already selected, mouse clicking not work
    else {
      return;
    }
  }

  /*
    (onclick event handler) unselect tab when user clicked
     --> when user click close btn, hide close btn and set the style to initial state
  */
  unSelectTab(event, className) {
    event.currentTarget.style.display = 'none';

    let obj: any = document.getElementsByClassName(className);
    for (let i of obj) {
      //when unselect tab, the styles declare here
      i.firstChild.classList.add("t_s_tabs");
      i.firstChild.classList.remove("t_s_tabs_disable");
      i.style.opacity = '1';
    }

    //set the documents to initial state
    let currentClassId = this.styleFlowControl[className].id;
    for (let i in this.styleFlowControl) {
      if (this.styleFlowControl[i].id >= currentClassId) {
        if (this.styleFlowControl[i].id > currentClassId) {
          this.styleFlowControl[i].display = false;
        }
        this.styleFlowControl[i].clicked = false;
      }
    }
    //★★★★★ stop event propagation ★★★★★//
    event.stopPropagation();
  }

  /*
    pop up FullCalendar modal
  */
  popUpModalReady(whichTeacher, coursesTeachingByWhichTeacher) {
    const modalRef = this.modalService.open(TrialModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.termPeriod = this.termPeriod;
    modalRef.componentInstance.cateName = this.filters['CategoriesName'];
    modalRef.componentInstance.orgName = this.filters['OrgsName'];
    modalRef.componentInstance.whichTeacher = whichTeacher;
    modalRef.componentInstance.cateId = this.filters["CategoriesId"];
    modalRef.componentInstance.orgId = this.filters["OrgsId"];
    modalRef.componentInstance.courses = this.courses;
    modalRef.componentInstance.LearnerId = this.LearnerId;
    modalRef.componentInstance.availableDOW = this.getAvailabelDOW(whichTeacher);
    modalRef.componentInstance.learners = this.learners;
    modalRef.componentInstance.coursesTeachingByWhichTeacher = coursesTeachingByWhichTeacher;
    if (this.arrangeCourseDetails) {
      modalRef.componentInstance.arrangeCourseInstance = this.arrangeCourseInstance
      modalRef.componentInstance.duration = this.arrangeCourseDetails.Duration
    }
  }

  popUpModal(whichTeacher) {
    let teacherId = whichTeacher.TeacherId;
    this.coursesService.getLessonsByTeacherId(teacherId).subscribe(
      (res) => {
        this.popUpModalReady(whichTeacher, res.Data);
      }
    )
  }

  /*
    get teacher availabe day in a week
  */
  getAvailabelDOW(whichTeacher) {
    let array: Array<any> = [];
    for (let i of whichTeacher.AvailableDays) {
      if (i.OrgId == this.filters["OrgsId"]) {
        array.push(i.DayOfWeek)
      }
    }
    return array;
  }

  /*
    get teacher level name
  */
  getLevel(level) {
    for (let i of this.teachersLevel) {
      if (level == i.PropValue) {
        return i.PropName;
      }
    }
  }

}
