import {SubscriptionsComponent} from "./subscriptions.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {RouterTestingModule} from "@angular/router/testing";
import {Subscription} from "../components/interface/subscription.interface";
import {LocalStorageService} from "../../../storage/local-storage.service";
import {Subject} from "../components/interface/subject.interface";
import {expect} from '@jest/globals';

describe('SubscriptionIntegrationComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>
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

  let subscriptions: Subscription[] = [
    {
      id: 1,
      subject: subjects[0],
    },
    {
      id: 2,
      subject: subjects[1],
    }
  ];

  const mockLocalStorage = {
    getArray: jest.fn().mockReturnValue(subscriptions),
    getItem: jest.fn(),
    setItemArray: jest.fn(),
    removeItem: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: LocalStorageService, useValue: mockLocalStorage}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should determine if user is subscribed to a subject', () => {
    expect(component.isSubscribed(1)).toBe(true);
    expect(component.isSubscribed(3)).toBe(false);
  });

  it('should handle subscription addition', () => {
    jest.spyOn(mockLocalStorage, 'getItem').mockReturnValue(1);
    component.subjectId = 3;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.subscription_button button');
    button.click();

    const subscribe = httpTestingController.expectOne('http://localhost:3001/api/subscription/1/3');
    subscribe.flush({id: 3, subject: {id: 3}});
    expect(subscribe.request.method).toBe('POST');

    fixture.detectChanges();

    expect(mockLocalStorage.setItemArray).toHaveBeenCalledWith('subscriptions', {id: 3, subject: {id: 3}});
  });

  it('should return error when subscription addition fails', () => {
    jest.spyOn(mockLocalStorage, 'getItem').mockReturnValue(1);
    component.subjectId = 3;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.subscription_button button');
    button.click();

    const subscribe = httpTestingController.expectOne('http://localhost:3001/api/subscription/1/3');
    subscribe.error(new ErrorEvent('error'));
    expect(subscribe.request.method).toBe('POST');

    fixture.detectChanges();

    expect(mockLocalStorage.setItemArray).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/subscription/1/3: 0 ');
  });

  it('should handle subscription removal', () => {
    component.subjectId = 1;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.subscription_button button');
    button.click();

    const req = httpTestingController.expectOne('http://localhost:3001/api/subscription/1');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should return error when subscription removal fails', () => {
    component.subjectId = 1;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.subscription_button button');
    button.click();

    const req = httpTestingController.expectOne('http://localhost:3001/api/subscription/1');
    req.error(new ErrorEvent('error'));
    expect(req.request.method).toEqual('DELETE');
    expect(component.errorMessage).toBe('Http failure response for http://localhost:3001/api/subscription/1: 0 ');
  });
})
