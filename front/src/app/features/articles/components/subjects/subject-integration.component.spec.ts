import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SubjectsComponent} from "./subjects.component";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Subject} from "../interface/subject.interface";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {RouterTestingModule} from "@angular/router/testing";
import {expect} from '@jest/globals';

describe('SubjectIntegrationComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;
  let httpTestingController: HttpTestingController;

  const subjects: Subject[] = [
    {
      id: 1,
      name: 'Subject 1',
      description: 'Description 1'
    },
    {
      id: 2,
      name: 'Subject 2',
      description: 'Description 2'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpTestingController.expectOne(req => req.url == 'http://localhost:3001/api/subject' && req.method == "GET")
      .flush(subjects);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all subjects', () => {
    fixture.detectChanges();
    const subjectElements = fixture.nativeElement.querySelectorAll('.list-details');
    expect(subjectElements.length).toBe(2);
    expect(subjectElements[0].textContent).toContain('Subject 1');
    expect(subjectElements[1].textContent).toContain('Subject 2');
  });
});
