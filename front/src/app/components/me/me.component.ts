import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserApiService} from "../../features/articles/components/services/user-api.service";
import {LocalStorageService} from "../../storage/local-storage.service";
import {User} from "../../features/articles/components/interface/user.interface";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {types} from "@angular/compiler-cli/linker/babel/src/babel_core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "../../features/articles/components/interface/subscription.interface";

@Component({
  selector: 'app-me', templateUrl: './me.component.html', styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit, OnDestroy {

  public user$: Observable<User> | undefined;
  public user: User | undefined;
  public subscriptions: Observable<Subscription[]> | undefined;
  public form: FormGroup | undefined;
  public errorMessage: string | null = null;

  private userId: string | null = null;
  private ngUnsubscribe: any = new Subject();

  constructor(private userService: UserApiService,
              private localStorage: LocalStorageService,
              private fb: FormBuilder,
              private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.user$ = this.fetchUser();
    this.subscribeToUser();
    console.log(this.localStorage.subscriptionsSubject)
    console.log(this.localStorage.subscriptionsSubject.subscribe())
    console.log(this.localStorage.getArray("subscriptions"))
    this.subscriptions = this.localStorage.subscriptionsSubject
    console.log('subscriptions', this.subscriptions)
  };

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  public submit() {
    const user = this.form?.value as User;
    this.userService.updateUser(user, this.userId!!.toString()).subscribe({
      next: (user) => {
        this.setLocalStorage(user);
        this.updateSnackBack('User updated !');
      }, error: (error) => {
        this.errorMessage = error.message
      }
    })
  }

  public logout() {
    this.localStorage.clear();
    window.location.reload();
  }

  private setLocalStorage(user: User) {
    this.localStorage.setItem("username", user.username)
    this.localStorage.setItem("email", user.email)
    this.localStorage.setArray("subscriptions", user.subscription)
  }

  private fetchUser() {
    this.userId = this.localStorage.getItem('id');
    return this.userService.getUser(this.userId!!)
  }

  private subscribeToUser() {
    this.user$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.user = user
      this.initForm(user)
    });
  }

  private initForm(user?: User) {
    console.log('user', user)
    this.form = this.fb.group({
      username: [
        user ? user.username : '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(40)]
      ],
      email: [
        user ? user.email : '',
        [Validators.required, Validators.email]
      ],
    });
  }

  private updateSnackBack(message: string) {
    this.matSnackBar.open(message, 'Close', {duration: 3000});
  }
}
