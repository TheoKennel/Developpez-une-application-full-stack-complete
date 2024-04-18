import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RegisterComponent} from './register.component';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {expect} from "@jest/globals";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter},
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login on successful registration', () => {
    mockAuthService.register.mockReturnValue(of({}));
    component.submit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should set error message on failed registration', () => {
    mockAuthService.register.mockReturnValue(throwError(new Error('Registration failed')));
    component.submit();
    expect(component.errorMessage).toBe('Registration failed');
  });

  it('should navigate back on back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  })
});
