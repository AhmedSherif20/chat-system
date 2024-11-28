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
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);
  private userStateService: UserStateService = inject(UserStateService);
  private authApiService: AuthApiService = inject(AuthApiService);

  returnUrl: any;

  loginForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
  loading: boolean = false;

  rememberMeControl = new FormControl(false);

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.sweetAlertService.showToast({
        icon: 'warning',
        title: 'Username and Password are required',
      });
      return;
    }
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

    this.loading = true;

    const loginResponse = await firstValueFrom(
      this.authApiService.login(apiRequestBody)
    );

    const { isSuccess, token } = loginResponse;

    if (!isSuccess || !token.length) {
      this.loading = false;

      this.sweetAlertService.showAlert({
        icon: 'info',
        title: 'Username or Password Incorrect',
        text: 'please try carefully',
      });
      return;
    }
    const rememberMe = this.rememberMeControl.value ?? false;

    this.userStateService.setUser(loginResponse, rememberMe);
    this.loading = false;
    this.sweetAlertService.showToast({
      icon: 'success',
      title: 'Logged Successfully',
    });
    this.router.navigate([this.returnUrl]);
  }
}
