import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailsComponent } from './todo-details.component';
import { ITodoResponse } from '../../../../interfaces/todo-response.interface';
import { TodoService } from '../../../../services/todo.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('TodoDetailsComponent', () => {
  let component: TodoDetailsComponent;
  let fixture: ComponentFixture<TodoDetailsComponent>;

  const todoServiceMock = {
    findTodoById: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn()
  }
  const dialogRefMock = {
    afterClosed: jest.fn()
  };
  const matDialogMock = {
    open: jest.fn()
  };
  const snackBarServiceMock = {
    openSnackBar: jest.fn()
  }
  const routerMock = {
    navigate: jest.fn()
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetailsComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        { provide: SnackBarService, useValue: snackBarServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: matDialogMock },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the todo values from todoService call', () => {
    todoServiceMock.findTodoById.mockReturnValue(of(todo));
    component.todoId = todo.id;
    fixture.detectChanges();
    expect(component.todo).toEqual(todo);
    const todoDetailsDescription = fixture.debugElement.query(By.css('.todo-details__description'));
    expect(todoDetailsDescription.nativeElement.textContent).toBe('description');
  });

  describe('todoPriotityColor and todoPriorityText pipes', () => {
    it('should have color-low css class and "Baixa" text when priority is 1', () => {
      todo.priority = 1;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const titleElement = fixture.debugElement.query(By.css('.color-low'));
      expect(titleElement.nativeElement.textContent).toBe('Baixa');
    });
  
    it('should have color-moderate css class and "Moderada" text when priority is 2', () => {
      todo.priority = 2;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const titleElement = fixture.debugElement.query(By.css('.color-moderate'));
      expect(titleElement.nativeElement.textContent).toBe('Moderada');
    });
    
    it('should have color-extreme css class and "Vital" text when priority is 3', () => {
      todo.priority = 3;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const titleElement = fixture.debugElement.query(By.css('.color-extreme'));
      expect(titleElement.nativeElement.textContent).toBe('Vital');
    });
  });

  describe('todoStatusColor and todoStatusText pipes', () => {
    it('should have color-completed css class and "Concluída" text when status is 1', () => {
      todo.status = 1;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const titleElement = fixture.debugElement.query(By.css('.color-completed'));
      expect(titleElement.nativeElement.textContent).toBe('Concluída');
    });
  
    it('should have color-in-progress css class and "Em andamento" text when status is 2', () => {
      todo.status = 2;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const titleElement = fixture.debugElement.query(By.css('.color-in-progress'));
      expect(titleElement.nativeElement.textContent).toBe('Em andamento');
    });
    
    it('should have color-not-started css class and "Não iniciada" text when status is 3', () => {
      todo.status = 3;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const titleElement = fixture.debugElement.query(By.css('.color-not-started'));
      expect(titleElement.nativeElement.textContent).toBe('Não iniciada');
    });
  });

  describe('onUpdateButtonClick', () => {
    it('should return to dashboard when update is successful', () => {
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);

      const result = new FormData();

      dialogRefMock.afterClosed.mockReturnValue(of(result));
      matDialogMock.open.mockReturnValue(dialogRefMock);
      todoServiceMock.updateTodo.mockReturnValue(of(undefined));

      component.onUpdateButtonClick(todo.id);

      expect(matDialogMock.open).toHaveBeenCalled();
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(todoServiceMock.updateTodo).toHaveBeenCalledWith(todo.id, result);
      expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard']);
      expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Tarefa atualizada com sucesso!', 'Fechar');
    });
    it('should do nothing when update is canceled', () => {
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);

      dialogRefMock.afterClosed.mockReturnValue(of(false));
      matDialogMock.open.mockReturnValue(dialogRefMock);

      component.onUpdateButtonClick(todo.id);

      expect(matDialogMock.open).toHaveBeenCalled();
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
    });
  });

  describe('onDeleteButtonClick', () => {
    it('should return to dashboard when delete is successful', () => {
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);

      dialogRefMock.afterClosed.mockReturnValue(of(true));
      matDialogMock.open.mockReturnValue(dialogRefMock);
      todoServiceMock.deleteTodo.mockReturnValue(of(undefined));

      component.onDeleteButtonClick(todo.id);

      expect(matDialogMock.open).toHaveBeenCalled();
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith(todo.id);
      expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard']);
      expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Tarefa deletada com sucesso!', 'Fechar');
    });
    it('should do nothing when delete is canceled', () => {
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);

      dialogRefMock.afterClosed.mockReturnValue(of(false));
      matDialogMock.open.mockReturnValue(dialogRefMock);

      component.onDeleteButtonClick(todo.id);

      expect(matDialogMock.open).toHaveBeenCalled();
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
    });
  })

});
