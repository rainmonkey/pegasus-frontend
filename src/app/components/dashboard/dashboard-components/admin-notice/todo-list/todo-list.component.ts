import { NotificationPopupComponent } from './../../../general/notifications/notification-popup/notification-popup.component';
import { UsersService } from 'src/app/services/http/users.service';
import { StaffListService } from 'src/app/services/http/staff-list.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  private toDoList:any;
  private notification:any;  
  constructor(private staffListService:StaffListService,
    private userService:UsersService,) { }

  ngOnInit() {
    this.getNotification();
    this.getTodoList();
  }
  getNotification(){
    this.staffListService.getNotices().subscribe(
      res=>{
        this.notification=res['Data']
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
    this.toDoList[i].deleteListBoolean=true;
  }

}
