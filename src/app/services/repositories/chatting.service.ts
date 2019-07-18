import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { retry } from 'rxjs/operators'
import { MessagerService } from './messager.service';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public hubConnection: signalR.HubConnection;
  public baseUrlForChatting: any = environment.baseUrlForChatting;
  public baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient,
    private messagerService:MessagerService) { }

  //start connection
  startConnection(userId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrlForChatting + 'chat?userId=' + userId)
      .build();

    return this.hubConnection
      .start()
      .then(() => {
        console.log('connection started');
        this.listenMessage();
      })
      .catch(err => console.log(err));
  }

  //send message
  sendMessage(messageObj) {
    return this.hubConnection.invoke('SendMessageOneToOne', messageObj)
      .then(
        () => {
          this.http.post(this.baseUrl + 'chat', messageObj).pipe(
            retry(2)
          ).subscribe(
            null,
            (err) => {
              throw Error('message send failed.');
            }
          );
        })
      .catch(err => {
        return err;
      });
  }

  //listen on the message
  listenMessage() {
    this.hubConnection.on('SendMessageOneToOne',
      (id, message, messageTime) => {
        //接收信息处理
        console.log('2222',messageTime)
        this.messagerService.saveChattingHistory({subscriberId:id,message:message,leftOrRight:'left',createTime:messageTime})
      }),
      (err) => {
        console.log(err)
      }
  }
}
