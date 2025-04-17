import { Component, Input } from '@angular/core';
import { ITodoResponse } from '../../../../interfaces/todo-response.interface';
import { CommonModule } from '@angular/common';
import { TodoStatusPipe } from '../../../../pipes/todo-status.pipe';
import { TodoPriorityPipe } from '../../../../pipes/todo-priority.pipe';
import { TodoCardStatusIconColorPipe } from '../../../../pipes/todo-card-status-icon-color.pipe';
import { TodoPriorityColorPipe } from '../../../../pipes/todo-priority-color.pipe';
import { TodoStatusColorPipe } from '../../../../pipes/todo-status-color.pipe';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule, TodoStatusPipe, TodoPriorityPipe, TodoCardStatusIconColorPipe, TodoPriorityColorPipe, TodoStatusColorPipe],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss'
})
export class TodoCardComponent {

  @Input({ required: true })
  todo: ITodoResponse = {} as ITodoResponse;

  @Input()
  isSelectedCard = false;

}
