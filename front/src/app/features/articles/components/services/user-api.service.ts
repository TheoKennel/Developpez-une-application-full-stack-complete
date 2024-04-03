import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interface/user.interface";
import {UserRequestInterface} from "../interface/userRequest.interface";

@Injectable({providedIn: 'root'})
export class UserApiService {

  constructor(private http: HttpClient) {
  }

  public getUser(userId: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3001/api/user/${userId}`, {withCredentials: true});
  }

  public updateUser(userRequest : UserRequestInterface, userId : string) : Observable<User> {
    return this.http.put<User>(`http://localhost:3001/api/user/${userId}`, userRequest, {withCredentials: true});
  }
}
