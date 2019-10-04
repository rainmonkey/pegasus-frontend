import { GeneralRepoService } from './../../../../../services/repositories/general-repo.service';
import { NotificationPopupComponent } from './../../../general/notifications/notification-popup/notification-popup.component';
import { UsersService } from 'src/app/services/http/users.service';
import { StaffListService } from 'src/app/services/http/staff-list.service';
import { Component, OnInit } from '@angular/core';
// import GeneralRepoService

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  private toDoList:any;
  private notification:any;  
  constructor(private staffListService:StaffListService,
    private userService:UsersService,private generalRepoService:GeneralRepoService) { }

  ngOnInit() {
    this.getNotification();
    this.getTodoList();
  }
  getNotification(){
    this.staffListService.getNotices().subscribe(
      res=>{
        this.notification=res['Data']
        this.generalRepoService.newNotifiNumer.next(this.notification.length);
        console.log(this.notification)
      },
      err=>{
        alert("Error occur!");
      }
    )
  }
  getTodoList(){
    this.userService.getToDoList().subscribe(
      res=>{
        this.toDoList=res['Data']
        console.log(this.toDoList)
      },
      err=>{
        alert("Error occur!");
      }
    )
  }
  deletetoDoList(i){
    if (this.toDoList[i].deleteListBoolean)
      this.toDoList[i].deleteListBoolean=false;
    else
      this.toDoList[i].deleteListBoolean=true;
  }
  deleteNotification(i){
    if (this.notification[i].deleteListBoolean)
      this.notification[i].deleteListBoolean=false;
    else
      this.notification[i].deleteListBoolean=true;
  }
  deleteList(index,TodoORNoti){
    if (TodoORNoti==1){
      let staffId=localStorage.getItem('staffId');
      console.log(this.notification);
      let noticeId=this.notification[index].NoticeId;
      
      this.staffListService.putNotice(staffId,noticeId,1).subscribe(
        res=>{
          this.ngOnInit();
        },
        err=>{
          console.log(err);
        }
      )
    }
    else//putTodoList
    {
      let todoId=this.toDoList[index].ListId;
      console.log(this.toDoList);
      this.staffListService.putTodoList(todoId).subscribe(
        res=>{
          this.ngOnInit();
        },
        err=>{
          console.log(err);
        }
      )
    }
  }
}
