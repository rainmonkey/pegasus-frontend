
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from '../app/app-routing.module';



// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/dashboard/general/sidebar/sidebar.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { LearnerComponent } from './components/dashboard/dashboard-components/learner-registration/learner/learner.component';
import { GuardianComponent } from './components/dashboard/dashboard-components/learner-registration/guardian/guardian.component';
import { CourseComponent } from './components/dashboard/dashboard-components/learner-registration/course/course.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LoginComponent } from './components/basic/login/login.component';
import { HeaderbarComponent } from './components/dashboard/general/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { LearnerDetailsComponent } from './components/dashboard/dashboard-components/learner-details/learner-details.component';
import { FooterComponent } from './components/basic/footer/footer.component';
import { CoursesPanelComponent } from './components/dashboard/dashboard-components/courses/courses-panel/courses-panel.component';
import { CoursesDetailComponent } from './components/dashboard/dashboard-components/courses/courses-detail/courses-detail.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component';
// Guards

// Services


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    HeaderbarComponent,
    SidebarComponent,
    TestcontentComponent,
    LearnerDetailsComponent,
    TimePickerComponent,
    FooterComponent,
    CoursesPanelComponent,
    CoursesDetailComponent,
    CoursesListComponent,
    LearnerComponent,
    GuardianComponent,
    CourseComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    routing
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
