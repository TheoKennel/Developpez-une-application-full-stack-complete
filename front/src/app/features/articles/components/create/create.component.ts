import { Component, OnInit } from '@angular/core';
import {ArticleApiService} from "../services/article-api.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  constructor(
    private articleService: ArticleApiService,
  ) { }

  public submitForm(): void {

  }

}
