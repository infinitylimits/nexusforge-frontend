# NexusForge Frontend

A simple React frontend for **NexusForge**, a developer collaboration and project discovery platform.
It talks to the Spring Boot backend: https://github.com/infinitylimits/nexusforge-backend

## Tech stack
React, Vite, React Router, Axios

## Features
- Register and login (JWT stored in the browser and sent with every request)
- Protected pages (redirects to login when not signed in)
- Projects: list, filter by tech stack, pagination, create, delete
- Posts: list, search, pagination, create, open a post, delete
- Comments: add, list with pagination, delete
- Public profiles with follow / unfollow and editable bio
- Feed of posts from people you follow
- Admin page (list users, delete a user), shown only to admins

## Run locally
1. Start the backend first (see the backend repository), running on http://localhost:8080
2. Install and start the frontend:

```bash
npm install
npm run dev
```

3. Open http://localhost:5173

The backend allows requests from `localhost:5173` through its CORS settings.

## Project structure
```
src/
  api/client.js        Axios instance that adds the JWT token
  auth.js              Helpers for the saved login
  components/          Navbar, Layout, ProtectedRoute
  pages/               Login, Register, Home, Projects, Posts, PostDetail, Feed, Profile, Admin
```



## Author
Piyush Chawla
