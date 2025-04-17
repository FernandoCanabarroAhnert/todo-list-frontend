import { Routes } from "@angular/router";
import { TodoDetailsComponent } from "../todo-details/todo-details.component";
import { TodosListContainerComponent } from "./todos-list-container.component";

export const todosListContainerRoutes: Routes = [
    {
        path: '',
        title: 'Minhas Tarefas',
        component: TodosListContainerComponent,
        children: [
            {
                path: ':todoId',
                title: 'Detalhes da Tarefa',
                component: TodoDetailsComponent
            }
        ]
    }
]