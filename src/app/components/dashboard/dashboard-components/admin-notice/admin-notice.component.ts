import  Swal  from 'sweetalert2';
import { Subject, Subscription } from 'rxjs';
import { StaffListService } from 'src/app/services/http/staff-list.service';
import { Component, OnInit } from '@angular/core';
// import {swal}
// import {StaffListService} from 

 interface INotice {
  Notice: string;
  FromStaffId: number;
  ToStaffId: number[];
}
@Component({
  selector: 'app-admin-notice',
  templateUrl: './admin-notice.component.html',
  styleUrls: ['./admin-notice.component.css']
})

export class AdminNoticeComponent implements OnInit {
  private staffs:any;
  selectedItem:any;
  todoText:string;
  // notice:INotice;
  constructor(private staffListService: StaffListService) { }

  ngOnInit() {
    this.staffListService.getStaffInfo().subscribe(
      res=>{
        this.staffs = res['Data']
      },
      err=>{
        alert("Something error!");
      }
    )
  }
  reset(){
    this.selectedItem={};
    this.todoText='';
  }
  onClick(){
    const notice = {} as INotice;
     notice.Notice=this.todoText;
    notice.FromStaffId=parseInt(localStorage.getItem('staffId'));
    notice.ToStaffId =[];
    console.log(notice);
    this.selectedItem.forEach(element => {
      console.log(element.StaffId);
      notice.ToStaffId.push(element.StaffId);
    });
    // let that = this;
    this.staffListService.addNotices(notice).subscribe(
      res=>{
        // this.staffs = res['Data']
        Swal.fire({
          title: 'Success!',
          text: 'Your Work Has Been Save',
          type: 'success',
        });
        this.reset();
      },
      err=>{
        alert("Something error!");
      }
    )
  }

}