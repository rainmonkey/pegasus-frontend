import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/basic/login/login.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LearnerComponent } from './components/dashboard/dashboard-components/learner-registration/learner/learner.component';
import { HomepageComponent } from './components/dashboard/general/homepage/homepage.component';
import { GuardianComponent } from './components/dashboard/dashboard-components/learner-registration/guardian/guardian.component';
import { CourseComponent } from './components/dashboard/dashboard-components/learner-registration/course/course.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';

import { DashboardRestrictGuard } from './guards/dashboard-restrict.guard';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-other/admin-learner-payment-other.component';


const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [DashboardRestrictGuard],

    children: [
      { path: 'testcontent', component: TestcontentComponent },
      { path: 'payment', component: AdminLearnerPaymentPanelComponent,
      children: [
        { path: 'invoice/:id', component: AdminLearnerPaymentInvoiceComponent },
        { path: 'payProducts/:id', component: AdminLearnerPaymentProductsComponent },
        { path: 'payRegis/:id', component: AdminLearnerPaymentRegistrationComponent },
        { path: 'payOther', component: AdminLearnerPaymentOtherComponent }
        ]
      },
      { path: 'learner', component: LearnerComponent },
      { path: 'guardian', component: GuardianComponent },
      { path: 'course', component: CourseComponent },
      { path: 'timePicker', component: TimePickerComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);
