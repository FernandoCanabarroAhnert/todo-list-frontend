import { Pipe, PipeTransform } from '@angular/core';
import { TodoStatusEnum } from '../enums/todo-status.enum';

@Pipe({
  name: 'todoStatusColor',
  standalone: true
})
export class TodoStatusColorPipe implements PipeTransform {

  transform(value: number): string {
    const todoStatusEnumMap: { [key in TodoStatusEnum]: string } = {
        [TodoStatusEnum.COMPLETED]: 'color-completed',
        [TodoStatusEnum.IN_PROGRESS]: 'color-in-progress',
        [TodoStatusEnum.NOT_STARTED]: 'color-not-started',
    }
    return todoStatusEnumMap[value as TodoStatusEnum];
  }

}
