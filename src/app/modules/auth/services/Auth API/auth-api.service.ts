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
  /**
   * Base URL for the API, loaded from environment variables or constants.
   */
  private baseUrl: string = Vars.baseUrl;

  /**
   * Injected `HttpClient` for making HTTP requests.
   */
  private http: HttpClient = inject(HttpClient);

  /**
   * API path for authentication-related operations.
   */
  private path: string = '/api/Auth';

  /**
   * Sends a login request to the API.
   *
   * @param body - A `FormData` object containing login credentials (e.g., username and password).
   * @returns An `Observable` that emits the `LoginResponseBody` containing the response data.
   *          In case of an error, emits a fallback response with `isSuccess: false`.
   */
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

  /**
   * Sends a registration request to the API.
   *
   * @param body - A `FormData` object containing registration details (e.g., username, email, and password).
   * @returns An `Observable` that emits the `RegisterResponseBody` containing the response data.
   *          In case of an error, emits the error response received from the server.
   */
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

  /**
   * Fetches a list of all users from the API.
   *
   * @returns An `Observable` that emits the `GetAllUsersResponseBody` containing user data.
   *          In case of an error, emits a fallback response with `isSuccess: false` and an empty data array.
   */
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
