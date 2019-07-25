import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit, Input } from '@angular/core';
import { Animations } from '../../../../../../animation/chatting-animation'
import { environment } from 'src/environments/environment.prod';
import { fromEvent } from 'rxjs';
import { bufferTime, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-messager-personal-info',
  templateUrl: './messager-personal-info.component.html',
  styleUrls: ['./messager-personal-info.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css'],
  //theme background img changing animations
  animations: [Animations.changeThemeImg,
               Animations.changeOnlineStatus,
               Animations.photoImgGreyFilterAnimation]
})
export class MessagerPersonalInfoComponent implements OnInit {
  //应该把onlineStatus写在localStorage里面
  public onlineStatus:string = 'online';
  public personalSignature: string;
  public userFirstName;
  public userLastName;
  public userPhoto;
  public userPosition;
  public organisation;
  public photoUrl = environment.photoUrl;

  @Input() themeChangeFlag;
  constructor(
    private chattingService: ChattingService
  ) { }

  ngOnInit() {
    //获取用户信息
    console.log(localStorage)
    this.getUserInfo();
    //一开始就调用所有的事件处理
    this.eventHandler();
    // console.log('a')
    //登陆的时候就给后台发送在线状态变更 这个要在项目登陆界面实现  （未实现）

    //初始化在线状态 要从数据库拿数据 或者从localStorage里 （未实现）
  }

  getUserInfo(){
    this.userFirstName = localStorage.getItem('userFirstName');
    this.userLastName = localStorage.getItem('userLastName');
    this.userPhoto = localStorage.getItem('photo');
    this.userPosition = localStorage.getItem('userPosition');
    this.organisation = localStorage.getItem('organisations');
  }

  /*
    保存用户原始的个性签名
  */
  getSignature(event) {
    this.personalSignature = event.target.value;
  }

  /*
    改变用户个性签名
  */
  changeSignature(event) {
    if (event.target.value == this.personalSignature) {
      return;
    }
    else {

    }
    console.log('b', event.target.value)
  }

  changeOnlineStatusStyle(){
    this.onlineStatus = this.onlineStatus == 'online'? 'offline':'online';
  }
  
  /*
    event handlers in this component
  */
  eventHandler(){
    this.getOnlineStatusHandler();
    this.changeOnlineStatusHandler();
  }

  /*
    获得当前的在线状态
  */
  getOnlineStatusHandler(){
    this.chattingService.disconnectFlag$.subscribe(
      (res) =>{
        //if res true means network disconnect
        this.onlineStatus = res? 'offline':'online';
      }
    )
  }

  /*
    on line status handler
  */
  changeOnlineStatusHandler(){
    let obj = document.querySelector('.m_p_online_status');
    let click$ = fromEvent(obj,'click');

    //if no click event happend after 1s, send the online status to the server
    click$.pipe(
      debounceTime(1000)
    )
    .subscribe((res) =>{
      console.log(this.onlineStatus)
      if(this.onlineStatus ==='online'){
        //调后台在线api
        let userId = localStorage.getItem('userID');
        this.chattingService.startConnection(Number(userId));
      }
      else{
        //调后台离线api
        this.chattingService.closeConnection();
      }
    })
   
  }

}
