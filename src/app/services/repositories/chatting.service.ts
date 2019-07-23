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
        console.log('11111')
        this.reconnect(userId);
      });

    this.hubConnection
    //当连接成功后 断线(连接断开)
      .onclose(() =>{
        if(!this.manualReconnectFlag){
          this.reconnect(userId);
        }
        console.log('------');
        return;
      })
  }

  reconnect(userId){
    //重连10次  
    if(this.reconnectCounter > 10){
      //10次之后肯定失败 调用方法
      this.disconnectFlag$.next(true);
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
    return forkJoin(
      from(this.hubConnection.invoke('SendMessageOneToOne', messageObj)),
      //放后台吧这个东西
      // this.http.post(this.baseUrl + 'chat', messageObj).pipe(
      //   retry(2)
      // )
    )
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
