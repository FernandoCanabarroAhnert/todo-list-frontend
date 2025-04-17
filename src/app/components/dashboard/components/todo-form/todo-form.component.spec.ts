import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFormComponent } from './todo-form.component';
import { FormBuilder } from '@angular/forms';
import { By, DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TodoService } from '../../../../services/todo.service';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { ITodoResponse } from '../../../../interfaces/todo-response.interface';
import { EMPTY, of } from 'rxjs';
import { IFileHandle } from '../../../../interfaces/file-handle.interface';

describe('CreateTodoComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;

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
  const imageFile: IFileHandle = {
    file: new File([], 'file'),
    url: 'url'
  }

  const domSanitizer = {
    bypassSecurityTrustUrl: jest.fn()
  }
  const todoServiceMock = {
    createTodo: jest.fn(),
    findTodoById: jest.fn().mockReturnValue(of(todo)),
  }
  const snackBarServiceMock = {
    openSnackBar: jest.fn()
  }
  const dialogRefMock = {
    close: jest.fn()
  }
  const matDialogDataMock = {
    todoId: 'id' 
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [
        TodoFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: TodoService, useValue: todoServiceMock },
        { provide: SnackBarService, useValue: snackBarServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataMock },
        { provide: DomSanitizer, useValue: domSanitizer },
      ]
    })
    .compileComponents();

    Object.defineProperty(window.URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(() => 'mocked-url')
    });
    
    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form creation based on isCreateTodoForm input', () => {
    it('should create a blank form when isCreateTodoForm input is true', () => {
      component.isCreateTodoForm = true;
      const spy = jest.spyOn(component, 'instantiateForm');
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.todoForm).toBeTruthy();
      expect(spy).toHaveBeenCalled();
      expect(component.todoForm.get('title')?.value).toBe('');
      expect(component.todoForm.get('description')?.value).toBe('');
    });
    it('should create a fulfilled form and have an element with todo-form__statuses css class in html when isCreateTodoForm input is false', () => {
      component.isCreateTodoForm = false;
      const spy = jest.spyOn(component, 'instantiateFormAndFulfillData');
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.todoId).toBe('id');
      expect(component.todoForm).toBeTruthy();
      expect(spy).toHaveBeenCalled();
      expect(component.title.value).toBe(todo.title);
      expect(component.description.value).toBe(todo.description);
      expect(component.imageFile).toBeTruthy();
      expect(component.imageFile?.url).toBe(todo.image);
      const todoFormStatuses = fixture.debugElement.query(By.css('.todo-form__statuses'));
      expect(todoFormStatuses).toBeTruthy();
    });
  });

  describe('watchImageInputChange', () => {
    it('should set imageFile and requiredImageError to false when file is selected', () => {
      const event = {
        target: {
          files: [imageFile.file]
        }
      } as unknown as Event;
      component.imageFile = null;
      fixture.detectChanges();

      component.watchImageInputChange(event);
      expect(component.imageFile).toBeTruthy();
      expect(component.requiredImageError).toBe(false);
    });
    it('should set  requiredImageError to true when file is null', () => {
      const event = {
        target: {
          files: null
        }
      } as unknown as Event;
      component.imageFile = null;
      fixture.detectChanges();

      component.watchImageInputChange(event);
      expect(component.imageFile).toBeNull();
      expect(component.requiredImageError).toBe(true);
    });
  })

  describe('createTodo', () => {
    it('should create todo when data is valid', () => {
      component.isCreateTodoForm = true;
      component.imageFile = imageFile;
      component.ngOnInit();
      component.todoForm.patchValue({
        title: 'title',
        description: 'description',
        priority: 1,
        expiresAt: new Date()
      });
      fixture.detectChanges();
      todoServiceMock.createTodo.mockReturnValue(of(EMPTY));
      expect(component.todoForm.valid).toBe(true);

      component.createTodo();
      expect(todoServiceMock.createTodo).toHaveBeenCalled();
      expect(component.title.value).toBeNull();
      expect(component.description.value).toBeNull();
      expect(component.imageFile).toBeNull();
      expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Tarefa criada com sucesso!', 'Fechar');
    });
    it('should mark form as touched todo when data is invalid', () => {
      component.isCreateTodoForm = true;
      component.imageFile = imageFile;
      fixture.detectChanges();
      component.ngOnInit();

      component.createTodo();
      expect(component.todoForm.invalid).toBe(true);
      expect(component.todoForm.touched).toBe(true);
      expect(component.title.touched).toBe(true);
      expect(component.description.touched).toBe(true);
      expect(component.title.hasError('required')).toBe(true);
      expect(component.description.hasError('required')).toBe(true);
    });
    it('should set requiredImageError as true todo when data imageFile is null', () => {
      component.isCreateTodoForm = true;
      component.imageFile = null;
      fixture.detectChanges();
      component.ngOnInit();

      component.createTodo();
      expect(component.requiredImageError).toBe(true);
      expect(component.todoForm.invalid).toBe(true);
      expect(component.todoForm.touched).toBe(true);
      expect(component.title.touched).toBe(true);
      expect(component.description.touched).toBe(true);
      expect(component.title.hasError('required')).toBe(true);
      expect(component.description.hasError('required')).toBe(true);
    });
  });

  describe('onUpdateTodoClick', () => {
    it('should update todo when data is valid', () => {
      component.isCreateTodoForm = false;
      fixture.detectChanges();

      component.onUpdateTodoClick();
      expect(dialogRefMock.close).toHaveBeenCalled();
    });
    it('should mark form as touched todo when data is invalid', () => {
      component.isCreateTodoForm = false;
      component.imageFile = imageFile;
      fixture.detectChanges();
      component.ngOnInit();
      component.todoForm.patchValue({
        title: '',
        description: '',
        priority: null,
        status: null,
        expiresAt: new Date()
      });

      component.onUpdateTodoClick();
      expect(component.todoForm.invalid).toBe(true);
      expect(component.todoForm.touched).toBe(true);
      expect(component.title.touched).toBe(true);
      expect(component.description.touched).toBe(true);
      expect(component.title.hasError('required')).toBe(true);
      expect(component.description.hasError('required')).toBe(true);
    });
    it('should set requiredImageError as true todo when data imageFile is null', () => {
      component.isCreateTodoForm = false;
      fixture.detectChanges();
      component.ngOnInit();
      component.todoForm.patchValue({
        title: '',
        description: '',
        priority: null,
        status: null,
        expiresAt: new Date()
      });
      component.imageFile = null;

      component.onUpdateTodoClick();
      expect(component.requiredImageError).toBe(true);
      expect(component.todoForm.invalid).toBe(true);
      expect(component.todoForm.touched).toBe(true);
      expect(component.title.touched).toBe(true);
      expect(component.description.touched).toBe(true);
      expect(component.title.hasError('required')).toBe(true);
      expect(component.description.hasError('required')).toBe(true);
    });
  })

  it('deleteImage', () => {
    component.imageFile = imageFile;
    fixture.detectChanges();
    component.deleteImage();
    expect(component.imageFile).toBeNull();
    expect(component.requiredImageError).toBe(true);
  });

});
