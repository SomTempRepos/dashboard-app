## Frontend UI Plan — Work Management Dashboard

---

## 1. Core Concept

```
Mobile / Tablet  → Feels like a Native Mobile App
                   - Bottom navigation bar
                   - Full screen pages
                   - Card based UI
                   - Touch friendly
                   - No sidebars

Desktop          → Normal Web Dashboard
                   - Left sidebar
                   - Top navbar
                   - Multi column layouts
                   - Data tables
                   - More information density
```

---

## 2. Breakpoints ( Ant Design Grid )

```
Mobile     → < 768px
Tablet     → 768px - 1024px
Desktop    → > 1024px

Mobile + Tablet = App Layout
Desktop         = Dashboard Layout
```

---

## 3. Layout System

### Desktop Layout
```
┌─────────────────────────────────────────────┐
│              Top Navbar                      │
├──────────────┬──────────────────────────────┤
│              │                              │
│   Sidebar    │      Page Content            │
│              │                              │
│  - Dashboard │                              │
│  - Tasks     │                              │
│  - Teams     │                              │
│  - Profile   │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### Mobile / Tablet Layout
```
┌─────────────────────┐
│     Top Bar         │  ← Simple , just title + avatar
├─────────────────────┤
│                     │
│                     │
│    Page Content     │
│                     │
│                     │
│                     │
├─────────────────────┤
│  Bottom Nav Bar     │  ← Home | Tasks | Teams | Profile
└─────────────────────┘
```

---

## 4. Navigation

### Desktop Sidebar
```
┌─────────────────┐
│   [Logo + Name] │
│─────────────────│
│  🏠 Dashboard   │
│  ✅ Tasks       │
│  👥 Teams       │
│─────────────────│
│  👤 Profile     │
│  🚪 Logout      │
└─────────────────┘
```

### Mobile Bottom Bar
```
┌──────────────────────────────┐
│  🏠    ✅    👥    👤        │
│ Home  Tasks Teams Profile    │
└──────────────────────────────┘
```

### Mobile Top Bar
```
┌──────────────────────────────┐
│  < Back    Page Title    👤  │
└──────────────────────────────┘
```

---

## 5. Page by Page UI Plan

---

### AUTH PAGES
```
Same layout for all screen sizes
Centered card , clean and simple

┌────────────────────┐
│                    │
│      [Logo]        │
│   Work Dashboard   │
│                    │
│  ┌──────────────┐  │
│  │     Card     │  │
│  │              │  │
│  │  Form Fields │  │
│  │              │  │
│  │  [ Button ]  │  │
│  │              │  │
│  │  Links       │  │
│  └──────────────┘  │
│                    │
└────────────────────┘
```

**Login Card :**
```
- Email input
- Password input ( with show/hide toggle )
- [ Login Button ]
- Link → Forgot Password
- Link → Register
```

**Register Card :**
```
- Name input
- Email input
- Password input ( with show/hide toggle )
- Confirm Password input
- [ Register Button ]
- Link → Login
```

**Reset Password Card :**
```
- Email input
- New Password input
- Confirm Password input
- [ Reset Button ]
- Link → Login
```

---

### DASHBOARD PAGE

**Desktop**
```
┌─────────────────────────────────────────────────────┐
│  Good Morning , [Name] 👋           [Date]           │
├───────────────┬───────────────┬─────────────────────┤
│  Total Tasks  │  In Progress  │      Done            │
│     [12]      │     [4]       │      [6]             │
├───────────────┴───────────────┴─────────────────────┤
│                                                      │
│   My Recent Tasks                [ View All → ]      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Task Title    │ Priority │ Status  │ Due Date  │  │
│  │────────────────┼──────────┼─────────┼──────────│  │
│  │  Task 1        │  High    │  Todo   │ 12 Dec    │  │
│  │  Task 2        │  Medium  │  Done   │ 15 Dec    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│   My Teams                                           │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │  Team A      │ │  Team B      │                  │
│  │  5 members   │ │  3 members   │                  │
│  │  8 tasks     │ │  4 tasks     │                  │
│  └──────────────┘ └──────────────┘                  │
└─────────────────────────────────────────────────────┘
```

**Mobile**
```
┌─────────────────────┐
│  Hey [Name] 👋      │
├─────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐  │
│  │12 │ │ 4 │ │ 6 │  │
│  │All│ │ IP│ │Done│  │
│  └───┘ └───┘ └───┘  │
├─────────────────────┤
│  My Recent Tasks    │
│  ┌─────────────────┐│
│  │ Task 1    [High]││
│  │ In Progress     ││
│  │ Due: 12 Dec     ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ Task 2    [Med] ││
│  │ Done            ││
│  │ Due: 15 Dec     ││
│  └─────────────────┘│
├─────────────────────┤
│  My Teams           │
│  ┌─────────────────┐│
│  │ Team A          ││
│  │ 5 members│8tasks││
│  └─────────────────┘│
└─────────────────────┘
```

---

### TASKS PAGE

**Desktop**
```
┌─────────────────────────────────────────────────────┐
│  My Tasks                        [ + Add Task ]      │
├─────────────────────────────────────────────────────┤
│  Filter: [ All ▾ ]  [ Priority ▾ ]  [ Status ▾ ]    │
├────────────────────────────────────────────────────┤
│  Title  │Description│Assigned │Priority│Status│ ... │
│─────────┼───────────┼─────────┼────────┼──────┼─────│
│  Task 1 │  desc..   │ User A  │  High  │ Todo │ ··· │
│  Task 2 │  desc..   │ User B  │  Low   │ Done │ ··· │
└─────────────────────────────────────────────────────┘

  ( ··· opens → Edit / Delete / Change Status )
