import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/auth/components/home/home.component';
import { MeComponent } from './components/me/me.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./features/interceptors/auth-interceptor.service";
import {AppRoutingModule} from "./app-routing.module";
import {FlexModule} from "@angular/flex-layout";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {ArticleModule} from "./features/articles/article.module";
import {AuthModule} from "./features/auth/auth.module";
import {MatSidenavModule} from "@angular/material/sidenav";

@NgModule({
  declarations: [AppComponent, HomeComponent, MeComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    ArticleModule,
    AuthModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
