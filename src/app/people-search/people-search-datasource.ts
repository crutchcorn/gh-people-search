import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort, PageEvent, Sort} from '@angular/material';
import {map} from 'rxjs/operators';
import {Observable, of as observableOf, merge, BehaviorSubject} from 'rxjs';
import {GithubUser} from '../github/githubUser';
import {GitHubService} from '../github/git-hub.service';
import {switchMap} from 'rxjs/internal/operators/switchMap';

export class PeopleSearchDataSource extends DataSource<GithubUser> {
  private searchSubj = new BehaviorSubject<string>('');
  private currentServerData: GithubUser[] = [];
  private currentServerPage = 0;

  constructor(private paginator: MatPaginator, private sort: MatSort, private gitHubService: GitHubService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<GithubUser[]> {
    // Set the paginator's initial length to 0, as we don't want default values
    this.paginator.length = 0;

    // This ensures that whenever we expect to update the UI with new data (not necessarily refetch data)
    return merge(
      this.searchSubj,
      this.paginator.page,
      this.sort.sortChange
    ).pipe(switchMap(eventVal => {
      // This should always be true with our config but is added for expandandability
      const canHybridPage = (100 % this.paginator.pageSize) === 0;
      // Method to be used to return the valid dataset
      const getReturnArr = () => {
        if (canHybridPage) {
          const leftOver = (this.paginator.pageSize * this.paginator.pageIndex) % 100;
          return this.currentServerData.slice(leftOver, leftOver + this.paginator.pageSize);
        } else {
          return this.currentServerData;
        }
      };

      // When searchSubj changed, we need to reset to start and regrab data
      if (typeof eventVal === 'string') {
        // Early return if data has not changed
        if (eventVal === this.searchSubj.value) {
          return observableOf(getReturnArr());
        }
        return this.gitHubService.searchUsers(this.searchSubj.value, 0, {
          // If it can handle hybrid page, it will be `false` which is removed from server call by object helper function
          per_page: (!canHybridPage) && this.paginator.pageSize,
          order: this.sort.direction
        })
          .pipe(map(({total_count, items}) => {
            this.paginator.length = total_count;
            this.paginator.firstPage();
            this.currentServerData = items;
            this.currentServerPage = 0;
            // Return only the actual amount of items we need to. We're going to be fetching more from the server to limit the number of
            // We can only do this if `(100 % this.paginator.pageSize) === 0` otherwise things don't work out
            // API calls (GH's v3 API limits pretty heavily so this should help a bit with that)
            return canHybridPage ? items.slice(0, this.paginator.pageSize) : items;
          }));
      }

      // Page was changed in some way
      const isEventPageEvent = (eventInfo: any): eventInfo is PageEvent => !!(eventInfo as PageEvent).pageIndex;
      if (isEventPageEvent(eventVal)) {

      }

      // Sort was changed
      const isEventSort = (eventInfo: any): eventInfo is Sort => !!(eventInfo as Sort).direction;
      if (isEventSort(eventVal)) {

      }

      // Otherwise safe return in case of edgecase
      return observableOf(getReturnArr());
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }

  setSearch(val) {
    if (!val) {

    }
    this.searchSubj.next(val);
  }
}
