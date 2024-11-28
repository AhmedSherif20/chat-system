import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../interfaces/User';
import { SweetAlertService } from '../../services/sweet alert/sweet-alert.service';
import { UserStateService } from '../../services/user state/user-state.service';

/**
 * The AuthGuard is used to prevent access to certain routes by users who are not authenticated.
 * It checks the user's login status by subscribing to the `userData$` observable from the `UserStateService`.
 * If the user is authenticated, they are allowed to proceed; otherwise, they are redirected to the login page.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const userStateService: UserStateService = inject(UserStateService); // Inject UserStateService to get user state
  const router: Router = inject(Router); // Inject Router to navigate
  const sweetAlert: SweetAlertService = inject(SweetAlertService); // Inject SweetAlertService to show alerts

  return userStateService.userData$.pipe(
    map((user: User | null) => {
      if (user && user.token && new Date(user.validTO) > new Date()) {
        // Allow access if the user is authenticated and token is valid
        return true;
      } else {
        // Show an alert and redirect to the login page if the user is not authenticated
        sweetAlert.showToast({
          icon: 'warning',
          title: 'Login Required',
        });
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }, // Store the original URL to redirect back after login
        });
        return false; // Deny access if not authenticated
      }
    })
  );
};
