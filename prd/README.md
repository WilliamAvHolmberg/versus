# Versus - AI Model Comparison Platform

## Project Overview
Versus is a platform that enables users to compare HTML content generation across multiple AI models simultaneously. Users can input a single prompt and see how different models interpret and generate HTML content, complete with performance metrics and side-by-side comparisons.

## Core Value Proposition
- Instant comparison of multiple AI models
- Performance and cost transparency
- Easy-to-use interface
- No account required to start

## Target Users
- Developers
- Content creators
- AI enthusiasts
- UX/UI designers

## Project Timeline
- Phase 1: Core Features (MVP)
- Phase 2: User Enhancement
- Phase 3: Advanced Features

## Current Status
Project in planning phase - awaiting implementation start.

See individual feature files for detailed specifications and status tracking.

# Technical Specifications

## Technology Stack
- Frontend: Next.js
- Backend: Next.js Server Actions
- Database: PostgreSQL
- AI Integration: OpenRouter API

## Architecture Overview
- Full-stack Next.js application
- Server-side rendering for optimal performance
- API routes handled through Next.js Server Actions
- Serverless deployment

## Data Models

### Generation
```typescript
interface Generation {
  id: string;
  prompt: string;
  createdAt: Date;
  userId: string;  // temp ID for anonymous users
  isPublic: boolean;
  results: ModelResult[];
}

interface ModelResult {
  id: string;
  generationId: string;
  modelId: string;
  generatedHtml: string;
  executionTime: number;
  cost: number;
  error?: string;
  createdAt: Date;
}
```

### User (Phase 2)
```typescript
interface User {
  id: string;
  email: string;
  createdAt: Date;
  tempUserId?: string;  // for linking anonymous history
}
```

# Phase 1: Core Features (MVP)

## 1. Landing Page [Status: In Progress]
### Requirements
- Clean, minimal interface
- Prominent prompt input
- Model selection interface
- Recent generations display (30 most recent)
- Suggested prompts section

### Acceptance Criteria
- [x] Prompt input is clearly visible above the fold
- [x] Model selection is intuitive and clear
- [ ] Recent generations load automatically
- [x] Responsive design works on all devices

### Implementation Progress
- ✅ Clean hero section with prominent prompt input
- ✅ Two-column layout (3/5 generations, 2/5 model selection)
- ✅ Model selection with search functionality
- ⏳ Recent generations API integration
- 🔄 Next: Implement generations API
- ⏳ TODO: Add suggested prompts section

## 2. Generation Process [Status: In Progress]
### Requirements
- Multi-model selection
- Real-time generation status
- Error handling
- Performance metrics tracking

### Acceptance Criteria
- [x] Users can select multiple models
- [x] Generation progress is clearly visible
- [x] Errors are handled gracefully
- [x] Database schema implemented for storing generations and results
- [x] Time and cost metrics are recorded

### Implementation Progress
- ✅ Database schema created with Prisma
- ✅ Basic data models defined
- ✅ Server action created for generation
- ✅ Anonymous user tracking implemented
- ✅ Error handling and loading states
- 🔄 Next: Implement real-time generation status updates

## 3. Results Display [Status: In Progress]
### Requirements
- Grid layout for results
- Preview cards
- Expandable full-view
- Performance metrics display
- Basic sharing functionality

### Acceptance Criteria
- [x] Results display in a responsive grid
- [x] Each result shows preview and metrics
- [x] Full view shows complete HTML
- [x] Share button generates shareable link

### Implementation Progress
- ✅ Grid layout with preview cards
- ✅ HTML preview with iframes
- ✅ Copy HTML functionality
- ✅ Performance metrics display (time/cost)
- ✅ Error state handling
- 🔄 Next: Implement expandable full-view

## 4. Anonymous User System [Status: In Progress]
### Requirements
- LocalStorage-based user tracking
- History tracking for anonymous users
- Basic history view

### Acceptance Criteria
- [x] TempUserID generated and stored
- [x] Anonymous users can view their history
- [x] History persists across sessions

### Implementation Progress
- ✅ Cookie-based user tracking implemented
- ✅ Server-side cookie reading for SSR
- ✅ Client-side cookie persistence (1 year expiry)
- ✅ Anonymous user history tracking
- 🔄 Next: Implement user dashboard and favorites

### Technical Details
```typescript
// Root page (page.tsx) - Server Component
export default async function Page() {
  return <CookieProvider />;
}

// Server-side cookie reading (CookieProvider.tsx)
"use server"
export async function CookieProvider() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  return <HomePage initialUserId={userId} />;
}

// Client-side cookie handling (HomePage.tsx)
"use client"
useEffect(() => {
  if (!initialUserId) {
    const newUserId = uuidv4();
    setCookie("userId", newUserId, { maxAge: 60 * 60 * 24 * 365 });
  }
}, [initialUserId]);
```

### Architecture Notes
- Three-layer cookie handling:
  1. Async Server Page (root)
  2. Async Cookie Provider (server)
  3. Client Component (cookie management)
- Server components use async cookies() from next/headers
- Client components use cookies-next for persistence
- Cookie provider pattern ensures:
  - Proper SSR handling
  - Async cookie reading
  - Clean separation of concerns

# Phase 2: User Enhancements

## 1. Registration Flow [Status: Not Started]
### Requirements
- Email-only registration
- Second-prompt registration modal
- History migration

### Acceptance Criteria
- [ ] Modal appears after second generation
- [ ] Email-only registration works
- [ ] Anonymous history migrates to new account
- [ ] User receives confirmation

## 2. User Dashboard [Status: Not Started]
### Requirements
- Generation history view
- Basic filtering
- Favorites system

### Acceptance Criteria
- [ ] Users can view all their generations
- [ ] Basic search/filter functionality
- [ ] Favorite/unfavorite generations
- [ ] Clear history organization

# Future Improvements

## Planned Enhancements
1. **Model Filtering/Categorization**
   - Model categories
   - Quick filters
   - Favorite models

2. **Prompt Templates**
   - Common use case templates
   - Category-based prompts
   - User-saved templates

3. **Cost Estimation**
   - Pre-generation cost estimates
   - Budget warnings
   - Usage tracking

4. **Analytics Dashboard**
   - Model performance comparisons
   - Cost analysis
   - Generation time statistics

5. **Advanced Sharing**
   - Generation collections
   - Embedded views
   - Export formats

6. **Team Collaboration**
   - Shared workspaces
   - Team permissions
   - Collaborative prompting

## Nice-to-Have Features
- API access
- Custom model integration
- Prompt optimization suggestions
- A/B testing capabilities
- Error handling, taking care of openrouter
- Pre select models

- load result individually, either stream full response or individual requests