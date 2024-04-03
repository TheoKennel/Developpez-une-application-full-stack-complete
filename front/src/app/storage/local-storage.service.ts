import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Subscription} from "../features/articles/components/interface/subscription.interface";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public subscriptionsSubject: BehaviorSubject<Subscription[]> = new BehaviorSubject<Subscription[]>(this.getArray('subscriptions'));
  constructor() { }

  setItem(key: string, value: string) : void {
    localStorage.setItem(key, value)
    if (key === 'subscriptions') {
      console.log(this.subscriptionsSubject.value)
      this.subscriptionsSubject.next(this.getArray('subscriptions'))
    }
  }


  setArray(key: string, value: any[]) : void {
    localStorage.setItem(key, JSON.stringify(value))
    this.subscriptionsSubject.next(value)
  }

  setItemArray(key: string, value: any) : void {
    const array = this.getArray(key)
    array.push(value)
    this.setArray(key, array)
    this.subscriptionsSubject.next(array)
  }

  getItem(key: string) : string | null {
     return localStorage.getItem(key)
  }

  getArray(key: string) : any[] {
    return JSON.parse(localStorage.getItem(key) || '[]')
  }

  removeItem(key : string, value : number) : void {
    const array = this.getArray(key).filter(item => item.subject.id !== value);
    this.setArray(key, array);
    this.subscriptionsSubject.next(array)
  }

  clear(): void {
    localStorage.clear()
  }
}
