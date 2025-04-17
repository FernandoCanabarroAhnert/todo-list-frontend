import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { UpdatePasswordFormComponent } from './components/update-password-form/update-password-form.component';
import { UpdateUserInfosFormComponent } from './components/update-user-infos-form/update-user-infos-form.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatTabsModule, CommonModule, UpdatePasswordFormComponent, UpdateUserInfosFormComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
