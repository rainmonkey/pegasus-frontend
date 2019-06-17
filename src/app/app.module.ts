import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
// Dependencies
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from 'ng-fullcalendar';
import { ChartsModule } from 'ng2-charts';
import { routing } from '../app/app-routing.module';
// Components
import { AppComponent } from './app.component';
import { FooterComponent } from './components/basic/footer/footer.component';
import { ForgotPasswordModalComponent } from './components/basic/forgot-password-modal/forgot-password-modal.component';
import { LoginComponent } from './components/basic/login/login.component';
import { AdminLearnerListComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-list/admin-learner-list.component';
import { AdminLearnerPanelComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-panel/admin-learner-panel.component';
import { LearnerDeleteModalComponent } from './components/dashboard/dashboard-components/admin-learner/learner-delete-modal/learner-delete-modal.component';
import { LearnerDetailModalComponent } from './components/dashboard/dashboard-components/admin-learner/learner-detail-modal/learner-detail-modal.component';
import { LearnerEditModalComponent } from './components/dashboard/dashboard-components/admin-learner/learner-edit-modal/learner-edit-modal.component';
import { LearnerAddModalComponent } from './components/dashboard/dashboard-components/admin-learner/learner-add-modal/learner-add-modal.component';
import { LearnerDeleteCourseModalComponent } from './components/dashboard/dashboard-components/admin-learner/learner-delete-course-modal/learner-delete-course-modal.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-other/admin-learner-payment-other.component';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentSuccessComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-success/admin-learner-payment-success.component';
import { PayrollListComponent } from './components/dashboard/dashboard-components/admin-payroll/payroll-list/payroll-list.component';
import { PayrollPanelComponent } from './components/dashboard/dashboard-components/admin-payroll/payroll-panel/payroll-panel.component';
import { AdminInvoiceEditModalComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-invoice-edit-modal/admin-invoice-edit-modal.component';
import { AdminInvoiceListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-invoice-list/admin-invoice-list.component';
import { AdminPaymentListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-payment-list/admin-payment-list.component';
import { AdminSalesListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-sales-list/admin-sales-list.component';
import { TransactionsPanelComponent } from './components/dashboard/dashboard-components/admin-transactions/transactions-panel/transactions-panel.component';
import { CourseClassDetailModalComponent } from './components/dashboard/dashboard-components/courses/course-class-detail-modal/course-class-detail-modal.component';
import { CourseClassListComponent } from './components/dashboard/dashboard-components/courses/course-class-list/course-class-list.component';
import { CourseDeleteModalComponent } from './components/dashboard/dashboard-components/courses/course-delete-modal/course-delete-modal.component';
import { CourseDetailModalComponent } from './components/dashboard/dashboard-components/courses/course-detail-modal/course-detail-modal.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component';
import { CoursesPanelComponent } from './components/dashboard/dashboard-components/courses/courses-panel/courses-panel.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-components/dashboard-home/dashboard-home.component';
import { InventoryListComponent } from './components/dashboard/dashboard-components/inventory/inventory-list/inventory-list.component';
import { InventoryPanelComponent } from './components/dashboard/dashboard-components/inventory/inventory-panel/inventory-panel.component';
import { LearnerRegistrationFormComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-form/learner-registration-form.component';
import { LearnerRegistrationModalComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-modal/learner-registration-modal.component';
import { LearnerRegistrationConfirmModalComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-confirm-modal/learner-registration-confirm-modal.component';
import { LearnerRegistrationDeleteModalComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-delete-modal/learner-registration-delete-modal.component';
import { SessionCancelModalComponent } from './components/dashboard/dashboard-components/sessions/session-modals/session-cancel-modal/session-cancel-modal.component';
import { SessionCompletedModalComponent } from './components/dashboard/dashboard-components/sessions/session-modals/session-completed-modal/session-completed-modal.component';
import { SessionDetailEditModalComponent } from './components/dashboard/dashboard-components/sessions/session-modals/session-detail-edit-modal/session-detail-edit-modal.component';
import { SessionDetailModalComponent } from './components/dashboard/dashboard-components/sessions/session-modals/session-detail-modal/session-detail-modal.component';
import { SessionTutorReportModalComponent } from './components/dashboard/dashboard-components/sessions/session-modals/session-tutor-report-modal/session-tutor-report-modal.component';
import { SessionsPanelComponent } from './components/dashboard/dashboard-components/sessions/sessions-panel/sessions-panel.component';
import { SessionsCalendarViewAdminComponent } from './components/dashboard/dashboard-components/sessions/sessions-views/sessions-calendar-view-admin/sessions-calendar-view-admin.component';
import { SessionsCalendarViewTutorComponent } from './components/dashboard/dashboard-components/sessions/sessions-views/sessions-calendar-view-tutor/sessions-calendar-view-tutor.component';
import { SessionsListViewComponent } from './components/dashboard/dashboard-components/sessions/sessions-views/sessions-list-view/sessions-list-view.component';
import { ChangePasswordModalComponent } from './components/dashboard/dashboard-components/support/change-password-modal/change-password-modal.component';
import { ChartingComponent } from './components/dashboard/dashboard-components/support/charting/charting.component';
import { RatingModalComponent } from './components/dashboard/dashboard-components/support/rating-modal/rating-modal.component';
import { SearchNameModuleComponent } from './components/dashboard/dashboard-components/support/search-name-module/search-name-module.component';
import { TeacherCourseModalComponent } from './components/dashboard/dashboard-components/teachers/teacher-course-modal/teacher-course-modal.component';
import { TeacherDeleteModalComponent } from './components/dashboard/dashboard-components/teachers/teacher-delete-modal/teacher-delete-modal.component';
import { TeacherDetailModalComponent } from './components/dashboard/dashboard-components/teachers/teacher-detail-modal/teacher-detail-modal.component';
import { TeacherInfoComponent } from './components/dashboard/dashboard-components/teachers/teacher-info/teacher-info.component';
import { TeacherModalFormComponent } from './components/dashboard/dashboard-components/teachers/teacher-modal-form/teacher-modal-form.component';
import { TeacherPanelComponent } from './components/dashboard/dashboard-components/teachers/teacher-panel/teacher-panel.component';
import { TeacherUpdateModalComponent } from './components/dashboard/dashboard-components/teachers/teacher-update-modal/teacher-update-modal.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { TrialInfoComponent } from './components/dashboard/dashboard-components/trial-session/trial-info/trial-info.component';
import { TrialPanelComponent } from './components/dashboard/dashboard-components/trial-session/trial-panel/trial-panel.component';
import { TrialSearchComponent } from './components/dashboard/dashboard-components/trial-session/trial-search/trial-search.component';
import { TrialModalComponent } from './components/dashboard/dashboard-components/trial-session/trial-modal/trial-modal.component';
import { DashboardPanelComponent } from './components/dashboard/general/dashboard-panel/dashboard-panel.component';
import { HeaderbarComponent } from './components/dashboard/general/headerbar/headerbar.component';
import { SidebarComponent } from './components/dashboard/general/sidebar/sidebar.component';
import { TestoneComponent } from './components/testcomponent/testone/testone.component';
import { ColumnTitleFormatPipe } from './shared/pipes/column-title-format.pipe';
// Guards
// Services
//import { NgbdSortableHeader } from './services/others/ngbootstraptable.service';
// Pipes
import { CommandFormatPipe } from './shared/pipes/command-format.pipe';
import { GenderPipe } from './shared/pipes/gender.pipe';
import { MyTypePipe } from './shared/pipes/myType-format.pipe';
import { OrgFormatPipe } from './shared/pipes/org-format.pipe';
import { RelationshipPipe } from './shared/pipes/relationship.pipe';
import { WeekFormatPipe } from './shared/pipes/week-format.pipe';
import { PaymentPeriodPipe } from './shared/pipes/paymentPeriod.pipe';
import { IsUnder18Pipe } from './shared/pipes/isUnder18.pipe';
import { confirmEqualValidatorDirectie } from './shared/confirm-equal-validator.directive';
import { StaffListComponent } from './components/dashboard/dashboard-components/admin-staff/Staff-list/Staff-list.component';
import { StaffPanelComponent } from './components/dashboard/dashboard-components/admin-staff/staff-panel/staff-panel.component';
import { SimplifyOrgPipe } from './shared/pipes/simplify-org.pipe';
import { LearnerCreditPanelComponent } from './components/dashboard/dashboard-components/learner-credit/learner-credit-panel/learner-credit-panel.component';
import { LearnerCreditDetailsComponent } from './components/dashboard/dashboard-components/learner-credit/learner-credit-details/learner-credit-details.component';
import { OrderbyPipe } from './shared/pipes/orderby.pipe';
import { SessionRescheduleModalComponent } from './components/dashboard/dashboard-components/sessions/session-modals/session-reschedule-modal/session-reschedule-modal.component';
import { MondayDateInWeekByDatePipe } from './shared/pipes/monday-date-in-week-by-date.pipe';
import { AdminLearnerLeaveComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-leave/admin-learner-leave.component';
import { AdminLearnerCourseEditComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-course-edit/admin-learner-course-edit.component';
import { AdminLearnerPeriodCourseChangeModalComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-period-course-change-modal/admin-learner-period-course-change-modal.component';
import { TrialConfirmComponent } from './components/dashboard/dashboard-components/trial-session/trial-confirm/trial-confirm.component';
import { StaffDeleteModalComponent } from './components/dashboard/dashboard-components/admin-staff/staff-delete-modal/staff-delete-modal.component';
import { StaffDetailModalComponent } from './components/dashboard/dashboard-components/admin-staff/staff-detail-modal/staff-detail-modal.component';
import { StaffEditModalComponent } from './components/dashboard/dashboard-components/admin-staff/staff-edit-modal/staff-edit-modal.component';
import { StaffModalFormComponent } from './components/dashboard/dashboard-components/admin-staff/staff-modal-form/staff-modal-form.component';
import { InventoryDetailModalComponent } from './components/dashboard/dashboard-components/inventory/inventory-detail-modal/inventory-detail-modal.component';
import { InventoryReceiptModalComponent } from './components/dashboard/dashboard-components/inventory/inventory-receipt-modal/inventory-receipt-modal.component';
import { HolidayCalendarComponent } from './components/dashboard/dashboard-components/admin-holidays/holiday-calendar/holiday-calendar.component';
import { AddHolidaysModalComponent } from './components/dashboard/dashboard-components/admin-holidays/add-holidays-modal/add-holidays-modal.component';
import { DeleteHolidayComponent } from './components/dashboard/dashboard-components/admin-holidays/delete-holiday/delete-holiday.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardPanelComponent,
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
    CoursesListComponent,
    OrgFormatPipe,
    WeekFormatPipe,
    LearnerRegistrationFormComponent,
    LearnerRegistrationModalComponent,
    LearnerRegistrationConfirmModalComponent,
    LearnerRegistrationDeleteModalComponent,
    CommandFormatPipe,
    SessionsPanelComponent,
    SessionsListViewComponent,
    SessionDetailEditModalComponent,
    SessionDetailModalComponent,
    AdminLearnerPanelComponent,
    AdminLearnerListComponent,
    InventoryPanelComponent,
    InventoryListComponent,
    AdminInvoiceListComponent,
    AdminInvoiceEditModalComponent,
    MyTypePipe,
    PayrollPanelComponent,
    PayrollListComponent,
    TransactionsPanelComponent,
    AdminPaymentListComponent,
    AdminSalesListComponent,
    SessionsCalendarViewTutorComponent,
    SessionsCalendarViewAdminComponent,
    TeacherInfoComponent,
    TeacherDeleteModalComponent,
    TeacherDetailModalComponent,
    TeacherUpdateModalComponent,
    TeacherModalFormComponent,
    TeacherPanelComponent,
    CourseDetailModalComponent,
    CourseDeleteModalComponent,
    TestoneComponent,

    LearnerDeleteModalComponent,
    LearnerDetailModalComponent,
    LearnerEditModalComponent,
    LearnerAddModalComponent,
    LearnerDeleteCourseModalComponent,

    SessionCancelModalComponent,
    SessionTutorReportModalComponent,
    SessionCompletedModalComponent,
    GenderPipe,
    RelationshipPipe,
    ColumnTitleFormatPipe,
    MondayDateInWeekByDatePipe,
    CourseClassListComponent,
    CourseClassDetailModalComponent,
    DashboardHomeComponent,
    TeacherCourseModalComponent,
    ChartingComponent,
    RatingModalComponent,
    ForgotPasswordModalComponent,
    ChangePasswordModalComponent,
    TrialPanelComponent,
    TrialInfoComponent,
    TrialModalComponent,
    TrialSearchComponent,
    PaymentPeriodPipe,
    IsUnder18Pipe,
    confirmEqualValidatorDirectie,
    StaffListComponent,
    StaffPanelComponent,
    SimplifyOrgPipe,
    TrialModalComponent,
    LearnerCreditPanelComponent,
    LearnerCreditDetailsComponent,
    OrderbyPipe,
    SessionRescheduleModalComponent,
    MondayDateInWeekByDatePipe,
    AdminLearnerLeaveComponent,
    AdminLearnerCourseEditComponent,
    AdminLearnerPeriodCourseChangeModalComponent,
    TrialConfirmComponent,

    StaffModalFormComponent,
    StaffDeleteModalComponent,
    StaffDetailModalComponent,
    StaffEditModalComponent,
    InventoryDetailModalComponent,
    InventoryReceiptModalComponent,
    HolidayCalendarComponent,
    AddHolidaysModalComponent,
    DeleteHolidayComponent,
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
    FullCalendarModule,
    CommonModule,
    ChartsModule
  ],
  providers: [
    DatePipe,
    MondayDateInWeekByDatePipe
  ],
  entryComponents:[
    TeacherDeleteModalComponent,
    TeacherDetailModalComponent,
    TeacherUpdateModalComponent,
    TeacherCourseModalComponent,
    AdminInvoiceEditModalComponent,
    CourseDeleteModalComponent,
    CourseDetailModalComponent,
    SessionDetailEditModalComponent,
    CourseClassDetailModalComponent,
    LearnerDeleteModalComponent,
    LearnerDetailModalComponent,
    LearnerEditModalComponent,
    LearnerAddModalComponent,
    LearnerDeleteCourseModalComponent,
    SessionCancelModalComponent,
    SessionCompletedModalComponent,
    SessionRescheduleModalComponent,
    RatingModalComponent,
    AdminLearnerPeriodCourseChangeModalComponent,
    ForgotPasswordModalComponent,
    AdminLearnerLeaveComponent,
    ChangePasswordModalComponent,
    LearnerRegistrationModalComponent,
    LearnerRegistrationConfirmModalComponent,
    LearnerRegistrationDeleteModalComponent,
    TrialModalComponent,
    TrialConfirmComponent,
    StaffDeleteModalComponent,
    StaffDetailModalComponent,
    StaffEditModalComponent,
    InventoryDetailModalComponent,
    InventoryReceiptModalComponent,
    AddHolidaysModalComponent,
    DeleteHolidayComponent
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
