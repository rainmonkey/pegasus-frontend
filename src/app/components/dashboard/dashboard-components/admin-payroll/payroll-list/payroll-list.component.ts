import { Component, OnInit } from '@angular/core';
import {PayrollService} from '../../../../../services/http/payroll.service';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payroll-list',
  templateUrl: './payroll-list.component.html',
  styleUrls: ['./payroll-list.component.css']
})
export class PayrollListComponent implements OnInit {
  public TeacherSalaryList: any;
  public TeacherSalaryListLength: number;
  public page = 1;  // pagination current page
  public pageSize = 10;    // [can modify] pagination page size
  public searchBeginDate;
  public searchEndDate;
  public isloading = false;
  public titleArray = [
    '#',
    'Teacher ID',
    'FirstName',
    'LastName',
    'Wage Amount'
  ];

  public detailsTitleArray = [
    '#',
    'Teacher',
    'Lesson Begin Date',
    'Lesson End Date',
    'Wage Amout'
  ]
  public teacherTransactionList: any;
  public teacherTransactionListLength: number;
  public modalpage = 1;
  public modalpageSize = 10;
  constructor(private payrollservice: PayrollService,
              private datePipe: DatePipe,
              private modalservice: NgbModal) { }

  ngOnInit() {
  }

  getPayrollData = (beginDate,endDate) => {
    this.payrollservice.getPayroll(beginDate, endDate).subscribe((res) => {
      this.TeacherSalaryList = res.Data.TeacherSalary;
      this.TeacherSalaryListLength = res.Data.TeacherSalary.length;
      this.isloading = false;
    }, (err) => {
      console.log(err);
    });
  }

  search = () => {
    this.isloading = true;
    const beginDate = this.searchBeginDate == null ? alert('please enter begin date') :
      this.datePipe.transform(this.searchBeginDate, 'yyyy-MM-dd');
    const endDate = this.searchEndDate == null ? alert('please enter end date') :
      this.datePipe.transform(this.searchEndDate, 'yyyy-MM-dd');
    this.getPayrollData(beginDate, endDate);
  }


  openTeacherTransactionModel = (content, teacherId) => {
    this.modalservice.open(content, {size: 'lg'}).result
      .then(result => {
        this.teacherTransactionList = [];
        this.teacherTransactionListLength = 0;
      }, reason => {
        this.teacherTransactionList = [];
        this.teacherTransactionListLength = 0;
      });
    this.payrollservice.getTeacherTransaction(teacherId, this.searchBeginDate, this.searchEndDate).subscribe(res => {
      this.teacherTransactionList = res.Data;
      this.teacherTransactionListLength = res.Data.length;
    }, err => {
      console.log(err);
    });
  }

}
