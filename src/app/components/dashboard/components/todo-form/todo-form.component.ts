import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../../../services/todo.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../button/button.component';

import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { IFileHandle } from '../../../../interfaces/file-handle.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent implements OnInit {

  todoForm!: FormGroup;

  @Input()
  isCreateTodoForm: boolean = false;
  todoId: string | null = null;

  imageFile: IFileHandle | null = null;
  requiredImageError: boolean = false;

  private readonly _fb = inject(FormBuilder);
  private readonly _todoService = inject(TodoService);

  private readonly _dialogRef = inject(MatDialogRef<TodoFormComponent>, { optional: true });
  private readonly _data = inject(MAT_DIALOG_DATA, { optional: true });

  private readonly _domSanitizer = inject(DomSanitizer);

  private readonly _snackBarService = inject(SnackBarService);

  ngOnInit(): void {
    if (this.isCreateTodoForm) {
      this.instantiateForm();
    }
    else {
      this.todoId = this._data.todoId;
      this.instantiateFormAndFulfillData();
    }
  }

  get title(): FormControl {
    return this.todoForm.get('title') as FormControl;
  }
  get description(): FormControl {
    return this.todoForm.get('description') as FormControl;
  }
  get priority(): FormControl {
    return this.todoForm.get('priority') as FormControl;
  }
  get expiresAt(): FormControl {
    return this.todoForm.get('expiresAt') as FormControl;
  }

  instantiateForm() {
    this.todoForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: [null, [Validators.required]],
      expiresAt: [null, [Validators.required]]
    })
  }

  instantiateFormAndFulfillData() {
    this._todoService.findTodoById(this.todoId!)
      .subscribe({
        next: (response) => {
          this.todoForm = this._fb.group({
            title: [response.title, [Validators.required]],
            description: [response.description, [Validators.required]],
            priority: [response.priority, [Validators.required]],
            status: [response.status, [Validators.required]],
            expiresAt: [response.expiresAt, [Validators.required]]
          })
          this.imageFile = {
            file: null,
            url: response.image
          }
        }
      })
  }

  watchImageInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.requiredImageError = true
      return;
    }
    this.imageFile = {
      file: input.files![0] as File,
      url: this._domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(input.files![0]))
    }
    this.requiredImageError = false;
  }

  deleteImage() {
    this.imageFile = null;
    this.requiredImageError = true;
  }

  createTodo() {
    if (this.todoForm.invalid || !this.imageFile) {
      this.todoForm.markAllAsTouched();
      if (!this.imageFile) {
        this.requiredImageError = true;
      }
      return;
    }
    this._todoService.createTodo(this.prepareFormData()).subscribe({
      next: () => {
        this.todoForm.reset();
        this.todoForm.markAsPristine();
        this.imageFile = null;
        this._snackBarService.openSnackBar('Tarefa criada com sucesso!', 'Fechar');
    }})
  }

  onUpdateTodoClick() {
    if (this.todoForm.invalid || !this.imageFile) {
      this.todoForm.markAllAsTouched();
      if (!this.imageFile) {
        this.requiredImageError = true;
      }
      return;
    }
    this._dialogRef?.close(this.prepareFormData());
  }

  prepareFormData(): FormData {
    const formData: FormData = new FormData();
    formData.append(
      'request',
       new Blob([JSON.stringify(this.todoForm.value)], { type: 'application/json' })
    );
    if (this.imageFile?.file) {
      formData.append('image', this.imageFile.file);
    }
    return formData;
  }

}
