import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsComponent } from './subscriptions.component';
import {LocalStorageService} from "../../../storage/local-storage.service";
import {SubscriptionApiService} from "../components/services/subscription-api.service";
import {of, throwError} from "rxjs";
import { expect } from '@jest/globals';

describe('SubscriptionsComponent', () => {
  let component: SubscriptionsComponent;

const mockSubscriptionApiService = {
  addSubscription: jest.fn().mockReturnValue(of({})),
  removeSubscription: jest.fn().mockReturnValue(of({}))
};

const mockLocalStorage = {
  getItem: jest.fn().mockReturnValue('1'),
  getArray: jest.fn().mockReturnValue([{ subject: { id: 1 }, id: 1 }]),
  setItemArray: jest.fn(),
  removeItem: jest.fn()
};

beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [SubscriptionsComponent],
    providers: [
      { provide: SubscriptionApiService, useValue: mockSubscriptionApiService },
      { provide: LocalStorageService, useValue: mockLocalStorage }
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(SubscriptionsComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

it('should check if user is subscribed to a subject', () => {
  const isSubscribed = component.isSubscribed(1);
  expect(isSubscribed).toBe(true);
});

it('should add subscription', () => {
  component.addSubscription(2);
  expect(mockSubscriptionApiService.addSubscription).toHaveBeenCalledWith('1', '2');
  expect(mockLocalStorage.setItemArray).toHaveBeenCalled();
});

it('should handle error on add subscription', () => {
  mockSubscriptionApiService.addSubscription.mockReturnValue(throwError(new Error("Error while adding subscription")))

})


it('should remove subscription', () => {
  component.removeSubscription(1);
  expect(mockSubscriptionApiService.removeSubscription).toHaveBeenCalledWith(1);
  expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('subscriptions', 1);
});
});
