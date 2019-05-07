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
  private teachersList: any;
  private teachersListLength: number;
  private temTeachersList: any;
  private temTeachersListLength: number;
  private temPaginationTeacher = [];
  private page: number = 1;  //pagination current page
  private pageSize: number = 10;    //[can modify] pagination page size
  private FirstNameOrder = true;
  private LastNameOrder = true;


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
        // console.log(this.teachersList);
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
    const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then(function(){
      that.getData()
    });
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
  onSearch(e){
    //should init original list and length
    this.teachersList = this.temTeachersList;
    this.teachersListLength = this.temTeachersListLength;

    let searchStr = e.target.value;
    let titlesToSearch = ['FirstName','LastName'];

    this.teachersList = this.ngTable.searching(this.teachersList,titlesToSearch,searchStr);
    this.teachersListLength = this.teachersList.length;
  }

  /*
    sort method
  */
  onSort(orderBy) {
    if(this[orderBy+'Order'] == true){
      this[orderBy+'Order'] = false;
      this.ngTable.sorting(this.teachersList,orderBy, this[orderBy+'Order']);
    }
    else{
      this[orderBy+'Order'] = true;
      this.ngTable.sorting(this.teachersList,orderBy, this[orderBy+'Order']);
    }
    //console.log(this.teachersList)
  }
}
