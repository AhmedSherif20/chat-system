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
  private router: Router = inject(Router);
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);
  private userStateService: UserStateService = inject(UserStateService);
  private authApiService: AuthApiService = inject(AuthApiService);

  passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
  invalidPasswordPatternMsg: string = `Password must contain at least one uppercase letter (A-Z) and one special character (e.g., !, @, #, etc.).`;

  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordRegex),
    ]),
  });

  errorMsgs: string[] = [];

  loading: boolean = false;

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.sweetAlertService.showToast({
        icon: 'warning',
        title: 'all inputs are required',
      });
      return;
    }
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

    this.loading = true;

    const registerResponse = await firstValueFrom(
      this.authApiService.register(apiRequestBody)
    );

    const { isSuccess, token, errors } = registerResponse;

    if (!isSuccess || !token.length) {
      if (errors && errors.length) {
        this.errorMsgs = errors.map((error) => error.description);
      }
      this.loading = false;

      return;
    }

    this.userStateService.setUser(registerResponse, false);
    this.loading = false;
    this.router.navigate(['/']);
    this.sweetAlertService.showToast({
      icon: 'success',
      title: 'Registered Successfully',
    });
  }
}
//
