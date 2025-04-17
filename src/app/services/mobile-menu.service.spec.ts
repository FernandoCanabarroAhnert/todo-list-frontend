import { TestBed } from '@angular/core/testing';

import { MobileMenuService } from './mobile-menu.service';

describe('MobileMenuService', () => {
  let mobileMenuService: MobileMenuService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({});
    mobileMenuService = TestBed.inject(MobileMenuService);
  });

  it('should be created', () => {
    expect(mobileMenuService).toBeTruthy();
  });

  describe('isMenuOpen$', () => {
    it('_isMenuOpenSubject should emit true value when open menu is called', () => {
      mobileMenuService.openMenu();
      mobileMenuService.isMenuOpen$.subscribe(value => {
        expect(value).toBe(true);
      })
    });
    it('_isMenuOpenSubject should emit false value when close menu is called', () => {
      mobileMenuService.closeMenu();
      mobileMenuService.isMenuOpen$.subscribe(value => {
        expect(value).toBe(false);
      })
    });
  })
});
