import { Component } from '@angular/core';
import {LocalStorageService} from "./storage/local-storage.service";
import {NavigationService} from "./common/navigation.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';

  constructor(
    private localStorage: LocalStorageService,
    private navigationService: NavigationService
  ) {}

  public $isLoggedIn(): Observable<boolean> {
    return of(this.localStorage.getItem('isLogged') === 'true');
  }

  public goToLogin(): void {
    this.navigationService.navigateToHome();
  }

  public goToArticle() {
    this.navigationService.navigateToArticle();
  }
}

