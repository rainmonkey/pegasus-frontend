import { MessagerService } from '../../../../../services/repositories/messager.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Animations } from '../../../../../../animation/chatting-animation'
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map, takeUntil, concatMap, delay, skip, tap } from 'rxjs/operators';

@Component({
  selector: 'app-messager-modal',
  templateUrl: './messager-modal.component.html',
  styleUrls: ['./messager-modal.component.css'],
  animations: [Animations.changeThemeColor,
  Animations.personalPanelAnimation]
})
export class MessagerModalComponent implements OnInit {

  public windowResize$: Observable<any>;
  /**@property {Subscription} windowResizeSubscription - subscription of windowResize$ */
  public windowResizeSubscription: Subscription;
  /**@property {string} modalTitle - modal's title */
  public modalTitle: string = '';
  /**@property {number} customThemeIndex - index of custom theme */
  public customThemeIndex: number;
  /**@property {number} currentBtnIndex - index of btn */
  public currentBtnIndex: number = 0;
  public isSettingPanelDisplay: boolean = false;
  public isErrorFlag: boolean = false;
  /**@property {number} modalHeight - modal's height, can resize with browsers' */
  public modalHeight: number = (window.outerHeight <= 750) ? (window.outerHeight - 110) : 650;
  public styleList: Array<object> = [{ background: 'linear-gradient(135deg, pink, white)' },
  { background: 'linear-gradient(135deg, lightgreen, lightblue)' },
  { background: 'linear-gradient(135deg, black, white)' },
  { background: 'linear-gradient(135deg, red, lightblue)' },
  { background: 'linear-gradient(135deg, lightblue, pink)' }];

  @Output() onCloseChattingModal = new EventEmitter();

  constructor(
    private messagerService: MessagerService
  ) { }

  ngOnInit() {
    this.eventHandlers();
    //if subscribers got failed.
    this.isErrorFlag = this.messagerService.isSubscriberListsGotError;
    this.setChattingModalTitle();
    this.setCustomModalTheme();
  }

  ngAfterViewInit() {
    this.dragMessagerModal();
  }

  ngOnDestory() {
    this.windowResizeSubscription.unsubscribe();
  }

  /**
   * event handlers
   */
  eventHandlers() {
    this.resizeEventHandler();
  }

  /**
   * Messager modal's height can resize with window size
   */
  resizeEventHandler() {
    this.windowResize$ = fromEvent(window, 'resize').pipe(
      map((val) => {
        return val.target['outerHeight'];
      }));

    this.windowResizeSubscription = this.windowResize$.subscribe(
      (res) => {
        this.modalHeight = (res <= 750) ? (res - 110) : 650;
      }
    )
  }

  /**
   * Set chatting modal title.
   */
  setChattingModalTitle() {
    let subObj = this.messagerService.getSubscriberChattingWith();
    if (subObj) {
      this.modalTitle = 'Chatting with ' + subObj.FirstName + ' ' + subObj.LastName;
    }
  }

  /**
   * Set custom modal theme.
   * @param [themeIndex] - index of theme
   */
  setCustomModalTheme(themeIndex?: number) {
    this.customThemeIndex = themeIndex ? themeIndex : (
      (this.messagerService.getCustomizedTheme() ? this.messagerService.getCustomizedTheme() : 1)
    )

    if (themeIndex) {
      this.messagerService.saveCustomizedTheme(themeIndex);
    }
  }

  /**
   * Drag messager modal withn browser
   */
  dragMessagerModal() {
    const mouseDown$ = fromEvent(document.querySelector('#draggable'), 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    mouseDown$.pipe(
      concatMap(mouseDownEvent => mouseMove$.pipe(
        tap(mouseMoveEvent => {
          mouseMoveEvent.preventDefault();
        }),
        map(mouseMoveEvent => ({
          left: mouseMoveEvent['clientX'] - mouseDownEvent['offsetX'],
          top: mouseMoveEvent['clientY'] - mouseDownEvent['offsetY'],
        })),
        takeUntil(mouseUp$)
      ))
    ).subscribe(position => {
      document.querySelector('.m_m_skeleton')['style'].left = position.left + 'px';
      document.querySelector('.m_m_skeleton')['style'].top = position.top + 'px';
    })
  }

  /**
   * Display config panel.
   */
  displayConfigPanel() {
    this.isSettingPanelDisplay = !this.isSettingPanelDisplay;
  }

  /**
   * Switch which modal to display.
   * @param selectedBtnIndex - index of which btn selected 
   */
  switchDisplayedModal(selectedBtnIndex) {
    this.currentBtnIndex = selectedBtnIndex;
  }

  /**
   * Start a new Chatting.
   * @param event - emit from child component
   */
  startANewChat(event) {
    this.setChattingModalTitle();
    //可能有bug
    this.currentBtnIndex = 2;
  }

  /**
   * Close messager modal.
   */
  closeChattingModal() {
    this.onCloseChattingModal.emit(true);
  }

}
