import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public hubConnection:signalR.HubConnection;
  public baseUrl: any = environment.baseUrlForChatting;

  constructor(private http:HttpClient) { }

  //start connection
  startConnection(userId:number){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.baseUrl + 'chat?userId=' + userId)
    .build();

    this.hubConnection
    .start()
    .then(()=> console.log('connection started'))
    .catch(err => console.log(err));
  }
}
