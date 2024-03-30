import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent{
  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef
    ) {}

  navigateToLogin() {
    this.route.navigate(['/auth/login'])
  }

  navigateToRegister() {
    this.route.navigate(['/auth/register'])
  }
}
