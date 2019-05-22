import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard-home.component.css']
})

export class DashboardHomeComponent implements OnInit, AfterViewInit {
  toDoList: { task: string; origin: string; }[];
  toDoForm: FormGroup;
  userName:string;
  formError:string;

  @ViewChild('popOver') public popover: NgbPopover;

  constructor(
    public title: Title,
    private formBuilder: FormBuilder
  ) {
    this.title.setTitle('Home');
    this.toDoList=[
      {
        task:'为人民服务.',
        origin: 'Mao'
      },
      {
        task:'Pay all the teachers on Thursday',
        origin: 'Auther'
      },
      {
        task:'Take out the rubblish on Tuesday.',
        origin: 'Edwin'
      },
      {
        task:'Finish the project.',
        origin: 'Barric'
      }
    ]
  }

  ngOnInit(): void {
    // Subscribe for all the to dos

    this.userName = localStorage.getItem('userFirstName')

  }

  ngAfterViewInit(): void {

  }

  newTaskFormBuilder(){
    this.toDoForm = this.formBuilder.group({
      task:['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
    })
  }

  toDoSubmit(): void {
    console.log(this.toDoForm)
    if(this.toDoForm.dirty && this.toDoForm.valid){
      this.toDoForm.value['origin'] = this.userName

      this.sendToBackend()

      this.toDoList.push(this.toDoForm.value)
      this.popover.close()
    }
    else{
      this.formError = "Please enter your task."
    }
  }

  openOrClosePopOver(): void {
    if (!this.popover.isOpen()){ this.popover.open(), this.popover.placement ="right"};
  }

  sendToBackend(){

  }
  
}
