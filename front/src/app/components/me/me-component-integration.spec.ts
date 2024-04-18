import {MeComponent} from "./me.component";
import {async, ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {UserApiService} from "../../features/articles/components/services/user-api.service";
import {LocalStorageService} from "../../storage/local-storage.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {expect} from '@jest/globals';
import {MatFormFieldModule} from "@angular/material/form-field";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('MeComponent Integration', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let httpTestingController: HttpTestingController;
  let matSnackBar: MatSnackBar;

  const mockLocalStorage = {
    getItem: jest.fn().mockReturnValue('1'),
    setItem: jest.fn(),
    setArray: jest.fn(),
    clear: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        UserApiService,
        LocalStorageService,
        {provide: LocalStorageService, useValue: mockLocalStorage}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    matSnackBar = TestBed.inject(MatSnackBar);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form', () => {
    beforeEach(() => {
      const mockUser = {
        username: 'test',
        email: 'test@test.com',
        subscription: []
      };

      const req = httpTestingController.expectOne('http://localhost:3001/api/user/1');
      expect(req.request.method).toEqual('GET');
      req.flush(mockUser);
    });

    it('should initialize the form with user value', fakeAsync(() => {
      fixture.detectChanges();
      expect(component.form).toBeDefined();
      expect(component.form?.get('username')?.value).toEqual('test');
      expect(component.form?.get('email')?.value).toEqual('test@test.com');
      expect(component.form?.valid).toBeTruthy();
    }));

    it('should disable form when invalid', () => {
      component.form?.setValue({username: 'test', email: 'test'});
      fixture.detectChanges();

      const buttonForm = fixture.debugElement.query(By.css('.form_button'));
      expect(component.form?.valid).toBeFalsy();
      expect(buttonForm.nativeElement.disabled).toBeTruthy();
    });

    it('should submit valid data', () => {
      const spy = jest.spyOn(matSnackBar, 'open');
      component.form?.setValue({username: 'testUser', email: 'test@example.com'});
      fixture.detectChanges();

      component.submit();
      const req = httpTestingController.expectOne('http://localhost:3001/api/user/1');
      expect(req.request.method).toEqual('PUT');
      req.flush({});

      expect(component.errorMessage).toBe("");
      expect(spy).toHaveBeenCalledWith('User updated !', 'Close', {duration: 3000});
    });

    it('should display error message on submit failure', () => {
      component.form?.setValue({username: 'testUser', email: 'test@example.com'});
      fixture.detectChanges();
      component.submit();
      const req = httpTestingController.expectOne('http://localhost:3001/api/user/1');
      req.flush({}, {status: 500, statusText: 'Internal Server Error'})

      expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/user/1: 500 Internal Server Error');
    });
  })
});
