import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, PageEvent} from '@angular/material';
import {map, mergeMap} from 'rxjs/operators';
import {Observable, of as observableOf, merge, BehaviorSubject} from 'rxjs';
import {GithubUser} from '../github/githubUser';
import {GitHubService} from '../github/git-hub.service';

export class PeopleSearchDataSource extends DataSource<GithubUser> {
  private searchSubj = new BehaviorSubject<string>('');
  private data: GithubUser[] = [];
  // We are restricting end page/start page until I can figure out more about how I'd do end page - seems like PageInfo lacks this ability
  private previousPage = 0;

  constructor(private paginator: MatPaginator,
              private gitHubService: GitHubService) {
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

    const subscribableItems = merge(
      this.searchSubj,
      this.paginator.page
    );

    // This ensures that whenever we expect to update the UI with new data (not necessarily re-fetch data)
    return subscribableItems.pipe(mergeMap(eventVal => {

      // When searchSubj changed, we need to reset to start and regrab data
      if (typeof eventVal === 'string') {
        // Early return if data has not changed
        if (eventVal === this.searchSubj.value) {
          return observableOf(this.data);
        }
        return this.gitHubService.searchUsers(this.searchSubj.value, this.paginator.pageSize)
          .pipe(map(({total, users}) => {
            this.paginator.length = total;
            this.paginator.firstPage();
            this.previousPage = 0;
            this.data = users;
            return this.data;
          }));
      }

      // Page was changed in some way - use function to preserve type data
      const isEventPageEvent = (eventInfo: any): eventInfo is PageEvent => !!(eventInfo as PageEvent).pageIndex;
      if (isEventPageEvent(eventVal)) {
        // If page has not moved, they're just adjusting the amount to grad and we should give them starting at the same index (cursor)
        const cursor = eventVal.pageIndex <= this.previousPage ? this.data[0].cursor : this.data[this.data.length - 1].cursor;
        // If page has been changed to a previous one, we need to go backward. Otherwise, in any other instance we can move forward
        const dir = eventVal.pageIndex < this.previousPage ? 'prev' : 'next';
        return this.gitHubService.searchUsers(
          this.searchSubj.value,
          this.paginator.pageSize,
          cursor,
          dir
        ).pipe(map(({total, users}) => {
          this.previousPage = eventVal.pageIndex;
          this.paginator.length = total;
          this.data = users;
          return users;
        }));
      }

      // Otherwise safe return in case of edgecase
      return observableOf(this.data);
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
