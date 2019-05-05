
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from '../app/app-routing.module';


import { NgbdSortableHeader } from './components/directives/sortable.directive';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/dashboard/general/sidebar/sidebar.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LoginComponent } from './components/basic/login/login.component';
import { HeaderbarComponent } from './components/dashboard/general/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/general/homepage/homepage.component';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { SearchNameModuleComponent } from './components/dashboard/dashboard-components/support/search-name-module/search-name-module.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-other/admin-learner-payment-other.component';
import { FooterComponent } from './components/basic/footer/footer.component';
import { CoursesPanelComponent } from './components/dashboard/dashboard-components/courses/courses-panel/courses-panel.component';
import { CoursesDetailComponent } from './components/dashboard/dashboard-components/courses/courses-detail/courses-detail.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component';
import { BodyComponent } from './components/dashboard/dashboard-components/teacher/body/body.component';
import { ModalDeleteComponent } from './components/dashboard/dashboard-components/teacher/body/modal-delete/modal-delete.component';
import { ModalUpdateComponent } from './components/dashboard/dashboard-components/teacher/body/modal-update/modal-update.component';
import { ModalUpdateFormComponent } from './components/dashboard/dashboard-components/teacher/body/modal-update/modal-update-form/modal-update-form.component';
import { GenderFormatPipe } from 'src/assets/pipes/teacher-pipes/gender-format.pipe';
import { WeekFormatPipe } from 'src/assets/pipes/teacher-pipes/week-format.pipe';
import { OrgFormatPipe } from 'src/assets/pipes/teacher-pipes/org-format.pipe';
import { LearnerRegistrationFormComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-form/learner-registration-form.component';
import { LearnerRegistrationEditComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-edit/learner-registration-edit.component';
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
    AdminLearnerPaymentPanelComponent,
    SearchNameModuleComponent,
    AdminLearnerPaymentInvoiceComponent,
    AdminLearnerPaymentProductsComponent,
    AdminLearnerPaymentRegistrationComponent,
    AdminLearnerPaymentOtherComponent,
    TimePickerComponent,
    FooterComponent,
    CoursesPanelComponent,
    CoursesDetailComponent,
    CoursesListComponent,
    BodyComponent,
    ModalDeleteComponent,
    ModalUpdateComponent,
    ModalUpdateFormComponent,
    GenderFormatPipe,
    WeekFormatPipe,
    OrgFormatPipe,
    LearnerRegistrationFormComponent,
    LearnerRegistrationEditComponent,
    NgbdSortableHeader
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
  entryComponents:[
    ModalUpdateComponent,
    ModalDeleteComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
