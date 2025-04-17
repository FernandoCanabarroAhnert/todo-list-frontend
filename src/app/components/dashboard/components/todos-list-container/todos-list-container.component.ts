import { Component, inject, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosListComponent } from '../todos-list/todos-list.component';
import { TodoService } from '../../../../services/todo.service';
import { TodoListResponse } from '../../../../types/todo-list-response';
import { IPageResponse } from '../../../../interfaces/page-response.interface';
import { PaginationComponent } from '../../../pagination/pagination.component';

@Component({
  selector: 'app-todos-list-container',
  standalone: true,
  imports: [RouterOutlet, TodosListComponent, PaginationComponent],
  templateUrl: './todos-list-container.component.html',
  styleUrl: './todos-list-container.component.scss'
})
export class TodosListContainerComponent {

  private readonly _todoService = inject(TodoService);

  todosList: IPageResponse<TodoListResponse> = {} as IPageResponse<TodoListResponse>;

  @Input()
  findCompletedTodos!: boolean;

  FIXED_PAGE_SIZE: number = 3;

  ngOnInit(): void {
    if (this.findCompletedTodos) {
      this._todoService.findAllCompletedTodosFromConnectedUser(1, this.FIXED_PAGE_SIZE)
        .subscribe(todosList => this.todosList = todosList);
    }
    else {
      this._todoService.findAllNotCompletedTodosFromConnectedUser(1, this.FIXED_PAGE_SIZE)
        .subscribe(todosList => this.todosList = todosList);
    }
  }

  onPageChange(pageIndex: number) {
    if (this.findCompletedTodos) {
      this._todoService.findAllCompletedTodosFromConnectedUser(pageIndex, this.FIXED_PAGE_SIZE)
        .subscribe(todosList => this.todosList = todosList);
    }
    else {
      this._todoService.findAllNotCompletedTodosFromConnectedUser(pageIndex, this.FIXED_PAGE_SIZE)
        .subscribe(todosList => this.todosList = todosList);
    }
  }

}
