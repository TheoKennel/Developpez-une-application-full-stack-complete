import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginRequest} from "../../interfaces/loginRequest.interface";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {UserInformation} from "../../interfaces/userInformation.interface";

/**
 * Composant pour la page de connexion de l'application.
 * Permet aux utilisateurs de se connecter en utilisant leur email et mot de passe.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public errorMessage: string | null = null;
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
  });

  public fields = [
    {name: 'email', label: "E-mail ou nom d'utilisateur", type: 'email', placeholder: ''},
    {name: 'password', label: 'Mot de passe', type: 'password', placeholder: ''}
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
  }

  /**
   * Soumet le formulaire de connexion et traite la réponse.
   */
  public submit() {
    const loginRequest = this.form.value as LoginRequest;
    this.authService.login(loginRequest).subscribe({
      next: (userInformation) => {
        this.setLocalStorage(userInformation);
        this.router.navigate(['/article']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
      }
    });
  }

  /**
   * Navigation pour retourner à la page précédente.
   */
  public back() {
    window.history.back();
  }

  /**
   * Stocke les informations de l'utilisateur dans le stockage local après une connexion réussie.
   * @param userInformation Informations de l'utilisateur à stocker.
   */
  private setLocalStorage(userInformation: UserInformation) {
    this.localStorage.setItem("id", userInformation.id.toString());
    this.localStorage.setItem("pictureUrl", userInformation.picture);
    this.localStorage.setItem("isLogged", "true");
    this.localStorage.setItem("userName", userInformation.userName);
    this.localStorage.setArray("subscriptions", userInformation.subscriptions);
  }
}
