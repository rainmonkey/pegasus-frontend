import { TeachersService } from '../../../../../services/http/teachers.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-delete-modal',
  templateUrl: './teacher-delete-modal.component.html',
  styleUrls: ['./teacher-delete-modal.component.css']
})
export class TeacherDeleteModalComponent implements OnInit {
  //delete flag
  public isDeleteSuccess:boolean = false;
  public isDeleteFail:boolean = false;
  public isDeleteFlag:boolean = false;

  @Input() command;
  @Input() whichTeacher;
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter(); 

  constructor(public activeModal: NgbActiveModal,public teachersService:TeachersService) { }

  ngOnInit() {
  }

  onClose(){
    if(this.isDeleteFlag == true){
      this.refreshFlag.emit(true);
    }
    else{
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }

  /*
    delete data
  */
  delete(){
    let teacherId = this.whichTeacher.TeacherId;
    this.teachersService.deleteTeacher(teacherId).subscribe(
      (res) => {
        this.isDeleteFlag = true;
        this.isDeleteSuccess = true;
        //成功信息
        //this.refreshService.sendRefreshRequest(teacherId);
      },
      (err) => {
        //失败信息
        this.isDeleteFail = true;
      }
    );
  }

}
