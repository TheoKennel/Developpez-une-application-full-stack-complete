import {TestBed} from "@angular/core/testing";
import {SubjectsComponent} from "./subjects.component";
import {SubjectApiService} from "../services/subject-api.service";
import {of} from "rxjs";
import { expect } from '@jest/globals';

describe('SubjectsComponent', () => {

let component: SubjectsComponent;

const mockSubjectApiService = {
  allSubject: jest.fn().mockReturnValue(of([
    { id: 1, name: 'Subject 1' },
    { id: 2, name: 'Subject 2' }
  ]))
};

beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [SubjectsComponent],
    providers: [
      { provide: SubjectApiService, useValue: mockSubjectApiService }
    ]
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
  })});
});
