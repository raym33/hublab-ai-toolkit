# Data Integration Guides

Complete step-by-step tutorials for connecting your HubLab-exported UI to real data sources.

## Overview

HubLab generates beautiful UI components, but you need to connect them to real data. These guides show you exactly how to integrate with popular data sources and services.

## Available Guides

### 1. [REST API Integration](./rest-api.md)
Connect to any REST API using SWR for automatic caching and revalidation.

**Use when:**
- You have an existing REST API
- You want automatic caching and revalidation
- You need TypeScript type safety

**Time:** 10-15 minutes

---

### 2. [Supabase Integration](./supabase.md)
Connect to Supabase (PostgreSQL) with real-time subscriptions.

**Use when:**
- You need a PostgreSQL database
- You want real-time updates
- You need built-in authentication
- You want row-level security

**Time:** 15-20 minutes

---

### 3. [GraphQL Integration](./graphql.md)
Connect to GraphQL APIs using Apollo Client.

**Use when:**
- Your backend uses GraphQL
- You want efficient data fetching
- You need complex nested queries

**Time:** 15-20 minutes

---

### 4. [Firebase Integration](./firebase.md)
Connect to Firebase Firestore with real-time listeners.

**Use when:**
- You're using Firebase ecosystem
- You want real-time updates
- You need offline support
- You want easy authentication

**Time:** 15-20 minutes

---

### 5. [State Management](./state-management.md)
Add global state management with Zustand.

**Use when:**
- You need to share state across components
- You're building an e-commerce cart
- You want simple, performant state management

**Time:** 10 minutes

---

### 6. [Form Handling](./form-handling.md)
Add validation and error handling with React Hook Form + Zod.

**Use when:**
- You have complex forms
- You need validation
- You want TypeScript type safety
- You need error messages

**Time:** 10-15 minutes

---

### 7. [Authentication](./authentication.md)
Add user authentication with NextAuth.js.

**Use when:**
- You need user login/signup
- You want OAuth providers (Google, GitHub, etc.)
- You need protected routes
- You want session management

**Time:** 20-25 minutes

---

## Quick Start Workflow

1. **Build Your UI in HubLab**
   - Go to [hublab.dev/studio-v2](https://hublab.dev/studio-v2)
   - Add components (tables, forms, charts, etc.)
   - Export your code (React, Next.js, or HTML)

2. **Choose Your Data Source**
   - Pick the guide that matches your backend
   - Follow the step-by-step instructions
   - Copy the integration code

3. **Connect Data to UI**
   - Import the integration hooks
   - Replace static data with real data
   - Add loading and error states

4. **Deploy**
   - Test locally
   - Deploy to Vercel, Netlify, or your platform
   - Monitor and iterate

---

## Example: Dashboard with REST API

**Before (Static Data):**
```tsx
// Exported from HubLab
function Dashboard() {
  const users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ];

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**After (Real Data with REST API):**
```tsx
// After following rest-api.md guide
import { useUsers } from '@/lib/api';

function Dashboard() {
  const { users, isLoading, isError } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**What changed:**
1. Added `useUsers()` hook from integration guide
2. Added loading and error states
3. Data now comes from real API with automatic caching

**Time spent:** ~10 minutes

---

## Common Patterns

### Pattern 1: List with Create/Update/Delete

**UI Components from HubLab:**
- Data Table
- Modal (for create/edit forms)
- Button (for delete)

**Integration Guide:** REST API or Supabase

**Time:** 15-20 minutes

---

### Pattern 2: Form with Validation

**UI Components from HubLab:**
- Text Input
- Select Dropdown
- Textarea
- Button

**Integration Guide:** Form Handling

**Time:** 10 minutes

---

### Pattern 3: Dashboard with Real-time Data

**UI Components from HubLab:**
- Dashboard Layout
- Stat Cards
- Charts
- Tables

**Integration Guide:** REST API (polling) or Supabase (real-time)

**Time:** 20-25 minutes

---

### Pattern 4: E-commerce with Cart

**UI Components from HubLab:**
- Product Grid
- Cart Summary
- Checkout Form

**Integration Guide:** State Management + Form Handling

**Time:** 25-30 minutes

---

### Pattern 5: Protected Dashboard

**UI Components from HubLab:**
- Login Form
- Dashboard Layout
- User Profile

**Integration Guide:** Authentication + REST API

**Time:** 30-35 minutes

---

## Installation

Each guide includes specific dependencies, but here's a complete list:

```bash
# REST API
npm install swr

# Supabase
npm install @supabase/supabase-js

# GraphQL
npm install @apollo/client graphql

# Firebase
npm install firebase

# State Management
npm install zustand

# Forms
npm install react-hook-form @hookform/resolvers zod

# Authentication
npm install next-auth
```

Or install everything at once:
```bash
npm install swr @supabase/supabase-js @apollo/client graphql firebase zustand react-hook-form @hookform/resolvers zod next-auth
```

---

## Environment Variables

Create a `.env.local` file in your project root:

```env
# REST API
NEXT_PUBLIC_API_URL=https://api.example.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# GraphQL
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.example.com/graphql

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_ID=xxx
GITHUB_SECRET=xxx
```

---

## Troubleshooting

### Issue: "Module not found"
**Solution:** Make sure you installed all dependencies
```bash
npm install swr
```

### Issue: "Environment variable undefined"
**Solution:** Create `.env.local` and restart dev server
```bash
# Stop server (Ctrl+C)
# Add variables to .env.local
npm run dev
```

### Issue: "CORS error"
**Solution:** Configure your API to allow requests from your domain
```js
// API server
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Issue: "Data not updating"
**Solution:** Check your SWR configuration
```tsx
useSWR('/api/users', fetcher, {
  refreshInterval: 30000, // Enable auto-refresh
  revalidateOnFocus: true
});
```

---

## Next Steps

1. Choose a guide based on your backend
2. Follow the step-by-step instructions
3. Test with your HubLab-exported components
4. Deploy to production

Need help? Check the individual guides for detailed examples and troubleshooting.

---

**Last Updated:** November 2025
**Difficulty:** Beginner to Intermediate
**Prerequisites:** Basic React/Next.js knowledge
