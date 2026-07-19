# client_lead_crm
A full-stack Client Lead Management System built with React.js, Node.js, Express.js, and MongoDB for managing client leads, tracking status, and follow-ups.
# Client Lead Management System (Mini CRM)

A production-ready, full-stack Mini CRM for managing client leads — built with React (Vite) + Tailwind CSS on the frontend and Node.js + Express + MongoDB on the backend, secured with JWT authentication.

---

## Features

- **Secure admin authentication** — JWT + bcrypt password hashing, protected routes on both frontend and backend
- **Dashboard** — total / new / contacted / converted lead counts, recent leads, leads-by-source breakdown
- **Full lead CRUD** — create, view, edit, delete leads
- **Status pipeline** — New → Contacted → Converted, updatable inline, instantly reflected on the dashboard
- **Notes & timeline** — every lead keeps a running history of notes and status changes
- **Search & filter** — search by name/email/company, filter by source and status, sort newest/oldest
- **Pagination** on the leads table
- **CSV export** of the current filtered lead list
- Toast notifications, confirmation dialogs, loading/empty/error states, and a fully responsive blue-and-white UI

---

## Tech Stack

| Layer     | Technology                                                        |
|-----------|--------------------------------------------------------------------|
| Frontend  | React (Vite), Tailwind CSS, React Router, Axios, React Hook Form, React Hot Toast, Lucide Icons |
| Backend   | Node.js, Express.js                                                |
| Database  | MongoDB + Mongoose                                                 |
| Auth      | JWT, bcrypt                                                        |

---

## 1. Project Folder Structure

```
client-lead-crm/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # register/login/me
│   │   └── leadController.js      # lead CRUD, stats, notes, CSV export
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   └── errorHandler.js        # centralized error handling
│   ├── models/
│   │   ├── Admin.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── leadRoutes.js
│   ├── seed/
│   │   └── seed.js                # sample admin + leads
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js           # axios instance + auth interceptor
│   │   ├── components/            # Sidebar, Navbar, LeadTable, LeadModal, etc.
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/                 # Login, Dashboard, Leads, LeadDetail
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 2. Installation Commands

> Prerequisites: Node.js 18+, npm, and a MongoDB instance (local or Atlas).

```bash
# Clone or unzip the project, then:
cd client-lead-crm

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 3. Environment Variables

**backend/.env** (copy from `backend/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/client-lead-crm
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**frontend/.env** (copy from `frontend/.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 4. Run Commands

```bash
# 1. Start MongoDB locally (if not using Atlas)
mongod

# 2. Seed sample data (creates admin@crm.com / admin123 + 8 sample leads)
cd backend
npm run seed

# 3. Start the backend (http://localhost:5000)
npm run dev

# 4. In a new terminal, start the frontend (http://localhost:5173)
cd frontend
npm run dev
```

Login with:
- **Email:** `admin@crm.com`
- **Password:** `admin123`

(Or register a new admin via `POST /api/auth/register`.)

---

## API Endpoints Reference

### Auth
| Method | Endpoint             | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/register`  | Create a new admin        |
| POST   | `/api/auth/login`     | Login and receive a JWT   |
| GET    | `/api/auth/me`        | Get current admin profile |

### Leads
| Method | Endpoint                      | Description                              |
|--------|-------------------------------|-------------------------------------------|
| GET    | `/api/leads`                  | List leads (search/filter/sort/paginate)  |
| GET    | `/api/leads/stats/dashboard`  | Dashboard statistics                       |
| GET    | `/api/leads/export/csv`       | Export (filtered) leads as CSV             |
| GET    | `/api/leads/:id`              | Get single lead                            |
| POST   | `/api/leads`                  | Create a lead                              |
| PUT    | `/api/leads/:id`               | Update a lead                              |
| DELETE | `/api/leads/:id`               | Delete a lead                              |
| PUT    | `/api/leads/:id/status`        | Update only the status                     |
| POST   | `/api/leads/:id/notes`         | Add a note to a lead                       |

All `/api/leads/*` routes require an `Authorization: Bearer <token>` header.

---

## 5. GitHub Deployment Instructions

```bash
cd client-lead-crm
git init
git add .
git commit -m "Initial commit: Client Lead Management System"

# Create a new repo on GitHub first, then:
git remote add origin https://github.com/<your-username>/client-lead-crm.git
git branch -M main
git push -u origin main
```

> The root `.gitignore` already excludes `node_modules/`, `.env`, and build output.

---

## 6. Deployment

### Backend → Render

1. Push your code to GitHub (see above).
2. On [Render](https://render.com), click **New → Web Service** and connect your repo.
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in the Render dashboard (from `backend/.env.example`):
   - `MONGO_URI` (use a MongoDB Atlas connection string for production)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_ORIGIN` → set this to your deployed Vercel frontend URL
   - `NODE_ENV=production`
5. Deploy. Render will give you a URL like `https://client-lead-crm-api.onrender.com`.

### Frontend → Vercel

1. On [Vercel](https://vercel.com), click **New Project** and import the same GitHub repo.
2. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   - `VITE_API_BASE_URL` → your Render backend URL + `/api`, e.g. `https://client-lead-crm-api.onrender.com/api`
4. Deploy. Vercel will give you a URL like `https://client-lead-crm.vercel.app`.
5. Go back to Render and update `CLIENT_ORIGIN` to this Vercel URL, then redeploy the backend so CORS allows it.

---

## Notes on Production Readiness

- Passwords are hashed with bcrypt (salt rounds: 10); plaintext passwords are never stored or returned.
- All mutating lead routes are protected by JWT middleware.
- Centralized error handling normalizes Mongoose validation, duplicate-key, and cast errors into clean JSON responses.
- Duplicate lead emails are rejected both by a unique Mongoose index and explicit application-level checks.
- Input is validated on the backend with `express-validator` in addition to frontend validation via `react-hook-form`.
- For a real production deployment, also consider: rate limiting (`express-rate-limit`), helmet for HTTP headers, refresh tokens, and audit logging for admin actions.

---

## Suggested Next Steps (Bonus Ideas Not Yet Included)

- Dark mode toggle (Tailwind `dark:` variants + a theme context)
- Role-based access control (`superadmin` vs `admin` permissions — the `Admin` model already has a `role` field ready for this)
- Activity log collection recording every create/update/delete action
- Chart.js/Recharts visualizations for lead trends over time
