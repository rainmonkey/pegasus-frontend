import { Component, OnInit, Input } from '@angular/core';
import { StaffListService } from 'src/app/services/http/staff-list.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-staff-delete-modal',
  templateUrl: './staff-delete-modal.component.html',
  styleUrls: ['./staff-delete-modal.component.css']
})
export class StaffDeleteModalComponent implements OnInit {
  public isDeleteSuccess = false;
  public isDeleteFail = false;

  @Input() command;
  @Input() whichStaff;
  constructor(
    private staffService: StaffListService,
    public activeModal: NgbActiveModal,

  ) { }

  ngOnInit() {
    console.log(this.whichStaff)
  }
 delete(){
  this.staffService.deleteStaff(this.whichStaff.StaffId).subscribe(
    (res) => {
      this.isDeleteSuccess = true;
    },
    (err) => {
      //失败信息
      this.isDeleteFail = true;
    }
  );
}

}

