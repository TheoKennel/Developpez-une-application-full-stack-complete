import { Component, OnInit } from '@angular/core';
import {ArticleApiService} from "../services/article-api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SubjectApiService} from "../services/subject-api.service";
import {Subject} from "../interface/subject.interface";
import {EMPTY, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {ArticleRequest} from "../interface/articleRequest.interface";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public errorMessage : string | null = null
  public subject$ : Observable<Subject[]> = new Observable<Subject[]>();

  public form = this.fb.group({
    subjectId: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)],],
    content: ['', [Validators.required, Validators.maxLength(10000)]]
})

  constructor(
    private articleService: ArticleApiService,
    private matSnackBar: MatSnackBar,
    private subjectApiService: SubjectApiService,
    private localStorage: LocalStorageService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.subject$ = this.subjectApiService.allSubject().pipe(
    catchError(err => {
      this.errorMessage = err.message;
      this.exitPage(this.errorMessage!!)
      return EMPTY;
    }));
  }

  public submitForm(): void {
    const articleRequest: ArticleRequest = {
      subject_id: this.form.value.subjectId!!,
      user_id: this.localStorage.getItem('id')!!,
      title: this.form.value.title!!,
      content: this.form.value.content!!
    }
    console.log('articleRequest', articleRequest)
    this.articleService.create(articleRequest).subscribe({
      next: (_) => {
        this.errorMessage = ""
        this.exitPage("Article created successfully")
      },
      error: (error : HttpErrorResponse) => {
        this.errorMessage = error.message;
      }
    });
  }

  public back() {
    window.history.back()
  }

  private exitPage(message: string): void {
    this.matSnackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/article']);
  }
}
