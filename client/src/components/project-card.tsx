import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  const isLoading = !project.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      data-testid={`card-project-${project.id}`}
      className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-card-border hover-elevate active-elevate-2 transition-all duration-200"
    >
      {/* Project Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted via-card to-muted">
            <div className="text-center space-y-2 px-6">
              <div className="text-sm text-muted-foreground">Loading visual...</div>
              <Skeleton className="h-2 w-24 mx-auto" />
            </div>
          </div>
        ) : project.imageUrl ? (
          <>
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 via-card to-accent/10">
            <div className="text-4xl font-light tracking-tighter text-muted-foreground/30">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6 space-y-3">
        <h3 className="text-2xl font-medium tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        
        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs uppercase tracking-wider font-light"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
