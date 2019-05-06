import { Injectable, Directive, EventEmitter, Input, Output, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { LessonHead } from '../../models/lessonhead';

@Injectable({
  providedIn: 'root'
})
export class NgbootstraptableService {

  constructor() { }
}

// Sort Column

// get data
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
// end get data

interface SearchResult {
  lessons: LessonHead[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(lessons: LessonHead[], column: string, direction: string): LessonHead[] {
  if (direction === '') {
    return lessons;
  } else {
    return [...lessons].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(lesson: LessonHead, term: string, pipe: PipeTransform) {
  return pipe.transform(lesson.id).includes(term)
    || lesson.title.toLowerCase().includes(term)
    || pipe.transform(lesson.duration).includes(term)
    || pipe.transform(lesson.price).includes(term);
}

@Injectable({providedIn: 'root'})
export class LessonHeadService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _lessons$ = new BehaviorSubject<LessonHead[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._lessons$.next(result.lessons);
      this._total$.next(result.total);
    });
    
    this._search$.next();
  }

  get lessons$() { return this._lessons$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let lessons = sort(LessonDetails, sortColumn, sortDirection);

    // 2. filter
    lessons = lessons.filter(lesson => matches(lesson, searchTerm, this.pipe));
    const total = lessons.length;

    // 3. paginate
    lessons = lessons.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({lessons, total});
  }
}

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}


// End Sort Table