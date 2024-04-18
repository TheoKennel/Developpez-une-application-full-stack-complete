import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {DetailsComponent} from './details.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {expect} from "@jest/globals";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router

  const mockCommentResponse = [{
    content: 'Test Comment'
  },
    {content: 'Test Comment 2'}
  ];

  const mockActivatedRoute = {
    snapshot: {
      paramMap: new Map([['id', '1']])
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatIconModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DetailsComponent}
        ]),
        MatSnackBarModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('When form is valid', () => {
    it('should not display error message when form is valid', (fakeAsync(() => {
      fixture.detectChanges();
      const req = httpTestingController.expectOne('http://localhost:3001/api/article/1');
      req.flush({title: 'Test Title', content: 'Test Content', commentResponses: mockCommentResponse});
      component.form.setValue({content: 'Test comment'});
      tick();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      const articleTitle = fixture.debugElement.query(By.css('.details_article h1'));

      expect(articleTitle.nativeElement.textContent).toContain('Test Title');
      expect(errorMessage).toBeNull();
    })));

    it('should post comment and display it', () => {
      fixture.detectChanges();
      const req = httpTestingController.expectOne('http://localhost:3001/api/article/1');
      req.flush({title: 'Test Title', content: 'Test Content', commentResponses: []});
      fixture.detectChanges();

      component.form.setValue({content: 'Test comment'});
      fixture.detectChanges();

      const postButton = fixture.debugElement.query(By.css('.icon_button'));
      postButton.nativeElement.click();
      fixture.detectChanges();

      const req2 = httpTestingController.expectOne('http://localhost:3001/api/comment/create');
      req2.flush({content: 'Test comment'});
      expect(req2.request.method).toEqual('POST');
      fixture.detectChanges();

      const comments = fixture.debugElement.queryAll(By.css('.details_comment .comments'));
      expect(comments.length).toEqual(1);
      expect(comments[0].nativeElement.textContent).toContain('Test comment');
    });
  });
});
;
