import { TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ArticleApiService } from "../services/article-api.service";
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import {RouterTestingModule} from "@angular/router/testing";


describe('ListComponent', () => {
  let component: ListComponent;

  const mockArticleApiService = {
    all: jest.fn().mockReturnValue(of([
      { id: 1, date: new Date('2024-04-11') },
      { id: 2, date: new Date('2024-04-12') }
    ]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: ArticleApiService, useValue: mockArticleApiService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch articles on init', () => {
    expect(mockArticleApiService.all).toHaveBeenCalled();
  });

  it('should sort articles by date', () => {
    component.sortByDate();
    component.articles$.subscribe(articles => {
      expect(articles[0].id).toBe(2);
      expect(articles[1].id).toBe(1);
    });
  });
});
