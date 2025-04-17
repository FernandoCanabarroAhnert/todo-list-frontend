import { Pipe, PipeTransform } from '@angular/core';
import { TodoPriorityEnum } from '../enums/todo-priority.enum';

@Pipe({
  name: 'todoPriorityColor',
  standalone: true
})
export class TodoPriorityColorPipe implements PipeTransform {

  transform(value: number): string {
    const todoPriorityEnumMap: { [key in TodoPriorityEnum]: string } = {
        [TodoPriorityEnum.EXTREME]: 'color-extreme',
        [TodoPriorityEnum.MODERATE]: 'color-moderate',
        [TodoPriorityEnum.LOW]: 'color-low'
    }
    return todoPriorityEnumMap[value as TodoPriorityEnum];
  }

}
