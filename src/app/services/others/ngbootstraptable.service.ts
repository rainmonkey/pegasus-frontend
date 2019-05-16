import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgbootstraptableService {

  /*********************************************
    columnOrderControl is an obj, stored key and value pairs
    key: orderBy --> let orderBy as the key
    value: integer --> let integer as the value. if even, sort in asec; if odd, sort in dsec
  **********************************************/
  public columnOrderControl:number;

  public previousOrderBy = null;

  constructor() { }

  /*********************************************
    sorting method
    receive 2 parameters: 
      listToOrder --> object list to be sorted
      orderBy --> which column to order (eg: FirstName,LastName ....) !!★!! orderBy must as same as the obj name in listToOrder
  **********************************************/
  sorting(listToOrder: Array<any>, orderBy: string, orderControls?:number) {
    this.getColumnOrderControl(orderBy,orderControls);
    listToOrder.sort(this.compare(orderBy))
    return this.columnOrderControl;
  }

  /*********************************************
      searching method
      receice 3 parameters:
        listToSearch --> in whitch list to search
        searchBy --> search in which columns (eg: FirstName,LastName ....) !!★!! searchBy must as same as the obj name in listToSearch
        searchStr --> searching string
    **********************************************/
  searching(listToSearch: Array<any>, searchBy: string, searchStr: string) {
    let temList = [];

    for (let i of listToSearch) {
      if (i[searchBy] !== null) {
        if (temList.indexOf(i) == -1) {
          if ((i[searchBy].toLowerCase()).search(searchStr.toLowerCase()) !== -1) {
            temList.push(i)
          }
        }
      }
    }
    return temList;
  }

  ///////////////////////////////////////methods that implement sorting and searching/////////////////////////////////////////
  /*
    push key and value pair to columnOrderControl obj
  */
  getColumnOrderControl(orderBy,orderControls?) {
    if(orderControls !== undefined){
      this.columnOrderControl = orderControls;
    }
    else if (this.previousOrderBy !== orderBy) {
   
      this.columnOrderControl = 1;
    }
    else {
      this.columnOrderControl++;
    }
    this.previousOrderBy = orderBy;
  }

  /*
    algorithm of sorting, DO NOT alter anything in this method  
  */
  compare(orderBy): any {
    let that = this;
    return function (obj1, obj2) {
      let val1 = obj1[orderBy];
      let val2 = obj2[orderBy];
      //if value%2 is 0, then sort in asec
      if (that.columnOrderControl % 2 == 0) {
        //if has null value, put it at the end of list
        if (val1 == null) {
          return  1;
        }
        else if (val2 == null) {
          return  -1;
        }
        else if (val1 < val2) {
          return  1;
        }
        else if (val1 > val2) {
          return  -1;
        }
        else {
          return  0;
        }
      }
      //else, sort in dsec
      else {
        //if has null value, put it at the end of list
        if (val1 == null) {
          return  1;
        }
        else if (val2 == null) {
          return  -1;
        }
        else if (val1 > val2) {
          return  1;
        }
        else if (val1 < val2) {
          return  -1;
        }
        else {
          return  0;
        }
      }
    }
  }
}
