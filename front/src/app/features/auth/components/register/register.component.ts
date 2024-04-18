import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {HttpErrorResponse} from "@angular/common/http";

/**
 * Composant pour la page d'inscription de l'application.
 * Permet aux nouveaux utilisateurs de s'inscrire en fournissant un nom d'utilisateur, un email et un mot de passe.
 */
@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent {

  public errorMessage: string | null = null;
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.min(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
  });

  public fields = [
    {name: 'username', label: "Nom d'utilisateur", type: 'text', placeholder: ' '},
    {name: 'email', label: 'Adresse e-mail', type: 'email', placeholder: ''},
    {name: 'password', label: 'Mot de passe', type: 'password', placeholder: ''}
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  /**
   * Soumet le formulaire d'inscription et traite la réponse.
   */
  public submit() {
    const registerRequest = this.form.value as RegisterRequest;
    this.authService.register(registerRequest).subscribe({
      next: (_) => this.router.navigate(['/auth/login']),
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
}
