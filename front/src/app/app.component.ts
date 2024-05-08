import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from "./storage/local-storage.service";
import {Observable, of, Subject, takeUntil} from "rxjs";
import {BreakpointService} from "./services/breakpoint-screen.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit ,OnDestroy {

  @ViewChild('menu_hamburger') menu!: ElementRef;
  title = 'front';
  private ngUnsubscribe: any = new Subject();
  public screenSize!: string;
  isMenuOpen = false;

  constructor(
    private localStorage: LocalStorageService,
    private breakpointService: BreakpointService
  ) {
  }

  ngOnInit() {
    this.responsiveBreakpoint();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private responsiveBreakpoint() {
    this.breakpointService.screenSize$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(screenSize => this.screenSize = screenSize);
  }

  public $isLoggedIn(): Observable<boolean> {
    console.log(this.localStorage.getItem('isLogged'))
    return of(this.localStorage.getItem('isLogged') === 'true');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Check if the click was outside the menu
    if (this.menu && !this.menu.nativeElement.contains(targetElement)) {
      // Close the menu
      this.isMenuOpen = false;
    }
  }
}

