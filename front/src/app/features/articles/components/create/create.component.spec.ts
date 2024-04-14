import { TestBed} from '@angular/core/testing';
import { CreateComponent } from './create.component';
import { ArticleApiService } from "../services/article-api.service";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { SubjectApiService } from "../services/subject-api.service";
import { LocalStorageService } from "../../../../storage/local-storage.service";

describe('CreateComponent', () => {

  let component: CreateComponent;

  const mockArticleApiService = {
    create: jest.fn().mockReturnValue(of({}))
  };

  const mockSubjectApiService = {
    allSubject: jest.fn().mockReturnValue(of([]))
  };

  const mockMatSnackBar = {
    open: jest.fn()
  }

  const mockLocalStorage = {
    getItem: jest.fn().mockReturnValue('1')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [CreateComponent],
      providers: [
        { provide: ArticleApiService, useValue: mockArticleApiService },
        { provide: SubjectApiService, useValue: mockSubjectApiService },
        { provide: LocalStorageService, useValue: mockLocalStorage },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should fetch all subjects on init', () => {
    component.ngOnInit();
    expect(mockSubjectApiService.allSubject).toBeCalled();
  });

  it('should handle error on fetching subjects', () => {
    mockSubjectApiService.allSubject.mockReturnValueOnce(throwError(new Error('Error')));
    component.ngOnInit();
    expect(component.errorMessage).toEqual('Error');
  });

  it('should create article on submit', () => {
    const articleRequest = {
      subject_id: "",
      user_id: "1",
      title: "",
      content:""
    };

    component.submitForm();

    expect(mockArticleApiService.create).toBeCalledWith(articleRequest);
    expect(mockMatSnackBar.open).toBeCalledWith('Article created successfully', 'Close', { duration: 3000 });
  });

  it('should navigate back on back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle error on submit', () => {
    mockArticleApiService.create.mockReturnValueOnce(throwError(new Error('Error')));
    component.submitForm();
    expect(component.errorMessage).toEqual('Error');
  });
});
