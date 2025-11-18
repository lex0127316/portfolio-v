import type { Project, InsertProject, ContactForm, ResumeData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectImage(id: string, imageUrl: string): Promise<void>;
  
  // Resume Data
  getResumeData(): Promise<ResumeData>;
  
  // Contact Form
  saveContactForm(form: ContactForm): Promise<void>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private contactForms: ContactForm[];
  private resumeData: ResumeData;

  constructor() {
    this.projects = new Map();
    this.contactForms = [];
    
    // Sample resume data
    this.resumeData = {
      name: "Alex Developer",
      role: "Full-Stack Developer & Designer",
      bio: "I'm a passionate developer who loves creating beautiful, functional applications that make a difference. With expertise in modern web technologies and a keen eye for design, I build products that users love.",
      experience: [
        {
          company: "Tech Startup Inc.",
          position: "Senior Full-Stack Developer",
          period: "2022 - Present",
          description: "Leading development of cloud-native applications using React, Node.js, and AWS. Built microservices architecture serving 100K+ users."
        },
        {
          company: "Design Agency",
          position: "Full-Stack Developer",
          period: "2020 - 2022",
          description: "Developed custom web applications and e-commerce platforms for enterprise clients. Collaborated with designers to create pixel-perfect implementations."
        },
        {
          company: "Freelance",
          position: "Web Developer",
          period: "2018 - 2020",
          description: "Worked with startups and small businesses to build MVPs and production applications. Specialized in React, TypeScript, and modern UI/UX."
        }
      ],
      skills: [
        "React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS",
        "PostgreSQL", "MongoDB", "AWS", "Docker", "Git",
        "UI/UX Design", "Figma", "Framer Motion", "REST APIs", "GraphQL"
      ],
      social: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        twitter: "https://twitter.com/yourusername",
        email: "hello@yourdomain.com"
      }
    };
    
    // Sample projects
    this.initializeSampleProjects();
  }

  private initializeSampleProjects() {
    const sampleProjects = [
      {
        title: "E-Commerce Platform",
        description: "Modern e-commerce solution with real-time inventory, payment processing, and admin dashboard.",
        tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
        palette: ["#2563eb", "#1e40af", "#dbeafe"],
        deviceFrames: ["macbook", "mobile"],
        featured: true,
        caseStudyProblem: "A growing retailer needed a scalable e-commerce platform to handle increasing traffic and complex inventory management.",
        caseStudyApproach: "Built a headless commerce solution using React for the frontend, Node.js/Express for the API, and PostgreSQL for data persistence. Integrated Stripe for payments and implemented real-time inventory sync.",
        caseStudyResult: "Launched successfully with 99.9% uptime, handling 10K+ daily transactions. Reduced checkout time by 40% and increased conversion rate by 25%."
      },
      {
        title: "Task Management App",
        description: "Collaborative task management tool with real-time updates, team workspaces, and integrations.",
        tags: ["Next.js", "TypeScript", "Prisma", "WebSockets"],
        palette: ["#8b5cf6", "#6d28d9", "#ede9fe"],
        deviceFrames: ["macbook", "tablet"],
        featured: true,
        caseStudyProblem: "Teams needed a simple yet powerful tool to manage projects without the complexity of enterprise solutions.",
        caseStudyApproach: "Created a real-time collaborative platform using Next.js, WebSockets for live updates, and a clean, intuitive interface inspired by modern design principles.",
        caseStudyResult: "Adopted by 50+ teams within first month. Users reported 30% improvement in team productivity and praised the clean, distraction-free interface."
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time analytics platform with customizable widgets, data visualization, and export capabilities.",
        tags: ["React", "D3.js", "Python", "FastAPI"],
        palette: ["#10b981", "#059669", "#d1fae5"],
        deviceFrames: ["macbook"],
        featured: false,
        caseStudyProblem: "Business needed to visualize complex data patterns and make data-driven decisions quickly.",
        caseStudyApproach: "Developed an interactive dashboard with D3.js visualizations, Python backend for data processing, and real-time updates using server-sent events.",
        caseStudyResult: "Reduced time to insight by 60%. Enabled stakeholders to identify trends 3x faster than previous manual reporting process."
      },
      {
        title: "Social Platform",
        description: "Community-driven social platform with posts, comments, likes, and user profiles.",
        tags: ["React", "GraphQL", "MongoDB", "AWS"],
        palette: ["#f59e0b", "#d97706", "#fef3c7"],
        deviceFrames: ["mobile", "tablet"],
        featured: false,
      },
      {
        title: "Portfolio Website",
        description: "Minimalist portfolio site with AI-generated project visuals and smooth animations.",
        tags: ["Next.js", "Framer Motion", "Tailwind", "OpenAI"],
        palette: ["#ec4899", "#db2777", "#fce7f3"],
        deviceFrames: ["macbook", "mobile"],
        featured: true,
      },
      {
        title: "Food Delivery App",
        description: "Full-stack food delivery platform with restaurant management, order tracking, and payments.",
        tags: ["React Native", "Node.js", "PostgreSQL", "Google Maps"],
        palette: ["#ef4444", "#dc2626", "#fee2e2"],
        deviceFrames: ["mobile"],
        featured: false,
      }
    ];

    sampleProjects.forEach(projectData => {
      const id = randomUUID();
      const project: Project = {
        id,
        title: projectData.title,
        description: projectData.description,
        tags: projectData.tags,
        palette: projectData.palette,
        deviceFrames: projectData.deviceFrames,
        featured: projectData.featured,
        imageUrl: undefined,
        caseStudyProblem: projectData.caseStudyProblem,
        caseStudyApproach: projectData.caseStudyApproach,
        caseStudyResult: projectData.caseStudyResult,
        caseStudy: projectData.caseStudyProblem ? {
          problem: projectData.caseStudyProblem,
          approach: projectData.caseStudyApproach!,
          result: projectData.caseStudyResult!
        } : undefined
      };
      this.projects.set(id, project);
    });
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: any): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      caseStudy: insertProject.caseStudyProblem ? {
        problem: insertProject.caseStudyProblem,
        approach: insertProject.caseStudyApproach,
        result: insertProject.caseStudyResult
      } : undefined
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProjectImage(id: string, imageUrl: string): Promise<void> {
    const project = this.projects.get(id);
    if (project) {
      project.imageUrl = imageUrl;
      this.projects.set(id, project);
    }
  }

  async getResumeData(): Promise<ResumeData> {
    return this.resumeData;
  }

  async saveContactForm(form: ContactForm): Promise<void> {
    this.contactForms.push(form);
  }
}

export const storage = new MemStorage();
