# Life Maxxing Backend API

A Node.js backend API for "Life Maxxing" - a group-based task accountability app where users form groups of 4 people, complete daily and personal tasks, and upload photo proof of completion.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Group Management**: Create groups, join with invite codes, manage memberships
- **Task System**: Daily tasks (shared) and personal tasks with photo proof
- **Task Completion**: Upload proof images and get verified by group members
- **Statistics**: Track completion rates, streaks, and progress
- **File Upload**: Secure image upload for avatars and task proof

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Upload**: Multer for image handling
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## 🔧 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/lifemaxxing?schema=public"
JWT_SECRET=your_super_secret_jwt_key_here
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Start Server
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Groups
- `POST /api/groups` - Create new group
- `POST /api/groups/join` - Join group with invite code
- `GET /api/groups/my-groups` - Get user's groups
- `GET /api/groups/:groupId` - Get group details

### Tasks
- `POST /api/tasks/groups/:groupId/daily-tasks` - Create daily task
- `POST /api/tasks/groups/:groupId/personal-tasks` - Create personal task
- `POST /api/tasks/complete/daily/:taskId` - Complete daily task
- `GET /api/tasks/groups/:groupId/completions` - Get group completions

### Users
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-avatar` - Upload avatar
- `GET /api/users/stats` - Get user statistics

## 📝 Sample Data

After seeding:
- Users: john@example.com, jane@example.com (password: password123)
- Group: "Fitness Buddies" (invite code: DEMO123)

## 🚀 Scripts

```bash
npm run dev          # Development server
npm start           # Production server
npm run db:migrate  # Run migrations
npm run db:seed     # Seed database
``` 