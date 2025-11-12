# Firebase Firestore Integration

Quick guide to connecting HubLab UI to Firebase.

## Install
```bash
npm install firebase
```

## Setup
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## Usage
```typescript
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function createUser(userData) {
  return await addDoc(collection(db, 'users'), userData);
}
```

**Time:** 15-20 minutes
