import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from '../app/app-routing.module';



// Components
import { AppComponent } from './app.component';
import { BreadcrumbComponent } from './components/dashboard/breadcrumb/breadcrumb.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { LoginComponent } from './components/basic/login/login.component';
import { HeaderbarComponent } from './components/dashboard/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { FooterbarComponent } from './components/dashboard/footerbar/footerbar.component';
import { ContentareaComponent } from './components/dashboard/contentarea/contentarea.component';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';

// Guards

// import {}

// Services
import { UserDetailService } from './services/user-detail.service';







@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    HeaderbarComponent,
    BreadcrumbComponent,
    FooterbarComponent,
    SidebarComponent,
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
    UserDetailService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
