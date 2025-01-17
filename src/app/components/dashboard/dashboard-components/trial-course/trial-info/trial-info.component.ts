import { Component, OnInit ,Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-trial-info",
  templateUrl: "./trial-info.component.html",
  styleUrls: ["./trial-info.component.css"]
})
export class TrialInfoComponent implements OnInit {
  @Input() whichObject;
  arrangeFlag: boolean;
  arrangeCourse: number=null;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.whichObject);
    if (this.whichObject!=null){
      this.arrangeFlag = true;
      this.arrangeCourse = this.whichObject;
      return;
    }
    if ((this.activatedRoute.url as any).value[0].path == "arrange") {
      this.arrangeFlag = true;
    } else {
      this.arrangeFlag = false;
    }
  }

  returnBack() {
    if (this.arrangeFlag) {
      this.router.navigateByUrl(
        "/learner/credit/" + this.activatedRoute.snapshot.params.learnerId
      );
    } else {
      this.router.navigateByUrl("/learner/list");
    }
  }
}
