import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {HttpErrorResponse} from "@angular/common/http";
import {of, throwError} from "rxjs";
import { expect } from '@jest/globals';
import {ReactiveFormsModule} from "@angular/forms";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockLocalStorage = {
    setItem: jest.fn(),
    setArray: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: LocalStorageService, useValue: mockLocalStorage }
      ],
      imports: [ ReactiveFormsModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to articles on successful login', () => {
    const userInformation = { id: 1, picture: 'url', userName: 'user', subscriptions: [] };
    mockAuthService.login.mockReturnValue(of(userInformation));
    component.submit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/article']);
  });

  it('should set error message on failed login', () => {
    mockAuthService.login.mockReturnValue(throwError(new Error("Unauthorized")));
    component.submit();
    expect(component.errorMessage).toBe('Unauthorized');
  });

  it('should set local storage on successful login', () => {
    const userInformation = { id: 1, picture: 'url', userName: 'user', subscriptions: [] };
    mockAuthService.login.mockReturnValue(of(userInformation));
    component.submit();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('id', '1');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('pictureUrl', 'url');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isLogged', 'true');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userName', 'user');
    expect(mockLocalStorage.setArray).toHaveBeenCalledWith('subscriptions', []);
  });

  it('should navigate back on back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });
});
