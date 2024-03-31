import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article} from "../interface/article.interface";
import {ArticleRequest} from "../interface/articleRequest.interface";

@Injectable({providedIn: 'root'})
export class ArticleApiService {
  constructor(private httpClient: HttpClient) { }

  public all() : Observable<Article[]> {
    return this.httpClient.get<Article[]>("http://localhost:3001/api/article", {withCredentials: true});
  }

  public detail(id: string) {
    return this.httpClient.get<Article>(`http://localhost:3001/api/article/${id}`, {withCredentials: true});
  }

  public create(article: ArticleRequest) {
    return this.httpClient.post("http://localhost:3001/api/article", article, {withCredentials: true});
  }
}
