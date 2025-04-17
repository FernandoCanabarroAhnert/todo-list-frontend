import { Component, inject, OnInit } from '@angular/core';
import { TodosListComponent } from '../todos-list/todos-list.component';
import { TodoService } from '../../../../services/todo.service';
import { TodoListResponse } from '../../../../types/todo-list-response';
import { SummaryComponent } from './components/summary/summary.component';
import { IPageResponse } from '../../../../interfaces/page-response.interface';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [TodosListComponent, SummaryComponent, PaginationComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  username: string = '';

  notCompletedTodos: IPageResponse<TodoListResponse> = {} as IPageResponse<TodoListResponse>;
  completedTodos: IPageResponse<TodoListResponse> = {} as IPageResponse<TodoListResponse>;

  summary = {
    completedTodosPercentage: 0,
    inProgressTodosPercentage: 0,
    notStartedTodosPercentage: 0,
  }

  private readonly _todoService = inject(TodoService);
  private readonly _authService = inject(AuthService);

  FIXED_COMPLETED_TODOS_PAGE_SIZE: number = 2;
  FIXED_NOT_COMPLETED_TODOS_PAGE_SIZE: number = 3;

  ngOnInit(): void {
      this.getUsernameFromJWT();
      this.fulfillTodosList();
      this.getTodosSummary();
  }

  getUsernameFromJWT() {
    this.username = this._authService.getUserInfos().userName;
  }

  fulfillTodosList() {
    this._todoService.findAllNotCompletedTodosFromConnectedUser(0, this.FIXED_NOT_COMPLETED_TODOS_PAGE_SIZE)
        .subscribe(todos => this.notCompletedTodos = todos);
    this._todoService.findAllCompletedTodosFromConnectedUser(0, this.FIXED_COMPLETED_TODOS_PAGE_SIZE)
      .subscribe(todos => this.completedTodos = todos);
  }

  getTodosSummary() {
    this._todoService.getTodosSummaryFromConnectedUser().subscribe(response => {
      this.summary.completedTodosPercentage = response.completedTodosPercentage;
      this.summary.inProgressTodosPercentage = response.inProgressTodosPercentage;
      this.summary.notStartedTodosPercentage = response.notStartedTodosPercentage;
    })
  } 

  onNotCompletedTodosPageChange(pageIndex: number) {
    this._todoService.findAllNotCompletedTodosFromConnectedUser(pageIndex, this.FIXED_NOT_COMPLETED_TODOS_PAGE_SIZE)
        .subscribe(todos => this.notCompletedTodos = todos);
  }

  onCompletedTodosPageChange(pageIndex: number) {
    this._todoService.findAllCompletedTodosFromConnectedUser(pageIndex, this.FIXED_COMPLETED_TODOS_PAGE_SIZE)
      .subscribe(todos => this.completedTodos = todos);
  }

}
