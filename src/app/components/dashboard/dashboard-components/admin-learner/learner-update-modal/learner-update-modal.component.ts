import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { LearnersService } from 'src/app/services/http/learners.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-learner-update-modal',
  templateUrl: './learner-update-modal.component.html',
  styleUrls: ['./learner-update-modal.component.css']
})
export class LearnerUpdateModalComponent implements OnInit {
  public errorMessage: string = '';
  public successMessage: string = '';

  @Input() command;
  @Input() whichLearner;
  //in order to get the form from child component(TeacherModalFormDComponent)
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;

  constructor(
    public activeModal: NgbActiveModal,  
    private LearnerListService: LearnersService, 
) { }


  ngOnInit() {
  }

  onSubmit() {
    
    let vailadValue = this.checkInputVailad();
    if (vailadValue !== null) {
      this.stringifySubmitStr(vailadValue)
    }
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

    this.LearnerListService.addNew(submitData).subscribe(
      (res) => {
        this.successMessage = 'Submit success!'
      },
      (err) => {
        if (err.error.ErrorMessage == 'learner has exist.') {
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
    this.LearnerListService.update(submitData, this.whichLearner.learnerId).subscribe(
      (res) => {
        this.successMessage = 'Submit success!'
      },
      (err) => {
        console.log(err)
      }
    )
  }
}

 /*
    back-end limited submition data's type.
    this method is used to convert data to correct type.
  */
 prepareSubmitData(valueToSubmit) {
  valueToSubmit.Gender = this.checkGender(valueToSubmit);
  return valueToSubmit;
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
  

  
}
