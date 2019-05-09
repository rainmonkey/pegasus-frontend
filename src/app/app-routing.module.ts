import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/basic/login/login.component';
import { HomepageComponent } from './components/dashboard/general/homepage/homepage.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { LearnerRegistrationFormComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-form/learner-registration-form.component';
import { DashboardRestrictGuard } from './guards/dashboard-restrict.guard';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-other/admin-learner-payment-other.component';
import { AdminLearnerPaymentSussessComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-sussess/admin-learner-payment-sussess.component';
import { TutorInfoComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-info-list/tutor-info.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component'
import { SessionsListViewComponent } from './components/dashboard/dashboard-components/sessions/sessions-list-view/sessions-list-view.component';
import { SessionsPanelComponent } from './components/dashboard/dashboard-components/sessions/sessions-panel/sessions-panel.component';
import { SessionsCalendarViewComponent } from './components/dashboard/dashboard-components/sessions/sessions-calendar-view/sessions-calendar-view.component';
import { CoursesPanelComponent } from './components/dashboard/dashboard-components/courses/courses-panel/courses-panel.component';
import { TutorInfoPanelComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-info-panel/tutor-info-panel.component';
import { AdminLearnerPanelComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-panel/admin-learner-panel.component';
import { AdminLearnerListComponent } from './components/dashboard/dashboard-components/admin-learner/admin-learner-list/admin-learner-list.component';
import { InventoryPanelComponent } from './components/dashboard/dashboard-components/inventory/inventory-panel/inventory-panel.component';
import { InventoryListComponent } from './components/dashboard/dashboard-components/inventory/inventory-list/inventory-list.component';


const routes: Routes = [
  { path: '',
    component: HomepageComponent, canActivate: [DashboardRestrictGuard],
    children: [
      // Payments Area
      { path: 'payment/invoice', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent, },
          { path: ':id', component: AdminLearnerPaymentInvoiceComponent },
        ]
      },
      { path: 'payment/products', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent, },
          { path: ':id', component: AdminLearnerPaymentProductsComponent, },
        ]
      },
      { path: 'payment/registration', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent },
          { path: ':id', component: AdminLearnerPaymentRegistrationComponent },
        ]
      },
      { path: 'payment/other', component: AdminLearnerPaymentOtherComponent },
      // Tutor Area
      { path: 'tutor', component: TutorInfoPanelComponent,
        children:[
          { path: 'list', component: TutorInfoComponent }
        ]},
      // Sessions Area
      { path: 'sessions', component: SessionsPanelComponent, 
        children:[
          {path: 'list', component: SessionsListViewComponent},
          {path: 'calendar', component: SessionsCalendarViewComponent}
      ]},
      // Courses Area
      { path: 'courses', component: CoursesPanelComponent, 
        children:[
        { path: 'list', component: CoursesListComponent}
      ]},
      // Learner Area
      { path: 'learner', component:AdminLearnerPanelComponent,
        children:[
          {path: 'list', component: AdminLearnerListComponent}
      ]},
      // Inventory Area
      { path: 'inventory', component: InventoryPanelComponent, 
        children:[
          {path:'list', component: InventoryListComponent}
        ]},
      // Below to be rearranged
      { path: 'learnerRegistration', component: LearnerRegistrationFormComponent },
      { path: 'timePicker', component: TimePickerComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);
