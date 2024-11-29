import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../../../services/sweet alert/sweet-alert.service';
import { UserStateService } from '../../../../services/user state/user-state.service';
import { AuthApiService } from '../../services/Auth API/auth-api.service';
import { firstValueFrom } from 'rxjs';
import { RegisterRequestBody } from '../../interface/register/RegisterRequestBody';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  /**
   * Handles navigation between routes.
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
   * Regular expression pattern for password validation.
   * Ensures that the password contains:
   * - At least one uppercase letter (A-Z)
   * - At least one special character (e.g., `!`, `@`, `#`, etc.)
   * - A minimum length of 6 characters.
   */
  passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  /**
   * Error message for invalid password patterns.
   */
  invalidPasswordPatternMsg: string = `Password must contain at least one uppercase letter (A-Z) and one special character (e.g., !, @, #, etc.).`;

  /**
   * Reactive form group for registration input fields.
   * Contains:
   * - `userName`: A required field for the user's username.
   * - `email`: A required field for the user's email in a valid format.
   * - `password`: A required field for the user's password that adheres to the specified pattern and minimum length.
   */
  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordRegex),
    ]),
  });

  /**
   * Array of error messages received from the server during registration.
   */
  errorMsgs: string[] = [];

  /**
   * Indicates whether the registration process is currently loading.
   */
  loading: boolean = false;

  /**
   * Handles the registration process, including:
   * - Validating form inputs.
   * - Sending registration data to the server.
   * - Handling server responses, including errors.
   * - Storing the user's session if successful.
   * - Navigating to the home page after successful registration.
   */
  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      // Display a warning toast if the form is invalid.
      this.sweetAlertService.showToast({
        icon: 'warning',
        title: 'All inputs are required',
      });
      return;
    }

    // Prepare the registration data and API request body.
    const registerData: RegisterRequestBody = this.registerForm.value;
    const apiRequestBody: FormData = new FormData();

    for (const key in registerData) {
      if (registerData.hasOwnProperty(key)) {
        apiRequestBody.append(
          key,
          registerData[key as keyof typeof registerData] as string
        );
      }
    }

    // Indicate that the registration process is loading.
    this.loading = true;

    // Send the registration request to the API and wait for a response.
    const registerResponse = await firstValueFrom(
      this.authApiService.register(apiRequestBody)
    );

    const { isSuccess, token, errors } = registerResponse;

    if (!isSuccess || !token.length) {
      // Handle registration errors by displaying them in the UI.
      if (errors && errors.length) {
        this.errorMsgs = errors.map((error) => error.description);
      }
      this.loading = false;
      return;
    }

    // Store user session details.
    this.userStateService.setUser(registerResponse, false);

    // Stop loading and navigate to the home page.
    this.loading = false;
    this.router.navigate(['/']);

    // Display a success toast.
    this.sweetAlertService.showToast({
      icon: 'success',
      title: 'Registered Successfully',
    });
  }
}
