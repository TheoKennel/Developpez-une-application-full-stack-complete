import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserApiService} from "../../features/articles/components/services/user-api.service";
import {LocalStorageService} from "../../storage/local-storage.service";
import {User} from "../../features/articles/components/interface/user.interface";
import {Observable, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "../../features/articles/components/interface/subscription.interface";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-me', templateUrl: './me.component.html', styleUrls: ['./me.component.scss']
})
/**
 * Composant pour gérer le profil utilisateur.
 * Implémente les hooks de cycle de vie OnInit et OnDestroy.
 */
export class MeComponent implements OnInit, OnDestroy {

  public user$: Observable<User> | undefined;
  public user: User | undefined;
  public subscriptions: Observable<Subscription[]> | undefined;
  public form: FormGroup | undefined;
  public errorMessage: string | null = null;

  private userId: string | null = null;
  private ngUnsubscribe: any = new Subject();

  constructor(private userService: UserApiService,
              private localStorage: LocalStorageService,
              private fb: FormBuilder,
              private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.user$ = this.fetchUser();
    this.subscribeToUser();
    this.subscriptions = this.localStorage.subscriptionsSubject
  };

  /** Nettoie les ressources */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  /** Soumet les données utilisateur */
  public submit() {
    const user = this.form?.value as User;
    this.userService.updateUser(user, this.userId!!.toString()).subscribe({
      next: (user) => {
        this.errorMessage = ""
        this.setLocalStorage(user);
        this.updateSnackBack('User updated !');
      }, error: (error: HttpErrorResponse) => {
        console.log(error.message)
        this.errorMessage = error.message
      }
    })
  }

  /** Déconnecte l'utilisateur */
  public logout() {
    this.localStorage.clear();
    window.location.reload();
  }

  /**
   * Définit les données utilisateur dans le local storage.
   * @param user l'utilisateur
   */
  private setLocalStorage(user: User) {
    this.localStorage.setItem("username", user.username)
    this.localStorage.setItem("email", user.email)
    this.localStorage.setArray("subscriptions", user.subscription)
  }

  /**
   * Récupère les données utilisateur depuis le local storage.
   * @returns Observable émettant les données utilisateur
   */
  private fetchUser() {
    this.userId = this.localStorage.getItem('id');
    return this.userService.getUser(this.userId!!)
  }

  /** Souscrit à l'observable utilisateur */
  private subscribeToUser() {
    this.user$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.user = user
      this.initForm(user)
    });
  }

  /**
   * Initialise le formulaire avec les données utilisateur.
   * @param user Objet utilisateur
   */
  private initForm(user?: User) {
    this.form = this.fb.group({
      username: [
        user ? user.username : '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(40)]
      ],
      email: [
        user ? user.email : '',
        [Validators.required, Validators.email]
      ],
    });
  }

  /**
   * Affiche un message dans la barre de notification.
   * @param message Message à afficher
   */
  private updateSnackBack(message: string) {
    this.matSnackBar.open(message, 'Close', {duration: 3000});
  }
}
