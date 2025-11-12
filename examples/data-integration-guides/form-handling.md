# Form Handling with React Hook Form + Zod

Quick guide to adding validation to HubLab forms.

## Install
```bash
npm install react-hook-form @hookform/resolvers zod
```

## Usage
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <textarea {...register('message')} />
      {errors.message && <span>{errors.message.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

**Time:** 10-15 minutes
