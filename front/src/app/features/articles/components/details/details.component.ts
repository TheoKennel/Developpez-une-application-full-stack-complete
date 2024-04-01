import { Component, OnInit } from '@angular/core';
import {ArticleApiService} from "../services/article-api.service";
import {ActivatedRoute} from "@angular/router";
import {Article} from "../interface/article.interface";
import {Comment} from "../interface/comment.interface";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private article : Article | undefined;
  private articleId : string;
  private comment : Comment[] | undefined;

  constructor(
    private articleApiService: ArticleApiService,
    private route : ActivatedRoute
  ) {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    }

  ngOnInit(): void {
    this.fetchArticle();
  }

  public back() {
    window.history.back()
  }

  private fetchArticle() {
    this.articleApiService
      .detail(this.articleId)
      .subscribe((article: Article) => {
        this.article = article;
        this.comment = article.comments;
      })
  }
}
