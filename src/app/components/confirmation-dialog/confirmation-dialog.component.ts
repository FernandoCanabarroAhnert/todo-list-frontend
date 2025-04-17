import { Component, inject } from '@angular/core';

import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { IConfirmationData } from '../../interfaces/confirmation-data.interface';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {

  readonly data: IConfirmationData = inject(MAT_DIALOG_DATA);

}
