import { Component, OnInit } from '@angular/core';
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
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public article : Article | undefined;
  public comments : Comment[] | undefined;
  public errorMessage : string | null = null

  private comment = Comment
  private readonly articleId : number;

  public articleComments = new BehaviorSubject<Comment[]>([])

  public form = this.fb.group({
    content: ['Ecrivez ici votre commentaire', [Validators.required]],
  })

  constructor(
    private articleApiService: ArticleApiService,
    private commentApiService : CommentApiService,
    private localStorage : LocalStorageService,
    private route : ActivatedRoute,
    private matSnackBar : MatSnackBar,
    private fb : FormBuilder
  ) {
    this.articleId = parseInt(this.route.snapshot.paramMap.get('id')!);
    }

  ngOnInit(): void {
    this.fetchArticle();
  }

  public back() {
    window.history.back()
  }

  public postComment() {
    if (this.form.invalid) {
      this.errorMessage = "Content cannot be empty"
      return
    }
    const commentRequest : CommentRequest =  {
      content : this.form.value.content!!,
      userName : this.localStorage.getItem('userName')!!,
      article_id : this.articleId
    }
    this.commentApiService.postComments(commentRequest).subscribe({
      next: ()=> {
        const comment : Comment = {
          content : commentRequest.content,
          username : commentRequest.userName
        }
        this.comments?.push(comment)
        this.articleComments.next(this.comments!!)
        this.commentPosted("Comment posted successfully")
        this.form.value.content = ""
    },
      error : (error : HttpErrorResponse) => {
        this.errorMessage = error.message
      }
    })
  }

  private fetchArticle() {
    this.articleApiService
      .detail(this.articleId.toString())
      .subscribe((article: Article) => {
        this.article = article;
        console.log(article)
        this.comments = article.commentResponses
        this.articleComments.next(this.comments)
      })
  }

  private commentPosted(message: string) : void {
    this.matSnackBar.open(message, 'Close', { duration : 3000 })
  }
}
