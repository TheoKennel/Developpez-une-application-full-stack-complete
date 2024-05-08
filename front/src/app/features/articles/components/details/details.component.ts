import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleApiService} from "../services/article-api.service";
import {ActivatedRoute} from "@angular/router";
import {Article} from "../interface/article.interface";
import {Comment} from "../interface/comment.interface";
import {CommentRequest} from "../interface/commentRequest.interface";
import {CommentApiService} from "../services/comment-api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {BreakpointService} from "../../../../services/breakpoint-screen.service";

/**
 * Composant pour l'affichage des détails d'un article et pour poster des commentaires.
 * Implémente le hook de cycle de vie OnInit.
 */
@Component({
  selector: 'app-details', templateUrl: './details.component.html', styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  public article: Article | undefined;
  public comments: Comment[] | undefined;
  public errorMessage: string | null = null;
  public screenSize!: string;
  private ngUnsubscribe: any = new Subject();

  private readonly articleId: number;

  public articleComments = new BehaviorSubject<Comment[]>([]);

  public form = this.fb.group({
    content: ['Ecrivez ici votre commentaire', [Validators.required]],
  });

  constructor(private articleApiService: ArticleApiService, private commentApiService: CommentApiService, private localStorage: LocalStorageService, private route: ActivatedRoute, private matSnackBar: MatSnackBar, private fb: FormBuilder, private breakpointService: BreakpointService,) {
    this.articleId = parseInt(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnInit(): void {
    this.fetchArticle();
    this.responsiveBreakpoint();
  }

  /** Navigation pour retourner à la page précédente. */
  public back() {
    window.history.back();
  }

  /** Publie un nouveau commentaire si le formulaire est valide. */
  public postComment() {
    if (this.form.invalid) {
      this.errorMessage = "Content cannot be empty";
      return;
    }
    const commentRequest: CommentRequest = {
      content: this.form.value.content!!, userName: this.localStorage.getItem('userName')!!, article_id: this.articleId
    };
    this.commentApiService.postComments(commentRequest).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        const comment: Comment = {
          content: commentRequest.content, username: commentRequest.userName
        };
        this.comments?.push(comment);
        this.articleComments.next(this.comments!!);
        this.commentPosted("Comment posted successfully");
        this.form.value.content = "";
      }, error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
      }
    });
  }

  /** Récupère les détails de l'article et initialise les commentaires. */
  private fetchArticle() {
    this.articleApiService
      .detail(this.articleId.toString())
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe((article: Article) => {
      this.article = article;
      this.comments = article.commentResponses;
      this.articleComments.next(this.comments);
    });
  }

  /**
   * Affiche un message dans la barre de notification après la publication d'un commentaire.
   * @param message Message à afficher
   */
  private commentPosted(message: string): void {
    this.matSnackBar.open(message, 'Close', {duration: 3000});
  }

  private responsiveBreakpoint() {
    this.breakpointService.screenSize$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(screenSize => this.screenSize = screenSize);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
