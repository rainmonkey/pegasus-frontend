import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent implements OnInit {
myForm:FormGroup;
submitted=false;
errorMessage:string;
success=false;
  constructor(
    public activeModal: NgbActiveModal,
    public fb:  FormBuilder) { }

  ngOnInit() {
    this.createForm()
  }

  createForm(){
    this.myForm = this.fb.group({
      comments: ['',[Validators.minLength(2), Validators.maxLength(500)]],
      rating:['',[Validators.required]]
  })
}

onSubmit(){
  this.submitted = true;
    console.log(this.myForm.value)
    // stop here if form is invalid
    
    
    if (this.myForm.invalid ) {
      console.log(this.myForm)
      this.errorMessage='Please rate.'
      this.success=false; 
      return
        }
    else{
      console.warn('success')
      this.success=true;
   
        }
}

}
