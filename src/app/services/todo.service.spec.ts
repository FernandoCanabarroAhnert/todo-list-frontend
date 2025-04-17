import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ITodoResponse } from '../interfaces/todo-response.interface';
import { EMPTY, of, throwError } from 'rxjs';
import { IPageResponse } from '../interfaces/page-response.interface';
import { ITodosSummaryResponse } from '../interfaces/todos-summary-response.interface';

describe('TodoService', () => {
  let todoService: TodoService;
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }

  const notFoundError = {
    status: 404,
    message: 'Not found'
  }
  const invalidDataError = {
    status: 422,
    message: 'Invalid data'
  }
  const todo: ITodoResponse = {
    id: '1',
    title: 'title',
    description: 'description',
    priority: 1,
    status: 3,
    image: 'image',
    userId: '1',
    createdAt: new Date(),
    expiresAt: new Date()
  }
  const pageResponse: IPageResponse<ITodoResponse[]> = {
    content: [todo],
    number: 0,
    totalPages: 1,
    totalElements: 1,
    numberOfElements: 1
  }
  const todosSummaryResponse: ITodosSummaryResponse = {
    completedTodosPercentage: 0.50,
    inProgressTodosPercentage: 0.30,
    notStartedTodosPercentage: 0.20
  }

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    todoService = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(todoService).toBeTruthy();
  });

  it('findAllNotCompletedTodosFromConnectedUser', () => {
    mockHttpClient.get.mockReturnValue(of(pageResponse));
    todoService.findAllNotCompletedTodosFromConnectedUser(1,10).subscribe(response => {
      expect(response.content[0].id).toBe('1');
      expect(response.content[0].title).toBe('title');
      expect(response.content[0].description).toBe('description');
      expect(response.numberOfElements).toBe(1);
    })
  })

  it('findAllCompletedTodosFromConnectedUser', () => {
    mockHttpClient.get.mockReturnValue(of(pageResponse));
    todoService.findAllCompletedTodosFromConnectedUser(1,10).subscribe(response => {
      expect(response.content[0].id).toBe('1');
      expect(response.content[0].title).toBe('title');
      expect(response.content[0].description).toBe('description');
      expect(response.numberOfElements).toBe(1);
    })
  });

  describe('findTodoById', () => {
    it('should return todo and status 200', () => {
      mockHttpClient.get.mockReturnValue(of(todo));
      todoService.findTodoById('1').subscribe(response => {
        expect(response.id).toBe('1');
        expect(response.title).toBe('title');
        expect(response.description).toBe('description');
      })
    });
    it('should return status 404 when todo not found', () => {
      mockHttpClient.get.mockImplementation(() => {
        return throwError(() => notFoundError)       
      });
      todoService.findTodoById('1').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          expect(error.message).toEqual('Not found');
        }
      })
    })
  });

  describe('createTodo', () => {
    it('should create todo and return status 201', () => {
      mockHttpClient.post.mockReturnValue(of(EMPTY));
      todoService.createTodo(new FormData()).subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 422 when data is invalid', () => {
      mockHttpClient.post.mockImplementation(() => {
        return throwError(() => invalidDataError)
      });
      todoService.createTodo(new FormData()).subscribe({
        next: () => fail('should have failed with 422 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(422);
          expect(error.message).toEqual('Invalid data');
        }
      })
    })
  })

  describe('updateTodo', () => {
    it('should update todo and return status 200', () => {
      mockHttpClient.put.mockReturnValue(of(EMPTY));
      todoService.updateTodo('1', new FormData()).subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 404 when todo not found', () => {
      mockHttpClient.put.mockImplementation(() => {
        return throwError(() => notFoundError)
      });
      todoService.updateTodo('1', new FormData()).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          expect(error.message).toEqual('Not found');
        }
      })
    });
    it('should return status 422 when data is invalid', () => {
      mockHttpClient.put.mockImplementation(() => {
        return throwError(() => invalidDataError)
      });
      todoService.updateTodo('1', new FormData()).subscribe({
        next: () => fail('should have failed with 422 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(422);
          expect(error.message).toEqual('Invalid data');
        }
      })
    })
  });
  describe('deleteTodo', () => {
    it('should return status 204 when todo is deleted', () => {
      mockHttpClient.delete.mockReturnValue(of(EMPTY));
      todoService.deleteTodo('1').subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 404 when todo not found', () => {
      mockHttpClient.delete.mockImplementation(() => {
        return throwError(() => notFoundError)
      });
      todoService.deleteTodo('1').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          expect(error.message).toEqual('Not found');
        }
      })
    })
  })
  it('getTodosSummaryFromConnectedUser', () => {
    mockHttpClient.get.mockReturnValue(of(todosSummaryResponse));
    todoService.getTodosSummaryFromConnectedUser().subscribe(response => {
      expect(response.completedTodosPercentage).toBe(0.50);
      expect(response.inProgressTodosPercentage).toBe(0.30);
      expect(response.notStartedTodosPercentage).toBe(0.20);
    })
  });

});
