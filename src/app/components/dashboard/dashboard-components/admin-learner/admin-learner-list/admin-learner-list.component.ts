import { Component, OnInit } from '@angular/core';
import { LearnerListService } from '../../../../../services/http/learner-list.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
@Component({
  selector: 'app-admin-learner-list',
  templateUrl: './admin-learner-list.component.html',
  styleUrls: ['./admin-learner-list.component.css']
})
export class AdminLearnerListComponent implements OnInit {
    //what columns showed in the info page, can get from back-end in the future. must as same as database
  public columnsToShow: Array<string> = ['FirstName', 'LastName', 'Gender', 'ContactNum', 'Email'];

  //learners data from servers
  public learnerList: Array<any>;

  //learner list copy. Using in searching method, in order to initialize data to original
  public learnerListCopy: Array<any>;

   //how many datas in learnerList
   public learnerListLength: number;

  //errorMessage
  errorMessage:string;

  //search by which columns, determine by users
  public columnsToSearch: Array<string> = [];
  public currentPage: number = 1;
  public pageSize: number = 10;

  constructor(
    private LearnerListService: LearnerListService,
    private ngTable: NgbootstraptableService,
  ) { }

  ngOnInit() {
    this.getDataFromServer()
  }


  //get data from server
  getDataFromServer() {
    this.LearnerListService.getLearnerList().subscribe(
      (res) =>  {
        console.log(res)
       // @ts-ignore
        this.learnerList = res.Data;
        // @ts-ignore
        this.learnerListCopy = this.learnerList;
        // @ts-ignore
        this.learnerListLength =res.Data.length;
       
      },
    (err) => {
      console.log(err); this.errorMessage="Wrong"
    }
    )
  }

  /*
    sort method
  */
 onSort(orderBy) {
  console.log(orderBy)
  this.ngTable.sorting(this.learnerList, orderBy);
}

  /*
    search method
  */
 onSearch(event) {
  if (this.columnsToSearch.length == 0) {
    return;
  }
  else {
    let searchString = event.target.value;
    this.learnerList = this.ngTable.searching(this.learnerListCopy, this.columnsToSearch, searchString);
    this.learnerListLength = this.learnerList.length;
  }
}

 /*
    Insert space before capital letter.
      eg: FirstName --> First Name
  */
 AddSpaceInString(strToAdd) {
  return strToAdd.replace(/(?=[A-Z])/g, ' ');
}

 /*
    let user decide in which column to search
  */
 showSearchingSelection(event) {
  let dropDownObj = document.getElementById('t_info_search_by_btn');
  event.target.attributes.flag = !event.target.attributes.flag;

  if (event.target.attributes.flag == true) {
    let searchingInputObj = document.getElementById('searchingInput');
    searchingInputObj['value'] = null;
    dropDownObj.style.display = 'inline-block';
  }
  else {
    dropDownObj.style.display = 'none';
  }
}

}
