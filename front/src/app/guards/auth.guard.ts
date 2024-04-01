import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {LocalStorageService} from "../storage/local-storage.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
  constructor(
    private localStorage: LocalStorageService,
    private router : Router,
  ) { }

  public canActivate(): boolean {
    if (this.localStorage.getItem('isLogged') !== 'true') {
      this.navigateToHome()
      return false;
    }
    return true;
  }

  private navigateToHome(): void {
    this.router.navigate(['']);
  }
}
