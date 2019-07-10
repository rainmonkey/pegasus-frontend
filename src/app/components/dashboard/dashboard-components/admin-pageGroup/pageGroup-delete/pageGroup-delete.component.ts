import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PageGroupService } from 'src/app/services/http/pageGroup.service';

@Component({
  selector: 'app-pageGroup-delete',
  templateUrl: './pageGroup-delete.component.html',
  styleUrls: ['./pageGroup-delete.component.css']
})
export class PageGroupDeleteComponent implements OnInit {
  public isDeleteSuccess = false;
  public isDeleteFail = false;
  public isDeleteFlag:boolean = false;
  @Input() command;
  @Input() whichPageGroup;

  constructor(
    private pageGroupService:PageGroupService,
    public activeModal: NgbActiveModal,

  ) { }

  ngOnInit() {
    console.log(this.whichPageGroup)
  }
 delete(){
  this.pageGroupService.deletePageGroup(this.whichPageGroup.PageGroupId).subscribe(
    (res) => {
      this.isDeleteSuccess = true;
    },
    (err) => {
      //失败信息
      console.log(err)
      this.isDeleteFail = true;
    }
  );
}



}

