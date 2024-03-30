import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {NgModule} from "@angular/core";

const routes : Routes = [
  { title: 'Login', path: 'login', component : LoginComponent },
  { title: 'Register', path: 'register', component : RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
