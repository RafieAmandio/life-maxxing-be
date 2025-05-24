# V0 Prompt: Life Maxxing Frontend App

## Project Overview
Build a modern, responsive web application for "Life Maxxing" - a group-based task accountability app. Users form small groups (max 4 people), create daily and personal tasks, upload photo proof of completion, and verify each other's progress to maintain accountability.

## App Concept & User Flow
1. **Authentication**: Users register/login to access the platform
2. **Group Management**: Create groups or join existing ones via invite codes
3. **Task Creation**: Set up daily tasks (shared by group) and personal tasks
4. **Daily Completion**: Upload photo proof of task completion with optional notes
5. **Peer Verification**: Group members verify each other's completed tasks
6. **Progress Tracking**: View statistics, streaks, and group leaderboards

## Core Features to Implement

### 🔐 Authentication & Profile
- [ ] Register/Login forms with validation
- [ ] User profile management (name, avatar upload)
- [ ] Protected routes with JWT token handling
- [ ] Profile picture display throughout the app

### 👥 Group Management
- [ ] Create new group form (name, description)
- [ ] Join group via invite code
- [ ] Group dashboard showing members and invite code
- [ ] Group statistics and leaderboards
- [ ] Leave group functionality

### ✅ Task System
- [ ] Create daily tasks (visible to all group members)
- [ ] Create personal tasks (individual goals)
- [ ] Task list views with completion status
- [ ] Task completion form with image upload and notes
- [ ] Verification system for peer accountability

### 📊 Progress & Statistics
- [ ] User statistics dashboard (completion rate, streaks)
- [ ] Group progress overview
- [ ] Weekly progress charts
- [ ] Member leaderboards

### 📱 Mobile-First Design
- [ ] Responsive design that works on all devices
- [ ] Touch-friendly interface for mobile users
- [ ] Camera integration for photo uploads
- [ ] Optimized for daily mobile usage

## Technical Requirements

### Frontend Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS for modern, clean design
- **State Management**: React Context or Zustand for global state
- **HTTP Client**: Fetch API or Axios for API calls
- **File Upload**: Handle multipart form data for image uploads
- **Routing**: React Router for navigation
- **Form Handling**: React Hook Form with validation

### API Integration
- Base URL: `http://localhost:3000/api`
- JWT token authentication (store in localStorage/sessionStorage)
- Handle all CRUD operations as defined in API documentation
- Implement proper error handling and loading states
- File upload handling for avatars and proof images

## UI/UX Design Guidelines

### Design Theme
- **Style**: Modern, clean, motivational
- **Colors**: Energetic but professional (blues, greens, with accent colors)
- **Typography**: Clear, readable fonts
- **Layout**: Card-based design with clean spacing

### Key UI Components Needed
1. **Navigation**: Header with user avatar, notifications, navigation
2. **Cards**: Task cards, completion cards, member cards
3. **Forms**: Clean form inputs with validation
4. **Buttons**: Primary, secondary, and action buttons
5. **Modals**: For task creation, image viewing, confirmations
6. **Charts**: Simple progress visualization
7. **Image Upload**: Drag-and-drop or click-to-upload areas
8. **Feed**: Activity feed showing group completions

### User Experience Priorities
- **Simplicity**: Easy daily task completion flow
- **Visual Feedback**: Clear completion status, verification badges
- **Social Elements**: See group member activity and progress
- **Motivation**: Progress streaks, achievements, leaderboards
- **Mobile-First**: Optimized for quick daily check-ins

## Page Structure & Routes

### Main Pages
1. **Landing/Auth** (`/`, `/login`, `/register`)
2. **Dashboard** (`/dashboard`) - Overview of user's groups and today's tasks
3. **Group Detail** (`/groups/:id`) - Specific group with tasks and members
4. **Task Management** (`/groups/:id/tasks`) - Create and manage tasks
5. **Profile** (`/profile`) - User settings and statistics
6. **Statistics** (`/stats`) - Detailed progress analytics

### Component Hierarchy Example
```
App
├── AuthProvider (JWT token management)
├── Header (navigation, user menu)
├── Routes
│   ├── Dashboard
│   │   ├── TodaysTasks
│   │   ├── GroupsList
│   │   └── QuickStats
│   ├── GroupDetail
│   │   ├── GroupHeader
│   │   ├── MembersList
│   │   ├── DailyTasks
│   │   ├── PersonalTasks
│   │   └── RecentCompletions
│   └── Profile
│       ├── ProfileForm
│       ├── AvatarUpload
│       └── UserStats
└── Footer
```

## Key Functionality Details

### Authentication Flow
- Store JWT token securely
- Automatic token refresh if needed
- Redirect to login if token expires
- Show loading states during auth checks

### Task Completion Flow
1. User sees today's tasks (daily + personal)
2. Click "Complete" button on a task
3. Modal opens with camera/file upload
4. Add optional notes
5. Submit with loading state
6. Show success message and update UI
7. Other group members can verify completion

### Image Handling
- Support camera capture on mobile devices
- Image preview before upload
- Compress images for faster upload
- Display proof images in completion feed
- Click to enlarge images

### Real-time Updates (Nice to Have)
- Consider WebSocket integration for live updates
- Show when group members complete tasks
- Notifications for verification requests

## Sample Data Structures (from API)

Use these TypeScript interfaces for type safety:

```typescript
interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
  inviteCode: string;
  members: GroupMember[];
}

interface Task {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  creator: User;
  completions: TaskCompletion[];
}

interface TaskCompletion {
  id: number;
  proofImageUrl: string;
  notes?: string;
  isVerified: boolean;
  user: User;
  verifiedBy?: User;
}
```

## Success Metrics
The app should feel like a supportive community tool that:
- Makes daily task completion feel rewarding
- Encourages consistent habit building
- Provides gentle peer pressure through accountability
- Celebrates progress and achievements
- Maintains user engagement through social features

## Getting Started
1. Set up the React app with TypeScript and Tailwind CSS
2. Implement authentication flow first
3. Build the dashboard with group overview
4. Create task completion flow with image upload
5. Add verification and social features
6. Implement statistics and progress tracking

Please use the attached API documentation for exact endpoint details, request/response formats, and authentication requirements. Focus on creating a polished, mobile-first experience that encourages daily engagement and positive habit formation. 