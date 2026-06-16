// Zod validation schemas — one domain per file.
// Every API route input is validated here before touching Prisma.

import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["STUDENT", "INSTRUCTOR"]).default("STUDENT"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Course ───────────────────────────────────────────────────────────────────

export const createCourseSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  price: z.number().min(0).max(99999),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  categoryId: z.string().cuid().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseFilterSchema = z.object({
  categoryId: z.string().cuid().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

// ─── Lesson ───────────────────────────────────────────────────────────────────

export const createLessonSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  sectionId: z.string().cuid(),
  order: z.number().int().min(0),
  isFree: z.boolean().default(false),
});

export const updateLessonSchema = createLessonSchema.partial();

export const updateProgressSchema = z.object({
  lessonId: z.string().cuid(),
  watchedSeconds: z.number().int().min(0),
});

// ─── Section ──────────────────────────────────────────────────────────────────

export const createSectionSchema = z.object({
  title: z.string().min(3).max(200),
  courseId: z.string().cuid(),
  order: z.number().int().min(0),
});

// ─── Checkout ─────────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  courseId: z.string().cuid(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const updateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]),
});

export const updateUserBanSchema = z.object({
  isBanned: z.boolean(),
});

export const updateCourseStatusSchema = z.object({
  status: z.enum(["PUBLISHED", "ARCHIVED"]),
  rejectionReason: z.string().max(500).optional(),
});

// ─── Upload ───────────────────────────────────────────────────────────────────

export const createMuxUploadSchema = z.object({
  lessonId: z.string().cuid(),
});

// ─── Review ───────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  courseId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().max(2000).optional(),
});
