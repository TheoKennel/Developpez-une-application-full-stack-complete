import {RegisterComponent} from "./register.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {expect} from '@jest/globals';

describe('RegisterIntegrationComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    jest.clearAllMocks()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should navigate to login on successful registration', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.form.setValue({email: 'theo@test.com', username: 'theo', password: 'password'});

    fixture.detectChanges();

    component.submit();

    const req = httpTestingController.expectOne('http://localhost:3001/api/auth/register');
    req.flush({});
    expect(req.request.method).toBe('POST');

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should set error message on failed registration', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.form.setValue({email: 'theo@test.com', username: 'theo', password: 'password'});

    fixture.detectChanges();

    component.submit();

    const req = httpTestingController.expectOne('http://localhost:3001/api/auth/register');
    req.error(new ErrorEvent('error'));
    expect(req.request.method).toBe('POST');

    expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/auth/register: 0 ');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
