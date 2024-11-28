import { inject, Injectable } from '@angular/core';
import { Vars } from '../../../../enums/vars';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { LoginResponseBody } from '../../interface/login/LoginResponseBody';
import { RegisterResponseBody } from '../../interface/register/RegisterResponseBody';
import { GetAllUsersResponseBody } from '../../interface/users/GetAllUsersResponseBody';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private baseUrl: string = Vars.baseUrl;
  private http: HttpClient = inject(HttpClient);
  private path: string = '/api/Auth';

  login(body: FormData): Observable<LoginResponseBody> {
    return this.http
      .post<LoginResponseBody>(`${this.baseUrl}${this.path}/login`, body)
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error.error);
          return of({
            isSuccess: false,
          } as LoginResponseBody);
        })
      );
  }

  register(body: FormData): Observable<RegisterResponseBody> {
    return this.http
      .post<RegisterResponseBody>(`${this.baseUrl}${this.path}/register`, body)
      .pipe(
        catchError((error) => {
          return of({
            ...error.error,
          } as RegisterResponseBody);
        })
      );
  }

  getAllUsers(): Observable<GetAllUsersResponseBody> {
    return this.http
      .get<GetAllUsersResponseBody>(`${this.baseUrl}${this.path}/Users`)
      .pipe(
        catchError((error) => {
          return of({
            isSuccess: error.isSuccess ?? false,
            data: [],
          } as GetAllUsersResponseBody);
        })
      );
  }
}
