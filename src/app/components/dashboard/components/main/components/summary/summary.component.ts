import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  @Input({ required: true })
  summary = {
    completedTodosPercentage: 0,
    inProgressTodosPercentage: 0,
    notStartedTodosPercentage: 0,
  }

}
