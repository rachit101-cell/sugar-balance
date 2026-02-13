# 🍬 Sugar Streaker — The Future to Health

> A gamified family health platform that helps you track sugar intake, build streaks, and celebrate healthy habits together.

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/yourname/sugar-streaker.git
cd sugar-streaker
npm install

# 2. Configure environment
cp .env .env.local
# Edit MONGO_URI, JWT_SECRET etc.

# 3. Run dev (server + client with hot reload)
npm run dev

# 4. Or run with Docker
docker-compose up
```

App runs at:
- Frontend → http://localhost:5173
- Backend API → http://localhost:5000/api

---

## 📁 Project Structure

```
sugar-streaker/
├── frontend/
│   ├── pages/          HTML pages (8 sections)
│   ├── css/            Modular stylesheets (8 files)
│   ├── js/             ES6 modules (12 files)
│   └── components/     Reusable HTML fragments
├── backend/
│   ├── server.js       Express entry point
│   ├── routes/         7 route files
│   ├── controllers/    5 business logic files
│   ├── models/         5 Mongoose schemas
│   └── middleware/     auth, validate, error
├── data/               Seed JSON (products, marathon, actions)
├── config/             DB, JWT, CORS config
├── tests/              Jest + Supertest suites
├── Dockerfile
└── docker-compose.yml
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register + onboarding |
| POST | /api/auth/login | Login, get JWT |
| GET  | /api/auth/me | Current user |
| GET  | /api/users/profile | Profile + groups |
| PUT  | /api/users/profile | Update profile |
| GET  | /api/users/stats | Weekly stats |
| GET  | /api/food/products | All food items |
| POST | /api/food/log | Log a food item |
| POST | /api/food/log/:id/corrective | Complete corrective action |
| GET  | /api/food/history | Food log history |
| GET  | /api/points | Total + streak |
| GET  | /api/points/history | Daily breakdown |
| POST | /api/points/award | Award points |
| GET  | /api/marathon | Get/create marathon |
| PATCH| /api/marathon/task | Complete a task |
| POST | /api/marathon/complete | Claim 200-pt reward |
| GET  | /api/community/groups | List groups |
| POST | /api/community/groups/:id/join | Join group |
| GET  | /api/community/leaderboard | Daily rankings |
| GET  | /api/report | Full report card |

---

## 🧪 Tests

```bash
npm test              # run all suites
npm test -- --watch   # watch mode
```

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6 modules), Chart.js 4, Anime.js, Lottie Web
- **Backend**: Node.js 18, Express 4, MongoDB + Mongoose, JWT + bcryptjs
- **Dev**: Vite, Nodemon, Concurrently, ESLint
- **Test**: Jest, Supertest
- **Deploy**: Docker + Docker Compose, GitHub Actions CI

---

## 🎨 Design

- Pastel glassmorphism aesthetic
- Playfair Display (serif headings) + DM Sans (body)
- Full dark mode support
- Mobile-first responsive (480 / 768 / 1024 breakpoints)
- Accessible: keyboard nav, focus rings, ARIA labels, high contrast ratios
