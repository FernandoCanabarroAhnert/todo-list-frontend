import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, RouterLinkActive],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent {

  @Input()
  isMenuOpen: boolean = false;
  @Output()
  onCloseMenuButtonClickEmitter = new EventEmitter<void>();

  private readonly _matDialog = inject(MatDialog);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  onCloseMenu() {
    this.onCloseMenuButtonClickEmitter.emit();
  }

  onLogout() {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Sair da Conta',
        text: 'Você tem certeza que deseja sair da conta?'
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._router.navigate(['login']);
      this._authService.logout();
    })
  }

}
