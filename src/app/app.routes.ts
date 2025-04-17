import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Entrar',
        component: LoginComponent
    },
    {
        path: 'register',
        title: 'Cadastro',
        component: RegisterComponent
    },
    {
        path: 'activate-account',
        title: 'Ativar conta',
        component: ActivateAccountComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
