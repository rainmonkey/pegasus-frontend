import { TeachersService } from './../../../../../services/http/teachers.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-update-modal',
  templateUrl: './teacher-update-modal.component.html',
  styleUrls: ['./teacher-update-modal.component.css']
})
export class TeacherUpdateModalComponent implements OnInit {
  public errorMessage: string = '';
  public successMessage: string = '';

  @Input() command;
  @Input() whichTeacher;
  //in order to get the form from child component(TeacherModalFormDComponent)
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;

  constructor(public activeModal: NgbActiveModal, private teachersService: TeachersService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.showLoadingGif();
    let vailadValue = this.checkInputVailad();
    if (vailadValue !== null) {
      this.stringifySubmitStr(vailadValue)
    }
  }

  showLoadingGif() {

  }
  ////////////////////////////////////////handler of submition/////////////////////////////////////////////////////
  /*
    check whether data vailad or not(ruled by Validators).
  */
  checkInputVailad() {
    let valueToSubmit = this.modalUpdateFormComponentObj.updateForm.value;
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.modalUpdateFormComponentObj.updateForm.controls) {
      this.modalUpdateFormComponentObj.updateForm.controls[i].touched = true;
    }
    //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
    if (this.modalUpdateFormComponentObj.updateForm.status == 'VALID') {
      return this.prepareSubmitData(valueToSubmit);
    }
    else {
      this.errorMessage = 'Please check your input.'
      return null;
    }
  }

  /*
    back-end limited submition data's type.
    this method is used to convert data to correct type.
  */
  prepareSubmitData(valueToSubmit) {
    valueToSubmit.Gender = this.checkGender(valueToSubmit);
    valueToSubmit.Language = this.checkLanguages();
    valueToSubmit.DayOfWeek = this.checkOrgs();
    valueToSubmit.Qualificatiion = this.checkQualifications(valueToSubmit);
    return valueToSubmit;
  }

  /*
    after stringify submition string, data is ready to submit
  */
  stringifySubmitStr(vailadValue) {
    console.log(vailadValue)
    this.errorMessage = '';
    let submit = new FormData();
    submit.append('details', JSON.stringify(vailadValue));
    submit.append('Photo', this.modalUpdateFormComponentObj.photoToSubmit);
    submit.append('IdPhoto', this.modalUpdateFormComponentObj.idPhotoToSubmit);
    this.submitByMode(submit)
  }

  /*
   post the data by diffrent api
 */
  submitByMode(submitData) {
    //while push a stream of new data
    if (this.command == 0) {

      this.teachersService.addNew(submitData).subscribe(
        (res) => {
          this.successMessage = 'Submit success!'
        },
        (err) => {
          if (err.error.ErrorMessage == 'Teacher has exist.') {
            this.errorMessage = err.error.ErrorMessage;
          }
          else {
            this.errorMessage = 'Error! Please check your input.'

          }
          console.log('Error', err);
        }
      );
    }
    //while update data
    else if (this.command == 2) {
      this.teachersService.update(submitData, this.whichTeacher.TeacherId).subscribe(
        (res) => {
          this.successMessage = 'Submit success!'
        },
        (err) => {

          console.log(err)

        }



      )
    }
  }

  subscribtion(res, err) {

  }



  checkGender(valueToSubmit) {
    switch (valueToSubmit.Gender) {
      case 'Female':
        return 0;
      case 'Male':
        return 1;
      case 'Other':
        return 2;
    }
  }

  /*
   to check which language checked
 */
  checkLanguages() {
    let languageBoxObj = this.modalUpdateFormComponentObj.languagesCheckBox._results;
    let checkedLanguagesList = [];
    for (let i in languageBoxObj) {
      //whitchever languages is checked, add it to checkedLanguagesList
      if (languageBoxObj[i].nativeElement.checked == true) {
        checkedLanguagesList.push(Number(languageBoxObj[i].nativeElement.value));
      }
    }
    return checkedLanguagesList;
  }


  checkOrgs() {
    //console.log(this.modalUpdateFormComponentObj)
    let temBranches = this.modalUpdateFormComponentObj.branchesCheckBox._results;
    let temBranchesList = [[], [], [], [], [], [], []];

    for (let i of temBranches) {
      console.log(i.nativeElement.name)
      if (i.nativeElement.checked == true) {
        if (i.nativeElement.name == 'Monday') {
          temBranchesList[0].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Tuesday') {
          temBranchesList[1].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Wednsday') {
          temBranchesList[2].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Thursday') {
          temBranchesList[3].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Friday') {
          temBranchesList[4].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Satday') {
          temBranchesList[5].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Sunday') {
          temBranchesList[6].push(Number(i.nativeElement.defaultValue))
        }
      }
    }
    return temBranchesList;
  }

  checkQualifications(valueToSubmit) {
    let checkQualificationsList = [];
    if (valueToSubmit.Qualificatiion !== undefined) {
      checkQualificationsList.push(Number(valueToSubmit.Qualificatiion));
    }


    return checkQualificationsList;

  }
}
