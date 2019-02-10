import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { PeopleSearchDataSource } from './people-search-datasource';
import {GitHubService} from '../../github/git-hub.service';

@Component({
  selector: 'app-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.css']
})
export class PeopleSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: PeopleSearchDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['username', 'description', 'name'];

  constructor(private gitHubService: GitHubService) {}

  ngOnInit() {
    this.dataSource = new PeopleSearchDataSource(this.paginator, this.gitHubService);
  }
}
