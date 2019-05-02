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
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LoginComponent } from './components/basic/login/login.component';
import { HeaderbarComponent } from './components/dashboard/general/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { LearnerDetailsComponent } from './components/dashboard/dashboard-components/learner-details/learner-details.component';

// Guards

// Services
import { FooterComponent } from './components/basic/footer/footer.component';





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
    TimePickerComponent,
    FooterComponent
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
