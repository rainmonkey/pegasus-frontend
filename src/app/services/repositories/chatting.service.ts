import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { retry, delay } from 'rxjs/operators'
import { MessagerService } from './messager.service';
import { throwError, from, forkJoin, Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public hubConnection: signalR.HubConnection;
  public baseUrlForChatting: any = environment.baseUrlForChatting;
  public baseUrl: any = environment.baseUrl;
  public reconnectCounter:number = 0;
  public manualReconnectFlag:boolean = false;
  public disconnectFlag$ = new Subject();

  constructor(private http: HttpClient,
    private messagerService: MessagerService) { }

  //start connection
  //如果连接失败 重连5次 如果中途短线 会自动保持15s连接状态
  startConnection(userId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrlForChatting + 'chat?userId=' + userId)
      .build();
    
    this.hubConnection
      .start()
      .then(() => {
        console.log('connection started');
        this.reconnectCounter = 0;
        this.manualReconnectFlag = false;
        this.listenMessage();
      })
      //当connect连接出现错误(连接失败)
      .catch(err => {
        this.disconnectFlag$.next(true);
        console.log('11111')
        this.reconnect(userId);
      });

    this.hubConnection
    //当连接成功后 断线(连接断开)
      .onclose(() =>{
        this.reconnectCounter = 0;
        this.disconnectFlag$.next(true);
        // if(!this.manualReconnectFlag){
        //   this.reconnect(userId);
        // }
        // console.log('------');
        // return;
      })
  }

  reconnect(userId){
    //重连5次后放弃  
    if(this.reconnectCounter > 4){
      this.reconnectCounter = 0;
      return;
    }
    let reconnectTimeInterval = this.reconnectCounter === 0? 0 : 5000;
  
    setTimeout(()=>{
      this.startConnection(userId)
    },reconnectTimeInterval)

    this.reconnectCounter ++;
  }

  closeConnection(){
    this.manualReconnectFlag = true;
    console.log('close')
    this.hubConnection.stop()
    .then(()=>{
      this.disconnectFlag$.next(true);
    })
  }

  //send message
  sendMessage(messageObj) {
    //return from(this.hubConnection.invoke('SendMessageOneToOne', messageObj));
    
      return from(this.hubConnection.invoke('SendMessageOneToOne', messageObj))
      //放后台吧这个东西
      // this.http.post(this.baseUrl + 'chat', messageObj).pipe(
      //   retry(2)
      // )
    
  }

  //listen on the message
  listenMessage() {
    this.hubConnection.on('SendMessageOneToOne',
      (id, message, messageTime) => {
        //接收信息处理
        this.messagerService.saveChattingHistory({ subscriberId: id, message: message, leftOrRight: 'left', createTime: messageTime, isError: false, isResend: false })
      }),
      (err) => {
        console.log(err)
      }
  }
}
