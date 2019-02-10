import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CustomMaterialModule} from './custom-material.module';
import {GitHubService} from './github/git-hub.service';

import {AppComponent} from './app.component';

import {PeopleSearchComponent} from './shared/people-search/people-search.component';
import {AppNavComponent} from './app-nav/app-nav.component';
import {SafePipe} from './shared/safe.pipe';
import { GitHubGraphQLModule } from './github/git-hub-graph-q-l.module';
import {SearchInputComponent} from './shared/search-input/search-input.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PeopleSearchComponent,
    AppNavComponent,
    SafePipe,
    SearchInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    GitHubGraphQLModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [GitHubService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
