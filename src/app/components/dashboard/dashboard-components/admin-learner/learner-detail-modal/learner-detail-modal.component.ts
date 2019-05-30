import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';

@Component({
  selector: 'app-learner-detail-modal',
  templateUrl: './learner-detail-modal.component.html',
  styleUrls: ['./learner-detail-modal.component.css']
})
export class LearnerDetailModalComponent implements OnInit, AfterViewInit {
  @Input() command;
  @Input() whichLearner;
  // PropNameArray:Array<any>
  public isGroupCourse: boolean = true;
  public isCustomCourse: boolean = false;
  public learnerPurpose: Array<any>;
  public howKnown: Array<any>;
  public Purpose: Array<any>;
  public purposeString: any;
  PropNameArray: any;
  otherValueList = [];
  howKnowList = [];
  learnerLevelList = []

  howKnow: any
  reasonList: any
  constructor(public activeModal: NgbActiveModal, private LearnerListService: LearnersService, ) {

  }

  ngOnInit() {
    
    this.lookUpData1()
    this.lookUpData2()
    this.lookUpData4()
    console.log(this.whichLearner)
  }
  chooseGroupCourse() {
    this.isGroupCourse = true;
    this.isCustomCourse = false;
  }
  chooseCustomCourse() {
    this.isCustomCourse = true;
    this.isGroupCourse = false;
  }
  ngAfterViewInit() {
  }

  ////!!!!!!!!!!!!原本
  // lookUpData1(){
  //   this.LearnerListService.getLookups(2).subscribe(
  //     (res)=>{console.log(res), this.lookUpData2(res['Data'])},
  //     (err)=>{console.warn(err)}
  //   )
  // }
  // lookUpData2(data1){
  //   this.LearnerListService.getLookups(3).subscribe(
  //     (res)=>{console.log(res), 

  //       this.getPurposeValue(data1.concat(res['Data'])
  //       )},
  //     (err)=>{console.warn(err)}
  //   )
  // }

  lookUpData1() {
    this.LearnerListService.getLookups(2).subscribe(
      (res) => { console.log(res), this.getPurposeValue(res.Data) },
      (err) => { console.warn(err) }
    )
  }

  lookUpData2() {
    this.LearnerListService.getLookups(3).subscribe(
      (res) => { console.log(res), this.getHowKnowValue(res.Data) },
      (err) => { console.warn(err) }
    )
  }

  lookUpData4() {
    this.LearnerListService.getLookups(4).subscribe(
      (res) => { console.log(res), this.getLearnerValue(res.Data) },
      (err) => { console.warn(err) }
    )
  }


  getLearnerValue(displayData1) {
    displayData1.forEach(element => {
      console.log(element)
      if (this.whichLearner.LearnerLevel == element['PropValue']) {
        this.learnerLevelList.push(element['PropName'])
      }
    });
    console.log(this.learnerLevelList)
  }

  getPurposeValue(displayDatas) {
    console.log(displayDatas)
    this.whichLearner.LearnerOthers.forEach(learnerOther => {
      console.log(learnerOther)
      if (learnerOther.OthersType == "2") {
        displayDatas.forEach(displayData => {
          console.log(displayData)
          if (learnerOther.OthersValue == displayData['PropValue']) {
            console.log(displayData)
            this.otherValueList.push(displayData['PropName'])
          }
        })
      }
    })

    // 原本
    // getPurposeValue(displayDatas){
    //   console.log(displayDatas)

    //   this.whichLearner.LearnerOthers.forEach(learnerOther => {
    //     console.log(learnerOther)
    //     if(learnerOther.OthersType == "2" || learnerOther.OthersType== "3"){
    //         displayDatas.forEach(displayData => {
    //           console.log(displayData)
    //           if(learnerOther.OthersValue == displayData['PropValue']){
    //             console.log(displayData)
    //             this.otherValueList.push(displayData['PropName'])
    //           }
    //         })
    //     }
    //   })
    console.log(this.otherValueList)
  }

  getHowKnowValue(displayData) {
    console.log(displayData)
    this.whichLearner.LearnerOthers.forEach(learnerOther => {
      if (learnerOther.OthersType == "3") {
        displayData.forEach(displayData => {
          console.log(displayData)
          if (learnerOther.OthersValue == displayData['PropValue']) {
            console.log(displayData)
            this.howKnowList.push(displayData['PropName'])
          }
        })
      }
      console.log(this.howKnowList)
    })
  }






  /*
   if photo not found, set default photo 
 */
  setDefaultPhoto(event) {
    event.target.src = '../../../../../../assets/images/shared/learner-people.jpg';
    return;
  }

  setDefaultPhoto1(event) {
    event.target.src = '../../../../../../assets/images/shared/certificate-icon.png';
    return
  }
}



