# Life Maxxing Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": null,
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
**GET** `/auth/me` 🔒

Get current authenticated user profile.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "/uploads/avatars/avatar-123456.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 👤 User Endpoints

### Get User Profile
**GET** `/users/profile` 🔒

Get current user's profile information.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "/uploads/avatars/avatar-123456.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update User Profile
**PUT** `/users/profile` 🔒

Update user's profile information.

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "profileImageUrl": "/uploads/avatars/avatar-123456.jpg",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Upload Avatar
**POST** `/users/upload-avatar` 🔒

Upload user profile avatar image.

**Request:** Multipart form data
- `avatar`: Image file (JPG, PNG, GIF, max 5MB)

**Response (200):**
```json
{
  "message": "Avatar uploaded successfully",
  "profileImageUrl": "/uploads/avatars/avatar-123456.jpg",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "/uploads/avatars/avatar-123456.jpg",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Get User Statistics
**GET** `/users/stats?groupId={groupId}&period={period}` 🔒

Get user's completion statistics.

**Query Parameters:**
- `groupId` (optional): Filter stats by specific group
- `period` (optional): `week`, `month`, or `all` (default: `all`)

**Response (200):**
```json
{
  "stats": {
    "completionRate": 85.5,
    "currentStreak": 7,
    "longestStreak": 14,
    "totalCompletions": 45,
    "weeklyProgress": [
      { "date": "2024-01-01", "completions": 3 },
      { "date": "2024-01-02", "completions": 2 },
      { "date": "2024-01-03", "completions": 4 }
    ]
  }
}
```

### Get User Completions
**GET** `/users/my-completions?groupId={groupId}&date={date}` 🔒

Get user's task completions.

**Query Parameters:**
- `groupId` (optional): Filter by specific group
- `date` (optional): Filter by date (YYYY-MM-DD format)

**Response (200):**
```json
{
  "completions": [
    {
      "id": 1,
      "proofImageUrl": "/uploads/proofs/proof-123456.jpg",
      "completionDate": "2024-01-01",
      "notes": "Completed morning workout!",
      "isVerified": true,
      "createdAt": "2024-01-01T08:00:00.000Z",
      "dailyTask": {
        "id": 1,
        "title": "Morning Workout",
        "description": "30 minutes of exercise"
      },
      "personalTask": null,
      "group": {
        "id": 1,
        "name": "Fitness Buddies"
      }
    }
  ]
}
```

---

## 👥 Group Endpoints

### Create Group
**POST** `/groups` 🔒

Create a new group.

**Request Body:**
```json
{
  "name": "Fitness Buddies",
  "description": "Daily fitness accountability group"
}
```

**Response (201):**
```json
{
  "message": "Group created successfully",
  "group": {
    "id": 1,
    "name": "Fitness Buddies",
    "description": "Daily fitness accountability group",
    "inviteCode": "ABC123",
    "maxMembers": 4,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "members": [
      {
        "id": 1,
        "role": "ADMIN",
        "joinedAt": "2024-01-01T12:00:00.000Z",
        "user": {
          "id": 1,
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe",
          "profileImageUrl": null
        }
      }
    ],
    "creator": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "inviteCode": "ABC123"
}
```

### Join Group
**POST** `/groups/join` 🔒

Join a group using invite code.

**Request Body:**
```json
{
  "inviteCode": "ABC123"
}
```

**Response (200):**
```json
{
  "message": "Successfully joined the group",
  "group": {
    "id": 1,
    "name": "Fitness Buddies",
    "description": "Daily fitness accountability group",
    "inviteCode": "ABC123",
    "members": [
      {
        "id": 1,
        "role": "ADMIN",
        "user": {
          "id": 1,
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe"
        }
      },
      {
        "id": 2,
        "role": "MEMBER",
        "user": {
          "id": 2,
          "username": "jane_smith",
          "firstName": "Jane",
          "lastName": "Smith"
        }
      }
    ]
  }
}
```

### Get User's Groups
**GET** `/groups/my-groups` 🔒

Get all groups the user is a member of.

**Response (200):**
```json
{
  "groups": [
    {
      "group": {
        "id": 1,
        "name": "Fitness Buddies",
        "description": "Daily fitness accountability group",
        "inviteCode": "ABC123",
        "maxMembers": 4,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "creator": {
          "id": 1,
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe"
        }
      },
      "memberCount": 2,
      "myRole": "ADMIN",
      "joinedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Get Group Details
**GET** `/groups/{groupId}` 🔒

Get detailed information about a specific group.

**Response (200):**
```json
{
  "group": {
    "id": 1,
    "name": "Fitness Buddies",
    "description": "Daily fitness accountability group",
    "inviteCode": "ABC123",
    "maxMembers": 4,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "members": [
      {
        "id": 1,
        "role": "ADMIN",
        "joinedAt": "2024-01-01T12:00:00.000Z",
        "user": {
          "id": 1,
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe",
          "profileImageUrl": "/uploads/avatars/avatar-123.jpg"
        }
      }
    ],
    "dailyTasks": [
      {
        "id": 1,
        "title": "Morning Workout",
        "description": "30 minutes of exercise",
        "isActive": true,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "creator": {
          "id": 1,
          "username": "john_doe"
        }
      }
    ],
    "creator": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Leave Group
**DELETE** `/groups/{groupId}/leave` 🔒

Leave a group.

**Response (200):**
```json
{
  "message": "Successfully left the group"
}
```

### Get Group Statistics
**GET** `/groups/{groupId}/stats?period={period}` 🔒

Get group statistics and leaderboards.

**Query Parameters:**
- `period` (optional): `week`, `month`, or `all` (default: `all`)

**Response (200):**
```json
{
  "groupStats": {
    "totalTasks": 5,
    "completionRate": 78.5,
    "totalCompletions": 157
  },
  "memberStats": [
    {
      "user": {
        "id": 1,
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "completionCount": 45,
      "role": "ADMIN"
    },
    {
      "user": {
        "id": 2,
        "username": "jane_smith",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "completionCount": 38,
      "role": "MEMBER"
    }
  ],
  "taskStats": [
    {
      "task": {
        "id": 1,
        "title": "Morning Workout",
        "creator": {
          "id": 1,
          "username": "john_doe"
        }
      },
      "completionCount": 28
    }
  ]
}
```

---

## ✅ Task Endpoints

### Create Daily Task
**POST** `/tasks/groups/{groupId}/daily-tasks` 🔒

Create a new daily task for the group.

**Request Body:**
```json
{
  "title": "Morning Workout",
  "description": "Complete 30 minutes of physical exercise"
}
```

**Response (201):**
```json
{
  "message": "Daily task created successfully",
  "task": {
    "id": 1,
    "title": "Morning Workout",
    "description": "Complete 30 minutes of physical exercise",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "creator": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "group": {
      "id": 1,
      "name": "Fitness Buddies"
    }
  }
}
```

### Get Group Daily Tasks
**GET** `/tasks/groups/{groupId}/daily-tasks` 🔒

Get all daily tasks for a group with today's completions.

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Morning Workout",
      "description": "Complete 30 minutes of physical exercise",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "creator": {
        "id": 1,
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "completions": [
        {
          "id": 1,
          "proofImageUrl": "/uploads/proofs/proof-123.jpg",
          "notes": "Great workout today!",
          "isVerified": false,
          "createdAt": "2024-01-01T08:00:00.000Z",
          "user": {
            "id": 2,
            "username": "jane_smith",
            "firstName": "Jane",
            "lastName": "Smith",
            "profileImageUrl": null
          }
        }
      ]
    }
  ]
}
```

### Update Daily Task
**PUT** `/tasks/daily-tasks/{taskId}` 🔒

Update a daily task (creator or admin only).

**Request Body:**
```json
{
  "title": "Updated Morning Workout",
  "description": "Complete 45 minutes of physical exercise",
  "isActive": true
}
```

**Response (200):**
```json
{
  "message": "Daily task updated successfully",
  "task": {
    "id": 1,
    "title": "Updated Morning Workout",
    "description": "Complete 45 minutes of physical exercise",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "creator": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Delete Daily Task
**DELETE** `/tasks/daily-tasks/{taskId}` 🔒

Delete a daily task (creator or admin only).

**Response (200):**
```json
{
  "message": "Daily task deleted successfully"
}
```

### Create Personal Task
**POST** `/tasks/groups/{groupId}/personal-tasks` 🔒

Create a personal task within a group.

**Request Body:**
```json
{
  "title": "Read 30 Pages",
  "description": "Read 30 pages of a self-development book"
}
```

**Response (201):**
```json
{
  "message": "Personal task created successfully",
  "task": {
    "id": 1,
    "title": "Read 30 Pages",
    "description": "Read 30 pages of a self-development book",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "user": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "group": {
      "id": 1,
      "name": "Fitness Buddies"
    }
  }
}
```

### Get Group Personal Tasks
**GET** `/tasks/groups/{groupId}/personal-tasks` 🔒

Get user's personal tasks for a specific group.

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Read 30 Pages",
      "description": "Read 30 pages of a self-development book",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "completions": [
        {
          "id": 1,
          "proofImageUrl": "/uploads/proofs/proof-456.jpg",
          "notes": "Finished chapter 3",
          "isVerified": true,
          "createdAt": "2024-01-01T20:00:00.000Z",
          "user": {
            "id": 1,
            "username": "john_doe",
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  ]
}
```

### Complete Daily Task
**POST** `/tasks/complete/daily/{taskId}` 🔒

Complete a daily task with proof image.

**Request:** Multipart form data
- `proofImage`: Image file (required)
- `notes`: Text notes (optional)

**Response (201):**
```json
{
  "message": "Task completed successfully",
  "completion": {
    "id": 1,
    "proofImageUrl": "/uploads/proofs/proof-123456.jpg",
    "completionDate": "2024-01-01",
    "notes": "Great workout session!",
    "isVerified": false,
    "createdAt": "2024-01-01T08:00:00.000Z",
    "dailyTask": {
      "id": 1,
      "title": "Morning Workout",
      "description": "Complete 30 minutes of physical exercise",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "user": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "group": {
      "id": 1,
      "name": "Fitness Buddies"
    }
  }
}
```

### Complete Personal Task
**POST** `/tasks/complete/personal/{taskId}` 🔒

Complete a personal task with proof image.

**Request:** Multipart form data
- `proofImage`: Image file (required)
- `notes`: Text notes (optional)

**Response (201):**
```json
{
  "message": "Task completed successfully",
  "completion": {
    "id": 2,
    "proofImageUrl": "/uploads/proofs/proof-789012.jpg",
    "completionDate": "2024-01-01",
    "notes": "Finished reading chapter 5",
    "isVerified": false,
    "createdAt": "2024-01-01T20:00:00.000Z",
    "personalTask": {
      "id": 1,
      "title": "Read 30 Pages",
      "description": "Read 30 pages of a self-development book",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "user": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "group": {
      "id": 1,
      "name": "Fitness Buddies"
    }
  }
}
```

### Get Group Completions
**GET** `/tasks/groups/{groupId}/completions?date={date}` 🔒

Get all task completions for a group on a specific date.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format (default: today)

**Response (200):**
```json
{
  "completions": [
    {
      "id": 1,
      "proofImageUrl": "/uploads/proofs/proof-123456.jpg",
      "completionDate": "2024-01-01",
      "notes": "Great workout session!",
      "isVerified": true,
      "createdAt": "2024-01-01T08:00:00.000Z",
      "user": {
        "id": 1,
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe",
        "profileImageUrl": "/uploads/avatars/avatar-123.jpg"
      },
      "dailyTask": {
        "id": 1,
        "title": "Morning Workout",
        "description": "Complete 30 minutes of physical exercise"
      },
      "personalTask": null
    },
    {
      "id": 2,
      "proofImageUrl": "/uploads/proofs/proof-789012.jpg",
      "completionDate": "2024-01-01",
      "notes": "Finished reading",
      "isVerified": false,
      "createdAt": "2024-01-01T20:00:00.000Z",
      "user": {
        "id": 2,
        "username": "jane_smith",
        "firstName": "Jane",
        "lastName": "Smith",
        "profileImageUrl": null
      },
      "dailyTask": null,
      "personalTask": {
        "id": 1,
        "title": "Read 30 Pages",
        "description": "Read 30 pages of a self-development book"
      }
    }
  ]
}
```

### Verify Task Completion
**POST** `/tasks/completions/{completionId}/verify` 🔒

Verify another user's task completion.

**Response (200):**
```json
{
  "message": "Completion verified successfully",
  "completion": {
    "id": 1,
    "proofImageUrl": "/uploads/proofs/proof-123456.jpg",
    "completionDate": "2024-01-01",
    "notes": "Great workout session!",
    "isVerified": true,
    "createdAt": "2024-01-01T08:00:00.000Z",
    "user": {
      "id": 2,
      "username": "jane_smith",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "verifiedBy": {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "dailyTask": {
      "id": 1,
      "title": "Morning Workout",
      "description": "Complete 30 minutes of physical exercise",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

---

## 📋 Data Models

### User
```typescript
interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Group
```typescript
interface Group {
  id: number;
  name: string;
  description?: string;
  inviteCode: string;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  creator: User;
  members: GroupMember[];
}
```

### GroupMember
```typescript
interface GroupMember {
  id: number;
  role: "ADMIN" | "MEMBER";
  joinedAt: string;
  user: User;
}
```

### DailyTask
```typescript
interface DailyTask {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  creator: User;
  completions: TaskCompletion[];
}
```

### PersonalTask
```typescript
interface PersonalTask {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  user: User;
  completions: TaskCompletion[];
}
```

### TaskCompletion
```typescript
interface TaskCompletion {
  id: number;
  proofImageUrl: string;
  completionDate: string;
  notes?: string;
  isVerified: boolean;
  createdAt: string;
  user: User;
  verifiedBy?: User;
  dailyTask?: DailyTask;
  personalTask?: PersonalTask;
  group: Group;
}
```

---

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Access denied. No token provided."
}
```

### Authorization Error (403)
```json
{
  "error": "You are not a member of this group"
}
```

### Not Found Error (404)
```json
{
  "error": "Resource not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Usage Examples

### Complete Registration & Login Flow
```javascript
// 1. Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'username',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

// 2. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// 3. Use token for authenticated requests
const userGroups = await fetch('/api/groups/my-groups', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Create Group and Tasks Flow
```javascript
// 1. Create a group
const groupResponse = await fetch('/api/groups', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Accountability Group',
    description: 'Daily habits and goals'
  })
});

const { group, inviteCode } = await groupResponse.json();

// 2. Create a daily task
const taskResponse = await fetch(`/api/tasks/groups/${group.id}/daily-tasks`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Morning Exercise',
    description: '30 minutes of physical activity'
  })
});

// 3. Complete the task with proof
const formData = new FormData();
formData.append('proofImage', imageFile);
formData.append('notes', 'Completed my workout!');

const completionResponse = await fetch(`/api/tasks/complete/daily/${taskId}`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

## 🔗 Static File URLs

### Avatar Images
```
GET /uploads/avatars/{filename}
```

### Proof Images
```
GET /uploads/proofs/{filename}
```

### Health Check
```
GET /health
```

Returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
``` 