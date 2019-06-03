import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trial-search',
  templateUrl: './trial-search.component.html',
  styleUrls: ['./trial-search.component.css',
    '../../teachers/teacher-panel/teacher-panel.component.css']
})
export class TrialSearchComponent implements OnInit {
  public iconName: Array<string> = ['piano.svg', 'drum.png', 'guitar.png', 'violin.png', 'cello.png', 'voice.png', 'theory.png', 'aural.svg'];
  public tabsCloseFlag: boolean = false;
  public styleFlowControl = {
    "Categories": { "clicked": false, "display": true },
    "Orgs": { "clicked": false, "display": false },
    "Teachers": { "clicked": false, "display": false }
  }
  public selectedCateId: number;
  public previousCloseBtn:any = null;

  @Input() courses;
  @Input() coursesCate;
  @Input() orgs;

  constructor() { }

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

  displayOrgTabs() {
    if (this.styleFlowControl.Orgs.display == true) {
      return this.orgs;
    }
  }

  /*
    (onclick event handler) select the tab that user clicked
     --> when user click a tab, select this tab and show some animations
  */
  selectTab(event, className, nextClass, index, selectedCate) {
    console.log('nnnn')
    //only no tab select, mouse clicking works
    if (this.styleFlowControl[className].clicked == false) {
      this.styleFlowControl[className].clicked = true;
      let obj: any = document.getElementsByClassName(className);
      for (let i of obj) {
        //tabs that not be selected 
        if (Number(i.id) !== index) {
          i.firstChild.classList.add("t_s_tabs_disable");
          i.firstChild.classList.remove("t_s_tabs");
          i.style.opacity = '0.3';
          i.style.transition = 'opacity 0.5s linear';
        }
        //tab that selected
        else {
          this.selectedCateId = selectedCate.CourseCategoryId;
          let targetObj = event.currentTarget;
          setTimeout(() => {
            //★★★★★ event.currentTarget: 获取的是目标元素的父节点(如果目标元素是父节点则获取它自己) ★★★★★//
            targetObj.firstChild.style.display = 'block';
            this.styleFlowControl[nextClass].display = true;
          }, 500)
        }
      }

      if(this.previousCloseBtn !== null){
        console.log(this.previousCloseBtn)
        this.previousCloseBtn.style.display = 'none';
      }

      this.previousCloseBtn =  event.currentTarget.firstChild;
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
  unSelectTab(event,className, nextClass) {
    event.currentTarget.style.display = 'none';
   
    let obj: any = document.getElementsByClassName(className);
    for (let i of obj) {
      i.firstChild.classList.add("t_s_tabs");
      i.firstChild.classList.remove("t_s_tabs_disable");
      i.style.opacity = '1';
    }
    this.styleFlowControl[className].clicked = false;
    this.styleFlowControl[nextClass].display = false;

    //★★★★★ stop event propagation ★★★★★//
    if(this.previousCloseBtn !== null){
      console.log('000',this.previousCloseBtn)
      this.previousCloseBtn.style.display = 'block';
    }
    event.stopPropagation();
  }

}
