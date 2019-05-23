import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  formNoEmailPassword = "Please enter your email and password"
  formIsClean = "There are no inputs"
  formInputRequired = " Required"
  
  
  constructor() { }

  // API error response handler
  apiErrorMessageProcessing(err):string{
    console.warn(err)
    if (err.error) {
      if(err.error.ErrorMessage){
        return (err.error.ErrorMessage).slice(0, 60);
      } else {
        return "Sorry, something's wrong with ther server.";
      }
    } else {
      return "Sorry, something's wrong with ther server.";
    }
  }


}