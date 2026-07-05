# CRM Premium - Enterprise Customer Relationship Management

A **production-ready** CRM SaaS web application with a modern UI inspired by HubSpot, Salesforce, Linear, and Attio. Built with React 19, Node.js, Express, MongoDB, and TypeScript.

## Tech Stack

### Frontend
- **React 19** + TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** + shadcn/ui components
- **Framer Motion** (Animations)
- **React Router** v7 (Routing)
- **TanStack Query** (Data fetching)
- **React Hook Form** + Zod (Forms)
- **Recharts** (Charts & Analytics)
- **Socket.io Client** (Real-time)
- **@hello-pangea/dnd** (Drag & Drop)

### Backend
- **Node.js** + Express.js
- **MongoDB** + Mongoose (Database)
- **JWT Authentication** (Secure auth)
- **Cloudinary** (File uploads)
- **Socket.io** (Real-time notifications)
- **Helmet**, CORS, Rate Limiting (Security)

## Core Features

- 🔐 **Secure Authentication** (Login, Register, Forgot Password, Google OAuth)
- 👥 **Role-Based Access** (Admin, Manager, Sales, Support)
- 📊 **Modern Dashboard** with KPIs, Charts, Revenue, Customer Growth
- 👤 **Customer Management** (CRUD, Search, Filter, Sort, Pagination)
- 📋 **Customer Profiles** with Timeline, Notes, Activity Log
- 🎯 **Lead Management** & Lead-to-Customer Conversion
- 📌 **Drag-and-Drop Sales Pipeline** (Kanban Board)
- ✅ **Task & Meeting Management**
- 📄 **Invoice & Payment Tracking**
- 👥 **User Management** (Admin)
- 📈 **Reports & Analytics**
- 🔍 **Global Search**
- 🔔 **Real-time Notifications**
- ⚙️ **Company Settings & Profile Settings**
- 🌓 **Dark & Light Mode**

## Project Structure

```
├── server/                  # Express Backend
│   ├── config/              # DB, Cloudinary config
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, Error handling, Upload
│   ├── models/              # MongoDB models
│   ├── routes/              # Express routes
│   ├── utils/               # Helpers, Token generation
│   ├── validators/          # Zod schemas
│   └── index.js             # Server entry point
│
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn components
│   │   │   └── layout/      # Sidebar, Header, AppLayout
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── dashboard/   # Dashboard with charts
│   │   │   ├── customers/   # Customer CRUD
│   │   │   ├── leads/       # Lead management
│   │   │   ├── pipeline/    # Kanban pipeline
│   │   │   ├── tasks/       # Task management
│   │   │   ├── meetings/    # Meeting scheduler
│   │   │   ├── invoices/    # Invoice management
│   │   │   ├── payments/    # Payment tracking
│   │   │   ├── reports/     # Analytics & reports
│   │   │   ├── notifications/ # Notification center
│   │   │   └── settings/    # User settings
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities, API client
│   │   ├── providers/       # React context providers
│   │   ├── store/           # Zustand store
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Router & app shell
│   │   └── main.tsx         # Entry point
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
└── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd crm-premium

# Install backend dependencies
cd server
npm install
cp .env .env   # Edit with your values

# Install frontend dependencies
cd ../client
npm install --legacy-peer-deps

# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

### Environment Variables

See `.env.example` for all required variables.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/customers` | Customer CRUD |
| GET/PUT/DELETE | `/api/customers/:id` | Single customer |
| GET/POST | `/api/leads` | Lead CRUD |
| PUT | `/api/leads/:id/convert` | Convert lead |
| PUT | `/api/leads/:id/pipeline` | Update pipeline |
| GET/POST | `/api/tasks` | Task CRUD |
| GET/POST | `/api/meetings` | Meeting CRUD |
| GET/POST | `/api/invoices` | Invoice CRUD |
| GET/POST | `/api/payments` | Payment CRUD |
| GET/POST | `/api/activities` | Activity log |
| GET | `/api/notifications` | Notifications |
| GET/POST | `/api/users` | User management (admin) |

## License

MIT
