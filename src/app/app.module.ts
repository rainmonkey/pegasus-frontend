import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppComponent } from './app.component';
import { BreadcrumbComponent } from './components/dashboard/breadcrumb/breadcrumb.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentareaComponent } from './components/dashboard/contentarea/contentarea.component';
import { FooterbarComponent } from './components/dashboard/footerbar/footerbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderbarComponent } from './components/dashboard/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { JwtInterceptor } from './_helpers';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';
import { LoginComponent } from './components/login/login.component';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NavibarComponent } from './components/dashboard/navibar/navibar.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { routing } from '../app/app-routing.module';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { UserDetailService } from './_services';




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
    RegistrationComponent,
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
    UserDetailService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
