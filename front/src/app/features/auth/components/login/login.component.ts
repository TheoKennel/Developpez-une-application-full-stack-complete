import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginRequest} from "../../interfaces/loginRequest.interface";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public errorMessage : string | null = null
  public form = this.fb.group ({ email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
  });

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) { }

  public submit() {
    const loginRequest = this.form.value as LoginRequest;
    this.authService.login(loginRequest).subscribe({
        next: (_) => this.router.navigate(['/article']),
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error.message
        }
      }
    );
  }

  public navigateHome() {
    this.router.navigate(['/'])
  }
}
