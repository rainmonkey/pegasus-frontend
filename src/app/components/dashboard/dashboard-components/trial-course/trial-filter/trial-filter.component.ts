import { filter } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TransactionService } from "./../../../../../services/http/transaction.service";
import { Component, OnInit, Input } from "@angular/core";
import { CoursesService } from "src/app/services/http/courses.service";
import { TeachersService } from "src/app/services/http/teachers.service";
import { forkJoin } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TrialCalendarComponent } from "../trial-calendar/trial-calendar.component";
import { ClassField } from "@angular/compiler";

@Component({
  selector: "app-trial-filter",
  templateUrl: "./trial-filter.component.html",
  styleUrls: ["./trial-filter.component.css"]
})
export class TrialFilterComponent implements OnInit {
  public filterLabel: Array<string> = [
    "Categories",
    "Orgnizations",
    "DayOfWeek"
  ];
  public orgIdFilter: number;
  public orgName: string;
  public cateIdFilter: number;
  public cateName: string;
  @Input() arrangeFlag;
  courseDetail: any;

  /**@property {Array<string>} filterString -  A list stored the filter tags that selected.*/
  public filterString: Array<string> = [];

  /**@property {Array<Array<any>>} filterTags - A list stored all filter tags.*/
  public filterTags: Array<Array<any>> = [];

  /**@property {Array<Array<object>>} teachersList - Teachers list to display */
  public teachersList: Array<Array<object>> = [];
  public originalData;
  public dayOfWeekIndex: number = 0;
  public nodata = "No Data Found!";

