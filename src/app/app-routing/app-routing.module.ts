import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistrationComponent } from '../components/registration/registration.component';
import { AuthorizationComponent } from '../components/authorization/authorization.component';
import { ChatComponent } from '../components/chat/chat.component';
import { ChatGuard } from './guards-activate/chat-guards';
import { AuthorizationGuard } from './guards-activate/authorization-guards';
import { RegistrationGuard } from './guards-activate/registration-guards';

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full'},
  { path: 'chat',
    component: ChatComponent,
    canActivate: [ChatGuard]
  },
  { path: 'authorization',
    component: AuthorizationComponent,
    canActivate: [AuthorizationGuard]
  },
  { path: 'register',
    component: RegistrationComponent,
    canActivate: [RegistrationGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}

