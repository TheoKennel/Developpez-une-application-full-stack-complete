import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CommentRequest} from "../interface/commentRequest.interface";
import {Comment} from "../interface/comment.interface";
import {Observable} from "rxjs";

@Injectable({providedIn : "root"})

export class CommentApiService {

  constructor(
    private http : HttpClient
  ) {}

  public postComments(commentRequest : CommentRequest) {
     return this.http.post<CommentRequest>(`http://localhost:3001/api/comment/create`, commentRequest, {withCredentials : true})
  }
}

