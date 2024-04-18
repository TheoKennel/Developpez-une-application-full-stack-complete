import {NgModule} from "@angular/core";
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { DetailsComponent } from './components/details/details.component';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {RouterLink, RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {ArticleRoutingModule} from "./article-routing.module";
import {AuthModule} from "../auth/auth.module";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ReactiveFormsModule} from "@angular/forms";
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import {SubjectsComponent} from "./components/subjects/subjects.component";

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DetailsComponent,
    SubscriptionsComponent,
    SubjectsComponent
  ],
  imports: [
    MatCardModule,
    MatSnackBarModule,
    FlexModule,
    ArticleRoutingModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    DatePipe,
    NgForOf,
    AuthModule,
    NgStyle,
    NgIf,
    ReactiveFormsModule
  ],
  exports: [
    SubscriptionsComponent
  ]
})

export class ArticleModule {}
