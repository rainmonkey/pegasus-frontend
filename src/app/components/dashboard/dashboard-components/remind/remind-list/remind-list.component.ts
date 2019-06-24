import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { RemindModalComponent } from '../../remind/remind-modal/remind-modal.component';
import { CoursesService } from 'src/app/services/http/courses.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-remind-list',
  templateUrl: './remind-list.component.html',
  styleUrls: ['./remind-list.component.css']
})
export class RemindListComponent implements OnInit {
  public columnsToShow:Array<string>=[
    'Type', 'RemindTitle', 'To', 'Info'];
  public remindsList:Array<any>;
  public remindsListCopy:Array<any>;
  public remindsListLengh:number;
 // Pagination
  public currentPage:number = 1;
  public pageSize:number = 10;
// Search
  public searchBeginDate;
  public searchEndDate;

  public isloading = false;
  public detail:Array<string> = [
    'Type', 'Teacher', 'Course', 'RemindTitle', 'Info'
  ]
  
  @ViewChild('pagination') pagination;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courseService: CoursesService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
  ) { }

  ngOnInit():any{ 
    var today = new Date().toISOString().split('T')[0];
    // console.log(today);

    var yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    // console.log(yesterday);
    this.getRemindData(yesterday, today);
  }

  getRemindData = (beginDate, endDate) => {
    this.isloading = true;
    this.courseService.getRemindList(beginDate, endDate).subscribe(
      (res) => {
        // console.log(res);
        this.remindsList = res.Data;
        this.remindsListLengh = res.Data.length;
        this.isloading = false;
        console.log(this.remindsListLengh);
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.')
        console.log(err);
        this.isloading = false;
      });
  }


  search() {
    // console.warn('asdfasdf')
    const beginDate = this.searchBeginDate == null ? alert('Please enter begin date') :
      this.datePipe.transform(this.searchBeginDate, 'yyyy-MM-dd');
    const endDate = this.searchEndDate == null ? alert('Please enter end date') :
      this.datePipe.transform(this.searchEndDate, 'yyyy-MM-dd');
    this.getRemindData(beginDate, endDate);
  }
 
  remindModal(data){
    // console.log(data)
    let madalRef = this.modalService.open(RemindModalComponent, {size:'lg'})
    madalRef.componentInstance.whichRemind = data;
  }

  getCurrentPage(){
    let currentPage = this.pagination.page;
  }

}