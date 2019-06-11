import { TrialModalComponent } from './../trial-modal/trial-modal.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from 'src/app/services/http/courses.service';

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
  public filters: object = { "CategoriesId": null, "OrgsId": null,"OrgsName":null, "CategoriesName":null }
  public previousCloseBtn: any = null;
  public coursesTeachingByCate;
  public termPeriod;

  @Input() courses;
  @Input() coursesCate;
  @Input() orgs;
  @Input() teachers;
  @Input() groupCoursesInstance;
  @Input() teachingCourses;
  @Output() childEvent = new EventEmitter();

  constructor(private modalService: NgbModal,
              private coursesService: CoursesService) { }

  ngOnInit() {
    this.getSemesterPeriod();
  }

  getSemesterPeriod(){
    this.coursesService.getoioi().subscribe(
      (res) => {
        this.termPeriod = res.Data;
        console.log(this.termPeriod)
      },
      (err) => {
        alert('Sorry, something went wrong in server.')
      }
    )
  };

  /*
    display courses categories tabs in HTML
  */
  displayCoursesCateTabs() {
    if (this.coursesCate !== undefined) {
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
    //先从teacher api里寻找在指定org教课的老师的课
    for (let i of this.teachers) {
      for (let j of i.AvailableDays) {
        if (j.OrgId == this.filters['OrgsId']) {
          array.push(i)
        }
      }
    }
 
    //再从teachingcourse里寻找教指定乐器的老师的课
    let array1: Array<any> = [];
    for (let i of this.teachingCourses){
      for(let j of array){
        if(j.TeacherId == i.TeacherId  && i.Course.CourseCategory.CourseCategoryId == this.filters["CategoriesId"]){
          array1.push(j)
        }
      }
    }

    this.coursesTeachingByCate = array1;

    let hash = {};
    let result = array1.reduce(function (item, next) {
      hash[next.TeacherId] ? '' : hash[next.TeacherId] = true && item.push(next);
      return item;
    }, [])

    //需要保存一次array
    return result;

  }

  /*
    (onclick event handler) select the tab that user clicked
      --> when user click a tab, select this tab and show some animations
  */
  selectTab(event, className, nextClass, index, filterId, filterName) {
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
  popUpModal(whichTeacher) {
    let coursesTeachingByWhichTeacher = this.getCoursesTeachingByWhichTeacher(whichTeacher);
    //console.log(coursesTeachingByWhichTeacher)
    const modalRef = this.modalService.open(TrialModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.termPeriod = this.termPeriod;
    modalRef.componentInstance.cateName = this.filters['CategoriesName'];
    modalRef.componentInstance.orgName = this.filters['OrgsName'];
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  getCoursesTeachingByWhichTeacher(whichTeacher){
    //console.log(whichTeacher.TeacherId)
    this.coursesService.getLessonsByTeacherId(1).subscribe(
      (res) => {
        console.log(res.Data)
      },
      (err) => {

      }
    )
    //测试用 1

  }

}
