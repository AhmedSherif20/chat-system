import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { InputComponent } from '../../ui/shared/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    InputComponent,
    ReactiveFormsModule,
  ],
})
export class AuthModule {}
