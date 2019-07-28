import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { take } from 'rxjs/operators'
import { MessagerService } from './messager.service';
import { from, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public hubConnection: signalR.HubConnection;
  public baseUrlForChatting: any = environment.baseUrlForChatting;
  public baseUrl: any = environment.baseUrl;
  public reconnectCounter: number = 0;
  public isConnected$ = new Subject();
  public isReconnecting = false;


  constructor(
    private http: HttpClient,
    private messagerService: MessagerService
  ) { }

  /**
   * Start chatting connection with server by using SignalR.
   * @param userId - user's ID
   */
  startConnection(userId: number) {
    //build a connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrlForChatting + 'chat?userId=' + userId)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('connection started');
        this.isReconnecting = false;
        this.processConnectionStatus(true);
        this.listenMessageOneToOne();
      })
      //when connection failed
      .catch(err => {
        this.reconnect(userId, 3000, 5);
      });

    this.hubConnection
      //when lost connetion after connection started
      .onclose(() => {
        this.processConnectionStatus(false);
      })
  }

  /**
   * Reconnect.
   * @param userId - user's ID
   * @param timeInterval - time interval between reconnection
   * @param reconnectTimes - max times to reconnect
   */
  reconnect(userId, timeInterval, reconnectTimes) {
    if (!this.isReconnecting) {
      this.isReconnecting = true;
      this.processConnectionStatus(false);
      let reconnectionTimer$ = timer(timeInterval, timeInterval);
      reconnectionTimer$.pipe(
        take(reconnectTimes)
      )
        .subscribe(
          () => {
            this.startConnection(userId);
          },
          null,
          () => {
            this.isReconnecting = false;
          }
        )
    }
  }

  /**
   * Close a connection.
   */
  closeConnection() {
    this.hubConnection.stop()
      .then(() => {
        this.processConnectionStatus(false);
      })
  }

  /**
   * Send message with mode 1 to 1.
   * @param messageObj - message object to send
   */
  sendMessageOneToOne(messageObj) {
    return from(this.hubConnection.invoke('SendMessageOneToOne', messageObj))
    //放后台吧这个东西
    // this.http.post(this.baseUrl + 'chat', messageObj).pipe(
    //   retry(2)
    // )

  }

  /**
   * Listen the incoming message in 1 to 1 mode.
   */
  listenMessageOneToOne() {
    this.hubConnection.on('SendMessageOneToOne',
      (id, message, messageTime, role) => {
        //接收信息处理
        console.log(id, message, messageTime, role)
        this.messagerService.processIncomingMessage(id, message, messageTime,role)
      }),
      (err) => {
        console.log(err)
      }
  }

  /**
   * Online status processor.
   * @param isConnected connected or disconnected
   */
  processConnectionStatus(isConnected: boolean) {
    this.isConnected$.next(isConnected);
    this.messagerService.saveConnectionStatus(isConnected);
  }
}
