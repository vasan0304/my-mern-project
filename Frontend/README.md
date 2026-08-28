# TMS Frontend - React

## Folder Structure

```
src/
├── index.js                        # Entry point
├── App.js                          # Main app + routing
├── context/
│   └── AuthContext.js              # JWT auth context (login/logout/role)
├── utils/
│   ├── api.js                      # Axios-like fetch wrapper
│   └── theme.js                    # Colors, status colors, constants
├── components/
│   ├── UI.js                       # Shared UI: Badge, Spinner, Card, Input, Select, Textarea, Btn, Modal, Table, Toast
│   ├── Sidebar.js                  # Navigation sidebar
│   └── MasterCRUD.js               # Reusable CRUD component for master screens
└── pages/
    ├── LoginPage.js                # Login screen
    ├── dashboard/
    │   └── DashboardPage.js        # Stats dashboard
    ├── master/
    │   ├── DepartmentPage.js
    │   ├── ProgrammePage.js
    │   ├── BlockPage.js
    │   ├── RoomPage.js
    │   ├── RolePage.js
    │   └── UserPage.js
    ├── complaints/
    │   └── ComplaintsPage.js       # Raise, list, assign, update status
    └── reports/
        └── ReportsPage.js          # Filtered report generation
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure backend is running on port 5000.
   The `proxy` field in package.json handles API routing automatically.

3. Start frontend:
```bash
npm start
```

App runs on http://localhost:3000

## Notes

- All files use `.js` extension (React JSX syntax inside .js files)
- Auth token is stored in localStorage under `tms_token`
- API base URL is set in `src/utils/api.js` → change if needed
- Role-based access is controlled via `AuthContext` and enforced in backend routes
