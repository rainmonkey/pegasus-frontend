import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TestcontentComponent } from './components/contents/testcontent/testcontent.component';
import { LearnerDetailsComponent } from './components/contents/learner-details/learner-details.component';
import { RegistrationComponent } from './components/contents/registration/registration.component';
import { TimePickerComponent } from './components/contents/time-picker/time-picker.component';

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
    path: 'time-picker',
    component: TimePickerComponent
  },
  {
    path: "**",
    redirectTo: 'Testcontent'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
