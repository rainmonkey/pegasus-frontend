import { Routes, RouterModule } from '@angular/router';
import { DashboardRestrictGuard } from './guards/dashboard-restrict.guard';

import { LoginComponent } from './components/basic/login/login.component';
import { DashboardPanelComponent } from './components/dashboard/general/dashboard-panel/dashboard-panel.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { LearnerRegistrationEditComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-edit/learner-registration-edit.component';
import { LearnerRegistrationFormComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-form/learner-registration-form.component';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-other/admin-learner-payment-other.component';
import { AdminLearnerPaymentSuccessComponent } from './components/dashboard/dashboard-components/admin-payment/admin-learner-payment-success/admin-learner-payment-success.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component'
import { SessionsListViewComponent } from './components/dashboard/dashboard-components/sessions/sessions-views/sessions-list-view/sessions-list-view.component';
import { SessionsPanelComponent } from './components/dashboard/dashboard-components/sessions/sessions-panel/sessions-panel.component';
import { CoursesPanelComponent } from './components/dashboard/dashboard-components/courses/courses-panel/courses-panel.component';
import { AdminLearnerPanelComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-panel/admin-learner-panel.component';
import { AdminLearnerListComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-list/admin-learner-list.component';
import { InventoryPanelComponent } from './components/dashboard/dashboard-components/inventory/inventory-panel/inventory-panel.component';
import { InventoryListComponent } from './components/dashboard/dashboard-components/inventory/inventory-list/inventory-list.component';
import { PayrollPanelComponent } from './components/dashboard/dashboard-components/admin-payroll/payroll-panel/payroll-panel.component';
import { PayrollListComponent } from './components/dashboard/dashboard-components/admin-payroll/payroll-list/payroll-list.component';
import { AdminInvoiceListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-invoice-list/admin-invoice-list.component';
import { TransactionsPanelComponent } from './components/dashboard/dashboard-components/admin-transactions/transactions-panel/transactions-panel.component';
import { AdminPaymentListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-payment-list/admin-payment-list.component';
import { AdminSalesListComponent } from './components/dashboard/dashboard-components/admin-transactions/admin-sales-list/admin-sales-list.component';
import { SessionsCalendarViewAdminComponent } from './components/dashboard/dashboard-components/sessions/sessions-views/sessions-calendar-view-admin/sessions-calendar-view-admin.component';
import { SessionsCalendarViewTutorComponent } from './components/dashboard/dashboard-components/sessions/sessions-views/sessions-calendar-view-tutor/sessions-calendar-view-tutor.component';
import { TeacherPanelComponent } from './components/dashboard/dashboard-components/teachers/teacher-panel/teacher-panel.component';
import { TeacherInfoComponent } from './components/dashboard/dashboard-components/teachers/teacher-info/teacher-info.component';
import { TestoneComponent } from './components/testcomponent/testone/testone.component';
import { CourseClassListComponent } from './components/dashboard/dashboard-components/courses/course-class-list/course-class-list.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-components/dashboard-home/dashboard-home.component';


const routes: Routes = [
  { path: '', component: DashboardPanelComponent, canActivate: [DashboardRestrictGuard],  
    children: [
      {path:'home', component: DashboardHomeComponent},
      // Testing path
      {path:'testone', component: TestoneComponent},
      // Payment Area
      { path: 'payment/invoice', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children:[
          { path: 'pay/:id', component: AdminLearnerPaymentInvoiceComponent },
          { path: 'pay/success', component: AdminLearnerPaymentSuccessComponent },
      ]},
      { path: 'payment/product', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSuccessComponent },
          { path: ':id', component: AdminLearnerPaymentProductsComponent },
        ]
      },
      { path: 'payment/registration', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSuccessComponent },
          { path: ':id', component: AdminLearnerPaymentRegistrationComponent },
        ]
      },
      { path: 'payment/other', pathMatch: 'prefix', component: AdminLearnerPaymentOtherComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSuccessComponent },
        ]
      },
      // Transaction Area
      { path: 'transaction', component: TransactionsPanelComponent,
        children: [
          { path: 'invoices', component: AdminInvoiceListComponent },
          { path: 'success', component: AdminLearnerPaymentSuccessComponent },
          { path: 'payments', component: AdminPaymentListComponent },
          { path: 'sales', component: AdminSalesListComponent }
        ]},
      // Teacher Area
      { path: 'tutors', component: TeacherPanelComponent,
        children:[
          { path: 'list', component: TeacherInfoComponent }
        ]},
      // Sessions Area
      { path: 'sessions', component: SessionsPanelComponent,
        children:[
          {path: 'list', component: SessionsListViewComponent},
          {path: 'calendar/admin', component: SessionsCalendarViewAdminComponent},
          {path: 'calendar/tutor', component: SessionsCalendarViewTutorComponent}
      ]},
      // Courses Area
      { path: 'courses', component: CoursesPanelComponent,
        children:[
        { path: 'list', component: CoursesListComponent},
        { path: 'class/list', component: CourseClassListComponent}
      ]},
      // Learner Area
      { path: 'learner', component:AdminLearnerPanelComponent,
        children:[

          {path: 'list', component: AdminLearnerListComponent},
          {path: 'registration/edit', component: LearnerRegistrationEditComponent},
          {path: 'registration', component: LearnerRegistrationFormComponent}
      ]},
      // Inventory Area
      { path: 'inventory', component: InventoryPanelComponent,
        children:[
          {path:'list', component: InventoryListComponent}
      ]},
      // Payroll Area
      { path: 'payroll' , component: PayrollPanelComponent,
        children:[
          {path:'list', component:PayrollListComponent}
        ]
      },
      // Below to be rearranged
      { path: 'timePicker', component: TimePickerComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' }
];

export const routing = RouterModule.forRoot(routes);