```

**Mobile**
```
┌─────────────────────┐
│  My Tasks    [ + ]  │
├─────────────────────┤
│  [ All ] [Todo] [IP]│
│  [Done]  [High][Low]│
├─────────────────────┤
│  ┌─────────────────┐│
│  │ Task 1    [High]││
│  │ Todo  •  12 Dec ││
│  │ Assigned: You   ││
│  │ [Edit]  [Delete]││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ Task 2    [Low] ││
│  │ Done  •  15 Dec ││
│  │ Assigned: TeamA ││
│  │ [Edit]  [Delete]││
│  └─────────────────┘│
└─────────────────────┘
```

**Add / Edit Task → Modal ( same desktop + mobile )**
```
┌──────────────────────────┐
│  Add New Task        [X] │
├──────────────────────────┤
│  Title                   │
│  [                     ] │
│                          │
│  Description             │
│  [                     ] │
│                          │
│  Status      Priority    │
│  [ Todo ▾ ]  [ High ▾ ] │
│                          │
│  Assign To               │
│  [ Select Users ▾ ]      │
│                          │
│  Team ( optional )       │
│  [ Select Team  ▾ ]      │
│                          │
│  Due Date ( optional )   │
│  [ Pick Date    ▾ ]      │
│                          │
│  [ Cancel ]  [ Save ]    │
└──────────────────────────┘
```

---

### TEAMS PAGE

**Desktop**
```
┌─────────────────────────────────────────────────────┐
│  My Teams                      [ + Create Team ]     │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────┐  ┌───────────────────┐        │
│  │  Team A           │  │  Team B           │        │
│  │  Created by: You  │  │  Created by: John │        │
│  │  5 Members        │  │  3 Members        │        │
│  │  8 Tasks          │  │  4 Tasks          │        │
│  │  [ View Team ]    │  │  [ View Team ]    │        │
│  └───────────────────┘  └───────────────────┘        │
└─────────────────────────────────────────────────────┘
```

**Mobile**
```
┌─────────────────────┐
│  Teams       [ + ]  │
├─────────────────────┤
│  ┌─────────────────┐│
│  │ Team A          ││
│  │ 5 members       ││
│  │ 8 tasks         ││
│  │       [ View ]  ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ Team B          ││
│  │ 3 members       ││
│  │ 4 tasks         ││
│  │       [ View ]  ││
│  └─────────────────┘│
└─────────────────────┘
```

---

### TEAM DETAILS PAGE

**Desktop**
```
┌─────────────────────────────────────────────────────┐
│  ← Back    Team A          [ Edit ] [ Delete ]       │
├───────────────────────┬─────────────────────────────┤
│  Members              │  Team Tasks                  │
│  ┌─────────────────┐  │  ┌──────────────────────┐   │
│  │ 👤 You ( Admin )│  │  │Task│Priority│Status   │   │
│  │ 👤 John         │  │  │────┼────────┼─────────│   │
│  │ 👤 Sara         │  │  │ T1 │ High   │ Todo    │   │
│  │                 │  │  │ T2 │ Low    │ Done    │   │
│  │ [+ Add Member ] │  │  └──────────────────────┘   │
│  └─────────────────┘  │  [ + Add Task to Team ]      │
└───────────────────────┴─────────────────────────────┘
```

**Mobile**
```
┌─────────────────────┐
│  ← Team A    [ ··· ]│
├─────────────────────┤
│  [ Members ][ Tasks]│  ← Tabs
├─────────────────────┤
│                     │
│  Members Tab :      │
│  ┌─────────────────┐│
│  │ 👤 You (Admin)  ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ 👤 John         ││
│  └─────────────────┘│
│  [ + Add Member ]   │
│                     │
│  Tasks Tab :        │
│  ┌─────────────────┐│
│  │ Task 1   [High] ││
│  │ Todo            ││
│  └─────────────────┘│
│  [ + Add Task ]     │
└─────────────────────┘
```

---

### PROFILE PAGE

**Desktop + Mobile ( same , just wider on desktop )**
```
┌──────────────────────────────┐
│                              │
│         [ 👤 Avatar ]        │
│         [ Name ]             │
│         [ Email ]            │
│                              │
├──────────────────────────────┤
│  Edit Profile                │
│                              │
│  Name                        │
│  [                        ]  │
│                              │
│  Email                       │
│  [                        ]  │
│                              │
│  [ Save Changes ]            │
├──────────────────────────────┤
│  Change Password             │
│                              │
│  New Password                │
│  [                        ]  │
│                              │
│  Confirm Password            │
│  [                        ]  │
│                              │
│  [ Update Password ]         │
├──────────────────────────────┤
│                              │
│  [ Logout ]                  │
│  [ Delete Account ]          │
│                              │
└──────────────────────────────┘
```

---

## 6. Component Summary

```
Layout Components :
- AppLayout.jsx       → switches Desktop / Mobile layout
- DesktopLayout.jsx   → sidebar + navbar + content
- MobileLayout.jsx    → top bar + content + bottom nav
- Sidebar.jsx         → desktop only
- TopBar.jsx          → mobile only
- BottomNav.jsx       → mobile only

