import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MobileMenuService } from '../../services/mobile-menu.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  date!: Date;

  private readonly _mobileMenuService = inject(MobileMenuService)

  ngOnInit(): void {
      this.date = new Date();
  }

  onMenuClick() {
    this._mobileMenuService.openMenu();
  }

}
