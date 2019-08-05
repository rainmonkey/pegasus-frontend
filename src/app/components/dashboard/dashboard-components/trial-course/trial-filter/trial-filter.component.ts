import { CoursesService } from 'src/app/services/http/courses.service';
import { Component, OnInit } from '@angular/core';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trial-filter',
  templateUrl: './trial-filter.component.html',
  styleUrls: ['./trial-filter.component.css']
})
export class TrialFilterComponent implements OnInit {
  public filterLabel: Array<string> = ['Categories', 'Orgnizations'];
  public orgIdFilter: number;
  public cateIdFilter: number;
  public filterName: Array<string> = [];
  public filterContent: Array<Array<object>> = [];
  public teachersListAfterFilter: Array<Array<object>> = [];

  constructor(
    private coursesService: CoursesService,
    private teachersService: TeachersService
  ) { }

  ngOnInit() {
    this.processFilters(0);
  }

  /**
   * @param index - filter index
   * @param itemIndex - item index
   * @param filters - filter object
   * Categories processor.
   */
  processFilters(index: number, itemIndex?: number, filters?: object,id?:string) {
    //console.log(index)
    //console.log(itemIndex)
    if (index == 0) {
      this.getCates().subscribe(
        (res) => {
          //console.log(res)
          this.filterContent.push(res['Data']);
        }
      )
    }

    //cate filter
    if (index == 1) {
      //if a cate already selected
      if (this.filterName.length >= 1) {
        return
      }
      //if no cate seleted
      else {
        this.filterName.push(filters['CourseCategoryName']);
        this.cateIdFilter = filters['CourseCategoryId'];
        this.getOrgs().subscribe(
          (res) => {
            //console.log(res)
            this.filterContent.push(res['Data']);
          }
        );
      }
    }

    //org filter
    if (index == 2) {
      if (this.filterName.length >= 2) {
        return
      }
      else {
        //console.log(filters)
        this.filterName.push(filters['Abbr']);
        this.orgIdFilter = filters['OrgId'];
        this.getTeachersNTeachingCourses().subscribe(
          (res) => {
            this.processTeachersList(res);
            // console.log(res)
            // this.filterContent.push(res['Data']);
          }
        )
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

  /**
   * Get teachers from server.
   */
  getTeachersNTeachingCourses() {
    let getTeachers = this.teachersService.getTeachersInfo();
    let getTeachingCourses = this.teachersService.getTeachingCourse();
    return forkJoin([getTeachers, getTeachingCourses]);
  }

  /**
   * Process the data of tachers List
   * @param data - data to process
   */
  processTeachersList(data: Array<object>) {
    console.log(data)
    /**@property {Array<object>} array1 - array after processing (teachers list that pass org filter)*/
    let array1: Array<object> = [];
    //data[0] - teachers list
    data[0]['Data'].map(
      (val) => {
        val['AvailableDays'].map(
          (item) => {
            if (item.OrgId == this.orgIdFilter) {
              if (array1.indexOf(val) == -1) {
                array1.push(val);
              }
            }
          }
        )
      }
    )
    /**@property {Array<object>} array2 - array after processing (teachers list that pass cate and org filter) */
    let array2: Array<object> = [];
    array1.map(
      (val) => {
        //data[1] - courses teaching list
        for (let i of data[1]['Data']) {
          if (i.Course.CourseCategory.CourseCategoryId == this.cateIdFilter && val['TeacherId'] == i.TeacherId) {
            if (array2.indexOf(val) == -1) {
              array2.push(val);
            }
          }
        }
      }
    )
    this.teachersListAfterFilter = this.checkTeacherAvailableDays(array2);
    console.log(this.teachersListAfterFilter)
  }

  /**
   * Distribute teachers in avaliable days.
   * @param teacherList - teachers list to process
   */
  checkTeacherAvailableDays(teacherList: Array<object>) {
    /**@property {Array<Array<object>>} array - list after process*/
    let array: Array<Array<object>> = [[], [], [], [], [], [], []];
    teacherList.map(
      (val) => {
        for (let i of val['AvailableDays']) {
          //remove the reduplicative items
          if (array[i.DayOfWeek - 1].indexOf(val) == -1) {
            array[i.DayOfWeek - 1].push(val);
          }
        }
      }
    )
    return array;
  }


  removeFilters(index) {
    console.log(index)
    if (index == 0) {
      this.filterName = [];
      this.filterContent = [this.filterContent[0]];
    }
    else {
      this.filterName = this.filterName.slice(0, index);
      this.filterContent = this.filterContent.slice(0, index + 1);
    }

    this.teachersListAfterFilter = [];
  }

}
