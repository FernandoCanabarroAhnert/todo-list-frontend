import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideMenuComponent } from './aside-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, provideRouter, Router, withEnabledBlockingInitialNavigation, withNavigationErrorHandler } from '@angular/router';
import { of } from 'rxjs';

describe('AsideMenuComponent', () => {
  let component: AsideMenuComponent;
  let fixture: ComponentFixture<AsideMenuComponent>;

  const dialogRefMock = {
    afterClosed: jest.fn()
  }
  const matDialogMock = {
    open: jest.fn()
  }
  const authServiceMock = {
    logout: jest.fn()
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [AsideMenuComponent],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: AuthService, useValue: authServiceMock },
        provideRouter(
          [],
          withEnabledBlockingInitialNavigation(),
          withNavigationErrorHandler(() => {})
        ),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onCloseMenuButtonClickEmitter when onCloseMenu is called', () => {
    const spy = jest.spyOn(component.onCloseMenuButtonClickEmitter, 'emit');
    component.onCloseMenu();
    expect(spy).toHaveBeenCalled();
  });

  describe('onLogout', () => {
    it('should navigate to login page and call logout method from authService', () => {
      dialogRefMock.afterClosed.mockReturnValue(of(true));
      matDialogMock.open.mockReturnValue(dialogRefMock);
      component.onLogout();
      expect(authServiceMock.logout).toHaveBeenCalled();
    });
    it('should do nothing when when logout is canceled', () => {
      dialogRefMock.afterClosed.mockReturnValue(of(false));
      matDialogMock.open.mockReturnValue(dialogRefMock);
      component.onLogout();
      expect(authServiceMock.logout).not.toHaveBeenCalled();
    });
  })

});
