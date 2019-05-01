import { AngularFontAwesomeModule } from 'angular-font-awesome';
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
import { RegistrationComponent } from './components/dashboard/dashboard-components/registration/registration.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LoginComponent } from './components/basic/login/login.component';
import { HeaderbarComponent } from './components/dashboard/general/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
<<<<<<< HEAD
import { HeaderbarComponent } from './components/dashboard/headerbar/headerbar.component';
import { BreadcrumbComponent } from './components/dashboard/breadcrumb/breadcrumb.component';
import { FooterbarComponent } from './components/dashboard/footerbar/footerbar.component';
import { NavibarComponent } from './components/dashboard/navibar/navibar.component';
import { ContentareaComponent } from './components/dashboard/contentarea/contentarea.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';
import { LearnersListService } from './components/contents/learner-details/learners-list.service';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { TimePickerComponent } from './components/contents/time-picker/time-picker.component';
=======
import { LearnerDetailsComponent } from './components/dashboard/dashboard-components/learner-details/learner-details.component';

// Guards

// Services
import { FooterComponent } from './components/basic/footer/footer.component';




>>>>>>> 99a899d889bd0f58b14843f92ac1f21e0183ef77

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    HeaderbarComponent,
    SidebarComponent,
    TestcontentComponent,
    LearnerDetailsComponent,
    RegistrationComponent,
<<<<<<< HEAD
    TimePickerComponent
=======
    FooterComponent
>>>>>>> 99a899d889bd0f58b14843f92ac1f21e0183ef77
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AngularFontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    routing
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
