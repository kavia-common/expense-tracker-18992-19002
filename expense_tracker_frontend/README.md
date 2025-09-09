# Expense Tracker Frontend (React)

A lightweight React frontend for managing expenses and categories with user authentication.

## Features

- Authentication: Register and Login
- Expenses: List, Create, Edit, Delete
- Categories: List, Create, Edit, Delete
- Protected routes and navigation
- API integration with Flask backend
- Light/Dark theme toggle

## Environment Variables

Create a `.env` file in the frontend root if needed:

- REACT_APP_API_BASE_URL: Base URL of the backend API (e.g., http://localhost:5000)

Example:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

Alternatively, you can set `window.__API_BASE_URL__` before loading the bundle for static deployments.

## Expected Backend Endpoints

Adjust in `src/services/api.js` if your backend differs:

- POST /auth/register { name, email, password } -> { token, user }
- POST /auth/login { email, password } -> { token, user }
- GET /auth/me -> { id, email, name }
- Expenses:
  - GET /expenses -> [ { id, title, amount, date, category_id } ]
  - POST /expenses
  - PUT /expenses/:id
  - DELETE /expenses/:id
- Categories:
  - GET /categories -> [ { id, name } ]
  - POST /categories
  - PUT /categories/:id
  - DELETE /categories/:id

## Scripts

- npm start
- npm test
- npm run build

## Styling

Basic styles and theme variables are in `src/App.css`, with defaults applied in `src/index.css`.

## Notes

- All protected pages are wrapped in `ProtectedRoute`, which redirects unauthenticated users to `/login`.
- Authentication token is stored in `localStorage` as `auth_token`. Clear storage if needed.

