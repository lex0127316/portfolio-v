import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema } from "@shared/schema";
import { 
  generateImage, 
  createProjectPrompt, 
  createHeroBackgroundPrompt,
  createPDFCoverPrompt 
} from "./openai";

// Simple in-memory cache for generated images
const imageCache = new Map<string, string>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Generate project image
  app.post("/api/projects/:id/generate-image", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check cache first
      const cacheKey = `project-${project.id}`;
      if (imageCache.has(cacheKey)) {
        return res.json({ url: imageCache.get(cacheKey), cached: true });
      }

      // Generate new image
      const deviceFrame = project.deviceFrames[0] || "macbook";
      const prompt = createProjectPrompt(
        project.title,
        project.tags,
        project.palette,
        deviceFrame
      );

      const result = await generateImage({ prompt, quality: "standard" });
      
      if (result) {
        imageCache.set(cacheKey, result.url);
        await storage.updateProjectImage(project.id, result.url);
        res.json({ url: result.url, cached: false });
      } else {
        // Return graceful response even if generation fails
        res.json({ url: null, cached: false, error: "Image generation unavailable" });
      }
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Generate hero background image
  app.get("/api/images/hero-background", async (_req, res) => {
    try {
      const cacheKey = "hero-background";
      
      // Check cache
      if (imageCache.has(cacheKey)) {
        return res.json({ url: imageCache.get(cacheKey), cached: true });
      }

      const prompt = createHeroBackgroundPrompt();
      const result = await generateImage({ prompt, size: "1792x1024" });
      
      if (result) {
        imageCache.set(cacheKey, result.url);
        res.json({ url: result.url, cached: false });
      } else {
        // Return null for graceful degradation
        res.json({ url: null, cached: false });
      }
    } catch (error) {
      console.error("Hero background generation error:", error);
      res.json({ url: null, cached: false });
    }
  });

  // Get resume data
  app.get("/api/resume", async (_req, res) => {
    try {
      const resumeData = await storage.getResumeData();
      res.json(resumeData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resume data" });
    }
  });

  // Download resume PDF
  app.get("/api/resume/download", async (_req, res) => {
    try {
      const resumeData = await storage.getResumeData();
      
      // For now, return a simple response indicating PDF generation would happen here
      // In production, you'd use Puppeteer/Playwright to generate the actual PDF
      res.json({ 
        message: "PDF generation endpoint - would generate PDF with Puppeteer in production",
        data: resumeData 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const result = contactFormSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid form data", 
          details: result.error.errors 
        });
      }

      await storage.saveContactForm(result.data);
      
      // In production, you would send an email here using Resend or similar service
      console.log("Contact form submitted:", result.data);
      
      res.json({ 
        success: true, 
        message: "Message received - email would be sent in production" 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
