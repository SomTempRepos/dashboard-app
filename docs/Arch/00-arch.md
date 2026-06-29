# Final MVP Plan — Work Management Dashboard

---

## 1. Tech Stack

### Backend
| Component | Choice |
|---|---|
| Language | Python |
| Framework | FastAPI |
| Auth | JWT (python-jose) |
| Password | Bcrypt (passlib) |
| Storage | TinyDB (JSON) |
| Validation | Pydantic |
| Server | Uvicorn |

### Frontend
| Component | Choice |
|---|---|
| Framework | React (Vite) |
| UI Library | Ant Design |
| Server State | TanStack Query |
| Client State | Zustand |
| API Calls | Axios |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Dates | Dayjs |

---

### Dependencies

**Backend**
```
fastapi
uvicorn
python-jose[cryptography]
passlib[bcrypt]
tinydb
pydantic
python-multipart
```

**Frontend**
```
react + vite
antd
@tanstack/react-query
zustand
axios
react-router-dom
react-hook-form
zod
dayjs
```

---

## 2. Data Models

### Users
```json
{
  "id": "uuid",
  "name": "",
  "email": "",
  "password": "hashed",
  "team_ids": [],
  "created_at": ""
}
```

### Tasks
```json
{
  "id": "uuid",
  "title": "",
  "description": "",
  "status": "todo/in-progress/done",
  "priority": "low/medium/high",
  "assigned_to": ["user_ids"],
  "team_id": "uuid or null",
  "created_by": "user_id",
  "due_date": "",
  "created_at": ""
}
```

### Teams
```json
{
  "id": "uuid",
  "name": "",
  "member_ids": [],
  "created_by": "user_id",
  "created_at": ""
}
```

---

## 3. API Routes

### Auth
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/reset-password
```

### Users
```
GET    /users/me
PUT    /users/me
DELETE /users/me
```

### Tasks
```
POST   /tasks/
GET    /tasks/              ← my tasks
GET    /tasks/team/{id}     ← team tasks
PUT    /tasks/{id}
DELETE /tasks/{id}
PATCH  /tasks/{id}/status
```

### Teams
```
POST   /teams/
GET    /teams/
GET    /teams/{id}
PUT    /teams/{id}
DELETE /teams/{id}
POST   /teams/{id}/members
DELETE /teams/{id}/members/{user_id}
```

---

## 4. Frontend Pages

```
/login              → Login
/register           → Register
/reset-password     → Reset Password
/dashboard          → Main Dashboard
/tasks              → My Tasks
/teams              → Teams
/teams/{id}         → Team Details
/profile            → Profile Settings
```

---

## 5. Folder Structure

```
project/
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── tasks.py
│   │   └── teams.py
│   ├── models/
│   │   ├── user_model.py
│   │   ├── task_model.py
│   │   └── team_model.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── task_service.py
│   │   └── team_service.py
│   ├── utils/
│   │   └── db.py
│   └── data/
│       ├── users.json
│       ├── tasks.json
│       └── teams.json
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ResetPassword.jsx
        │   ├── Dashboard.jsx
        │   ├── Tasks.jsx
        │   ├── Teams.jsx
        │   ├── TeamDetails.jsx
        │   └── Profile.jsx
        ├── components/
        │   ├── Layout.jsx
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskForm.jsx
        │   ├── TeamCard.jsx
        │   └── TeamForm.jsx
        ├── store/
        │   └── useAuthStore.js
        ├── api/
        │   ├── axios.js
        │   ├── authApi.js
        │   ├── tasksApi.js
        │   └── teamsApi.js
        └── utils/
            └── helpers.js
```

---

## 6. Build Phases

### Phase 1 — Setup
```
- Init FastAPI project
- Init React + Vite project
- Install all dependencies
- Setup TinyDB connection
- Setup JWT config
- Setup Axios instance
- Setup React Router
- Setup TanStack Query
- Setup Zustand store
```

### Phase 2 — Backend Auth
```
- User register
- User login → JWT token
- User logout
- Reset password
- Get / Update / Delete profile
```

### Phase 3 — Backend Tasks
```
- Create task
- Get my tasks
- Get team tasks
- Update task
- Delete task
- Update task status
```

### Phase 4 — Backend Teams
```
- Create team
- Get my teams
- Get single team
- Update team
- Delete team
- Add / Remove members
```

### Phase 5 — Frontend Auth
```
- Login page
- Register page
- Reset password page
- JWT token storage
- Protected routes
- Auth Zustand store
```

### Phase 6 — Frontend Dashboard
```
- Layout ( Sidebar + Navbar )
- Welcome section
- My tasks summary ( counts by status )
- Recent tasks list
- My teams quick view
- Team tasks summary
```

### Phase 7 — Frontend Tasks
```
- Full tasks list
- Filter by status / priority
- Add task ( modal + form )
- Edit task ( modal + form )
- Delete task
- Quick status update
- Assign to users
```

### Phase 8 — Frontend Teams
```
- Teams list
- Create team
- Team details page
- Members list
- Add / Remove members
- Team tasks list
```

### Phase 9 — Testing & Fixes
```
- Test all API endpoints
- Test all frontend flows
- Error handling
- Loading states
- Bug fixes
```

---

## 7. Key Rules & Decisions

```
- JWT stored in LocalStorage ( simple for MVP )
- Passwords always Bcrypt hashed
- All IDs are UUIDs
- Task status  : todo / in-progress / done
- Task priority: low / medium / high
- TinyDB handles all JSON read/write
- One TinyDB instance shared across services
- CORS enabled for local development
```

---

## 8. Out of Scope

```
- Email verification
- Real-time updates
- Notifications
- File attachments
- Comments on tasks
- Activity logs
- Pagination
- Dark mode
```

---

## ✅ Status

```
Tech Stack        → Final ✅
Data Models       → Final ✅
API Routes        → Final ✅
Pages             → Final ✅
Folder Structure  → Final ✅
Build Order       → Final ✅
```

---

