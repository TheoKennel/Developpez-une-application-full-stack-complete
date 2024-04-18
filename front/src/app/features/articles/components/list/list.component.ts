import {Component} from '@angular/core';
import {map, Observable} from "rxjs";
import {Article} from "../interface/article.interface";
import {ArticleApiService} from "../services/article-api.service";

/**
 * Composant pour lister les articles.
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  public articles$: Observable<Article[]> = this.articleApiService.all();

  constructor(
    private articleApiService: ArticleApiService
  ) {
  }

  /**
   * Trie les articles par date, du plus récent au plus ancien.
   */
  public sortByDate() {
    this.articles$ = this.articles$.pipe(
      map(articles => articles
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      ));
  }
}
