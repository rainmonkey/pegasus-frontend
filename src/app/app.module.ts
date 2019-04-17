import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { UserDetailService } from './user-detail.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
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
<<<<<<< HEAD
<<<<<<< HEAD
import { LearnersListService } from './components/contents/learner-details/learners-list.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
=======
import { RegistrationComponent } from './components/contents/registration/registration.component'
>>>>>>> b4da512d1f9dba29fba9b5d294c50e8a2522e17c
=======
import { RegistrationComponent } from './components/contents/registration/registration.component';

>>>>>>> e6c4274069a918db9a814d08cfff958dfda9fd40

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    HeaderbarComponent,
    BreadcrumbComponent,
    FooterbarComponent,
    NavibarComponent,
    ContentareaComponent,
    TestcontentComponent,
    LearnerDetailsComponent,
    RegistrationComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserDetailService,
    LearnersListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
