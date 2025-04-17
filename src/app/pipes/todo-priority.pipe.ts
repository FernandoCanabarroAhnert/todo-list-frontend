import { Pipe, PipeTransform } from '@angular/core';
import { TodoPriorityEnum } from '../enums/todo-priority.enum';
import { todoPriorityEnumMap } from '../utils/todo-priority-enum-map';

@Pipe({
  name: 'todoPriority',
  standalone: true
})
export class TodoPriorityPipe implements PipeTransform {

  transform(value: number): string {
    return todoPriorityEnumMap[value as TodoPriorityEnum];
  }

}
