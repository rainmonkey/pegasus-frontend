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
    this.updateForm = this.fb.group(this.formGroupAssemble());
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
  let rightImgObj = document.getElementById('img_right');

  if (position == 0) {
    this.showLeftImgFlag = true;
    this.showRightImgFlag = false;

    rightImgObj.style.display = 'none';
    leftImgObj.style.display = 'block';
  }
  else {
    this.showRightImgFlag = true;
    this.showLeftImgFlag = false;

    leftImgObj.style.display = 'none';
    rightImgObj.style.display = 'block';
  }
}

 /*
    pre view the img that user upload
    whichPhoto value:
      0 --> userPhoto
      1 --> userIdPhoto
  */
 preViewImg(event, whichPhoto) {
  let photoObj;
  let photoRender;
  if (whichPhoto == 0) {
    photoObj = document.getElementById('userPhoto');
    //assign photo to photoToSubmit
    this.photoToSubmit = <File>event.target.files[0];
    photoRender = this.photoToSubmit;
  }
  else {
    photoObj = document.getElementById('userIdPhoto');
    //assign id photo to idPhotoToSubmit
    this.idPhotoToSubmit = <File>event.target.files[0];
    photoRender = this.idPhotoToSubmit;
  }
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
        Note: ['',[Validators.required]],
        LevelType: ['',[Validators.required]],
        Amendment: ['',[Validators.required]],
        InvoiceWaitingConfirm: ['',[Validators.required]],
        Lesson: ['',[Validators.required]],
        LessonRemain: ['',[Validators.required]],
        Parent: ['',[Validators.required]],
        RemindLog: ['',[Validators.required]],
        SoldTransaction: ['',[Validators.required]],
        TodoList: ['',[Validators.required]],

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
      }
    }
    return groupObj;
  }
}
