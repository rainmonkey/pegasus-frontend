import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgbootstraptableService {
  constructor() { }

  /*********************************************
    sorting method
    receive 3 parameters: 
      listToOrder --> object list to be sorted
      orderBy --> which column to order (eg: FirstName,LastName ....) !!★!! orderBy must as same as the obj name in listToOrder
      order --> true: asec  false: dsec
  **********************************************/
  sorting(listToOrder:Array<any>, orderBy:string, order:boolean) {
    listToOrder.sort(this.compare(orderBy, order))
  }

  /*********************************************
    searching method
    receice 3 parameters:
      listToSearch --> in whitch list to search
      searchBy --> search in which columns (eg: FirstName,LastName ....) !!★!! searchBy must as same as the obj name in listToSearch
      searchStr --> searching string
  **********************************************/
  searching(listToSearch:Array<any>, searchBy:Array<string>,searchStr:string) {
    let temList= [];
    let temListToSearch = listToSearch;
    listToSearch = temListToSearch;

    for (let i of listToSearch) {
      for (let j of searchBy) {
        if (i[j] !== null) {
          if (temList.indexOf(i) == -1) {
            if ((i[j].toLowerCase()).search(searchStr.toLowerCase()) !== -1) {
              temList.push(i)
            }
          }
        }
      }
    }
    return temList;
  }


  compare(orderBy, order): any {
    return function (obj1, obj2) {
      let val1 = obj1[orderBy];
      let val2 = obj2[orderBy];
      if (order == true) { //asec
        //if has null value, put it at the end of list
        if(val1 == null){
          return 1;
        }
        else if (val2 == null){
          return -1;
        }
        else if (val1 < val2) {
          return 1;
        } 
        else if (val1 > val2) {
          return -1;
        } 
        else {
          return 0;
        }
      }
      else { //dsec
        //if has null value, put it at the end of list
        if(val1 == null){
          return 1;
        }
        else if (val2 == null){
          return -1;
        }
        else if (val1 > val2) { 
          return 1;
        } 
        else if (val1 < val2) {
          return -1;
        } 
        else {
          return 0;
        }
      }
    }
  }
}