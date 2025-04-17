import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let loadingService: LoadingService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({});
    loadingService = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(loadingService).toBeTruthy();
  });

  describe('setLoading', () => {
    it('_loadingSubject should emit true value when loading is true', () => {
      loadingService.setLoading('url', true);
      loadingService.loading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });
    it('_loadingSubject should emit true value when loading map is empty', () => {
      loadingService.setLoading('url', true);
      loadingService.loading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
      loadingService.setLoading('url', false);
      loadingService.loading$.subscribe((loading) => {
        expect(loading).toBe(false);
      });
    });
  })
});
