import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoListResponse } from '../types/todo-list-response';
import { ITodoResponse } from '../interfaces/todo-response.interface';
import { ITodosSummaryResponse } from '../interfaces/todos-summary-response.interface';
import { IPageResponse } from '../interfaces/page-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private readonly _http = inject(HttpClient);

  apiBaseUrl = 'https://todos.fernandocanabarrodev.tech';

  findAllNotCompletedTodosFromConnectedUser(page: number, size: number): Observable<IPageResponse<TodoListResponse>> {
    return this._http.get<IPageResponse<TodoListResponse>>(this.apiBaseUrl + '/todos', { params: { page: page - 1, size } });
  }

  findAllCompletedTodosFromConnectedUser(page: number, size: number): Observable<IPageResponse<TodoListResponse>> {
    return this._http.get<IPageResponse<TodoListResponse>>(this.apiBaseUrl + '/todos/completed', { params: { page: page - 1, size } });
  }

  findTodoById(todoId: string): Observable<ITodoResponse> {
    return this._http.get<ITodoResponse>(this.apiBaseUrl + '/todos/' + todoId)
  }

  createTodo(data: FormData): Observable<void> {
    return this._http.post<void>(this.apiBaseUrl + '/todos', data);
  }

  updateTodo(todoId: string, data: FormData): Observable<void> {
    return this._http.put<void>(this.apiBaseUrl + '/todos/' + todoId, data);
  }

  deleteTodo(todoId: string): Observable<void> {
    return this._http.delete<void>(this.apiBaseUrl + '/todos/' + todoId);
  }

  getTodosSummaryFromConnectedUser(): Observable<ITodosSummaryResponse> {
    return this._http.get<ITodosSummaryResponse>(this.apiBaseUrl + '/todos/summary');
  }

}
