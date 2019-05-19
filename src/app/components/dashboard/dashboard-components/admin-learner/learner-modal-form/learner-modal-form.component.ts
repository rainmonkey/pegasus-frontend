import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LearnersService } from 'src/app/services/http/learners.service';

@Component({
  selector: 'app-learner-modal-form',
  templateUrl: './learner-modal-form.component.html',
  styleUrls: ['./learner-modal-form.component.css']
})
export class LearnerModalFormComponent implements OnInit {
  public updateForm
  public readOnlyFlag: boolean = false
  public showLeftImgFlag: boolean = true;
  public showRightImgFlag: boolean = false;
  public photoToSubmit: any;
  public idPhotoToSubmit: any;

  @Input() command;
  @Input() whichLearner;
  constructor(
     private fb: FormBuilder,
    private LearnerListService: LearnersService,) { }

  ngOnInit() {
    this.setReadOnly();
    this.updateForm = this.fb.group(this.formGroupAssemble());
    

  }

/*
    when only date format is like YYYY-MM-DD, formControlName will show the correct things 
  */
 getDateFormat(date) {
  if (date !== null) {
    return (date.substring(0, 10))
  }
  return null;
}
  
  /*
    in detail mode, data can only be read
  */
 setReadOnly() {
  if (this.command == 1) {
    this.readOnlyFlag = true;
  }
}

  /*
    switch photo and IdPhoto
    and change them styles
  */
 showPhotos(position) {
  let leftImgObj = document.getElementById('img_left');
    this.showLeftImgFlag = true;
    this.showRightImgFlag = false;   
    leftImgObj.style.display = 'block';
  

}

 /*
    pre view the img that user upload
    whichPhoto value:
      0 --> userPhoto
      1 --> userIdPhoto
  */
 preViewImg(event) {
  let photoObj;
  let photoRender;
  photoObj = document.getElementById('userPhoto');
    //assign photo to photoToSubmit
    this.photoToSubmit = <File>event.target.files[0];
    photoRender = this.photoToSubmit;
  
  //important! 
  //set src and read it 
  let reader = new FileReader();
  reader.onloadend = function () {
    photoObj.setAttribute("src", this.result.toString());
  }
  reader.readAsDataURL(photoRender);
}


  //////////form Group////////////
  formGroupAssemble(){
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        FirstName: ['', Validators.required],
        MiddleName: [''],
        LastName: ['', Validators.required],
        EnrollDate: ['',[Validators.required]],
        ContactNum: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        Email: ['', [Validators.required, Validators.email]],
        Address: ['',[Validators.required]],
        IsUnder18: ['',[Validators.required]],
        Dob: ['', [Validators.required]],
        Gender: ['', [Validators.required]],
        IsAbrsmG5: ['',[Validators.required]],
        G5Certification: ['',[Validators.required]],
        CreatedAt: ['',[Validators.required]],
        ReferrerLearnerId: ['',[Validators.required]],
        Note: ['',],
        LevelType: ['',[Validators.required]],
        Amendment: ['',[Validators.required]],
        InvoiceWaitingConfirm: ['',[Validators.required]],
        Lesson: ['',],
        LessonRemain: ['',],
        Parent: ['',[Validators.required]],
        RemindLog: ['',],
        SoldTransaction: ['',[Validators.required]],
        TodoList: ['',],
        OrgId:[''],
      }
    }
    else{
      groupObj={
        FirstName: [{ value: this.whichLearner.FirstName, disabled: this.readOnlyFlag }, Validators.required],
        MiddleName: [{value: this.whichLearner.MiddleName, disabled: this.readOnlyFlag}],
        LastName: [{value: this.whichLearner.LastName, disabled: this.readOnlyFlag}, Validators.required],
        EnrollDate: [{value: this.whichLearner.EnrollDate, disabled: this.readOnlyFlag},[Validators.required]],
        ContactNum: [{value: this.whichLearner.ContactNum, disabled: this.readOnlyFlag}, Validators.required],
        Email: [{value: this.whichLearner.Email,disabled: this.readOnlyFlag}, [Validators.required, Validators.email]],
        Address: [{value: this.whichLearner.Address,disabled: this.readOnlyFlag},[Validators.required]],
        IsUnder18: [{value: this.whichLearner.IsUnder18,disabled: this.readOnlyFlag},[Validators.required]],
        Dob: [{value: this.whichLearner.Dob,disabled: this.readOnlyFlag}, [Validators.required]],
        Gender: [{value: this.whichLearner.Gender,disabled: this.readOnlyFlag}, [Validators.required]],
        IsAbrsmG5: [{value: this.whichLearner.IsAbrsmG5,disabled: this.readOnlyFlag},[Validators.required]],
        G5Certification: [{value: this.whichLearner.G5Certification,disabled: this.readOnlyFlag},[Validators.required]],
        CreatedAt: [{value: this.whichLearner.CreatedAt,disabled: this.readOnlyFlag},[Validators.required]],
        ReferrerLearnerId: [{value: this.whichLearner.ReferrerLearnerId,disabled: this.readOnlyFlag},[Validators.required]],
        Note: [{value: this.whichLearner.Note,disabled: this.readOnlyFlag},[Validators.required]],
        LevelType: [{value: this.whichLearner.LevelType,disabled: this.readOnlyFlag},[Validators.required]],
        Amendment: [{value: this.whichLearner.Amendment,disabled: this.readOnlyFlag},[Validators.required]],
        InvoiceWaitingConfirm: [{value: this.whichLearner.InvoiceWaitingConfirm,disabled: this.readOnlyFlag},[Validators.required]],
        Lesson: [{value: this.whichLearner.Lesson,disabled: this.readOnlyFlag},[Validators.required]],
        LessonRemain: [{value: this.whichLearner.LessonRemain,disabled: this.readOnlyFlag},[Validators.required]],
        Parent: [{value: this.whichLearner.Parent,disabled: this.readOnlyFlag},[Validators.required]],
        RemindLog: [{value: this.whichLearner.RemindLog,disabled: this.readOnlyFlag},[Validators.required]],
        SoldTransaction: [{value: this.whichLearner.SoldTransaction,disabled: this.readOnlyFlag},[Validators.required]],
        TodoList: [{value: this.whichLearner.TodoList,disabled: this.readOnlyFlag},[Validators.required]], 
        OrgId: [{value: this.whichLearner.OrgId,disabled: this.readOnlyFlag},[Validators.required]],
      }
    }
    return groupObj;
  }
}
