import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { UserDetailService } from './services/user-detail.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { HeaderbarComponent } from './components/dashboard/headerbar/headerbar.component';
import { BreadcrumbComponent } from './components/dashboard/breadcrumb/breadcrumb.component';
import { FooterbarComponent } from './components/dashboard/footerbar/footerbar.component';
import { NavibarComponent } from './components/dashboard/navibar/navibar.component';
import { ContentareaComponent } from './components/dashboard/contentarea/contentarea.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

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
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AngularFontAwesomeModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    UserDetailService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
