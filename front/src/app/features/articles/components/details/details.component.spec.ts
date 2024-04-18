import {TestBed} from '@angular/core/testing';
import {DetailsComponent} from './details.component';
import {ArticleApiService} from "../services/article-api.service";
import {CommentApiService} from "../services/comment-api.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {of, throwError} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {expect} from '@jest/globals';
import {MatIconModule} from "@angular/material/icon";

describe('DetailsComponent', () => {
  let component: DetailsComponent;

  const mockArticleApiService = {
    detail: jest.fn().mockReturnValue(of({commentResponses: []}))
  };

  const mockCommentApiService = {
    postComments: jest.fn().mockReturnValue(of({}))
  };

  const mockMatSnackBar = {
    open: jest.fn()
  }

  const mockLocalStorage = {
    getItem: jest.fn().mockReturnValue('1')
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  const mockRouter = {
    navigate: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule
      ],
      declarations: [DetailsComponent],
      providers: [
        {provide: ArticleApiService, useValue: mockArticleApiService},
        {provide: CommentApiService, useValue: mockCommentApiService},
        {provide: LocalStorageService, useValue: mockLocalStorage},
        {provide: FormBuilder, useValue: new FormBuilder()},
        {provide: MatSnackBar, useValue: mockMatSnackBar},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch article on init', () => {
    component.ngOnInit();
    expect(mockArticleApiService.detail).toBeCalledWith('1');
  });

  it('should post comment on valid form', () => {
    const commentRequest = {
      content: 'Test comment',
      userName: '1',
      article_id: 1
    };

    component.form.setValue({content: 'Test comment'});
    component.postComment();

    expect(mockCommentApiService.postComments).toBeCalledWith(commentRequest);
    expect(mockMatSnackBar.open).toBeCalledWith('Comment posted successfully', 'Close', {duration: 3000});
  });

  it('should handle error on post comment', () => {
    mockCommentApiService.postComments.mockReturnValueOnce(throwError(new Error('Error')));
    component.postComment();
    expect(component.errorMessage).toEqual('Error');
  });

  it('should navigate back on back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should not post comment on invalid form', () => {
    component.form.setValue({content: ''});
    component.postComment();
    expect(component.errorMessage).toEqual('Content cannot be empty');
  });
});
