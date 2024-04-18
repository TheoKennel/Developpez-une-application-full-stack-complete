import {Component} from '@angular/core';
import {Router} from "@angular/router";

/**
 * Composant pour la page d'accueil de l'application.
 * Fournit la navigation vers les pages de connexion et d'inscription.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private route: Router
  ) {
  }

  /**
   * Navigue vers la page de connexion.
   */
  public navigateToLogin() {
    this.route.navigate(['/auth/login'])
  }

  /**
   * Navigue vers la page d'inscription.
   */
  public navigateToRegister() {
    this.route.navigate(['/auth/register'])
  }
}
