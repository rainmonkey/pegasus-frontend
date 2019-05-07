import { Component, OnInit } from '@angular/core';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ModalDeleteComponent } from '../tutor-delete-modal/modal-delete.component';
import { TutorEditModalComponent } from '../tutor-edit-modal/tutor-edit-modal.component';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';

@Component({
  selector: 'app-tutor-info',
  templateUrl: './tutor-info.component.html',
  styleUrls: ['./tutor-info.component.css']
})
export class TutorInfoComponent implements OnInit {
  public teachersList: any; 
  public teachersListLength: number;
  public temTeachersList: any; //save the original teacherList
  public temTeachersListLength: number; //save the original teacherList length
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;    //[can modify] pagination page size

  constructor(private teachersService: TeachersService, private modalService: NgbModal, private ngTable:NgbootstraptableService) { }

  ngOnInit() {
    this.getData();
  }

  /*
    get data form serve
  */
  getData() {
    this.teachersService.getTeachers().subscribe(
      (res) => {
        this.teachersList = res.Data;
        //后台AvailableDays崩了？？？？？？？？？？？？
        // for(let i of this.teachersList){
        //   console.log(i.AvailableDays)
        // }
        this.teachersListLength = res.Data.length; //length prop is under Data prop
        this.temTeachersList = res.Data;
        this.temTeachersListLength = res.Data.length;
      },
      (error) => {this.errorProcess(error) })
  }

  errorProcess(error) {
    alert(error.message)
  }


  /*
    pop up modals, when need to pop up a modal, call this method
    commands:
      0 --> Add new
      1 --> show details/show more
      2 --> Edit/update
      3 --> delete
  */
  popUpModals(command, whichTeacher) {
    switch(command){
      case 0:
        this.updateModal(command,whichTeacher);
        break;
      case 1:
        this.detailModal(command,whichTeacher)
        break;
      case 2:
        this.updateModal(command,whichTeacher);
        break;
      case 3:
        this.deleteModal(command,whichTeacher);
        break;
    }
  }

  /*
    update modal
  */
  updateModal(command,whichTeacher){
    //pop up modal
    const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' });
    //bind this pointer to that
    let that = this;
    //refresh after save
    modalRef.result.then(function(){
      that.getData()
    });
    //pass parameters to pop up modals
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    delete modal
  */
  deleteModal(command, whichTeacher) {
    const modalRef = this.modalService.open(ModalDeleteComponent)
    let that = this;
    modalRef.result.then(function(){
      that.getData()
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    detail modal
  */
  detailModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' })
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }


  /*
    search method
  */
 /////////////////////////////////////////////////这个method要精简   -----------by Richard
  onSearch(event){
    //should init original list and length
    this.teachersList = this.temTeachersList;
    this.teachersListLength = this.temTeachersListLength;
    
    let searchStr = event.target.value;
    //
    let titlesToSearch = ['FirstName','LastName'];

    this.teachersList = this.ngTable.searching(this.teachersList,titlesToSearch,searchStr);
    this.teachersListLength = this.teachersList.length;
  }


  /*
    sort method
  */
  onSort(orderBy) {
    this.ngTable.sorting(this.teachersList,orderBy);
  }
}
