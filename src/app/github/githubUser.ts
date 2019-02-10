export interface GithubUser {
  login: string; // Username
  id: number;
  node_id: string;
  avatar_url: string; // Avatar image URL
  gravatar_id: string;
  url: string; // API route to their profile
  html_url: string; // URL to their profile on GH's site
  followers_url: string; // Followers route on API
  subscriptions_url: string; // Subscriptions route on API
  organizations_url: string; // Organizations route on API
  repos_url: string; // Repos route on API
  received_events_url: string; // Events route on API
  type: string; // Should be 'User'
  score: number; // Relevance to search
}
