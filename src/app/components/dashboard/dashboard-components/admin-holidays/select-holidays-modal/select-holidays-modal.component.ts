import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HolidaysService } from 'src/app/services/http/holidays.service';
import * as moment from 'moment/moment.js'
import { CompilePipeMetadata } from '@angular/compiler';
@Component({
  selector: 'app-select-holidays-modal',
  templateUrl: './select-holidays-modal.component.html',
  styleUrls: ['./select-holidays-modal.component.css']
})
export class SelectHolidaysModalComponent implements OnInit {
  newInfo = {
    HolidayDate: null,
    HolidayName: null,
  }
  errorMessage: string
  myForm: FormGroup
  success = false
  successMessage: string
  submit = false
  public submitionFlag: boolean = true;
  public loadingGifFlag: boolean = false;
  selectDate = []
  @Input() date
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private HolidaysService: HolidaysService) { }

  ngOnInit() {
    console.log(this.date)
    this.creatForm()
    // this.getSelectDate()
  }

  creatForm() {
    this.myForm = this.fb.group({
      HolidayName: ['', [Validators.required]]
    })
  }

  getSelectDate() {
    const beginDate1= (this.date.start).setDate(this.date.start.getDate() + 1)
    let beginDate = this.date.start
    const endDate = this.date.end
    console.log()
    //  while (moment(beginDate).isBefore(endDate))
    for (beginDate1; moment(beginDate).isBefore(endDate) || moment(beginDate).isSame(endDate); beginDate.setDate(beginDate.getDate() + 1)) {

      // this.selectDate.push(beginDate)
      this.newInfo.HolidayDate = beginDate
      this.newInfo.HolidayName = this.myForm.value.HolidayName
      console.log(this.newInfo)
      if (this.myForm.invalid) {
        this.errorMessage = 'Please fill all inputs.'
        this.success = false;
        return
      }
      else {
        this.HolidaysService.addHoliday(this.newInfo).subscribe(
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log(err)
          }
        )
        this.success = true;
        this.successMessage = "Holiday Saved"
      }
    }
    // console.log(this.selectDate)
    return
  }

  OnSubmit() {
    // this.submit=true
    // this.newInfo.HolidayDate=this.date.dateStr
    // this.newInfo.HolidayName=this.myForm.value.HolidayName
    // console.log(this.newInfo)


    // if (this.myForm.invalid) {
    //   this.errorMessage = 'Please fill all inputs.'
    //   this.success = false;
    //   return
    // }
    // else {
    //   this.HolidaysService.addHoliday(this.newInfo).subscribe(
    //     (res)=>{
    //       console.log(res)

    //     },
    //     (err)=>{
    //       console.log(err)
    //     }
    //   )

    //   this.success = true;
    //   this.successMessage="Holiday Saved"
    // }
  }
  OnClose() {
    if (this.myForm.dirty == true) {
      this.refreshFlag.emit(true);

    }
    else {
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }
}
