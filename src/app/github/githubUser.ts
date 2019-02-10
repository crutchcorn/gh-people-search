import {SearchOrganizationType} from './search-query';

export interface GithubUser {
  login: string; // Username
  name: string;
  bio: string;
  cursor: string;
  avatarUrl: string;
  followers: number;
  following: number;
  starredRepositories: number;
  issues: number;
  organizations: {
    total: number;
    data: SearchOrganizationType['nodes']
  };
}
