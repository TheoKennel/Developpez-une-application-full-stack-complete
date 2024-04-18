import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule} from '@angular/router/testing';
import {ArticleApiService} from '../services/article-api.service';
import {CreateComponent} from './create.component';
import {MatIconModule} from "@angular/material/icon";
import {By} from "@angular/platform-browser";
import {expect} from '@jest/globals';


describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let httpTestingController: HttpTestingController;
  let matSnackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule
      ],
      providers: [
        FormBuilder,
        ArticleApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    matSnackBar = TestBed.inject(MatSnackBar);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should throw error and exit page if subject getAll fails', () => {
    const spy = jest.spyOn(matSnackBar, 'open');

    fixture.detectChanges();
    const req = httpTestingController.expectOne('http://localhost:3001/api/subject');

    req.flush('Error', {status: 500, statusText: 'Internal Server Error'});

    expect(spy).toHaveBeenCalledWith('Http failure response for http://localhost:3001/api/subject: 500 Internal Server Error', 'Close', {duration: 3000});
    expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/subject: 500 Internal Server Error');
  })

  describe('When FetchSubject works', () => {
    beforeEach(() => {
      const req = httpTestingController.expectOne('http://localhost:3001/api/subject');
      req.flush([{id: 1, name: 'Test Subject'}]);
    })

    it('should not display error message when form is valid', () => {
      component.form.setValue({subjectId: '1', title: 'Test Title', content: 'Test Content'});
      fixture.detectChanges();

      const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
      expect(submitButton.disabled).toBe(false);

      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage).toBeNull();
    });

    it('should display disable button when form is invalid', () => {
      component.form.setValue({subjectId: '', title: '', content: ''});
      fixture.detectChanges();

      const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
      expect(submitButton.disabled).toBe(true);
    });

    it('should submit valid data', () => {
      const spy = jest.spyOn(matSnackBar, 'open');
      component.form.setValue({subjectId: '1', title: 'Test Title', content: 'Test Content'});
      fixture.detectChanges();

      component.submitForm();

      const req = httpTestingController.expectOne('http://localhost:3001/api/article/create');
      expect(req.request.method).toEqual('POST');
      req.flush({});

      expect(spy).toHaveBeenCalledWith('Article created successfully', 'Close', {duration: 3000});
    });

    it('should display error message on submit failure', () => {
      component.form.setValue({subjectId: '1', title: 'Test Title', content: 'Test Content'});
      fixture.detectChanges();

      component.submitForm();

      const req = httpTestingController.expectOne('http://localhost:3001/api/article/create');
      req.flush('Error', {status: 500, statusText: 'Internal Server Error'});

      expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/article/create: 500 Internal Server Error');
    });

  });
});
