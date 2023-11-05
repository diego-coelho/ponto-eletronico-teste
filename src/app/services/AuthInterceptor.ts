import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, of, retry, throwError } from 'rxjs';
import { LoadingService } from './sharedServices/loading.service';
import { AccountsService } from './accounts/accounts.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private accountService: AccountsService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('id_token');

    this.loadingService.open();
    let handled: boolean = false;

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken),
      });

      return next.handle(cloned).pipe(
        catchError((returnedError) => {
          if (returnedError instanceof HttpErrorResponse) {
            handled = this.handleServerSideError(returnedError);
          }

          return of(returnedError);
        }),
        finalize(() => {
          this.loadingService.close();
        })
      );
    } else {
      return next.handle(req).pipe(
        catchError((returnedError) => {
          console.error(returnedError);
          return of(returnedError);
        }),
        finalize(() => {
          this.loadingService.close();
        })
      );
    }
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    let handled: boolean = false;

    switch (error.status) {
      case 401:
        this.accountService.logout();
        handled = true;
        break;
      case 403:
        this.accountService.logout();
        handled = true;
        break;
    }

    return handled;
  }
}
