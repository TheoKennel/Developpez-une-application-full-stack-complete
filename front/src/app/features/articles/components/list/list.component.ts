import { Component } from '@angular/core';
import {map, Observable} from "rxjs";
import {Article} from "../interface/article.interface";
import {ArticleApiService} from "../services/article-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  public articles$ : Observable<Article[]> = this.articleApiService.all();
  constructor(
    private articleApiService: ArticleApiService,
  ) { }

  public sortByDate() {
    this.articles$ = this.articles$.pipe(
      map(articles => articles
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ));
  }
}
