import {TestBed} from "@angular/core/testing";
import {SubjectsComponent} from "./subjects.component";
import {SubjectApiService} from "../services/subject-api.service";
import {of} from "rxjs";
import {expect} from '@jest/globals';
import {SubscriptionsComponent} from "../../subscriptions/subscriptions.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('SubjectsComponent', () => {

  let component: SubjectsComponent;

  const mockSubjectApiService = {
    allSubject: jest.fn().mockReturnValue(of([
      {id: 1, name: 'Subject 1'},
      {id: 2, name: 'Subject 2'}
    ]))
  };

  const mockSubscriptionComponent = {
    isSubscribed: jest.fn().mockReturnValue(true),
    addSubscription: jest.fn(),
    removeSubscription: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectsComponent],
      imports: [],
      providers: [
        {provide: SubjectApiService, useValue: mockSubjectApiService},
        {provide: SubscriptionsComponent, useValue: mockSubscriptionComponent}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch subjects on init', () => {
    expect(mockSubjectApiService.allSubject).toHaveBeenCalled();
  });

  it('should assign fetched subjects to subject$', done => {
    component.subject$.subscribe(subjects => {
      expect(subjects.length).toBe(2);
      expect(subjects[0].id).toBe(1);
      expect(subjects[0].name).toBe('Subject 1');
      expect(subjects[1].id).toBe(2);
      expect(subjects[1].name).toBe('Subject 2');
      done();
    })
  });
});
