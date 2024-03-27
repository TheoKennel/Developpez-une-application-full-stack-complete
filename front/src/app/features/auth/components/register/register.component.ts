import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {LoginRequest} from "../../interfaces/loginRequest.interface";

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent  {

  public onError = false;
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
        error: _ => this.onError = true,
    }
    );
  }
}
