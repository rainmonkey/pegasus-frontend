import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HolidaysService} from 'src/app/services/http/holidays.service';
@Component({
  selector: 'app-add-holidays-modal',
  templateUrl: './add-holidays-modal.component.html',
  styleUrls: ['./add-holidays-modal.component.css']
})
export class AddHolidaysModalComponent implements OnInit {
  newInfo={
    HolidayDate:null,
    HolidayName: null,
  }
  errorMessage:string
  myForm:FormGroup
  success=false
  successMessage:string
  submit=false
  public submitionFlag: boolean = true;
  public loadingGifFlag: boolean = false;
@Input() date
@Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private HolidaysService: HolidaysService) { }

  ngOnInit() {
    console.log(this.date)
    this.creatForm()
  }

  creatForm(){
    this.myForm = this.fb.group({
     HolidayName:['',[Validators.required]]
    })
  }

  OnSubmit(){
    this.submit=true
    this.newInfo.HolidayDate=this.date.dateStr
    this.newInfo.HolidayName=this.myForm.value.HolidayName
    console.log(this.newInfo)


    if (this.myForm.invalid) {
      this.errorMessage = 'Please fill all inputs.'
      this.success = false;
      return
    }
    else {
      this.HolidaysService.addHoliday(this.newInfo).subscribe(
        (res)=>{
          console.log(res)

        },
        (err)=>{
          console.log(err)
        }
      )

      this.success = true;
      this.successMessage="Holiday Saved"
    }
  }
  OnClose(){
    if (this.myForm.dirty == true ) {
      this.refreshFlag.emit(true);

    }
    else {
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }
  }

