import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { delay, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MobileMenuService } from './services/mobile-menu.service';
import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoadingComponent, CommonModule, AsideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  showLoading: boolean = false;
  showMobileMenu: boolean = false;

  private readonly _loadingService = inject(LoadingService);
  private readonly _mobileMenuService = inject(MobileMenuService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.listenToLoading();
    this.observeMenuState();
    this.listenToMobileNavigationEnd(); 
  }

  listenToLoading() {
    this._loadingService.loading$
      .pipe(
        delay(0)
      )
      .subscribe(value => this.showLoading = value);
  }

  observeMenuState() {
    this._mobileMenuService.isMenuOpen$.subscribe(value => this.showMobileMenu = value);
  }

  listenToMobileNavigationEnd() {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.showMobileMenu) {
          this._mobileMenuService.closeMenu();
        }
      })
  }

  onCloseMenuButtonClick() {
    this._mobileMenuService.closeMenu();
  }

}
