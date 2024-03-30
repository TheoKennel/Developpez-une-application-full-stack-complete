import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {LocalStorageService} from "../storage/local-storage.service";
import {NavigationService} from "../common/navigation.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
  constructor(
    private localStorage: LocalStorageService,
    private navigationService: NavigationService
  ) { }

  public canActivate(): boolean {
    if (this.localStorage.getItem('isLogged') !== 'true') {
      this.navigationService.navigateToHome()
      return false;
    }
    return true;
  }
}
