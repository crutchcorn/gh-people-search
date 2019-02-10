import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ObjectMap} from '../shared/object-helpers';
import {GithubUser} from './githubUser';
import {Apollo} from 'apollo-angular';
import {map, take, tap} from 'rxjs/operators';
import {getSearchQuery, SearchOrganizationType, SearchQueryType} from './search-query';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  loggedIn: boolean = false;

  constructor(private apollo: Apollo) {
  }

  login() {
    return this.apollo.watchQuery<SearchQueryType>({
      query: gql`{ viewer { login }}`
    }).valueChanges.pipe(tap(() => this.loggedIn = true)).toPromise();
  }

  searchUsers(...args: Parameters<typeof getSearchQuery>): Observable<{
    total: number,
    users: GithubUser[]
  }> {
    return this.apollo.watchQuery<SearchQueryType>({
      query: getSearchQuery(...args)
    }).valueChanges
      .pipe(
        take(1),
        map(({data}) => {
          const {search} = data;
          const {userCount: total, edges} = search;
          const users: GithubUser[] = edges.map(edge => {
            const usrData = ObjectMap(edge.node, (val) => {
              const isTot = (v): v is { totalCount: number } => v && v.totalCount !== undefined;
              if (isTot(val)) {
                const isOrg = (v): v is SearchOrganizationType => Object.keys(v).filter(k => !k.startsWith('__')).length > 1;
                if (isOrg(val)) {
                  return {
                    total: val.totalCount,
                    data: val.nodes
                  };
                }
                return val.totalCount;
              }
              return val;
            });

            return {
              cursor: edge.cursor,
              ...usrData
            };
          });
          return {
            total,
            users
          };
        })
      );
  }
}
