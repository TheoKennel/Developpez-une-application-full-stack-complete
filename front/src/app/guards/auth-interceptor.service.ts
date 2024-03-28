import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, req, next))
    );
  }

  private handleError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (error.status === 401) {
      return this.handle401Error(req, next);
    }
    return of(error);
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
        }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(req);
        }));
    }
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`http://localhost3001/api/auth/refresh-token`, { withCredentials: true }).pipe(
      catchError((error: any) => {
        this.router.navigate(['login']);
        return of(error);
      })
    );
  }
}
