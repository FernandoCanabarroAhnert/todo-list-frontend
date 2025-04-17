import { Pipe, PipeTransform } from '@angular/core';
import { todoStatusEnumMap } from '../utils/todo-status-enum-map';
import { TodoStatusEnum } from '../enums/todo-status.enum';

@Pipe({
  name: 'todoStatus',
  standalone: true
})
export class TodoStatusPipe implements PipeTransform {

  transform(value: number): string {
    return todoStatusEnumMap[value as TodoStatusEnum];
  }

}
