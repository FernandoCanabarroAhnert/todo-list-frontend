import { TestBed } from '@angular/core/testing';

import { SnackBarService } from './snack-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SnackBarService', () => {
  let service: SnackBarService;
  const matSnackBarMock = {
    open: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ]
    });
    service = TestBed.inject(SnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('openSnackBar', () => {
    const text = 'Test message';
    const action = 'Test action';
    service.openSnackBar(text, action);
    expect(matSnackBarMock.open).toHaveBeenCalledWith(text, action, { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
  })
});
