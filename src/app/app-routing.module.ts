import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/basic/login/login.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/dashboard/dashboard-components/learner-details/learner-details.component';
import { RegistrationComponent } from './components/dashboard/dashboard-components/registration/registration.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';

import { DashboardRestrictGuard } from './guards/dashboard-restrict.guard';

const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [DashboardRestrictGuard],

    children: [
      { path: 'testcontent', component: TestcontentComponent },
      { path: 'payment', component: LearnerDetailsComponent },
      { path: 'registration', component: RegistrationComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);
