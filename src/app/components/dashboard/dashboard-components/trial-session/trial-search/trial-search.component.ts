import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trial-search',
  templateUrl: './trial-search.component.html',
  styleUrls: ['./trial-search.component.css',
              '../../teachers/teacher-panel/teacher-panel.component.css']
})
export class TrialSearchComponent implements OnInit {
  public iconName:Array<string> = ['piano.svg','drum.png','guitar.png','violin.png','cello.png','voice.png','theory.png','aural.svg'];
  public tabsCloseFlag:boolean = false;

  @Input() courses;
  @Input() coursesCate;

  constructor() { }

  ngOnInit() {
  }


  displayCourses(){
    if(this.coursesCate !== undefined){
      return this.coursesCate.slice(0,-1);
    }
  }

  displayInstrumentsIcon(index){
    let iconLocalSrc:string = '../../../../../../assets/images/shared/';
    return iconLocalSrc + this.iconName[index];

  }

  selectTab(event,className,index){
    let obj:any = document.getElementsByClassName(className);
    for (let i of obj){
      if(Number(i.id) !== index){
        i.style.opacity = '0';
        i.style.transition = 'opacity 0.7s linear';
        setTimeout(()=>{
          i.style.display = 'none';
          this.tabsCloseFlag = true;
        },1000)
      }
    }
  }

}
