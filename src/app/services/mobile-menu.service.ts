import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileMenuService {

  private readonly _isMenuOpenSubject = new BehaviorSubject<boolean>(false);
  
  isMenuOpen$ = this._isMenuOpenSubject.asObservable();

  openMenu() {
    this._isMenuOpenSubject.next(true);
  }

  closeMenu() {
    this._isMenuOpenSubject.next(false);
  }
  
}
