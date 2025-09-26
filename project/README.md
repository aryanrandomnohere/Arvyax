# Arvyax Wellness Session Management - Frontend

A professional React frontend for managing wellness sessions (yoga/meditation flows) with JWT authentication, auto-save functionality, and immersive wellness design.

## Features

### 🔐 Authentication
- JWT-based login/register system
- Protected routes with automatic token validation
- localStorage token management
- Automatic redirect for unauthenticated users

### ✏️ Session Editor
- Real-time auto-save (5 seconds after inactivity or every 30 seconds)
- Visual feedback for save status
- Title, tags, and JSON URL fields
- Draft and publish workflow
- Professional form validation

### 📊 Dashboard
- Personal session management
- Search and filter functionality
- Session statistics and analytics
- Responsive card-based layout

### 🌍 Public Sessions
- Browse published wellness sessions
- Search by title or tags
- Community discovery features

### 🎨 Design
- Professional wellness-themed UI
- Calming color palette (greens, purples, oranges)
- Inter font family for readability
- Smooth animations and micro-interactions
- Fully responsive design
- Toast notifications for user feedback

## Tech Stack

- **React 18** with TypeScript
- **React Router Dom** for routing
- **React Hook Form** for form management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Date-fns** for date formatting
- **Vite** for development and building

## API Integration

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Sessions
- `GET /api/my-sessions` - Get user's sessions
- `POST /api/my-sessions` - Create new session
- `PUT /api/my-sessions/:id` - Update session
- `DELETE /api/my-sessions/:id` - Delete session
- `GET /api/sessions` - Get published sessions

### Expected Response Format
```typescript
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

interface WellnessSession {
  id: string;
  title: string;
  tags: string[];
  json_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id?: string;
}
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Update `VITE_API_URL` to match your backend URL.

3. **Development**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthForm.tsx    # Login/register form
│   ├── Layout.tsx      # Main app layout
│   ├── ProtectedRoute.tsx # Route protection
│   └── SessionCard.tsx # Session display card
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/             # Custom React hooks
│   └── useAutoSave.ts # Auto-save functionality
├── lib/               # Utilities and API
│   └── api.ts         # API client and types
├── pages/             # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── PublicSessions.tsx # Browse sessions
│   └── SessionEditor.tsx  # Create/edit sessions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Key Features Implementation

### JWT Authentication
- Tokens stored in localStorage
- Automatic token validation on app load
- Protected routes redirect to login
- Token included in API headers

### Auto-Save System
- Debounced saves (5 seconds after typing stops)
- Periodic saves (every 30 seconds)
- Visual feedback with toast notifications
- Prevents data loss during editing

### Professional UI/UX
- Loading states for all async operations
- Error handling with user-friendly messages
- Responsive design for all screen sizes
- Accessibility considerations
- Smooth animations and transitions

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Lazy loading of routes
- Optimized re-renders with proper React patterns
- Efficient state management
- Minimal bundle size with tree-shaking

## Contributing

This is a technical assignment project. The code demonstrates:

- Professional React development patterns
- Modern TypeScript usage
- Clean component architecture
- Proper error handling
- User experience best practices
- Production-ready code quality

## License

This project is created as part of a technical assignment for Arvyax.