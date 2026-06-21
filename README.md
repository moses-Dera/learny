# Learny LMS

A modern, full-stack Learning Management System (LMS) built with Next.js 15, Prisma, and PostgreSQL. Designed for both students and instructors, featuring seamless video streaming, and a sleek, responsive UI. (Note: Currently supports free courses, with Paystack integration for paid courses coming soon).

![Learny Preview](https://github.com/user-attachments/assets/lms-preview-placeholder)

##  Features

### For Students
- **Browse & Enroll**: Discover courses via a dynamic catalog with robust filtering and search.
- **Payments (Coming Soon)**: Currently supports free course enrollments. Paystack integration is actively being developed to support premium courses and ensure seamless payment processing in regions where Stripe is unavailable.
- **Video Learning**: High-quality video playback powered by Mux.
- **Progress Tracking**: Auto-saves video progress and lesson completion status.

### For Instructors
- **Instructor Studio**: A dedicated dashboard to manage courses, chapters, and lessons.
- **Direct Uploads**: Secure, direct-to-bucket image uploads via Cloudflare R2 and video uploads via Mux.
- **Analytics**: Track active courses, total students, and aggregated revenue.

### Core Platform
- **Role-Based Access**: Granular permissions (Student, Instructor, Admin).
- **Authentication**: Secure login via NextAuth.js v5 (Google OAuth & Credentials).
- **Dark Mode**: Premium, dark-themed UI built with Tailwind CSS and shadcn/ui.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on Neon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth v5 (Auth.js)](https://authjs.dev/)
- **Payments**: [Paystack](https://paystack.com/) *(Integration in progress — Chosen over Stripe to support creators and students in regions where Stripe account creation is restricted)*
- **Video Hosting**: [Mux](https://mux.com/)
- **File Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/)

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- API Keys for Mux, Cloudflare R2, and Google OAuth (Paystack keys required for future updates).

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/learny.git
   cd learny
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Duplicate `.env.example` and rename it to `.env`. Fill in the required API keys and connection strings.
   ```bash
   cp .env.example .env
   ```

4. **Initialize the Database**
   Push the Prisma schema to your database.
   ```bash
   npx prisma migrate dev
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:3000`.

---

## 🔐 Environment Variables

The project requires the following environment variables to run fully:

- `DATABASE_URL` & `DIRECT_URL` (PostgreSQL connection strings)
- `AUTH_SECRET` (Generated via `npx auth secret`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `PAYSTACK_SECRET_KEY` & `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` *(Coming soon)*
- `MUX_TOKEN_ID` & `MUX_TOKEN_SECRET` & `MUX_WEBHOOK_SECRET`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
