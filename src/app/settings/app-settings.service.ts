import { Injectable, OnDestroy } from '@angular/core';
import { UsersService } from '../services/http/users.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// This is the Settings facade for this application
export class AppSettingsService implements OnDestroy {
  public lookUpData = new BehaviorSubject(null)
  public sidebarData = new BehaviorSubject(null)
  public sidebarShowStatus = new BehaviorSubject<boolean>(true)
  public currentLookUpSettings: Observable<any>;
  public currentSidebarSettings: Observable<any>;

  public currentSidebarHiddenStatus: Observable<boolean>

  constructor(
    private userService : UsersService
    ) {
      this.currentLookUpSettings = this.lookUpData.asObservable()
      this.currentSidebarSettings = this.sidebarData.asObservable()
      this.prepareUserLookUpData()
      this.prepareUserSidebarData()
      console.log('Settings repository running')
    }

  // Get Lookup list from API
  prepareUserLookUpData(): void {
    this.userService.getLookUpData().subscribe(
      (res)=>{
        this.lookUpData.next(res['Data'])
      },
      (err)=>console.warn(err)
    )
  }

  // Get Sidebar list from API
  prepareUserSidebarData(): void {
    this.userService.getSidebar().subscribe(
      (res)=>{
        this.sidebarData.next(res['Data'])
      },
      (err)=>console.warn(err)
    )
  }

  ngOnDestroy (){

  }
}