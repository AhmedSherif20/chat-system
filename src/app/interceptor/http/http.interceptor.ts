import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  /**
   * Intercepts HTTP requests and modifies their responses or handles errors.
   *
   * - If the response body is an array, it wraps it in an object with the key `data`.
   * - Adds a boolean flag `isSuccess` to indicate the success or failure of the HTTP request.
   *
   * @param req - The outgoing `HttpRequest` instance.
   * @param next - The `HttpHandler` that forwards the request to the server.
   * @returns An `Observable` of the HTTP event stream with modified responses or error handling.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let body = event.body;

          // If the response body is an array, wrap it in a `data` object and add `isSuccess`
          if (Array.isArray(body)) {
            body = { data: body, isSuccess: true };
          } else {
            body = { ...body, isSuccess: true }; // For non-array responses
          }

          return event.clone({ body });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let modifiedError: any = error.error;

        // If the error body is an array, wrap it in a `data` object and add `isSuccess`
        if (Array.isArray(modifiedError)) {
          modifiedError = { errors: modifiedError, isSuccess: false };
        } else if (modifiedError) {
          modifiedError.isSuccess = false; // For non-array error bodies
        }

        // Create a new HttpErrorResponse with the modified error body
        const newError = new HttpErrorResponse({
          error: modifiedError,
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url ?? undefined,
        });

        return throwError(() => newError);
      })
    );
  }
}
