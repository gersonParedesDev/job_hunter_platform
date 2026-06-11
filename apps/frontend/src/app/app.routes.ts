import { Routes } from '@angular/router';
import { CandidateWizardComponent } from './features/candidate-wizard/candidate-wizard.component';

export const routes: Routes = [
  {
    path: '',
    component: CandidateWizardComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
