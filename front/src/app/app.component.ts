import { Component } from '@angular/core';
import {LocalStorageService} from "./storage/local-storage.service";
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
  ) {}

  public $isLoggedIn(): Observable<boolean> {
    return of(this.localStorage.getItem('isLogged') === 'true');
  }
}

