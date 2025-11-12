# GraphQL Integration with Apollo Client

Quick guide to connecting HubLab UI to GraphQL APIs.

## Install
```bash
npm install @apollo/client graphql
```

## Setup
```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

## Usage
```typescript
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_USERS = gql\`
  query GetUsers {
    users {
      id name email
    }
  }
\`;

function UsersList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

**Time:** 15-20 minutes
