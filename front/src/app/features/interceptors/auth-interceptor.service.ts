import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Router } from '@angular/router';
import {BehaviorSubject, finalize, Observable, throwError} from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import {LocalStorageService} from "../../storage/local-storage.service";
import {NavigationService} from "../../common/navigation.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router,
              private http: HttpClient,
              private localStorage : LocalStorageService,
              private navigationService: NavigationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, req, next))
    );
  }

  private handleError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (error.status === 401) {
      return this.handle401Error(req, next);
    }
    const errMsg = error.error && error.error.message ? error.error.message : error.message;
    return throwError(() => new Error(`Error occurred : ${errMsg}`));
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(req);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.localStorage.clear();
          this.navigationService.navigateToHome();
          return throwError(() => new Error('Failed to refresh token'));
        }),
        finalize(() => this.isRefreshing = false)
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(req);
        }));
    }
  }

  private refreshToken(): Observable<any> {
    console.log("Refresh token")
    return this.http.post<any>(`http://localhost:3001/api/auth/refresh-token`, {}, {withCredentials: true})
  }
}
