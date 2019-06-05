import { TrialModalComponent } from './../trial-modal/trial-modal.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  public filters: object = { "CategoriesId": null, "OrgsId": null}
  public previousCloseBtn: any = null;

  @Input() courses;
  @Input() coursesCate;
  @Input() orgs;
  @Input() teachers;
  @Input() groupCoursesInstance;
  @Output() childEvent = new EventEmitter();

  constructor(  private modalService: NgbModal,
    ) { }

  ngOnInit() {

  }

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
    display teachers that fit all the filters requirement
  */
  displayTeachers() {
    return this.teachers
    // let array: Array<any> = [];
    // for (let i of this.groupCoursesInstance) {
    //   if (i.Org.OrgId == this.filters['OrgsId'] && i.Course.CourseCategory.CourseCategoryId == this.filters['CategoriesId']) {
    //     array.push(i)
    //   }
    // }
    // return [{ 'a': 1 }, { "a": 1 }, { "a": 1 }]
  }

  /*
    (onclick event handler) select the tab that user clicked
     --> when user click a tab, select this tab and show some animations
  */
  selectTab(event, className, nextClass, index, filterId) {
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
          let targetObj = event.currentTarget;
          setTimeout(() => {
            //★★★★★ event.currentTarget: 获取的是目标元素的父节点(如果目标元素是父节点则获取它自己) ★★★★★//
            targetObj.firstChild.style.display = 'block';
            if(nextClass !== null){
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

  popUpModal(){
    //this.childEvent.emit(teacherSelected);
    const modalRef = this.modalService.open(TrialModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
  }

}
