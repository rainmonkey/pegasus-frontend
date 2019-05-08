import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  public coursesList: any; 
  public coursesListLength: number;
  public temCoursesList: any; //save the original teacherList
  public temCoursesListLength: number; //save the original teacherList length
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;    //[can modify] pagination page size

  constructor(private coursesService: CoursesService, private modalService: NgbModal, private ngTable:NgbootstraptableService) { }

  ngOnInit() {
    this.getData();
  }

  /*
    get data form serve
  */
  getData() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.coursesList = res.Data;
        this.coursesListLength = res.Data.length; //length prop is under Data prop
        this.temCoursesList = res.Data;
        this.temCoursesListLength = res.Data.length;
        console.log(this.coursesList);
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
  // popUpModals(command, whichTeacher) {
  //   switch(command){
  //     case 0:
  //       this.updateModal(command,whichTeacher);
  //       break;
  //     case 1:
  //       this.detailModal(command,whichTeacher)
  //       break;
  //     case 2:
  //       this.updateModal(command,whichTeacher);
  //       break;
  //     case 3:
  //       this.deleteModal(command,whichTeacher);
  //       break;
  //   }
  // }

  /*
    update modal
  */
  // updateModal(command,whichTeacher){
  //   //pop up modal
  //   const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' });
  //   //bind this pointer to that
  //   let that = this;
  //   //refresh after save
  //   modalRef.result.then(function(){
  //     that.getData()
  //   });
  //   //pass parameters to pop up modals
  //   modalRef.componentInstance.command = command;
  //   modalRef.componentInstance.whichTeacher = whichTeacher;
  // }

  // /*
  //   delete modal
  // */
  // deleteModal(command, whichTeacher) {
  //   const modalRef = this.modalService.open(ModalDeleteComponent)
  //   let that = this;
  //   modalRef.result.then(function(){
  //     that.getData()
  //   });
  //   modalRef.componentInstance.command = command;
  //   modalRef.componentInstance.whichTeacher = whichTeacher;
  // }

  // /*
  //   detail modal
  // */
  // detailModal(command, whichTeacher) {
  //   const modalRef = this.modalService.open(TutorEditModalComponent, { size: 'lg' })
  //   modalRef.componentInstance.command = command;
  //   modalRef.componentInstance.whichTeacher = whichTeacher;
  // }


  /*
    search method
  */
 /////////////////////////////////////////////////这个method要精简   -----------by Richard
  onSearch(event){
    //should init original list and length
    this.coursesList = this.temCoursesList;
    this.coursesListLength = this.temCoursesListLength;
    
    let searchStr = event.target.value;
    //
    let titlesToSearch = ['FirstName','LastName'];

    this.coursesList = this.ngTable.searching(this.coursesList,titlesToSearch,searchStr);
    this.coursesListLength = this.coursesList.length;
  }


  /*
    sort method
  */
  onSort(orderBy) {
    this.ngTable.sorting(this.coursesList,orderBy);
  }
}
