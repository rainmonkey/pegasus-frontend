import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { LoginComponent } from './components/login/login.component';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { TimePickerComponent } from './components/contents/time-picker/time-picker.component';
=======
import { LoginComponent } from './components/basic/login/login.component';
import { TestcontentComponent } from './components/testing/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/dashboard/dashboard-components/learner-details/learner-details.component';
import { RegistrationComponent } from './components/dashboard/dashboard-components/registration/registration.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';

import { DashboardRestrictGuard } from './guards/dashboard-restrict.guard';
>>>>>>> 99a899d889bd0f58b14843f92ac1f21e0183ef77

const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [DashboardRestrictGuard],

    children: [
      { path: 'testcontent', component: TestcontentComponent },
      { path: 'payment', component: LearnerDetailsComponent },
      { path: 'registration', component: RegistrationComponent }
    ]
  },
<<<<<<< HEAD
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'time-picker',
    component: TimePickerComponent
  },
  {
    path: "**",
    redirectTo: 'Testcontent'
  }
=======
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
>>>>>>> 99a899d889bd0f58b14843f92ac1f21e0183ef77
];

export const routing = RouterModule.forRoot(routes);
