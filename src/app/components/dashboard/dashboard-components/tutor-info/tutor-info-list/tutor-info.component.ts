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

  //update method
  update(command, witchTeacher) {
    const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' });

    let that = this;
    modalRef.result.then(function () {
      //怎么做到不同条件下不同反应
      that.ngOnInit();
    });
    if (command == "Edit") {
      modalRef.componentInstance.command = 'Edit';
    }
    if (command == "Add") {
      modalRef.componentInstance.command = "Add";
    }
    modalRef.componentInstance.witchTeacher = witchTeacher;
  }

  //delete method
  delete(command, witchTeacher) {
    const modalRef = this.modalService.open(ModalDeleteComponent)
    modalRef.componentInstance.command = 'Delete';
    modalRef.componentInstance.witchTeacher = witchTeacher;

  }

  //showDetail method
  showDetail(command, witchTeacher) {
    const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' })
    modalRef.componentInstance.command = 'Detail';
    modalRef.componentInstance.witchTeacher = witchTeacher;
  }

  //get data from server
  getData() {
    this.teachersService.getTeachers().subscribe(
      (data) => {
        this.teachersList = data.Data;
        // console.log(this.teachersList);
        this.teachersListLength = data.Data.length; //length prop is under Data prop
        this.temTeachersList = data.Data;
        this.temTeachersListLength = data.Data.length;
      },
      (error) => { console.log(error), this.errorProcess(error) })
    // show error 

    //this.update('aa',"aa");
  }

  errorProcess(error) {
    // if there is error message from server, display error message

    // if there are not error message from server, show server error
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
