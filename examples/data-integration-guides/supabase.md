# Supabase Integration

Connect your HubLab UI to Supabase (PostgreSQL) with real-time subscriptions, authentication, and row-level security.

## What You'll Build

A complete CRUD application with:
- Real-time data updates
- User authentication
- Row-level security
- TypeScript types from database schema
- File storage integration

**Time:** 15-20 minutes

---

## Prerequisites

- HubLab-exported app
- Supabase account (free tier available)
- Basic SQL knowledge (optional)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for database to be provisioned (~2 minutes)
5. Copy your project URL and anon key

---

## Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js
```

---

## Step 3: Configure Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Step 4: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types will be generated later
export type Database = any; // Replace with generated types
```

---

## Step 5: Create Database Tables

In Supabase Dashboard → SQL Editor, run:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated write)
CREATE POLICY "Public users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Step 6: Generate TypeScript Types

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Generate types
supabase gen types typescript --local > types/database.types.ts
```

Update `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

---

## Step 7: Create Data Hooks

Create `lib/supabase-hooks.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Database } from '@/types/database.types';

type User = Database['public']['Tables']['users']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

// Fetch all users with real-time updates
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Subscribe to changes
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          console.log('Change received!', payload);
          fetchUsers(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { users, loading, error, refresh: fetchUsers };
}

// Fetch single user
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetchUser();
  }, [userId]);

  async function fetchUser() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, error };
}

// Create user
export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update user
export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete user
export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

// Fetch user's posts
export function useUserPosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetchPosts();
  }, [userId]);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error) {
      setPosts(data || []);
    }
    setLoading(false);
  }

  return { posts, loading, refresh: fetchPosts };
}
```

---

## Step 8: Use in Your HubLab Component

```tsx
'use client';

import { useUsers, createUser, updateUser, deleteUser } from '@/lib/supabase-hooks';

export default function UsersPage() {
  const { users, loading, error, refresh } = useUsers();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Users ({users.length})
      </h1>

      <div className="grid gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onUpdate={(updates) => updateUser(user.id, updates)}
            onDelete={() => deleteUser(user.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Step 9: Add Authentication

```typescript
// lib/auth.ts
import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, signUp, signIn, signOut };
}
```

---

## Real-time Features

### Listen to specific record

```typescript
useEffect(() => {
  const channel = supabase
    .channel('user-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        setUser(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);
```

---

## File Storage

```typescript
// Upload avatar
export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

---

## Best Practices

1. **Always use Row Level Security (RLS)**
2. **Generate TypeScript types** from schema
3. **Use real-time subscriptions** sparingly (they use connections)
4. **Implement proper error handling**
5. **Use indexes** for frequently queried columns

---

## Next Steps

- Set up email authentication
- Add file uploads
- Implement search with full-text search
- Add database functions for complex queries

---

**Time Spent:** 15-20 minutes
**Difficulty:** Intermediate
**Result:** Full-stack app with real-time data
