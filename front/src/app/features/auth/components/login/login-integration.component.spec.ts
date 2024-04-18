import {LoginComponent} from "./login.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {ReactiveFormsModule} from "@angular/forms";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Router} from "@angular/router";
import { expect } from '@jest/globals';

describe('LoginIntegrationComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const mockLocalStorage = {
    setItem: jest.fn(),
    setArray: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: LocalStorageService, useValue: mockLocalStorage}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    jest.clearAllMocks()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should set local storage on successful login, and navigate to article', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const userInformation = { id: 1, picture: 'url', userName: 'user', subscriptions: [] };
    component.form.setValue({email: 'user@user.com', password: 'password'});
    fixture.detectChanges();

    component.submit();

    const req = httpTestingController.expectOne('http://localhost:3001/api/auth/login');
    req.flush(userInformation);
    expect(req.request.method).toBe('POST');

    fixture.detectChanges();

    expect(component.errorMessage).toBe(null);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('id', '1');
    expect(navigateSpy).toHaveBeenCalledWith(['/article']);
  });

  it('should set error message on failed login', () => {
    component.form.setValue({email: 'error@test.com', password: 'password'});

    fixture.detectChanges();

    component.submit();

    const req = httpTestingController.expectOne('http://localhost:3001/api/auth/login');
    req.error(new ErrorEvent('error'));
    expect(req.request.method).toBe('POST');

    expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/auth/login: 0 ');
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });
})
