import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }

  // API error response handler
  apiErrorMessageProcessing(err):string{
    console.warn(err)
    if (err.error) {
      if(err.error.ErrorMessage){
        return err.error.ErrorMessage;
      } else {
        return "Sorry, something's wrong with ther server.";
      }
    } else {
      return "Sorry, something's wrong with ther server.";
    }
  }

  
}
