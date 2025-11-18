import { z } from "zod";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Project table schema
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull(),
  palette: text("palette").array().notNull(),
  deviceFrames: text("device_frames").array().notNull(),
  caseStudyProblem: text("case_study_problem"),
  caseStudyApproach: text("case_study_approach"),
  caseStudyResult: text("case_study_result"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false).notNull(),
});

// TypeScript types
export type Project = typeof projects.$inferSelect & {
  caseStudy?: {
    problem: string;
    approach: string;
    result: string;
  };
};

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  imageUrl: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// Resume/About data schema
export const resumeDataSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    period: z.string(),
    description: z.string(),
  })),
  skills: z.array(z.string()),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    email: z.string(),
  }),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

// AI Image generation request/response
export const imageGenerationRequestSchema = z.object({
  prompt: z.string(),
  type: z.enum(["hero-background", "project-mockup", "pdf-cover"]),
  projectId: z.string().optional(),
});

export type ImageGenerationRequest = z.infer<typeof imageGenerationRequestSchema>;

export const imageGenerationResponseSchema = z.object({
  url: z.string(),
  cached: z.boolean().default(false),
});

export type ImageGenerationResponse = z.infer<typeof imageGenerationResponseSchema>;
