import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoListResponse } from '../../../../types/todo-list-response';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IPageResponse } from '../../../../interfaces/page-response.interface';

@Component({
  selector: 'app-todos-list',
  standalone: true,
  imports: [CommonModule, TodoCardComponent, RouterLink],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})
export class TodosListComponent {

  selectedTodoCardIndex!: number;

  @Input()
  title: string = 'Minhas Tarefas';
  @Input({ required: true })
  todosList: TodoListResponse = [];

  onTodoCardSelect(index: number) {
    this.selectedTodoCardIndex = index;
  }

}
