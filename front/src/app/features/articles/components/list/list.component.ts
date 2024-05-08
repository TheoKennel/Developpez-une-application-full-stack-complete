import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subject, takeUntil} from "rxjs";
import {Article} from "../interface/article.interface";
import {ArticleApiService} from "../services/article-api.service";
import {BreakpointService} from "../../../../services/breakpoint-screen.service";

/**
 * Composant pour lister les articles.
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public articles$: Observable<Article[]> = this.articleApiService.all();
  public screenSize!: string;
  private ngUnsubscribe: any = new Subject();

  constructor(
    private articleApiService: ArticleApiService,
    private breakpointService: BreakpointService
    ) {
  }

  ngOnInit() {
    this.responsiveBreakpoint();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Détermine la taille de l'écran.
   */
  private responsiveBreakpoint() {
    this.breakpointService.screenSize$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(screenSize => this.screenSize = screenSize);
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
