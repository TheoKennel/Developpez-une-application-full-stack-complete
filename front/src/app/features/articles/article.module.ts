import {NgModule} from "@angular/core";
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { DetailsComponent } from './components/details/details.component';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, DatePipe, NgForOf} from "@angular/common";
import {ArticleRoutingModule} from "./article-routing.module";

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DetailsComponent,
  ],
  imports: [
    MatCardModule,
    FlexModule,
    ArticleRoutingModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    DatePipe,
    NgForOf
  ],
})

export class ArticleModule {}
