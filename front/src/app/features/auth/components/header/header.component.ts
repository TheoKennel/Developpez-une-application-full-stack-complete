import { Component} from '@angular/core';
import {NavigationService} from "../../../../common/navigation.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  constructor(
    private navigationService: NavigationService
  ) { }

  public onClick() {
    this.navigationService.navigateToHome()
  }
}
