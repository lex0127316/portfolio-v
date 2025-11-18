import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";

interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-xl bg-black/60" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-2xl"
            data-testid="modal-case-study"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
              className="absolute top-4 right-4 z-10"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Hero Image */}
            {project.imageUrl && (
              <div className="relative aspect-[21/9] overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-8 md:p-12 space-y-12">
              {/* Header */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                  {project.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs uppercase tracking-wider">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Case Study Sections */}
              {project.caseStudy && (
                <div className="grid gap-12">
                  {/* Problem */}
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
                      Problem
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                      {project.caseStudy.problem}
                    </p>
                  </div>

                  {/* Approach */}
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
                      Approach
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                      {project.caseStudy.approach}
                    </p>
                  </div>

                  {/* Result */}
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
                      Result
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                      {project.caseStudy.result}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
