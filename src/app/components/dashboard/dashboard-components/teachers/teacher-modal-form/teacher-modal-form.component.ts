import { TeachersService } from '../../../../../services/http/teachers.service';
import { Component, OnInit, Input, ViewChildren, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-teacher-modal-form',
  templateUrl: './teacher-modal-form.component.html',
  styleUrls: ['./teacher-modal-form.component.css',
    '../teacher-panel/teacher-panel.component.css']
})
export class TeacherModalFormComponent implements OnInit {
  public updateForm;
  //qualification dropdown options
  public qualificationOptions: Object;
  //language dropdown options
  public languageOptions: any;
  public languageOptions1: any;
  public languageOptions2: any;
  //orgs dropdown options
  public orgOptions: Object;
  //Level dropdown options
  public teachersLevels: Object;
  //img max size, can modify
  public maxSize: number = 1024;
  //readonly or not
  public readOnlyFlag: boolean = false;
  //loading flag
  public loadingFlag: boolean = false;
  //loading counter
  public loadingCounter: number = 0;
  public showLeftImgFlag: boolean = true;
  public showRightImgFlag: boolean = false;
  public isAvailableDaysNull: boolean = false;
  public PhotoToSubmit: any;
  public IdPhotoToSubmit: any;
  public CVToSubmit: any;
  public FormToSubmit: any;
  public OthersToSubmit: any;
  public week: Array<object> = [{ "dayName": "Monday", 'dayId': 1 }, { "dayName": "Tuesday", 'dayId': 2 },
  { "dayName": "Wednesday", 'dayId': 3 }, { "dayName": "Thursday", 'dayId': 4 },
  { "dayName": "Friday", 'dayId': 5 }, { "dayName": "Saturday", 'dayId': 6 },
  { "dayName": "Sunday", 'dayId': 7 }];
  public idTypeList = [{ 'idTypeId': 1, 'idTypeName': 'Driver Lisence' },
  { 'idTypeId': 2, 'idTypeName': 'Student ID' },
  { 'idTypeId': 3, 'idTypeName': 'Passport' }];
  public photoUrl: any = environment.photoUrl;
  public cvmsg = '';
  public formmsg = '';
  public othersmsg = '';
  public avliableTextLength: number = 1000;
  public rooms;
  public DayOfWeek: Array<any> = [[], [], [], [], [], [], []];
  public availableDays;
  public setDefaultBranchSelectionCounter: number = 0;


  @Input() command;
  @Input() whichTeacher;
  @ViewChildren('lan') languagesCheckBox;
  @ViewChildren('branches') branchesCheckBox;
  @ViewChild('genderToSubmit') genderToSubmit;
  @ViewChild('Rooms') Rooms;

  constructor(private fb: FormBuilder,
    private teachersService: TeachersService) { }

  ngOnInit() {
    this.getAvailableDays();
    this.setDefaultDayOfWeek();
    this.loadingFlag = true;
    this.setReadOnly();
    this.updateForm = this.fb.group(this.formGroupAssemble());
    this.getRooms();
    this.getDropdownOptions();
    this.getTeacherLevel();
    this.getInitTextAreaLength();
  }
  ngAfterViewInit() {
    this.loadingFlag = false;

  }

  /////////////////////////////////////////////methods call by other methods/////////////////////////////////////////////////

  getInitTextAreaLength() {
    if (this.whichTeacher !== null && this.whichTeacher.Comment !== null) {
      this.avliableTextLength = 1000 - this.whichTeacher.Comment.length;
    }
    else {
      return;
    }
  }
  /*
    in detail mode, data can only be read
  */
  setReadOnly() {
    if (this.command == 1) {
      this.readOnlyFlag = true;
    }
  }

  getRooms() {
    this.teachersService.getRooms().subscribe(
      res => {
        this.rooms = res['Data'];
      },
      err => {
        alert('Server error!')
      }
    )
  }

