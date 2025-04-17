import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap: Map<string,boolean> = new Map<string,boolean>();
  readonly loading$ = this._loadingSubject.asObservable();

  setLoading(url: string, loading: boolean) {
    if (loading) {
      this.loadingMap.set(url, loading);
      this.showLoading();
    }
    if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.hideLoading();
    }
  }

  private showLoading() {
    this._loadingSubject.next(true);
  }

  private hideLoading() {
    this._loadingSubject.next(false);
  }

}
