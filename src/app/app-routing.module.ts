import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';

import { AuthGuard } from './_guards';

const routes: Routes = [
  {
    path: 'Testcontent',
    component: TestcontentComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'payment',
    component: LearnerDetailsComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const routing = RouterModule.forRoot(routes);
