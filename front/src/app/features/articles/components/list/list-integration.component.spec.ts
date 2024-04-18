import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ListComponent} from './list.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {Article} from "../interface/article.interface";
import {expect} from '@jest/globals';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpTestingController: HttpTestingController;

  const testArticles: Article[] = [
    {
      id: 1,
      title: 'Test Article 2',
      content: 'Content 2',
      date: new Date('2023-01-01T12:00:00Z'),
      authorName: 'Author 2',
      SubjectName: "Subject 2",
      commentResponses: []
    },
    {
      id: 2,
      title: 'Test Article 1',
      content: 'Content 1',
      date: new Date('2024-01-01T12:00:00Z'),
      authorName: 'Author 1',
      SubjectName: "Subject 1",
      commentResponses: []
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        CommonModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpTestingController.expectOne(req => req.url == 'http://localhost:3001/api/article' && req.method == "GET")
      .flush(testArticles);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display articles', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const articleTitles = fixture.debugElement.queryAll(By.css('.list-details h1')).map(de => de.nativeElement.textContent);
      expect(articleTitles).toEqual(['Test Article 2', 'Test Article 1']);
    });
  }));
});
