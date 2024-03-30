import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ListComponent} from "./components/list/list.component";

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { title: 'All', path: 'all', component: ListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
