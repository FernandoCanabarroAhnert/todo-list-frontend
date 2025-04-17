import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'todoCardStatusIconColor',
  standalone: true
})
export class TodoCardStatusIconColorPipe implements PipeTransform {

  transform(value: number): string {
    const statusColorMap: { [key: number]: string } = {
      1: 'todo-card__status-icon--completed',
      2: 'todo-card__status-icon--in-progress',
      3: 'todo-card__status-icon--not-started'
    }
    return statusColorMap[value];
  }

}
