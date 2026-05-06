# AGENTS.md

## Project Context
Full-stack Next.js application using Supabase (database + auth) and Vercel (deployment).

## AI Collaboration Rules

**Mandatory Skills:**
- Always use the `superpowers` skill when available
- Always use the `caveman` skill when available
- Reference these skills before making architectural decisions

**Git Commits:**
- Never add "Co-authored-by: AI" or similar attributions to commit messages
- Write commit messages as if you wrote the code yourself
- Keep commits focused and atomic

## Code Quality Principles

**DRY (Don't Repeat Yourself):**
- If any function is used more than once, extract it into a reusable utility
- If any component logic appears twice, create a shared component
- If any hook pattern repeats, create a custom hook
- **Zero tolerance for duplication** - even small helpers deserve extraction

**SOLID Principles for React:**
- **Single Responsibility**: Each component does one thing well
- **Open/Closed**: Use composition and props for extensibility, not modification
- **Liskov Substitution**: Component props should be predictable and consistent
- **Interface Segregation**: Don't force components to depend on props they don't use
- **Dependency Inversion**: Components depend on abstractions (props/hooks), not concrete implementations

**Component Organization:**
```typescript
// ❌ BAD - Logic mixed with UI
function UserProfile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser)
  }, [])
  return <div>{user?.name}</div>
}

// ✅ GOOD - Separated concerns
function UserProfile() {
  const { data: user } = useUser()
  return <UserProfileView user={user} />
}
```

## Data Fetching Standards

**All data fetching must be extracted into reusable functions:**

```typescript
// ❌ BAD - Inline fetch in component
useEffect(() => {
  supabase.from('users').select().then(({ data }) => setUsers(data))
}, [])

// ✅ GOOD - Extracted fetch function
// lib/api/users.ts
export async function getUsers() {
  const supabase = createClient()
  const { data, error } = await supabase.from('users').select()
  if (error) throw error
  return data
}

// components/UserList.tsx
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers
})
```

**Data fetching rules:**
- Every fetch operation lives in `/lib/api/` or similar
- Use React Query (or similar) for all client-side data fetching
- Query functions should be pure functions that can be imported and called anywhere
- Never inline API calls directly in components or hooks

## React/Next.js Architecture

**Component Extraction:**
- If JSX exceeds 100 lines, break into smaller components
- If you copy-paste JSX, you need a component
- If logic repeats, you need a custom hook

**Server vs Client Components (Brief):**
- Default to Server Components
- Use `'use client'` only when you need: hooks, event handlers, browser APIs
- Server: `createClient()` from `@/lib/supabase/server`
- Client: `createClient()` from `@/lib/supabase/client`

**File Structure:**
```
/app              # Routes and layouts
/components       # Shared components
  /ui             # Primitive/reusable UI components
/lib              # Business logic and utilities
  /api            # Data fetching functions
  /hooks          # Custom React hooks
  /utils          # Pure utility functions
/types            # TypeScript definitions
```

## Code Standards

**TypeScript:**
- Use TypeScript for all files
- Define interfaces for all data shapes
- Prefer `interface` over `type` for object shapes
- Export types alongside functions that use them

**Error Handling:**
- Always destructure `{ data, error }` from Supabase calls
- Handle errors explicitly - no silent failures
- Use try/catch for async operations

**Naming Conventions:**
- Components: `PascalCase` (UserProfile.tsx)
- Functions/variables: `camelCase` (getUserData)
- Constants: `UPPER_SNAKE_CASE` (API_BASE_URL)
- Files: Match export name (UserProfile.tsx exports UserProfile)

**Import Organization:**
```typescript
// 1. External dependencies
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal absolute imports
import { Button } from '@/components/ui/button'
import { getUsers } from '@/lib/api/users'

// 3. Relative imports
import { UserCard } from './UserCard'
```

## Anti-Patterns to Avoid

❌ Inline styles (use Tailwind classes or CSS modules)  
❌ Prop drilling beyond 2 levels (use context or composition)  
❌ Massive components (>200 lines = needs refactoring)  
❌ Direct DOM manipulation (use React state)  
❌ Mixing data fetching with UI logic  
❌ Copy-pasted code blocks  
❌ Forgetting to memoize expensive calculations  
❌ Using `any` type in TypeScript  

## Before Submitting Code

1. Did you extract all repeated logic into reusable functions/components/hooks?
2. Are all data fetches in separate, testable functions?
3. Does each component have a single, clear responsibility?
4. Are you using the appropriate Supabase client (server vs client)?
5. Have you handled all error cases?
6. Is the code TypeScript-safe with no `any` types?
7. Would another developer understand this in 6 months?
