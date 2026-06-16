# LearnFlow LMS

A modern, production-ready Learning Management System built to handle secure video streaming, dynamic course enrollment, and complex multi-role workflows.

## 🚀 Features

- **Role-Based Access Control (RBAC):** Three distinct user roles (Student, Instructor, Admin) with deeply integrated Edge Middleware protection.
- **Instructor Studio:** A dedicated dashboard for course creators to draft curriculums, organize sections, and manage lesson content.
- **Admin Approval Workflow:** A dedicated portal for administrators to review, approve, or reject courses before they are published to the public catalog.
- **Secure Video Processing:** Architecture designed around Mux Direct Uploads and Webhooks for asynchronous video encoding and playback.
- **Idempotent Payments:** Stripe checkout integration designed to prevent double-enrollments and handle asynchronous webhook delivery securely.
- **Notification Engine:** Real-time, database-backed notification system for alerting users to course approvals, reviews, and platform updates.
- **Serverless PostgreSQL:** Fully configured for Neon Database with connection pooling (`DATABASE_URL`) and direct migration access (`DIRECT_URL`).

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & React Server Components)
- **Database:** [PostgreSQL](https://www.postgresql.org/) hosted on [Neon](https://neon.tech/)
- **ORM:** [Prisma 7](https://www.prisma.io/)
- **Authentication:** [NextAuth.js (v5)](https://authjs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) Primitives & [Lucide Icons](https://lucide.dev/)

## 💻 Local Development

### 1. Prerequisites
- Node.js 18.17 or later
- A PostgreSQL database (or Neon account)

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/yourusername/learnflow.git
cd learnflow
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env` and fill in your keys:
```bash
cp .env.example .env
```
*Note: Make sure to fill in `AUTH_SECRET` (generate with `openssl rand -base64 32`) and your database connection strings.*

### 4. Database Setup
Push the schema to your database. Because we are using Prisma 7 with Neon, ensure your `DIRECT_URL` is set in your `.env` for this to work:
```bash
npx prisma db push
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture Note

LearnFlow is designed as a **Webhook-Driven** system. There are no manual background message queues (like RabbitMQ or Redis) running in this codebase. Instead, heavy asynchronous tasks (like video encoding and payment processing) are offloaded to third-party platforms (Mux and Stripe), which deliver webhooks back to our Next.js API routes upon completion. 

## 📝 License

This project is licensed under the MIT License.
