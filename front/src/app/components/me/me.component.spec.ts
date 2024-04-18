import {TestBed} from '@angular/core/testing';
import {MeComponent} from './me.component';
import {UserApiService} from "../../features/articles/components/services/user-api.service";
import {LocalStorageService} from "../../storage/local-storage.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {expect} from '@jest/globals';
import {of, throwError} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";

describe('MeComponent', () => {
  let component: MeComponent;
  let fb: FormBuilder;

  const mockUser = {
    username: 'test',
    email: 'theo@openclassroom.com',
    subscription: []
  };

  const mockUserApiService = {
    getUser: jest.fn().mockReturnValue(of(mockUser)),
    updateUser: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
  }

  const mockLocalStorage = {
    getItem: jest.fn().mockReturnValue('1'),
    setItem: jest.fn(),
    setArray: jest.fn(),
    clear: jest.fn()
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [MeComponent],
      providers: [
        {provide: UserApiService, useValue: mockUserApiService},
        {provide: LocalStorageService, useValue: mockLocalStorage},
        {provide: FormBuilder, useValue: fb},
        {provide: MatSnackBar, useValue: mockMatSnackBar},
      ]
    }).compileComponents();

    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn()
      },
      writable: true
    });

    const fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fb = new FormBuilder();
    fixture.detectChanges();
  });

  it('should fetch user on init', () => {

    component.ngOnInit();

    expect(mockUserApiService.getUser).toBeCalledWith('1');
  });

  it('should clear local storage on logout', () => {
    component.logout();

    expect(mockLocalStorage.clear).toBeCalled();
  });

  it('should update user on submit', () => {
    const updatedUser = {
      username: 'test',
      email: 'test@test.com',
      subscription: null
    };

    mockUserApiService.updateUser.mockReturnValueOnce(of(updatedUser));
    component.form = fb.group(updatedUser);

    component.submit();

    expect(mockUserApiService.updateUser).toBeCalledWith(updatedUser, '1');
    expect(mockLocalStorage.setItem).toBeCalledWith('username', 'test');
    expect(mockLocalStorage.setItem).toBeCalledWith('email', 'test@test.com');
    expect(mockLocalStorage.setArray).toBeCalledWith('subscriptions', null);
    expect(mockMatSnackBar.open).toBeCalledWith('User updated !', 'Close', {duration: 3000});
  });

  it('should handle error on submit', () => {
    mockUserApiService.updateUser.mockReturnValueOnce(throwError(new Error('Error')));

    component.submit();

    expect(component.errorMessage).toEqual('Error');
  });
});
