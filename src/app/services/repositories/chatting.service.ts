import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { retry } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public hubConnection:signalR.HubConnection;
  public baseUrlForChatting: any = environment.baseUrlForChatting;
  public baseUrl:any = environment.baseUrl;

  constructor(private http:HttpClient) { }

  //start connection
  startConnection(userId:number){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.baseUrlForChatting + 'chat?userId=' + userId)
    .build();

    this.hubConnection
    .start()
    .then(()=> console.log('connection started'))
    .catch(err => console.log(err));
  }

  //send message
  sendMessage(messageObj){
    return this.hubConnection.invoke('SendMessageOneToOne',messageObj)
    .then(
      ()=> {
        this.http.post(this.baseUrl + 'chat',messageObj).pipe(
          retry(2)
        ).subscribe(
          null,
          (err)=>{
            throw Error('message send failed.');
          }
        );
      })
    .catch(err => {
      return err;
    });
  }

  //listen on the message
  listenMessage(){
    this.hubConnection.on('SendMessageOneToOne', (a,b)=>{
      console.log(a)
      console.log(b)
    })
  }
}
