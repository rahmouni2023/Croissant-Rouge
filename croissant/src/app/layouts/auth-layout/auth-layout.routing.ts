import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    { path: 'register-donneur' ,   component : RegisterComponent},
    { path: 'register-membre' ,   component : RegisterComponent},
    { path: 'register-admin' ,   component : RegisterComponent},
];
