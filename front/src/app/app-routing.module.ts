import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {MeComponent} from "./components/me/me.component";
import {HomeComponent} from "./features/auth/components/home/home.component";
import {SubjectsComponent} from "./features/articles/components/subjects/subjects.component";


const routes: Routes = [
  { title: 'Home', path: '', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'article',
    loadChildren: () => import('./features/articles/article.module').then(m => m.ArticleModule)
  },
  {
    path: 'me', canActivate: [AuthGuard],
    component: MeComponent
  },
  {
    path: 'subject', canActivate: [AuthGuard], component: SubjectsComponent
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
