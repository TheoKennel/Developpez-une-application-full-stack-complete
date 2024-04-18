import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginRequest} from "../interfaces/loginRequest.interface";
import {RegisterRequest} from "../interfaces/registerRequest.interface";
import {UserInformation} from "../interfaces/userInformation.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  public register(registerRequest: RegisterRequest): Observable<LoginRequest> {
    return this.httpClient.post<LoginRequest>(`http://localhost:3001/api/auth/register`, registerRequest)
  }

  public login(loginRequest: LoginRequest): Observable<UserInformation> {
    return this.httpClient.post<UserInformation>(`http://localhost:3001/api/auth/login`, loginRequest, {withCredentials: true})
  }
}
