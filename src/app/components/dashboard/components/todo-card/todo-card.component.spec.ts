import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCardComponent } from './todo-card.component';
import { ITodoResponse } from '../../../../interfaces/todo-response.interface';
import { By } from '@angular/platform-browser';

describe('TodoCardComponent', () => {
  let component: TodoCardComponent;
  let fixture: ComponentFixture<TodoCardComponent>;

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
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [TodoCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the todo input values', () => {
    component.todo = todo;
    fixture.detectChanges();
    expect(component.todo).toEqual(todo);
    const titleElement = fixture.debugElement.query(By.css('.todo-card__title'));
    expect(titleElement.nativeElement.textContent).toBe('title');
  })

  it('should have the isSelectedCard input value and css class when isSelectedCard input is true', () => {
    component.isSelectedCard = true;
    component.todo = todo;
    fixture.detectChanges();
    expect(component.isSelectedCard).toBe(true);
    expect(component.todo).toEqual(todo);
    const titleElement = fixture.debugElement.query(By.css('.todo-card__description'));
    expect(titleElement.nativeElement.textContent).toBe('description');
    const todoCardSelected = fixture.debugElement.query(By.css('.todo-card--selected'));
    expect(todoCardSelected).toBeTruthy();
  });

  it('should not have the isSelectedCard input value and css class when isSelectedCard input is false', () => {
    component.isSelectedCard = false;
    component.todo = todo;
    fixture.detectChanges();
    expect(component.isSelectedCard).toBe(false);
    expect(component.todo).toEqual(todo);
    const titleElement = fixture.debugElement.query(By.css('.todo-card__description'));
    expect(titleElement.nativeElement.textContent).toBe('description');
    const todoCardSelected = fixture.debugElement.query(By.css('.todo-card--selected'));
    expect(todoCardSelected).toBeNull();
  });

  describe('todoCardStatusIconColor pipe', () => {
    it('should have todo-card__status-icon--completed css class when status is 1', () => {
      todo.status = 1;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const todoCardStatusIcon = fixture.debugElement.query(By.css('.todo-card__status-icon--completed'));
      expect(todoCardStatusIcon).toBeTruthy();
    });
    it('should have todo-card__status-icon--in-progress css class when status is 2', () => {
      todo.status = 2;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const todoCardStatusIcon = fixture.debugElement.query(By.css('.todo-card__status-icon--in-progress'));
      expect(todoCardStatusIcon).toBeTruthy();
    });
    it('should have todo-card__status-icon--not-started css class when status is 3', () => {
      todo.status = 3;
      component.todo = todo;
      fixture.detectChanges();
      expect(component.todo).toEqual(todo);
      const todoCardStatusIcon = fixture.debugElement.query(By.css('.todo-card__status-icon--not-started'));
      expect(todoCardStatusIcon).toBeTruthy();
    });
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

});
