import { Component, OnInit } from '@angular/core';
import {async, Observable} from "rxjs";
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
    private router : Router
  ) { }

  public navigateToDetail(id: number) {
    this.router.navigate([`/articles/${id}`]);
  }
}
