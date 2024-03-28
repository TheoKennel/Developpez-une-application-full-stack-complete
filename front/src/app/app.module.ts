import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MeComponent } from './components/me/me.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AuthModule} from "./features/auth/auth.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ArticleComponent } from './features/article/article.component';
import {AuthInterceptor} from "./guards/auth-interceptor.service";

@NgModule({
  declarations: [AppComponent, HomeComponent, MeComponent, NotFoundComponent, ArticleComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
