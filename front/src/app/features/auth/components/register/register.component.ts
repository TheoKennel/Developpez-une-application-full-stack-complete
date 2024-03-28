import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent  {

  public errorMessage : string | null = null
  public form = this.fb.group ({ email: ['', [Validators.required, Validators.email]],
  username: ['', [Validators.required, Validators.min(3), Validators.maxLength(20)]],
  password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
});

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) { }

  public submit() {
    const registerRequest = this.form.value as RegisterRequest;
    this.authService.register(registerRequest).subscribe({
        next: (_) => this.router.navigate(['/login']),
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