  constructor(
    private coursesService: CoursesService,
    private teachersService: TeachersService,
    private modalService: NgbModal,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.arrangeFlag) {
      this.transactionService
        .GroupOr121(this.activatedRoute.snapshot.params.courseId, 0)
        .subscribe(res => {
          this.courseDetail = res.Data;
          this.AddFilterString(0);
        });
    } else {
      this.AddFilterString(0);
    }
  }

  /**
   * Add a new filter string when user select a filter tag.
   * @param operationIndex - steps of opreation
   * @param itemIndex - item index (index of which item was selected)
   * @param item - item object (which item was selected)
   */
  AddFilterString(operationIndex: number, itemIndex?: number, item?: object) {
    // init get&set course categories filter tags
    if (operationIndex === 0) {
      if (this.arrangeFlag) {
        this.getCates().subscribe(res => {
          this.filterTags.push(
            res["Data"].filter(
              el =>
                el.CourseCategoryId ===
                this.courseDetail.Course.CourseCategoryId
            )
          );
        });
      } else {
        this.getCates().subscribe(res => {
          this.filterTags.push(res["Data"]);
        });
      }
    }

    // course categories filter tags processor
    if (operationIndex === 1) {
      // if a cate already selected
      if (this.filterString.length >= 1) {
        return;
      }
      // if no cate seleted
      else {
        this.filterString.push(item["CourseCategoryName"]);
        this.cateIdFilter = item["CourseCategoryId"];
        this.cateName = item["CourseCategoryName"];
        // get&set orgs filter tags
        this.getOrgs().subscribe(res => {
          this.filterTags.push(res["Data"]);
        });
      }
    }

    // orgs filter tags processor
    if (operationIndex === 2) {
      // if a org already selected
      if (this.filterString.length >= 2) {
        return;
      }
      // if no org selected
      else {
        this.filterString.push(item["Abbr"]);
        this.orgIdFilter = item["OrgId"];
        this.orgName = item["OrgName"];
        // get&set day of week filter tags
        const dayOfWeek = this.getDayOfWeek();
        this.filterTags.push(dayOfWeek);
      }
    }

    // day of week filter tags processor
    if (operationIndex === 3) {
      // if a day of week already selected
      if (this.filterString.length >= 3) {
        return;
      }
      // if no day of week tag selected
      else {
        this.filterString.push(item.toString());
        // get&set teachers (results)
        // if data already exist, no use to get it again
        if (this.originalData) {
          this.processTeachersList(this.originalData, itemIndex);
          return;
        }
        // no data exist, get it from server
        else {
          this.getTeachersNTeachingCourses().subscribe(res => {
            this.originalData = res;
            // process data got
            this.processTeachersList(res, itemIndex);
          });
        }
      }
    }
  }

  /**
   * Get course Categories from server.
   */
  getCates() {
    return this.coursesService.getCourseCategories();
  }

  /**
   * Get orgs from server.
   */
  getOrgs() {
    return this.coursesService.getLocations();
  }

  getDayOfWeek() {
    return [1, 2, 3, 4, 5, 6, 7, "All"];
  }

  /**
   * Get teachers from server.
   */
  getTeachersNTeachingCourses() {
    const getTeachers = this.teachersService.getTeachersInfo();
    const getTeachingCourses = this.teachersService.getTeachingCourse();
    return forkJoin([getTeachers, getTeachingCourses]);
  }

  /**
   * Process the data of tachers with filters
   * @param data - teacher and courses to process
   * @param dayOfWeekIndex - index of which day selected
   */
  processTeachersList(data: Array<object>, dayOfWeekIndex: any) {
    // 按不同的week day划分老师
    /**@property {Array{any}} array0 - list of teachers filt after org and week day */
    let array0: Array<any> = this.checkTeacherAvailableDays(
      data[0]["Data"],
      dayOfWeekIndex
    );
    /**@property {Array<number>} teachersIdOfCate - list of all teacher's ID that can taught selected course category */
    const teachersIdOfCate: Array<number> = [];

    for (const i of data[1]["Data"]) {
      if (i.Course.CourseCategory.CourseCategoryId == this.cateIdFilter) {
        if (teachersIdOfCate.indexOf(i.TeacherId) == -1) {
          teachersIdOfCate.push(i.TeacherId);
        }
      }
    }

    // filt teachers with category
    array0.map(val => {
      if (val.length === 0) {
        return;
      } else {
        for (const i in val) {
          if (!teachersIdOfCate.includes(val[i].TeacherId)) {
            val.splice(i, 1);
          }
        }
      }
    });

    if (this.arrangeFlag) {
      array0[0] = array0[0].filter(
        el => el.Level === this.courseDetail.Course.TeacherLevel
      );
    }

    this.teachersList = array0;
  }

  /**
   * Distribute teachers in avaliable days with specific org.
   * @param teacherList - teachers list to process
   */
  checkTeacherAvailableDays(teacherList: Array<object>, dayOfWeekIndex: any) {
    /**@property {Array<Array<object>>} array - list after process*/
    const array: Array<Array<object>> = [[], [], [], [], [], [], []];
    teacherList.map(val => {
      for (const i of val["AvailableDays"]) {
        if (i.OrgId == this.orgIdFilter) {
          if (array[i.DayOfWeek - 1].indexOf(val) === -1) {
            array[i.DayOfWeek - 1].push(val);
          }
        }
      }
    });

    return this.getTeacherListAfterDayOfWeekFilter(array, dayOfWeekIndex);
  }

  /**
   * Get teacher list with different day of week.
   * @param list -
   * @param dayOfWeekIndex - index of day
   */
  getTeacherListAfterDayOfWeekFilter(list, dayOfWeekIndex: any) {
    // show all
    if (dayOfWeekIndex == 7) {
      this.dayOfWeekIndex = null;
      return list;
    }
    // show specific day
    else {
      this.dayOfWeekIndex = dayOfWeekIndex;
      return [list[dayOfWeekIndex]];
    }
  }

  /**
   * Display calendar modal.
   * @param teacher - teacher selected
   */
  popupCalendarModal(teacher: object) {
    const modalRef = this.modalService.open(TrialCalendarComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.teacher = teacher;
    modalRef.componentInstance.orgName = this.orgName;
    modalRef.componentInstance.orgId = this.orgIdFilter;
    modalRef.componentInstance.CourseCategoryId = this.cateIdFilter;
    modalRef.componentInstance.courseCategoryName = this.cateName;
    if (this.arrangeFlag) {
      modalRef.componentInstance.LearnerId = this.courseDetail.LearnerId;
      modalRef.componentInstance.durationType = this.courseDetail.Course.Duration;
    }
  }

  removeFilters(index) {
    if (index == 0) {
      this.filterString = [];
      this.filterTags = [this.filterTags[0]];
    } else {
      this.filterString = this.filterString.slice(0, index);
      this.filterTags = this.filterTags.slice(0, index + 1);
    }

    this.teachersList = [];
    this.dayOfWeekIndex = 0;
  }
}
