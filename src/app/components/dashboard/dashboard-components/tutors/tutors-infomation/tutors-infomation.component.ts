import { Component, OnInit } from '@angular/core';
import { TeachersService } from 'src/app/services/http/teachers.service';

@Component({
  selector: 'app-tutors-infomation',
  templateUrl: './tutors-infomation.component.html',
  styleUrls: ['./tutors-infomation.component.css']
})
export class TutorsInfomationComponent implements OnInit {
  public DisplayedLabels:Array<string> = ['FirstName','LastName','MobilePhone'];

  constructor(
    private teachersService: TeachersService
  ) { }

  ngOnInit() {
  }

  getTeachersList(){
    this.teachersService.getTeachersInfo
  }

}
