import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ListComponent} from "./components/list/list.component";
import {CreateComponent} from "./components/create/create.component";
import {DetailsComponent} from "./components/details/details.component";

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', component: ListComponent},
  { path: 'detail/:id', component: DetailsComponent},
  { path: 'create', component: CreateComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
