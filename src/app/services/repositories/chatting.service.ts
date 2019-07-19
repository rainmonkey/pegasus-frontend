import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { retry, delay } from 'rxjs/operators'
import { MessagerService } from './messager.service';
import { throwError, from, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public hubConnection: signalR.HubConnection;
  public baseUrlForChatting: any = environment.baseUrlForChatting;
  public baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient,
    private messagerService: MessagerService) { }

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
    //return from(this.hubConnection.invoke('SendMessageOneToOne', messageObj));
    return forkJoin(
      from(this.hubConnection.invoke('SendMessageOneToOne', messageObj)),
      this.http.post(this.baseUrl + 'chat', messageObj).pipe(
        retry(2)
      )
    )



    // return this.hubConnection.invoke('SendMessageOneToOne', messageObj)
    //   .then(
    //     () => {

    //       this.http.post(this.baseUrl + 'chat', messageObj).pipe(
    //         retry(2)
    //       ).subscribe(
    //         (res) => {
    //           this.error = true;
    //         },
    //         (err) => {
    //           return throwError('message send failed.');
    //         });
    //     })
    //   .catch(err => {
    //     console.log('?????')
    //     return createAtTimestamp;
    //   });
  }

  //listen on the message
  listenMessage() {
    this.hubConnection.on('SendMessageOneToOne',
      (id, message, messageTime) => {
        //接收信息处理
        this.messagerService.saveChattingHistory({ subscriberId: id, message: message, leftOrRight: 'left', createTime: messageTime,isError:false })
      }),
      (err) => {
        console.log(err)
      }
  }
}
