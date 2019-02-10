import gql from 'graphql-tag';

export interface SearchOrganizationType {
  totalCount: number;
  nodes: Array<{
    avatarUrl: string,
    websiteUrl: string,
    name: string
  }>;
}

export interface SearchQueryType {
  search: {
    userCount: number,
    edges: Array<{
      cursor: string,
      node: {
        login: string,
        name: string,
        bio: string,
        avatarUrl: string,
        followers: {
          totalCount: number
        },
        following: {
          totalCount: number
        },
        starredRepositories: {
          totalCount: number
        },
        issues: {
          totalCount: number
        },
        organizations: SearchOrganizationType,
      }
    }>,
  };
}

/**
 * TODO: Use TS types to generate GraphQL Query
 * @see {@link https://graphql-code-generator.com/docs/plugins/typescript-apollo-angular}
 * @param query - Query to pass to GH v4 API
 * @param limit - How many items you want returned
 * @param cursor - The cursor you want to start from
 * @param dir - The direction you want to go. Next will give you the current page, anything else will give you the previous
 */
export function getSearchQuery(query: string, limit: number = 100, cursor?: string, dir = 'next') {
  return gql`
      {
  search(query: "${query}", type: USER, first: ${limit}${cursor ? `, ${dir === 'next' ? 'after' : 'before'}: ${cursor}` : ''}) {
    edges {
      cursor
      node {
        ... on User {
        login
          name
          bio
          avatarUrl
          followers {
            totalCount
          }
           following {
              totalCount
            }
          starredRepositories {
            totalCount
          }
          issues {
            totalCount
          }
          organizations(first: 3) {
            totalCount
            nodes {
              ...on Organization {
                avatarUrl
                websiteUrl
                name
              }
            }
          }
        }
      }
    }
    userCount
  }
}
`;
}
