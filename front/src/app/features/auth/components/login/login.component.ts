import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginRequest} from "../../interfaces/loginRequest.interface";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {NavigationService} from "../../../../common/navigation.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  public errorMessage : string | null = null
  public form = this.fb.group ({ email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
  });

  public fields = [
    { name: 'email', label: "E-mail ou nom d'utilisateur", type: 'email', placeholder: '' },
    { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '' }
  ];

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private localStorage: LocalStorageService,
              private navigationService : NavigationService
  ) { }

  public submit() {
    const loginRequest = this.form.value as LoginRequest;
          console.log('Password : ', loginRequest.password)
    this.authService.login(loginRequest).subscribe({
        next: (userInformation) =>  {
          this.localStorage.setItem("id", userInformation.id.toString())
          this.localStorage.setItem("pictureUrl", userInformation.picture)
          this.localStorage.setItem("isLogged", "true")
          this.localStorage.setItem("userName", userInformation.userName)
          this.router.navigate(['/article'])
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message
        }
      }
    );
  }

  public navigateHome() {
    this.navigationService.navigateToHome()
  }
}
