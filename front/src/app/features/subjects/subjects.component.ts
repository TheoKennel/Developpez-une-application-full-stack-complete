import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Subject} from "../articles/components/interface/subject.interface";
import {SubjectApiService} from "../articles/components/services/subject-api.service";
import {SubscriptionApiService} from "../articles/components/services/subscription-api.service";
import {LocalStorageService} from "../../storage/local-storage.service";
import {HttpErrorResponse} from "@angular/common/http";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent{

  public subject$ : Observable<Subject[]> = this.listSubject();
  public errorMessage: string | null = null;
  constructor(
    private subjectApiService: SubjectApiService,
    private subscriptionApiService: SubscriptionApiService,
    private localStorage: LocalStorageService
  ) { }

  public addSubscription(subjectId: string): void {
    const userId = this.localStorage.getItem('userId');
    this.subscriptionApiService.addSubscription(userId!!, subjectId).pipe(
      catchError(error => {
        this.errorMessage = error.message
        return error
    }));
  }

  public removeSubscription(subscriptionId: string): void {
    this.subscriptionApiService.removeSubscription(subscriptionId).pipe(
      catchError(error => {
        this.errorMessage = error.message
        return error
    }));
  }

  private listSubject() : Observable<Subject[]> {
    console.log('listSubject : ', this.subject$)
    return this.subject$ = this.subjectApiService.allSubject();
  }
}
