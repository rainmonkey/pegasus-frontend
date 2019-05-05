import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { LessonHead } from '../../../models/lessonhead';
import { LessonHeadService } from '../../../services/repositories/lessonhead.service';
import { NgbdSortableHeader, SortEvent } from '../../directives/sortable.directive';

export const LessonDetails: LessonHead[] = [
  {
    id: 1,
    title: 'forget',
    name: 'Philp',
    discipline: 'guita lesson',
    tutorlevel: 'advance',
    learnerlevel: 'junior',
    duration: 2,
    price: 60,
    forgetnametwo: 'forget'
  },
  {
    id: 2,
    title: 'forget',
    name: 'Styrom',
    discipline: 'guita lesson',
    tutorlevel: 'foundation',
    learnerlevel: 'junior',
    duration: 1.5,
    price: 80,
    forgetnametwo: 'forget'
  },
  {
    id: 3,
    title: 'forget',
    name: 'Jarvid',
    discipline: 'guita lesson',
    tutorlevel: 'advance',
    learnerlevel: 'senior',
    duration: 10.5,
    price: 10,
    forgetnametwo: 'forget'
  }
]


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
