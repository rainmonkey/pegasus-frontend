// Dependencies
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from '../app/app-routing.module';
// Guards

// Services
//import { NgbdSortableHeader } from './services/others/ngbootstraptable.service';

// Pipes
import { CommandFormatPipe } from './shared/pipes/command-format.pipe';
import { GenderFormatPipe } from './shared/pipes/gender-format.pipe';
import { OrgFormatPipe } from './shared/pipes/org-format.pipe';
import { WeekFormatPipe } from './shared/pipes/week-format.pipe';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/dashboard/general/sidebar/sidebar.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { LoginComponent } from './components/basic/login/login.component';
import { HeaderbarComponent } from './components/dashboard/general/headerbar/headerbar.component';
import { HomepageComponent } from './components/dashboard/general/homepage/homepage.component';
import { SearchNameModuleComponent } from './components/dashboard/dashboard-components/support/search-name-module/search-name-module.component';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-other/admin-learner-payment-other.component';
import { AdminLearnerPaymentSuccessComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-success/admin-learner-payment-success.component';
import { FooterComponent } from './components/basic/footer/footer.component';
import { CoursesPanelComponent } from './components/dashboard/dashboard-components/courses/courses-panel/courses-panel.component';
import { CoursesDetailComponent } from './components/dashboard/dashboard-components/courses/courses-detail/courses-detail.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component';
import { TutorInfoComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-info-list/tutor-info.component';
import { ModalDeleteComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-delete-modal/modal-delete.component';
import { LearnerRegistrationFormComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-form/learner-registration-form.component';
import { LearnerRegistrationEditComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-edit/learner-registration-edit.component';
import { TutorEditModalComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-edit-modal/tutor-edit-modal.component'
import { TutorEditModalFormComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-edit-modal-form/tutor-edit-modal-form.component';
import { SessionsPanelComponent } from './components/dashboard/dashboard-components/sessions/sessions-panel/sessions-panel.component';
import { SessionsListViewComponent } from './components/dashboard/dashboard-components/sessions/sessions-list-view/sessions-list-view.component';
import { SessionDetailModalComponent } from './components/dashboard/dashboard-components/sessions/session-detail-modal/session-detail-modal.component';
import { TutorInfoPanelComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-info-panel/tutor-info-panel.component';
import { AdminLearnerPanelComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-panel/admin-learner-panel.component';
import { AdminLearnerListComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-list/admin-learner-list.component';
import { InventoryPanelComponent } from './components/dashboard/dashboard-components/inventory/inventory-panel/inventory-panel.component';
import { InventoryListComponent } from './components/dashboard/dashboard-components/inventory/inventory-list/inventory-list.component';
import { AdminInvoiceListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-invoice-list/admin-invoice-list.component';
import { AdminInvoiceEditModalComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-invoice-edit-modal/admin-invoice-edit-modal.component';
import { PayrollPanelComponent } from './components/dashboard/dashboard-components/admin-payroll/payroll-panel/payroll-panel.component';
import { PayrollListComponent } from './components/dashboard/dashboard-components/admin-payroll/payroll-list/payroll-list.component';
import { TransactionsPanelComponent } from './components/dashboard/dashboard-components/admin-transactions/transactions-panel/transactions-panel.component';
import { AdminPaymentListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-payment-list/admin-payment-list.component';
import { AdminSalesListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-sales-list/admin-sales-list.component';
import { SessionsCalendarViewTutorComponent } from './components/dashboard/dashboard-components/sessions/sessions-calendar-view-tutor/sessions-calendar-view-tutor.component';
import { SessionsCalendarViewAdminComponent } from './components/dashboard/dashboard-components/sessions/sessions-calendar-view-admin/sessions-calendar-view-admin.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    HeaderbarComponent,
    SidebarComponent,
    AdminLearnerPaymentPanelComponent,
    SearchNameModuleComponent,
    AdminLearnerPaymentInvoiceComponent,
    AdminLearnerPaymentProductsComponent,
    AdminLearnerPaymentRegistrationComponent,
    AdminLearnerPaymentOtherComponent,
    AdminLearnerPaymentSuccessComponent,
    TimePickerComponent,
    FooterComponent,
    CoursesPanelComponent,
    CoursesDetailComponent,
    CoursesListComponent,
    TutorInfoComponent,
    ModalDeleteComponent,
    TutorEditModalComponent,
    TutorEditModalFormComponent,
    GenderFormatPipe,
    OrgFormatPipe,
    WeekFormatPipe,
    LearnerRegistrationFormComponent,
    LearnerRegistrationEditComponent,
    CommandFormatPipe,
    SessionsPanelComponent,
    SessionsListViewComponent,
    SessionDetailModalComponent,
    TutorInfoPanelComponent,
    AdminLearnerPanelComponent,
    AdminLearnerListComponent,
    InventoryPanelComponent,
    InventoryListComponent,
    AdminInvoiceListComponent,
    AdminInvoiceEditModalComponent,
    PayrollPanelComponent,
    PayrollListComponent,
    TransactionsPanelComponent,
    AdminPaymentListComponent,
    AdminSalesListComponent,
    SessionsCalendarViewTutorComponent,
    SessionsCalendarViewAdminComponent
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
    routing,
  ],
  providers: [

  ],
  entryComponents:[
    TutorEditModalComponent,
    ModalDeleteComponent,
    AdminInvoiceEditModalComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
