import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { authGuard } from "../../guards/auth.guard";
import { TodoFormComponent } from "./components/todo-form/todo-form.component";
import { logoutGuard } from "../../guards/logout.guard";
import { MainComponent } from "./components/main/main.component";
import { SettingsComponent } from "./components/settings/settings.component";

export const dashboardRoutes: Routes = [
    {
        path: '',
        title: 'Dashboard',
        canActivate: [authGuard()],
        canActivateChild: [authGuard()],
        canDeactivate: [logoutGuard()],
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                title: 'Página Inicial',
                component: MainComponent
            },
            {
                path: 'todos',
                loadChildren: () => import('./components/todos-list-container/todos-list-container.routes').then(m => m.todosListContainerRoutes),
                data: { findCompletedTodos: false }
            },
            {
                path: 'completed-todos',
                loadChildren: () => import('./components/todos-list-container/todos-list-container.routes').then(m => m.todosListContainerRoutes),
                data: { findCompletedTodos: true }
            },
            {
                path: 'create-todo',
                title: 'Criar Tarefa',
                component: TodoFormComponent,
                data: { isCreateTodoForm: true }
            },
            {
                path: 'settings',
                title: 'Configurações',
                component: SettingsComponent
            }
        ]
    },
    
]