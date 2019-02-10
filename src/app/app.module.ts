import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CustomMaterialModule} from './custom-material.module';
import {GitHubService} from './github/git-hub.service';

import {AppComponent} from './app.component';

import {PeopleSearchComponent} from './people-search/people-search.component';
import {AppNavComponent} from './app-nav/app-nav.component';
import {SafePipe} from './shared/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PeopleSearchComponent,
    AppNavComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CustomMaterialModule
  ],
  providers: [GitHubService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
