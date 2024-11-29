import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../../../services/sweet alert/sweet-alert.service';
import { AuthApiService } from '../../services/Auth API/auth-api.service';
import { firstValueFrom } from 'rxjs';
import { LoginRequestBody } from '../../interface/login/LoginRequestBody';
import { UserStateService } from '../../../../services/user state/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  /**
   * Retrieves query parameters from the current route, especially for `returnUrl`.
   */
  private route: ActivatedRoute = inject(ActivatedRoute);

  /**
   * Allows navigation between routes.
   */
  private router: Router = inject(Router);

  /**
   * Service for displaying SweetAlert popups and toast notifications.
   */
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);

  /**
   * Service for managing the user state, including storing user details in memory or local storage.
   */
  private userStateService: UserStateService = inject(UserStateService);

  /**
   * Service for handling API requests related to authentication.
   */
  private authApiService: AuthApiService = inject(AuthApiService);

  /**
   * Stores the return URL to redirect the user after successful login.
   * Default is `'/'` if no query parameter is provided.
   */
  returnUrl: any;

  /**
   * Reactive form group for login input fields.
   * Contains:
   * - `userName`: A required field for the user's username.
   * - `password`: A required field for the user's password.
   */
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  /**
   * Indicates whether the login process is currently loading.
   */
  loading: boolean = false;

  /**
   * Form control for the "Remember Me" checkbox.
   * Default is unchecked (`false`).
   */
  rememberMeControl = new FormControl(false);

  /**
   * Initializes the component by retrieving the return URL from route parameters.
   */
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Handles the login process, including:
   * - Validating form inputs.
   * - Sending login data to the server.
   * - Storing the user's session if successful.
   * - Redirecting to the `returnUrl`.
   */
  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      // Display a warning toast if the form is invalid.
      this.sweetAlertService.showToast({
        icon: 'warning',
        title: 'Username and Password are required',
      });
      return;
    }

    // Prepare the login data and API request body.
    const loginData: LoginRequestBody = this.loginForm.value;
    const apiRequestBody: FormData = new FormData();
    for (const key in loginData) {
      if (loginData.hasOwnProperty(key)) {
        apiRequestBody.append(
          key,
          loginData[key as keyof typeof loginData] as string
        );
      }
    }

    // Indicate that the login process is loading.
    this.loading = true;

    // Send the login request to the API and wait for a response.
    const loginResponse = await firstValueFrom(
      this.authApiService.login(apiRequestBody)
    );

    const { isSuccess, token } = loginResponse;

    if (!isSuccess || !token.length) {
      // Stop loading and display an error alert if login fails.
      this.loading = false;
      this.sweetAlertService.showAlert({
        icon: 'info',
        title: 'Username or Password Incorrect',
        text: 'please try carefully',
      });
      return;
    }

    // Store user session details, considering the "Remember Me" option.
    const rememberMe = this.rememberMeControl.value ?? false;
    this.userStateService.setUser(loginResponse, rememberMe);

    // Stop loading and display a success toast.
    this.loading = false;
    this.sweetAlertService.showToast({
      icon: 'success',
      title: 'Logged Successfully',
    });

    // Navigate to the return URL.
    this.router.navigate([this.returnUrl]);
  }
}
