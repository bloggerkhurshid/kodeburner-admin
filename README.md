# 👑 KodeBurner - Admin Panel

**KodeBurner Admin Panel** is a production-ready React.js & Tailwind CSS dashboard for managing academic study resources, notes, reference textbooks, semester categories, student accounts, and system administrators with Role-Based Access Control (RBAC).

---

## ✨ Features

- **📊 Dashboard Analytics**: Overview metrics showing total users, notes, books, semesters, admins, and live activity audit logs.
- **📝 Notes Management**: Upload and edit lecture note PDFs, thumbnails, and semester categorizations.
- **📚 Reference Books Management**: Manage textbook resources and uploader information.
- **🎓 Semester Management**: Create, update, and organize academic semester categories.
- **👥 Student User Controls**: View registered student accounts, city, course, and email verification status.
- **🛡️ Administrator & Superadmin System**:
  - Superadmin controls to invite new administrators via single-use email invitation links.
  - Role management (`superadmin` / `admin`).
  - Resend invitation emails, activate/deactivate, and delete admin accounts.
- **🔑 Secure Authentication & Profile**: JWT-based session handling, password reset, and profile management.
- **🎨 Dark Minimal Theme**: Sleek dark slate layout with KodeBurner Rose primary accenting.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- PHP/MySQL REST API backend (`https://api.kodeburner.com`)

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/bloggerkhurshid/kodeburner-admin.git
cd kodeburner-admin
```

Install dependencies:
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:
```env
VITE_API_URL=https://api.kodeburner.com
```

### 4. Run Development Server

```bash
npm run dev
```

The admin panel will be accessible at `http://localhost:5173`.

### 5. Production Build

To build the static bundle for production deployment:
```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