Shared Components :
- TaskCard.jsx        → mobile task card
- TaskTable.jsx       → desktop task table
- TaskForm.jsx        → add/edit task modal
- TeamCard.jsx        → team card
- TeamForm.jsx        → create/edit team modal
- StatCard.jsx        → dashboard stat boxes
- PageHeader.jsx      → title + action button
```

---

## 7. UX Rules

```
Mobile :
- Minimum tap target 48px
- Bottom nav always visible
- Modals slide up from bottom ( Ant Design Drawer )
- Cards have clear tap areas
- Back button on every inner page
- No hover interactions

Desktop :
- Sidebar always visible
- Modals centered on screen
- Tables for list data
- Hover states on rows
- More data visible at once

Both :
- Loading spinner on every API call
- Empty state messages when no data
- Error messages on failures
- Success toasts on actions
- Confirmation before delete
```

---

## 8. Key UI Decisions

| Decision | Choice | Reason |
|---|---|---|
| Mobile Nav | Bottom Bar | Native app feel |
| Desktop Nav | Left Sidebar | Standard dashboard |
| Mobile Lists | Cards | Touch friendly |
| Desktop Lists | Tables | More data density |
| Mobile Modals | Ant Drawer ( slides up ) | Native app feel |
| Desktop Modals | Ant Modal ( centered ) | Standard web |
| Layout Switch | CSS breakpoint 768px | Clean switch point |
| Icons | Ant Design Icons | Already in package |

---

## ✅ UI Plan Status

```
Layout System      → Final ✅
Navigation         → Final ✅
Auth Pages         → Final ✅
Dashboard Page     → Final ✅
Tasks Page         → Final ✅
Teams Page         → Final ✅
Team Details Page  → Final ✅
Profile Page       → Final ✅
Component List     → Final ✅
UX Rules           → Final ✅
```

---

**Confirm and I will generate the Frontend AI Agent Prompt →**