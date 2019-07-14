import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { GeneralRepoService } from '../../../../../services/repositories/general-repo.service';
@Component({
  selector: 'app-admin-learner-name',
  templateUrl: './admin-learner-name.component.html',
  styleUrls: ['./admin-learner-name.component.css']
})
export class AdminLearnerNameComponent implements OnInit {
  public name;
  @Input()
  inputTemplate : TemplateRef<any>;
  constructor(private generalReposervice: GeneralRepoService) { }

  ngOnInit() {
  }

}
