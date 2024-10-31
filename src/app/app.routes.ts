import { Routes } from '@angular/router';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {LogoutComponent} from './pages/logout/logout.component';
import {HomeComponent} from './pages/home/home.component';
import {GuestComponent} from './pages/guest/guest.component';
import {PremisesComponent} from './pages/premises/premises.component';
import {EventsComponent} from './pages/events/events.component';
import {ContactComponent} from './pages/contact/contact.component';
import {MyAccountComponent} from './pages/my-account/my-account.component';
import {inject} from '@angular/core';
import {StateService} from './services/state.service';

// const stateService = inject(StateService)

function checkToken() {
  const stateService = inject(StateService)
  return stateService.token
}

export const routes: Routes = [
  {path: '', component: GuestComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'premises', component: PremisesComponent},
  {path: 'events', component: EventsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'home', component: HomeComponent, canActivate: [()=>{ // es como el condicional para que revise el token.
      return checkToken();
    }] },
  {path: 'my-account', component: MyAccountComponent, canActivate: [()=>{
      return checkToken()
    }] },
  {path: '**', component: NotFoundComponent}
];
