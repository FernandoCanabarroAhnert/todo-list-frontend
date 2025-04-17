import { Component, inject, Input } from '@angular/core';
import { TodoService } from '../../../../services/todo.service';
import { ITodoResponse } from '../../../../interfaces/todo-response.interface';
import { TodoPriorityPipe } from '../../../../pipes/todo-priority.pipe';
import { TodoStatusPipe } from '../../../../pipes/todo-status.pipe';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { TodoPriorityColorPipe } from '../../../../pipes/todo-priority-color.pipe';
import { TodoStatusColorPipe } from '../../../../pipes/todo-status-color.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-todo-details',
  standalone: true,
  imports: [TodoPriorityPipe, TodoStatusPipe, CommonModule, ButtonComponent, MatIconModule, TodoPriorityColorPipe, TodoStatusColorPipe],
  templateUrl: './todo-details.component.html',
  styleUrl: './todo-details.component.scss'
})
export class TodoDetailsComponent {

  _todoId!: string;

  @Input()
  set todoId(value: string) {
    this._todoService.findTodoById(value).subscribe(response => {
      this.todo = response;
      this._todoId = value;
    })
  }

  todo: ITodoResponse = {} as ITodoResponse;

  private readonly _todoService = inject(TodoService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _router = inject(Router);

  private readonly _snackBarService = inject(SnackBarService);

  onUpdateButtonClick(todoId: string) {
    const dialogRef = this._matDialog.open(TodoFormComponent,
      { 
        data: { todoId },
        width: '1000px'
      },
    );
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._todoService.updateTodo(todoId, result).subscribe({
        next: () => {
          this._router.navigate(['dashboard'])
          this._snackBarService.openSnackBar('Tarefa atualizada com sucesso!', 'Fechar');
        }
      })
    })
  }

  onDeleteButtonClick(todoId: string) {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, { 
      data: {
        title: 'Deletar tarefa',
        text: 'Você tem certeza que deseja deletar a tarefa?',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._todoService.deleteTodo(todoId).subscribe({
        next: () => {
          this._router.navigate(['dashboard']);
          this._snackBarService.openSnackBar('Tarefa deletada com sucesso!', 'Fechar');
        }
      });
    })
  }

}

