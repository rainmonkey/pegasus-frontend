import { Component,Input ,forwardRef, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR,NG_VALIDATORS, ControlValueAccessor,Validator,FormControl  } from '@angular/forms';


@Component({
  selector: 'app-reason-Input',
  templateUrl: './reason-Input.component.html',
  styleUrls: ['./reason-Input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ReasonInputComponent),
    multi: true
  },{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ReasonInputComponent),
    multi: true
  } ]
})
export class ReasonInputComponent implements ControlValueAccessor ,Validator  {
  // CancelReason
  // test1
  // @ViewChild('selector') selector
  private textReason: any = '';  //for out put
  private inputReason: any = ''; //for text input
  private selectReason: any = 'S:';//for select option
  constructor() { }

  ngOnInit() {
  }
  writeValue(value: any) {
    if (value !== this.textReason) {
        this.textReason = value;
    }
}
  propagateChange = (_: any) => {};
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any) {
      // this.onTouchedCallback = fn;
  }
  test() {
    // if (this.CancelReason == 'Other') {
    //   let x = document.getElementById("mySelect").remove()
    //   this.test1 = document.createElement('input')
    //   this.test1.type='text'
    //   document.getElementById("reason").append(this.test1)
    //   console.log(x)
    //   console.log(this.test1)
  }
  changeText(e){
    this.inputReason = e;
    // this.getTextReason();
    this.propagateChange(this.getTextReason());
  }
  changeSelect(e){
    this.selectReason = e;
    // this.getTextReason();    
    this.propagateChange(this.getTextReason());    
  }
  getTextReason(){
    this.textReason = this.selectReason+this.inputReason;
    return this.textReason;
  }
  public validate(c: FormControl) {
    console.log((!(this.textReason==''||this.textReason==null)) ? null : {
      jsonParseError: {
          valid: false,
      },
  })
    return (!(this.textReason==''||this.textReason==null)) ? null : {
        jsonParseError: {
            valid: false,
        },
    };
  }
}


