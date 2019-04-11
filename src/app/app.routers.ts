import { RouterModule } from '@angular/router';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';

export const appRoutes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'homepage',
    component: HomepageComponent
  }
];
