import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbPaginationNumber, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TeachersService } from '../../../../../services/http/teachers.service'

@Component({
  selector: 'app-tutor-edit-modal',
  templateUrl: './tutor-edit-modal.component.html',
  styleUrls: ['./tutor-edit-modal.component.css']
})
export class TutorEditModalComponent implements OnInit {

  private valueToBeSubmitted;
  private originalValue;
  private isSubmitFail:boolean = false;
  private errorMessage = '';
  

  @Input() command;
  @Input() witchTeacher;
  @Output() refresh = new EventEmitter;

  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;
  constructor(private activeModal: NgbActiveModal,private teachersService:TeachersService) { }

  ngOnInit() {
  }

  submit() {
    this.showLoadingGif();
    this.getDataReady();
    this.isAllInputsFilled();
  }

  /*
    prepare the data to submit
  */
  showLoadingGif(){
    let loadingGifObj = document.getElementById('loading');
    loadingGifObj.style.display = 'inline-block';
  }
  getDataReady(){
    this.originalValue = this.modalUpdateFormComponentObj.updateForm.value;
    this.valueToBeSubmitted = this.modalUpdateFormComponentObj.updateForm.value;  

    this.valueToBeSubmitted.Language = this.checkLanguages();
    this.valueToBeSubmitted.Qualificatiion = this.checkQualifications()
    this.valueToBeSubmitted.Gender = this.checkGender();
    this.valueToBeSubmitted.IDType = this.checkIdType();
    this.valueToBeSubmitted.DayOfWeek = this.checkOrgs();
    //this.valueToBeSubmitted.Dob = this.checkDate(this.valueToBeSubmitted.Dob);
    //this.valueToBeSubmitted.ExpiryDate = this.checkDate(this.valueToBeSubmitted.ExpiryDate)

    //console.log(this.modalUpdateFormComponentObj.branchesCheckBox._results)
    console.log('submitted',this.valueToBeSubmitted);
    console.log(typeof(this.valueToBeSubmitted.Dob));
    console.log(this.modalUpdateFormComponentObj)
  }

  //to check which language checked
  checkLanguages() {
    let languageBoxObj = this.modalUpdateFormComponentObj.languagesCheckBox._results;
    let checkedLanguagesList = [];
    for (let i in languageBoxObj) {
      //whitchever languages is checked, add it to checkedLanguagesList
      if (languageBoxObj[i].nativeElement.checked == true) {
        checkedLanguagesList.push(Number(languageBoxObj[i].nativeElement.value));
      }
    }
    //if checkedLanguagesList is empty,that is no language was checked, return null
    if(checkedLanguagesList.length !== 0){
      return checkedLanguagesList;
    }
    else{
      return null;
    }
    //console.log(this.checkedLanguagesList)
  }

  //server need Qualification type is list<string>
  //to convert the data 
  checkQualifications() {
    let checkQualificationsList = [];
    if(this.originalValue.Qualificatiion !== undefined){
      checkQualificationsList.push(Number(this.originalValue.Qualificatiion));  
    }
  
    if(checkQualificationsList.length!==0){
      return checkQualificationsList;
      
    }
    else{
      return null;
    }
  }

  checkOrgs() {
    //console.log(this.modalUpdateFormComponentObj)
    let temBranches = this.modalUpdateFormComponentObj.branchesCheckBox._results;
    let temBranchesList =[[],[],[],[],[],[],[]] ;

    for(let i of temBranches){
      if(i.nativeElement.checked == true){
        if(i.nativeElement.name =='Monday' ){
          temBranchesList[0].push(Number(i.nativeElement.defaultValue))
        }
        if(i.nativeElement.name =='Tuesday' ){
          temBranchesList[1].push(Number(i.nativeElement.defaultValue))
        }
        if(i.nativeElement.name =='Wednsday' ){
          temBranchesList[2].push(Number(i.nativeElement.defaultValue))
        }
        if(i.nativeElement.name =='Thursday' ){
          temBranchesList[3].push(Number(i.nativeElement.defaultValue))
        }
        if(i.nativeElement.name =='Friday' ){
          temBranchesList[4].push(Number(i.nativeElement.defaultValue))
        }
        if(i.nativeElement.name =='Satday' ){
          temBranchesList[5].push(Number(i.nativeElement.defaultValue))
        }
        if(i.nativeElement.name =='Sunday' ){
          temBranchesList[6].push(Number(i.nativeElement.defaultValue))
        }
      }
    }
    //console.log(temBranchesList)
    return temBranchesList;
  }

  checkIdType(){
    if(this.originalValue.IDType !== null){
      return Number(this.originalValue.IDType)
    }
    else{
      return null
    }
  }
  
  checkGender(){
    if(this.originalValue.Gender !== null){
      return Number(this.originalValue.Gender)
    }
    else{
      return null;
    }
  }

  checkDate(date){
    let newDate = new Date();
    newDate.setTime(Date.parse(date));
    //console.log(Date.parse(date))
    //console.log(newDate);
    return newDate;
  }

  /*
    check all inputs filled?
    yes-->submit to back-end
    no-->show error message
  */
  isAllInputsFilled(){
    for(let i in this.valueToBeSubmitted){
      if(this.valueToBeSubmitted[i] == null){
        this.errorMessage = 'Please fill all required inputs.';
        //once user click save btn, touch all inputs form with for-loop, in orde to trigger Validator
        for(let j in this.modalUpdateFormComponentObj.updateForm.controls)
        {
          this.modalUpdateFormComponentObj.updateForm.controls[j].touched = true;
        }
        return;
      }
    }

    this.readyToSubmit();
  }

  readyToSubmit(){
    this.errorMessage = '';
    let submit = this.stringifySubmitStr();
    this.modeToSubmit(submit);
  }

  stringifySubmitStr(){
    let submit = new FormData();
    submit.append('details',JSON.stringify(this.valueToBeSubmitted));
    submit.append('IdPhoto',this.modalUpdateFormComponentObj.photoToSubmit);
    submit.append('Photo','123456');
    return submit;
  }

  modeToSubmit(submitData){
     //while push a stream of new data
     if(this.command == 'Add'){
      //this.valueToBeSubmitted = JSON.stringify(this.valueToBeSubmitted);
      this.teachersService.addNew(submitData).subscribe(
        (data)=>{
          console.log('success',data);
          this.activeModal.close('Close click');
        },
        (error)=>{
          this.errorMessage = error.error.ErrorMessage;
          console.log('Error', error);
        }
      );
    }
    //while update data
    else if(this.command == 'Edit'){

    }
  }
}
