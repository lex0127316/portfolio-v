import "server-only";

import { createClient, type Entry } from "contentful";
import { cache } from "react";
import { z } from "zod";
import { fallbackProjects, type Project } from "@/data/projects";
import { heroContent } from "@/data/profile";

const projectFieldsSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional().default(""),
  description: z.string(),
  preview: z.string().url().optional().default(""),
  tech: z.array(z.string()).default([]),
  metrics: z.string().optional().default(""),
  year: z.string().optional().default(""),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
});

const heroSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  specialties: z.array(z.string()).default([]),
  availability: z.string().optional(),
});

const isCmsEnabled =
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_DELIVERY_TOKEN;

const client = isCmsEnabled
  ? createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    })
  : null;

const mapProjectEntry = (entry: Entry): Project | null => {
  const parsed = projectFieldsSchema.safeParse({
    slug: entry.fields.slug,
    title: entry.fields.title,
    subtitle: entry.fields.subtitle,
    description: entry.fields.description,
    preview: entry.fields.preview,
    tech: entry.fields.techStack,
    metrics: entry.fields.metrics,
    year: entry.fields.year,
    liveUrl: entry.fields.liveUrl,
    repoUrl: entry.fields.repoUrl,
  });

  if (!parsed.success) {
    console.warn("Invalid CMS project entry", parsed.error.flatten());
    return null;
  }

  return {
    slug: parsed.data.slug,
    title: parsed.data.title,
    subtitle: parsed.data.subtitle ?? "",
    description: parsed.data.description,
    preview: parsed.data.preview ?? "",
    tech: parsed.data.tech,
    metrics: parsed.data.metrics,
    year: parsed.data.year,
    links: {
      live: parsed.data.liveUrl,
      repo: parsed.data.repoUrl,
    },
  };
};

export const getHeroCopy = cache(async () => {
  if (!client) {
    return heroContent;
  }

  try {
    const res = await client.getEntries({
      content_type: "hero",
      limit: 1,
    });
    const entry = res.items[0];
    if (!entry) {
      return heroContent;
    }
    const parsed = heroSchema.safeParse(entry.fields);
    if (!parsed.success) {
      return heroContent;
    }
    return parsed.data;
  } catch (error) {
    console.warn("Failed to fetch hero copy", error);
    return heroContent;
  }
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  if (!client) {
    return fallbackProjects;
  }
  try {
    const entries = await client.getEntries({
      content_type: "project",
      limit: 6,
      order: "-fields.priority",
    });
    const mapped = entries.items
      .map(mapProjectEntry)
      .filter((entry): entry is Project => Boolean(entry));
    return mapped.length ? mapped : fallbackProjects;
  } catch (error) {
    console.warn("Failed to fetch projects", error);
    return fallbackProjects;
  }
});

