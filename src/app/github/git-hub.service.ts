import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ObjectMap, RemoveSparseObjectKeys} from '../shared/object-helpers';
import {GithubUser} from './githubUser';

export interface IGitHubPagination {
  page: number;
  per_page: number;
}

type GitHubOrderType = 'asc' | 'desc';
type GitHubSortType = 'followers' | 'repositories' | 'joined'; // Default is based on `score` but is not based by val I don't think

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  constructor(private http: HttpClient) {
  }

  searchUsers<T = {
    total_count: number,
    incomplete_results: boolean,
    items: GithubUser[]
  }>(query: string, page: number = 0, options: {
    per_page?: number,
    sort?: GitHubSortType,
    order?: GitHubOrderType | ''
  } = {}): Observable<T> {
    const partialParams = ObjectMap(RemoveSparseObjectKeys({page, per_page: 100, order: 'asc', ...options}), (val) => `${val}`);
    const queryParam = query.replace(/\s/g, '+');
    return this.http.get<T>(`https://api.github.com/search/users`, {
      params: {
        q: queryParam,
        ...partialParams
      }
    });
  }
}
