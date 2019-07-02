import { Component, OnInit, Input } from '@angular/core';
import { Animations } from '../../../../../../animation/chatting-animation'

@Component({
  selector: 'app-messager-personal-info',
  templateUrl: './messager-personal-info.component.html',
  styleUrls: ['./messager-personal-info.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css'],
  //theme background img changing animations
  animations: [Animations.changeThemeImg]
})
export class MessagerPersonalInfoComponent implements OnInit {
  //应该把onlineStatus写在localStorage里面
  public onlineStatus: boolean = true;
  public personalSignature: string;

  @Input() themeChangeFlag;
  constructor() { }

  ngOnInit() {
    //获取用户信息
    console.log(localStorage)
    // console.log('a')
    //登陆的时候就给后台发送在线状态变更 这个要在项目登陆界面实现  （未实现）

    //初始化在线状态 要从数据库拿数据 或者从localStorage里 （未实现）
  }

  /*
    改变用户的在线状态
  */
  changeOnlineStatus() {
    let obj = document.getElementsByClassName('m_p_online_status');
    if (this.onlineStatus == true) {
      this.onlineStatus = false;
      for (let i = 0; i < obj.length; i++) {
        obj[i]['title'] = 'offline';
        obj[i]['style'].background = 'rgb(175, 56, 56)';
      }
    }
    else {
      this.onlineStatus = true;
      for (let i = 0; i < obj.length; i++) {
        obj[i]['title'] = 'online';
        obj[i]['style'].background = 'rgb(125, 194, 22)';
      }
    }
    //向后台发送状态变更 （未实现）
  }

  /*
    保存用户原始的个性签名
  */
  getSignature(event) {
    this.personalSignature = event.target.value;
    console.log('a', this.personalSignature)
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

}
