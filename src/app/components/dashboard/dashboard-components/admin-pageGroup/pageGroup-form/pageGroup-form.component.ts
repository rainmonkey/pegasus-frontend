import { Component, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { PageGroupService } from 'src/app/services/http/pageGroup.service';


@Component({
  selector: 'app-pageGroup-form',
  templateUrl: './pageGroup-form.component.html',
  styleUrls: ['./pageGroup-form.component.css']
})
export class PageGroupFormComponent implements OnInit {
  public updateForm: FormGroup
  public readOnlyFlag: boolean = false;
 
  @Input() command;
  @Input() whichPageGroup;
  @ViewChildren('branches') branchesCheckBox;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setReadOnly();
    // this.getStaffCheckedOrg();
    this.updateForm = this.fb.group(this.formGroupAssemble());

  }


  // setDefaultBranchSelection(selectOrgId) {
  //   console.log(selectOrgId)
  //   if (this.command !== 0) {
  //     let a = this.whichStaff.StaffOrg.forEach(Org => {
  //       console.log(Org.OrgId)
  //       if (selectOrgId == Org.OrgId) {
  //         return true;
  //       }
  //     });
  //     console.log(a)
  //   }
  // }

  /*
  in detail mode, data can only be read
*/
  setReadOnly() {
    if (this.command === 1) {
      this.readOnlyFlag = true;
    }
  }

  /*
      switch photo and IdPhoto
      and change them styles
    */
 
  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        PageGroupName: [null, Validators.required],
        DisplayOrder: [null, Validators.required],
        Icon: [null, Validators.required]
        
      }
    }
    else {
      groupObj = {
        PageGroupName: [{ value: this.whichPageGroup.PageGroupName, disabled: this.readOnlyFlag }, Validators.required],
        DisplayOrder: [{ value: this.whichPageGroup.DisplayOrder, disabled: this.readOnlyFlag }, Validators.required],
        Icon: [{ value: this.whichPageGroup.Icon, disabled: this.readOnlyFlag }, Validators.required],
        
      }
    }
    return groupObj;
  }

}