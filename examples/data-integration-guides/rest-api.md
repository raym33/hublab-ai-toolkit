# REST API Integration with SWR

Learn how to connect your HubLab UI to any REST API using SWR (Stale-While-Revalidate) for automatic caching, revalidation, and error handling.

## What You'll Build

Connect a HubLab-exported dashboard to a REST API with:
- Automatic data fetching
- Loading states
- Error handling
- Auto-refresh every 30 seconds
- Optimistic updates
- TypeScript types

**Time:** 10-15 minutes

---

## Prerequisites

- HubLab-exported Next.js or React app
- A REST API endpoint (or use a mock API)
- Basic TypeScript/React knowledge

---

## Step 1: Install Dependencies

```bash
npm install swr
```

**What is SWR?**
SWR is a React hook library for data fetching created by Vercel. It handles caching, revalidation, focus tracking, and more automatically.

---

## Step 2: Create API Client

Create `lib/api.ts`:

```typescript
import useSWR from 'swr';

// Fetcher function - handles the actual fetch
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }

  return response.json();
};

// Get all users
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users',
    fetcher,
    {
      refreshInterval: 30000,      // Refresh every 30 seconds
      revalidateOnFocus: true,     // Refresh when tab focused
      revalidateOnReconnect: true, // Refresh when reconnected
      dedupingInterval: 5000,      // Dedupe requests within 5s
    }
  );

  return {
    users: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Get single user
export function useUser(userId: string) {
  const { data, error, isLoading } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

// Create user (POST)
export async function createUser(userData: any) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
}

// Update user (PUT)
export async function updateUser(userId: string, userData: any) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}

// Delete user (DELETE)
export async function deleteUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
}
```

---

## Step 3: Connect to Your HubLab Component

**Before (Static Data):**
```tsx
// Your HubLab-exported component
export default function DashboardPage() {
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
```

**After (Real Data):**
```tsx
'use client';

import { useUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { useState } from 'react';

export default function DashboardPage() {
  const { users, isLoading, isError, refresh } = useUsers();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Handle create
  const handleCreate = async (userData: any) => {
    await createUser(userData);
    refresh(); // Refresh the list
    setShowCreateModal(false);
  };

  // Handle update
  const handleUpdate = async (userId: string, updates: any) => {
    await updateUser(userId, updates);
    refresh(); // Refresh the list
  };

  // Handle delete
  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure?')) {
      await deleteUser(userId);
      refresh(); // Refresh the list
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading data</p>
          <p>Please try again later.</p>
          <button
            onClick={() => refresh()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Success state with real data
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users ({users.length})</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onUpdate={(updates) => handleUpdate(user.id, updates)}
            onDelete={() => handleDelete(user.id)}
          />
        ))}
      </div>

      {showCreateModal && (
        <CreateUserModal
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
```

---

## Step 4: Add TypeScript Types (Optional but Recommended)

Create `types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
}
```

Update `lib/api.ts` with types:

```typescript
import { User, CreateUserInput, UpdateUserInput } from '@/types';

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    '/api/users',
    fetcher,
    // ... config
  );

  return {
    users: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
```

---

## Step 5: Configure API Base URL

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

Update fetcher to use base URL:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const fetcher = async (url: string) => {
  const response = await fetch(`${API_URL}${url}`);
  // ... rest of fetcher
};
```

---

## Advanced Features

### 1. Pagination

```typescript
export function useUsersPaginated(page: number = 1, limit: number = 10) {
  const { data, error, isLoading } = useSWR(
    `/api/users?page=${page}&limit=${limit}`,
    fetcher
  );

  return {
    users: data?.users || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: error,
  };
}
```

### 2. Search and Filters

```typescript
export function useUsersFiltered(filters: {
  search?: string;
  status?: 'active' | 'inactive';
}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);

  const { data, error, isLoading } = useSWR(
    `/api/users?${params.toString()}`,
    fetcher
  );

  return {
    users: data || [],
    isLoading,
    isError: error,
  };
}
```

### 3. Optimistic Updates

```typescript
export async function updateUserOptimistic(userId: string, updates: any) {
  // Optimistically update the UI
  mutate(
    '/api/users',
    (users) => users.map((u) => u.id === userId ? { ...u, ...updates } : u),
    false // Don't revalidate yet
  );

  try {
    // Send request
    const updated = await updateUser(userId, updates);
    // Revalidate with server data
    mutate('/api/users');
    return updated;
  } catch (error) {
    // Rollback on error
    mutate('/api/users');
    throw error;
  }
}
```

---

## Testing with Mock API

Use JSONPlaceholder for testing:

```typescript
// Change API URL in .env.local
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com

// Endpoints:
// GET  https://jsonplaceholder.typicode.com/users
// GET  https://jsonplaceholder.typicode.com/users/1
// POST https://jsonplaceholder.typicode.com/users
```

---

## Troubleshooting

### Issue: CORS errors

**Solution:** Configure your API to allow your domain:

```javascript
// On your API server
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### Issue: Data not refreshing

**Solution:** Check SWR configuration:

```typescript
useSWR('/api/users', fetcher, {
  refreshInterval: 30000, // Must be > 0
  revalidateOnFocus: true
});
```

### Issue: "fetch is not defined"

**Solution:** SWR runs on both server and client. Use dynamic import:

```typescript
'use client'; // Add this at the top of your component
```

---

## Complete Example

See the full working example in our repository:
- [Dashboard with REST API](/examples/exported-code/nextjs-page/dashboard/page.tsx)

---

## Next Steps

- Add authentication headers
- Implement error boundaries
- Add loading skeletons
- Set up error tracking (Sentry)
- Add request caching strategies

---

**Time Spent:** 10-15 minutes
**Difficulty:** Beginner
**Result:** Production-ready data fetching
