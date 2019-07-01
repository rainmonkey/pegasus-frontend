import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  //测试数据
  public subscribers = [{'userId':123,'userName':'haha'},
  {'userId':234,'userName':'hehe'},
  {'userId':345,'userName':'1111'},
  {'userId':456,'userName':'2222'}]

  constructor() { }


  getChatListFronServer(){
    //从数据库获取数据 未完成
    
    console.log('shuju')
    return 'a';
  }

  //获得chatlist
  getChatListOfTeacher(){
    return this.subscribers;
  }






  setRecentlySubscribers(){
    if(sessionStorage.recentlySubscribers !== undefined){
      console.log(sessionStorage.getItem('recentlySubscribers'));
      let obj = JSON.parse(sessionStorage.getItem('recentlySubscribers'));
      console.log(obj)
    }
    else{
      let obj = [{'userId':'123'}];
      sessionStorage.setItem('recentlySubscribers',JSON.stringify(obj))
    }

  }

  getRecentlySubscribers(){

  }
}
