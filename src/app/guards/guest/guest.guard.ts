import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../interfaces/User';
import { UserStateService } from '../../services/user state/user-state.service';
import { SweetAlertService } from '../../services/sweet alert/sweet-alert.service';

/**
 * The GuestGuard is used to prevent access to the login and register routes
 * for users who are already authenticated. If the user is logged in, they are redirected to the home page.
 * If the user is not logged in, they are allowed to proceed to the login or register page.
 */
export const GuestGuard: CanActivateFn = (route, state) => {
  const userStateService: UserStateService = inject(UserStateService); // Inject UserStateService to get user state
  const router = inject(Router); // Inject Router to navigate
  const sweetAlert: SweetAlertService = inject(SweetAlertService); // Inject SweetAlertService to show alerts

  return userStateService.userData$.pipe(
    map((user: User | null) => {
      if (user && user.token && new Date(user.validTO) > new Date()) {
        // Redirect to the home page (or any other page) if the user is already logged in
        sweetAlert.showToast({
          icon: 'warning',
          title: 'you already logged in',
        });
        router.navigate(['/']); // Or specify a different route like '/dashboard'
        return false; // Deny access to login/register page if user is already logged in
      }
      return true; // Allow access to login/register page if the user is not logged in
    })
  );
};
