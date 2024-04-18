import {Component, OnInit} from '@angular/core';
import {ArticleApiService} from "../services/article-api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SubjectApiService} from "../services/subject-api.service";
import {Subject} from "../interface/subject.interface";
import {Observable, of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../../../../storage/local-storage.service";
import {ArticleRequest} from "../interface/articleRequest.interface";
import {HttpErrorResponse} from "@angular/common/http";

/**
 * Composant pour la création d'articles.
 * Implémente le hook de cycle de vie OnInit.
 */
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public errorMessage: string | null = null;
  public subject$: Observable<Subject[]> = new Observable<Subject[]>();

  public form = this.fb.group({
    subjectId: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    content: ['', [Validators.required, Validators.maxLength(10000)]]
  });

  constructor(
    private articleService: ArticleApiService,
    private matSnackBar: MatSnackBar,
    private subjectApiService: SubjectApiService,
    private localStorage: LocalStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchSubjects();
  }

  /** Soumet le formulaire pour créer un nouvel article. */
  public submitForm(): void {
    const articleRequest: ArticleRequest = {
      subject_id: this.form.value.subjectId!!,
      user_id: this.localStorage.getItem('id')!!,
      title: this.form.value.title!!,
      content: this.form.value.content!!
    };
    this.articleService.create(articleRequest).subscribe({
      next: (_) => {
        this.errorMessage = "";
        this.exitPage("Article created successfully");
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
      }
    });
  }

  /** Récupère tous les sujets disponibles pour sélection dans le formulaire. */
  private fetchSubjects(): void {
    this.subjectApiService.allSubject().subscribe({
      next: (subjects) => {
        this.subject$ = of(subjects);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.exitPage(this.errorMessage);
      }
    });
  }

  /** Navigation pour retourner à la page précédente. */
  public back() {
    window.history.back();
  }

  /**
   * Quitte la page après la création d'un article ou en cas d'erreur, affiche un message dans la barre de notification.
   * @param message Message à afficher
   */
  private exitPage(message: string): void {
    this.matSnackBar.open(message, 'Close', {duration: 3000});
    this.router.navigate(['/article']);
  }
}

