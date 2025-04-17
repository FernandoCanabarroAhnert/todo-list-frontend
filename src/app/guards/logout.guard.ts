import { ActivatedRouteSnapshot, CanDeactivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const logoutGuard = (): CanDeactivateFn<DashboardComponent> => {
  return (component: DashboardComponent, 
    currentRoute: ActivatedRouteSnapshot, 
    currentState: RouterStateSnapshot, 
    nextState: RouterStateSnapshot): MaybeAsync<GuardResult> => {
      const authService = inject(AuthService);
      if (nextState.url === '/login') {
        authService.logout();
        return true;
      }
      return true;
    }
}
