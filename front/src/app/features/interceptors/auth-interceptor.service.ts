import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, finalize, Observable, throwError} from 'rxjs';
import {catchError, switchMap, filter, take} from 'rxjs/operators';
import {LocalStorageService} from "../../storage/local-storage.service";

/**
 * Intercepteur HTTP pour gérer l'authentification et la gestion des jetons de rafraîchissement.
 * Intercepte les requêtes pour ajouter des tokens ou gérer les erreurs d'authentification.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router) {
  }

  /**
   * Intercepte les requêtes HTTP pour y ajouter un traitement spécifique lié à l'authentification.
   * @param req La requête HTTP à intercepter.
   * @param next Le gestionnaire de requête suivant dans la chaîne d'intercepteurs.
   * @returns Observable de la réponse HTTP ou une erreur.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, req, next))
    );
  }

  /**
   * Gère les erreurs HTTP pour rediriger ou rafraîchir les jetons selon le cas.
   * @param error L'erreur HTTP rencontrée.
   * @param req La requête HTTP initiale.
   * @param next Le gestionnaire de requête suivant dans la chaîne.
   * @returns Observable de la nouvelle tentative de requête ou erreur.
   */
  private handleError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (error.status === 401) {
      return this.handle401Error(req, next);
    }
    const errMsg = error.error && error.error.message ? error.error.message : error.message;
    return throwError(() => new Error(`Error occurred : ${errMsg}`));
  }

  /**
   * Traite spécifiquement les erreurs 401 en tentant un rafraîchissement du token.
   * @param req La requête HTTP initiale.
   * @param next Le gestionnaire de requête suivant.
   * @returns Observable de la requête reprise après rafraîchissement du token.
   */
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
          this.navigateToHome();
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

  /**
   * Effectue une requête pour rafraîchir le token d'authentification.
   * @returns Observable portant le nouveau token.
   */
  private refreshToken(): Observable<any> {
    return this.http.post<any>(`http://localhost:3001/api/auth/refresh-token`, {}, {withCredentials: true});
  }

  /**
   * Navigue vers la page d'accueil.
   */
  private navigateToHome() {
    this.router.navigate(['']);
  }
}

