import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class SubscriptionApiService {

  constructor(private http: HttpClient) {}

  public addSubscription(userId : string, subjectId : string) {
    return this.http.post(`http://localhost:3001/api/subscription`, { userId, subjectId }, { withCredentials: true });
  }

  public removeSubscription(subscriptionId : string) {
    return this.http.delete(`http://localhost:3001/api/subscription/${subscriptionId}`, { withCredentials: true });
  }
}
