import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/*********************************************
  this service is used to refresh page after user modify data streams(update, add, delete...)  
**********************************************/
export class RefreshService {
  public requestFlag: boolean;
  public tutorToDelete: number;

  constructor() { }

  /*
    1, called [sendRefreshRequest] after delete operation, tutorId !!REQUIRED!!
    2, called [sendRefreshRequest] after update and add operation, tutorId not required
  */
  sendRefreshRequest(tutorId?) {
    this.requestFlag = true;
    if (tutorId !== null && tutorId !== undefined) {
      this.tutorToDelete = tutorId;
    }
    else {
      this.tutorToDelete = null;
    }
  }

  getRefreshRequest() {
    let requestFlagToReturn = this.requestFlag;
    this.requestFlag = false;
    return [requestFlagToReturn, this.tutorToDelete];

  }
}
