import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit, Input } from '@angular/core';
import { Animations } from '../../../../../../animation/chatting-animation'
import { environment } from 'src/environments/environment.prod';
import { fromEvent } from 'rxjs';
import { bufferTime, debounceTime, tap } from 'rxjs/operators';
import { MessagerService } from 'src/app/services/repositories/messager.service';

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
  public connectionStatus: boolean = true;
  public personalSignature: string;
  public userFirstName: string;
  public userLastName: string;
  public userPhoto: string;
  public userPosition: string;
  public organisation: string;
  public photoUrl = environment.photoUrl;

  @Input() customThemeIndex;
  constructor(
    private chattingService: ChattingService,
    private messagerService: MessagerService
  ) { }

  ngOnInit() {
    this.eventHandlers();
    this.getUserPersonalInfo();
  }

  /**
   * Event handlers.
   */
  eventHandlers() {
    this.connectionStatusHandler();
    this.connectionStatusChangingHandler();
  }


  /**
   * Get user's personal information from local storage.
   */
  getUserPersonalInfo() {
    this.userFirstName = localStorage.getItem('userFirstName');
    this.userLastName = localStorage.getItem('userLastName');
    this.userPhoto = localStorage.getItem('photo');
    this.userPosition = localStorage.getItem('userPosition');
    this.organisation = localStorage.getItem('organisations');
  }

  /**
   * Get online status.
   */
  connectionStatusHandler() {
    this.connectionStatus = this.messagerService.readConnectionStatus();
    this.chattingService.isConnected$.subscribe(
      (res: boolean) => {
        //if res true means network disconnect
        this.connectionStatus = res;
      }
    )
  }

  /**
   * Handler of manual connect or disconnect.
   */
  connectionStatusChangingHandler() {
    let obj = document.querySelector('.m_p_online_status');
    let click$ = fromEvent(obj, 'click');
    //debounce
    click$.pipe(
      tap(() => {
        this.connectionStatus = !this.connectionStatus;
      }),
      debounceTime(1000)
    )
      .subscribe(() => {
        if (this.connectionStatus) {
          let userId = localStorage.getItem('userID');
          this.chattingService.startConnection(Number(userId));
        }
        else {
          this.chattingService.closeConnection();
        }
      })
  }

  /*
    保存用户原始的个性签名 【未完成】
  */
  getSignature(event) {
    this.personalSignature = event.target.value;
  }

  /*
    改变用户个性签名 【未完成】
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
