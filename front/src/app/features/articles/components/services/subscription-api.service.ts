import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";

@Injectable({providedIn: 'root'})
export class SubscriptionApiService {

  constructor(private http: HttpClient) {}

  public addSubscription(userId : string, subjectId : string): Observable<Subscription> {
    return this.http.post<Subscription>(`http://localhost:3001/api/subscription/${userId}/${subjectId}`, {}, { withCredentials: true });
  }

  public removeSubscription(subscriptionId : number) {
    return this.http.delete(`http://localhost:3001/api/subscription/${subscriptionId}`, { withCredentials: true });
  }
}

