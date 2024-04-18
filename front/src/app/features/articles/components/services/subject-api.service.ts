import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Subject} from "../interface/subject.interface";

@Injectable({providedIn: 'root'})
export class SubjectApiService {

  constructor(private http: HttpClient) {
  }

  public allSubject(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`http://localhost:3001/api/subject`, {withCredentials: true});
  }

  public subjectById(id: string): Observable<Subject> {
    return this.http.get<Subject>(`http://localhost:3001/api/subject/${id}`, {withCredentials: true});
  }
}
