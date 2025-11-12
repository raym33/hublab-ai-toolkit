/**
 * HubLab Data Integration Templates
 *
 * Ready-to-use templates for connecting HubLab UI to real data sources
 * 7 integration patterns: REST API, Supabase, GraphQL, Firebase, State, Forms, Auth
 */

// ============================================
// 1. REST API Integration (with SWR)
// ============================================

export const REST_API_TEMPLATE = `
import useSWR from 'swr';

// Fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
};

// Example: Fetch users list
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users',
    fetcher,
    {
      refreshInterval: 30000,      // Auto-refresh every 30 seconds
      revalidateOnFocus: true,     // Refresh when window focused
      revalidateOnReconnect: true, // Refresh when reconnected
      dedupingInterval: 5000,      // Dedupe requests within 5s
    }
  );

  return {
    users: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Example: Fetch single user
export function useUser(userId: string) {
  const { data, error, isLoading } = useSWR(
    userId ? \`/api/users/\${userId}\` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

// Example: POST request
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

// Example: PUT request
export async function updateUser(userId: string, userData: any) {
  const response = await fetch(\`/api/users/\${userId}\`, {
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

// Example: DELETE request
export async function deleteUser(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
}
`;

// ============================================
// 2. Supabase Integration
// ============================================

export const SUPABASE_TEMPLATE = `
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Fetch all records
export function useSupabaseQuery<T>(
  table: string,
  options?: {
    orderBy?: { column: string; ascending?: boolean };
    filter?: { column: string; value: any };
    limit?: number;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let query = supabase.from(table).select('*');

        if (options?.orderBy) {
          query = query.order(
            options.orderBy.column,
            { ascending: options.orderBy.ascending ?? true }
          );
        }

        if (options?.filter) {
          query = query.eq(options.filter.column, options.filter.value);
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: err } = await query;

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error };
}

// Example: Insert record
export async function insertRecord(table: string, record: any) {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select();

  if (error) throw error;
  return data;
}

// Example: Update record
export async function updateRecord(
  table: string,
  id: string,
  updates: any
) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

// Example: Delete record
export async function deleteRecord(table: string, id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Example: Real-time subscription
export function useSupabaseRealtime<T>(
  table: string,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(\`public:\${table}\`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
}
`;

// ============================================
// 3. GraphQL Integration (Apollo Client)
// ============================================

export const GRAPHQL_TEMPLATE = `
import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';

// Initialize Apollo Client
export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

// Example: Query
const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
      createdAt
    }
  }
\`;

export function useUsers() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);

  return {
    users: data?.users || [],
    loading,
    error,
    refresh: refetch,
  };
}

// Example: Query with variables
const GET_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        id
        title
        content
      }
    }
  }
\`;

export function useUser(userId: string) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  return {
    user: data?.user,
    loading,
    error,
  };
}

// Example: Mutation
const CREATE_USER = gql\`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
\`;

export function useCreateUser() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  const handleCreate = async (userData: any) => {
    const { data } = await createUser({
      variables: { input: userData },
      refetchQueries: [{ query: GET_USERS }],
    });
    return data.createUser;
  };

  return {
    createUser: handleCreate,
    loading,
    error,
  };
}
`;

// ============================================
// 4. Firebase Integration
// ============================================

export const FIREBASE_TEMPLATE = `
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Example: Fetch collection
export function useFirestoreCollection<T>(
  collectionName: string,
  constraints?: any[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = constraints
      ? query(collectionRef, ...constraints)
      : collectionRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Example: Add document
export async function addDocument(collectionName: string, data: any) {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}

// Example: Update document
export async function updateDocument(
  collectionName: string,
  docId: string,
  updates: any
) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, updates);
}

// Example: Delete document
export async function deleteDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}
`;

// ============================================
// 5. State Management (Zustand)
// ============================================

export const STATE_MANAGEMENT_TEMPLATE = `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Example: User store
interface UserState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// Example: Cart store
interface CartState {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, quantity: 1 }],
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
  total: 0, // Compute in selector
}));

// Computed selector
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
`;

// ============================================
// 6. Form Handling (React Hook Form + Zod)
// ============================================

export const FORM_HANDLING_TEMPLATE = `
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Example: Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\\+?\\d{10,}$/, 'Invalid phone number').optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function useContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Submit to API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    reset();
    return response.json();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}

// Example: User registration schema
const registrationSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function useRegistrationForm() {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  return form;
}
`;

// ============================================
// 7. Authentication (NextAuth.js)
// ============================================

export const AUTHENTICATION_TEMPLATE = `
import NextAuth from 'next-auth';
import { useSession, signIn, signOut } from 'next-auth/react';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

// NextAuth configuration
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials against your database
        const user = await validateUser(credentials);
        if (user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// Custom hooks
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signOut,
  };
}

// Protected page wrapper
export function withAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      signIn();
      return null;
    }

    return <Component {...props} />;
  };
}
`;

// Export all templates
export const DATA_INTEGRATION_TEMPLATES = {
  restApi: REST_API_TEMPLATE,
  supabase: SUPABASE_TEMPLATE,
  graphql: GRAPHQL_TEMPLATE,
  firebase: FIREBASE_TEMPLATE,
  stateManagement: STATE_MANAGEMENT_TEMPLATE,
  formHandling: FORM_HANDLING_TEMPLATE,
  authentication: AUTHENTICATION_TEMPLATE,
};

// Helper to get template by name
export function getDataIntegrationTemplate(
  name: keyof typeof DATA_INTEGRATION_TEMPLATES
): string {
  return DATA_INTEGRATION_TEMPLATES[name];
}

// Example usage documentation
export const EXAMPLE_USAGE = `
// 1. Install dependencies
npm install swr @supabase/supabase-js @apollo/client firebase zustand react-hook-form zod next-auth

// 2. Import the template you need
import { REST_API_TEMPLATE } from './data-integration';

// 3. Create a new file and paste the template
// e.g., lib/api.ts

// 4. Configure environment variables
// .env.local:
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.example.com/graphql
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXTAUTH_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

// 5. Use in your HubLab-exported components
import { useUsers } from '@/lib/api';

function MyDashboard() {
  const { users, isLoading, isError } = useUsers();

  // Your HubLab UI components here
}
`;
