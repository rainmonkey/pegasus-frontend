import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { LessonHead } from '../../../models/lessonhead';
import { LessonHeadService } from '../../../services/others/ngbootstraptable.service';
import { NgbdSortableHeader, SortEvent } from '../../../services/others/ngbootstraptable.service';


@Component({
  selector: 'app-testcontent',
  templateUrl: './testcontent.component.html',
  providers: [LessonHeadService, DecimalPipe]
})
export class TestcontentComponent implements OnInit {
  
  lessons$: Observable<LessonHead[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: LessonHeadService) {
    this.lessons$ = service.lessons$;
    this.total$ = service.total$;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  ngOnInit() {
  }
}
