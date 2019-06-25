import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-learner-detail-modal',
  templateUrl: './learner-detail-modal.component.html',
  styleUrls: ['./learner-detail-modal.component.css']
})
export class LearnerDetailModalComponent implements OnInit {
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
  othersmsg = '';
  agreeFormMsg = '';
  howKnow: any
  reasonList: any
  public photoUrl: any = environment.photoUrl;
  otherFileUrl = ''
  agreeFileUrl = ''
  learnerList1: any
  //amendment列表
  amendmentList = []
  tempraryList = []
  permanentList = []
  constructor(public activeModal: NgbActiveModal, private LearnerListService: LearnersService, ) {

  }

  ngOnInit() {

    this.lookUpData1()
    this.lookUpData2()
    this.lookUpData4()
    this.getOthersUrl()
    this.getFormUrl()
    console.log(this.whichLearner)
    this.getData()
    // this.getAmendentLength()
    this.getAmendmentList()
  }

  getData() {
    this.LearnerListService.getLearnerList().subscribe(
      (res) => {
        // console.log(res)
        //@ts-ignore
        this.learnerList1 = res.Data;
      },
      (err) => {
        console.log('error')
      }
    )
  }
  chooseGroupCourse() {
    this.isGroupCourse = true;
    this.isCustomCourse = false;
  }
  chooseCustomCourse() {
    this.isCustomCourse = true;
    this.isGroupCourse = false;
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
      if (this.whichLearner.LearnerLevel == element['PropValue']) {
        this.learnerLevelList.push(element['PropName'])
      }
    });
    console.log(this.learnerLevelList)
  }

  getPurposeValue(displayDatas) {
    this.whichLearner.LearnerOthers.forEach(learnerOther => {
      // console.log(learnerOther)
      if (learnerOther.OthersType == "2") {
        displayDatas.forEach(displayData => {
          // console.log(displayData)
          if (learnerOther.OthersValue == displayData['PropValue']) {
            // console.log(displayData)
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
    // console.log(this.otherValueList)
  }

  getHowKnowValue(displayData) {
    // console.log(displayData)
    this.whichLearner.LearnerOthers.forEach(learnerOther => {
      if (learnerOther.OthersType == "3") {
        displayData.forEach(displayData => {
          // console.log(displayData)
          if (learnerOther.OthersValue == displayData['PropValue']) {
            // console.log(displayData)
            this.howKnowList.push(displayData['PropName'])
          }
        })
      }
      // console.log(this.howKnowList)
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

  // other files
  getOthersUrl() {
    // console.log(this.whichLearner.OtherfileUrl)
    if (this.whichLearner.OtherfileUrl !== null) {
      this.othersmsg = 'Download Other Files'
      return this.otherFileUrl = this.photoUrl + this.whichLearner.OtherfileUrl;
    }
  }

  clickOtherFileUrl() {
    return window.open(this.otherFileUrl)
  }

  // agreeement Form
  getFormUrl() {
    if (this.whichLearner.FormUrl !== null) {
      this.agreeFormMsg = 'Download Enrollment Agreement Form'
      return this.agreeFileUrl = this.photoUrl + this.whichLearner.FormUrl;
    }
  }

  clickFormUrl() {
    return window.open(this.agreeFileUrl)
  }

  // getAmendentLength(){
  //   for(let ele of this.whichLearner.One2oneCourseInstance){
  //       this.amendment=ele.Amendment.length
  //       console.log(this.amendment)
  //   }
  // }

  getAmendmentList() {

    for (let i of this.whichLearner.One2oneCourseInstance) {
      console.log(i)
      if (i.Amendment) {
        i.Amendment.sort((a, b) => a.CreatedAt.replace(/-/gi,'').slice(0,8)- b.CreatedAt.replace(/-/gi,'').slice(0,8))
        console.log(i.Amendment.sort((a, b) => a.CreatedAt.replace(/-/gi,'').slice(0,8)- b.CreatedAt.replace(/-/gi,'').slice(0,8)))
        i.Amendment.forEach(element => {
          if (element.IsTemporary == 0) {
            i.permanent = element;
            return;
          }else if(element.IsTemporary == 1){
            i.temporary=element;
            return
          }
        });
      }
    }
    console.log(this.whichLearner.One2oneCourseInstance)
  }

}