  /*
    筛选与某个org匹配的Id
  */
  getAvailableRooms(orgId) {
    return this.rooms.filter(val => {
      if (val.OrgId == orgId) {
        return val;
      }
    })
  }
  /*
    some dropdown options are come from server
    get them and save in specific paras
  */
  getDropdownOptions() {
    this.teachersService.getDropdownOptions().subscribe(
      (res) => {
        this.qualificationOptions = res.Data.qualifications;
        this.languageOptions = res.Data.Languages;
        this.languageOptions1 = res.Data.Languages.slice(0, 3);
        this.languageOptions2 = res.Data.Languages.slice(3);
        this.orgOptions = res.Data.Orgs.map(val => {
          val.showRoom = false;
          return val;
        });
      },
      (err) => {
        alert('Server error!')
      }
    )
  }

  getTeacherLevel() {
    this.teachersService.getTeacherLevel().subscribe(
      (res) => {
        this.teachersLevels = res.Data;
      },
      (err) => {
        alert('Server error!')
      }
    )
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

  getQualiId() {
    if (this.whichTeacher.TeacherQualificatiion.length !== 0) {
      return this.whichTeacher.TeacherQualificatiion[0].QualiId;
    }
    else {
      return null;
    }
  }

  /////////////////////////////////////////////methods call by HTML Element or Event/////////////////////////////////////////////////

  /*
    display default language selection
  */
  setDefaultLanguageSelection(LanguageId) {
    if (this.command !== 0) {
      for (let i of this.whichTeacher.TeacherLanguage) {
        if (LanguageId == i.LangId) {
          return true;
        }
      }
      return false;
    }
    else {
      return false;
    }
  }

  displayRoom(event, orgId, i) {
    let obj = document.getElementById(i.dayName + orgId);
    if (event.target.checked) {
      obj.style.display = 'block';
      this.DayOfWeek[i.dayId - 1].push({ "OrgId": orgId })
    }
    else {
      obj.style.display = 'none';
      let newArray = [];
      this.DayOfWeek[i.dayId - 1].map(val => {
        if (val.OrgId !== orgId) {
          newArray.push(val);
        }
      })
      this.DayOfWeek[i.dayId - 1] = newArray;
    }

    //console.log(this.DayOfWeek)
  }

  tipRooms(event, dayofweek, orgId) {
    let roomId = event.target.value;
    this.DayOfWeek[dayofweek.dayId - 1].map(val => {
      if (val.OrgId == orgId) {
        val.RoomId = (roomId == -1)? null:Number(roomId);
      }
    })
    //console.log(this.DayOfWeek)
  }
  getRoomName(id){
    for (let element of this.rooms){
      if (element.RoomId==id) return element.RoomName;
    };
    return '';
  }

  /*
   display default branches selection
 */
  setDefaultBranchSelection(OrgId, week) {
    if (this.command == 2) {
      for (let i of this.whichTeacher.AvailableDays) {
        if (week.dayId == i.DayOfWeek) {
          if (OrgId == i.OrgId) {
            return true;
          }
        }
      }
      return false;

    }
    else {
      return false;
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

  // checkOrgs() {
  //   let temBranches = this.modalUpdateFormComponentObj.branchesCheckBox._results;
  //   let temBranchesList = [[], [], [], [], [], [], []];

  //   for (let i of temBranches) {
  //     if (i.nativeElement.checked == true) {
  //       if (i.nativeElement.name == 'Monday') {
  //         temBranchesList[0].push(Number(i.nativeElement.defaultValue))
  //       }
  //       if (i.nativeElement.name == 'Tuesday') {
  //         temBranchesList[1].push(Number(i.nativeElement.defaultValue))
  //       }
  //       if (i.nativeElement.name == 'Wednesday') {
  //         temBranchesList[2].push(Number(i.nativeElement.defaultValue))
  //       }
  //       if (i.nativeElement.name == 'Thursday') {
  //         temBranchesList[3].push(Number(i.nativeElement.defaultValue))
  //       }
  //       if (i.nativeElement.name == 'Friday') {
  //         temBranchesList[4].push(Number(i.nativeElement.defaultValue))
  //       }
  //       if (i.nativeElement.name == 'Saturday') {
  //         temBranchesList[5].push(Number(i.nativeElement.defaultValue))
  //       }
  //       if (i.nativeElement.name == 'Sunday') {
  //         temBranchesList[6].push(Number(i.nativeElement.defaultValue))
  //       }
  //     }
  //   }
  //   return temBranchesList;
  // }


  /*
    in update and add mode
    get days that teacher available of one week
  */
  getAvailableDays() {
    if(!this.whichTeacher){
      return
    }
    if (this.whichTeacher.AvailableDays.length !== 0) {
      this.isAvailableDaysNull = false;
      let availableDays: Array<number> = []
      if (this.command == 1) {
        for (let i of this.whichTeacher.AvailableDays) {
          if (availableDays.indexOf(i.DayOfWeek) == -1) {
            availableDays.push(i.DayOfWeek)
          }
        }
      }
      //返回一个有序数组 （如果availableDays比较多 按照Monday--->Sunday顺序排列）
      this.availableDays = availableDays.sort();
      // return availableDays.sort();
    }
    else {
      this.isAvailableDaysNull = true;
    }
  }

  setDefaultDayOfWeek() {
    //console.log(this.whichTeacher)
    if(!this.whichTeacher){
      return
    }
    this.whichTeacher.AvailableDays.map(val => {
      this.DayOfWeek[val.DayOfWeek - 1].push({ "OrgId": val.OrgId, "RoomId": val.RoomId })
    })
  }

  getDefaultRoom(dayofweek, orgId) {
    let day = Number(dayofweek.dayId - 1);
    let value: number = null;
    this.DayOfWeek[day].map(val => {
      if (Number(val.OrgId) === Number(orgId)) {
        value = Number(val.RoomId)
      }
    })
    let a = value? value:-1 ;
    return a;
  }

  /*
    get branches that teacher available in specfy date
  */
  getAvailableOrgs(whichDay) {
    if (this.command == 1 && this.whichTeacher.AvailableDays.length !== 0) {
      let temOrgs = [];
      for (let i of this.whichTeacher.AvailableDays) {
        if (i.DayOfWeek == whichDay && temOrgs.indexOf(i.OrgId) == -1) {
          console.log(i)
          temOrgs.push({"orgId":i.OrgId,"roomName":this.getRoomName(i.RoomId),"roomId":i.RoomId});
        }
      }

      return temOrgs;
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

  uploadCV(event) {
    this.CVToSubmit = <File>event.target.files[0];
  }

  uploadForm(event) {
    this.FormToSubmit = <File>event.target.files[0];
  }

  uploadOthers(event) {
    this.OthersToSubmit = <File>event.target.files[0];
  }

  getCVUrl() {
    if (this.whichTeacher.CV !== null) {
      this.cvmsg = 'Download CV'
      return this.photoUrl + this.whichTeacher.CV;
    }
  }

  getFormUrl() {
    if (this.whichTeacher.Form !== null) {
      this.formmsg = 'Download Form'
      return this.photoUrl + this.whichTeacher.Form;
    }
  }

  getOthersUrl() {
    // console.log(this.whichTeacher.OtherFile)
    if (this.whichTeacher.OtherFile !== null) {
      this.othersmsg = 'Download Other Files'
      return this.photoUrl + this.whichTeacher.OtherFile;
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
    get photo src
  */
  getPhotoSrc(photoObj) {
    if (this.command !== 0) {
      let src = this.whichTeacher[photoObj];
      if (src == null) {
        return '../../../../../../assets/images/shared/default-employer-profile.png';
      }
      else {
        return this.photoUrl + src;
      }
    }
    return;
  }

  /*
    in add and update mode
    Branch options hide in default, when user click week name, toggle branch options,
  */
  toggleBranchOptions(event, dayName) {
    let dropDownsObj: any = document.getElementsByClassName('dayName');
    //set [flag] attr to element, to switch between show and hide
    event.target.attributes.flag = !event.target.attributes.flag;

    if (event.target.attributes.flag == true) {
      for (let i of dropDownsObj) {
        i.style.display = 'block';
      }
    }
    else {
      for (let i of dropDownsObj) {
        i.style.display = 'none';
      }
    }
  }

  toggleLanguageOptions(event) {
    let dropDownsObj: any = document.getElementById('languageDropdown');
    event.target.attributes.flag = !event.target.attributes.flag;
    if (event.target.attributes.flag == true) {

      dropDownsObj.style.display = 'block';

    }
    else {

      dropDownsObj.style.display = 'none';

    }
  }
  /*
    if photo not found, set default photo
  */
  setDefaultPhoto(event) {
    event.target.src = '../../../../../../assets/images/shared/default-employer-profile.png';
    return;
  }

  calculateTextLength(event) {
    this.avliableTextLength = 1000 - event.target.value.length;
  }
  /////////////////////////////////////////////form group/////////////////////////////////////////////////

  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        CV: [null],
        Form: [null],
        OtherFile: [null],
        Photo: [null],
        IdPhoto: [null],
        FirstName: [null, Validators.required],
        LastName: [null, Validators.required],
        Gender: [null, Validators.required],
        Dob: [null, Validators.required],
        Qualificatiion: [null, Validators.required],
        MobilePhone: [null, Validators.required],
        HomePhone: [null],
        Email: [null, [Validators.required, Validators.email]],
        IRDNumber: [null, Validators.required],
        Language: [null, Validators.required],
        IDType: [null, Validators.required],
        IDNumber: [null, Validators.required],
        ExpiryDate: [null, Validators.required],
        DayOfWeek: [null],
        ability: [null],
        IsLeft: [null, Validators.required],
        IsContract: [null, Validators.required],
        Level: [null, Validators.required],
        Comment: [null],
        Rooms: [null]
      }
    }
    else {
      groupObj = {
        CV: [null],
        Form: [null],
        OtherFile: [null],
        Photo: [null],
        IdPhoto: [null],
        //formControlName 决定了提交表单时的参数名
        FirstName: [{ value: this.whichTeacher.FirstName, disabled: this.readOnlyFlag }, Validators.required],
        LastName: [{ value: this.whichTeacher.LastName, disabled: this.readOnlyFlag }, Validators.required],
        Gender: [{ value: this.whichTeacher.Gender, disabled: this.readOnlyFlag }, Validators.required],
        //★★★★★只有当日期格式为YYYY-MM-DD的时候 才会显示出formControlName的默认值
        Dob: [{ value: this.getDateFormat(this.whichTeacher.Dob), disabled: this.readOnlyFlag }, Validators.required],
        Qualificatiion: [{ value: this.getQualiId(), disabled: this.readOnlyFlag }, Validators.required],
        MobilePhone: [{ value: this.whichTeacher.MobilePhone, disabled: this.readOnlyFlag }, Validators.required],
        HomePhone: [{ value: this.whichTeacher.HomePhone, disabled: this.readOnlyFlag }],
        Email: [{ value: this.whichTeacher.Email, disabled: this.readOnlyFlag }, [Validators.required, Validators.email]],
        IRDNumber: [{ value: this.whichTeacher.IrdNumber, disabled: this.readOnlyFlag }, Validators.required],
        Language: [{ value: this.whichTeacher.TeacherLanguage, disabled: this.readOnlyFlag }, Validators.required],
        IDType: [{ value: this.whichTeacher.IdType, disabled: this.readOnlyFlag }, Validators.required],
        IDNumber: [{ value: this.whichTeacher.IdNumber, disabled: this.readOnlyFlag }, Validators.required],
        ExpiryDate: [{ value: this.getDateFormat(this.whichTeacher.ExpiryDate), disabled: this.readOnlyFlag }, Validators.required], //用dateFormat
        DayOfWeek: [{ value: null, disabled: this.readOnlyFlag }],
        ability: [{ value: this.whichTeacher.Ability, disabled: this.readOnlyFlag }],
        //后台没数据
        IsLeft: [{ value: this.whichTeacher.IsLeft, disabled: this.readOnlyFlag }, Validators.required],
        IsContract: [{ value: this.whichTeacher.IsContract, disabled: this.readOnlyFlag }, Validators.required],
        Level: [{ value: this.whichTeacher.Level, disabled: this.readOnlyFlag }, Validators.required],
        Comment: [{ value: this.whichTeacher.Comment, disabled: this.readOnlyFlag }],
        Rooms: [null]
      }
    }

    return groupObj;
  }

}
