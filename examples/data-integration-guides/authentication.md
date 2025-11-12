# Authentication with NextAuth.js

Quick guide to adding authentication to HubLab apps.

## Install
```bash
npm install next-auth
```

## Setup
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
```

## Usage
```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

function Profile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return <button onClick={() => signIn()}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Protected Pages
```typescript
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return <div>Protected content</div>;
}
```

**Time:** 20-25 minutes
