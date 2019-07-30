import { Component, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { StaffListService } from 'src/app/services/http/staff-list.service';


@Component({
  selector: 'app-staff-modal-form',
  templateUrl: './staff-modal-form.component.html',
  styleUrls: ['./staff-modal-form.component.css']
})
export class StaffModalFormComponent implements OnInit {
  public updateForm: FormGroup
  public readOnlyFlag: boolean = false;
  public showLeftImgFlag: boolean = true;
  public showRightImgFlag: boolean = false;
  public maxSize: number = 1024;
  public photoUrl: any = environment.photoUrl;
  public idTypeList = [{ 'idTypeId': 1, 'idTypeName': 'Driver Lisence' },
  { 'idTypeId': 2, 'idTypeName': 'Student ID' },
  { 'idTypeId': 3, 'idTypeName': 'Passport' }];
  public PhotoToSubmit: any;
  public IdPhotoToSubmit: any;
  public typeList: any;
  public orgList: any;
  public staffOrg: any
  public staffType:any;

  @Input() command;
  @Input() whichStaff;
  @ViewChildren('branches') branchesCheckBox;
  constructor(
    private fb: FormBuilder,
    private staffListService: StaffListService
  ) { }

  ngOnInit() {
    console.log(this.whichStaff)
    this.setReadOnly();
    this.getStaffType();
    this.getOrg();
    // this.getStaffCheckedOrg();
    this.updateForm = this.fb.group(this.formGroupAssemble());

  }

  getStaffType() {
    this.staffListService.getStaffType().subscribe(
      (res) => {
        this.typeList = res.Data
        console.log(this.typeList)
      },
      (err) => {
        alert('Server Error!')
      }
    )
  }

  getOrg() {
    this.staffListService.getOrg().subscribe(
      (res) => {
        this.orgList = res.Data
        console.log(this.orgList)
      },
      (err) => {
        alert('Server Error!')
      }
    )
  }

  /*
  get photo src
*/
  getPhotoSrc(photoObj) {
    if (this.command !== 0) {
      let src = this.whichStaff[photoObj];

      if (src == null) {
        return '../../../../../../assets/images/shared/default-employer-profile.png';
      }
      else {
        return this.photoUrl + src;
      }
    }
    return;
  }

  setDefaultBranchSelection(selectOrgId) {
    if (this.command !== 0) {
      // console.log('aaaa',selectOrgId)
      for(let i of this.whichStaff.StaffOrg){
        // console.log('bbbbb',i.OrgId)
       if(i.OrgId == selectOrgId){
         //return的作用 直接跳出function
         //但是 你要的
         return true;
       }
      }
    }
  }

  // setDefaultBranchSelection(selectOrgId) {
  //   console.log(selectOrgId)
  //   if (this.command !== 0) {
  //     let a = this.whichStaff.StaffOrg.forEach(Org => {
  //       console.log(Org.OrgId)
  //       if (selectOrgId == Org.OrgId) {
  //         return true;
  //       }
  //     });
  //     console.log(a)
  //   }
  // }

  /*
  in detail mode, data can only be read
*/
  setReadOnly() {
    if (this.command === 1) {
      this.readOnlyFlag = true;
    }
  }

  /*
      switch photo and IdPhoto
      and change them styles
    */
  switchImg(position) {
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
  */
  preViewImg(event, whichPhoto) {
    //assign photo to photoToSubmit
    this[whichPhoto + 'ToSubmit'] = <File>event.target.files[0];
    //photo size
    let fileSize = (Number(<File>event.target.files[0].size)) / 1024;
    //if size valid, continue; else return
    if (this.checkPhotoSize(fileSize)) {
      //important!
      //set src and read it
      let reader = new FileReader();
      reader.readAsDataURL(this[whichPhoto + 'ToSubmit']);
      reader.onloadend = function (event) {
        let imgObj = document.getElementById(whichPhoto);
        imgObj['src'] = event.target['result'];
      }
    }
    else {
      return;
    }
  }

  /*
      check photo size, photo size can not lager than limit
    */
  checkPhotoSize(size) {
    if (size > this.maxSize) {
      alert("Photo size can not large than 1M");
      return false;
    }
    else {
      return true;
    }
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
  if photo not found, set default photo
*/
  setDefaultPhoto(event) {
    event.target.src = '../../../../../../assets/images/shared/default-employer-profile.png';
    return;
  }



  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        FirstName: [null, Validators.required],
        LastName: [null, Validators.required],
        Visa: [null, Validators.required],
        ExpiryDate: [null, Validators.required],
        Dob: [null, Validators.required],
        Gender: [null, Validators.required],
        IrdNumber: [null, Validators.required],
        IdType: [null, Validators.required],
        IdPhoto: [null],
        IdNumber: [null, Validators.required],
        HomePhone: [null],
        MobilePhone: [null, Validators.required],
        Email: [null, Validators.required],
        Photo: [null],
        RoleId: [null, Validators.required],
        StaffOrg: [null, Validators.required],
      }
    }
    else {
      groupObj = {
        FirstName: [{ value: this.whichStaff.FirstName, disabled: this.readOnlyFlag }, Validators.required],
        LastName: [{ value: this.whichStaff.LastName, disabled: this.readOnlyFlag }, Validators.required],
        Visa: [{ value: this.whichStaff.Visa, disabled: this.readOnlyFlag }, Validators.required],
        ExpiryDate: [{ value: this.getDateFormat(this.whichStaff.ExpiryDate), disabled: this.readOnlyFlag }, Validators.required],
        Dob: [{ value: this.getDateFormat(this.whichStaff.Dob), disabled: this.readOnlyFlag }, Validators.required],
        Gender: [{ value: this.whichStaff.Gender, disabled: this.readOnlyFlag }, Validators.required],
        IrdNumber: [{ value: this.whichStaff.IrdNumber, disabled: this.readOnlyFlag }, Validators.required],
        IdType: [{ value: this.whichStaff.IdType, disabled: this.readOnlyFlag }, Validators.required],
        IdPhoto: [null],
        IdNumber: [{ value: this.whichStaff.IdNumber, disabled: this.readOnlyFlag }, Validators.required],
        HomePhone: [{ value: this.whichStaff.HomePhone, disabled: this.readOnlyFlag }],
        MobilePhone: [{ value: this.whichStaff.MobilePhone, disabled: this.readOnlyFlag }, Validators.required],
        Email: [{ value: this.whichStaff.Email, disabled: this.readOnlyFlag }, Validators.required],
        Photo: [null],
        RoleId: [{ value: this.whichStaff.RoleId, disabled: this.readOnlyFlag }, Validators.required],
        StaffOrg: [{ value: this.whichStaff.StaffOrg, disabled: this.readOnlyFlag }]
      }
    }
    return groupObj;
  }

}
