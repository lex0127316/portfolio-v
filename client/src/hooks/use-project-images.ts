import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useProjectImages(projects: Project[] | undefined) {
  const queryClient = useQueryClient();
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());

  const generateImageMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return apiRequest("POST", `/api/projects/${projectId}/generate-image`, {});
    },
    onSuccess: (data: any, projectId: string) => {
      if (data.url) {
        // Update the project in cache with the new image URL
        queryClient.setQueryData(["/api/projects"], (old: Project[] | undefined) => {
          if (!old) return old;
          return old.map(p => 
            p.id === projectId ? { ...p, imageUrl: data.url } : p
          );
        });
      }
    },
  });

  useEffect(() => {
    if (!projects || projects.length === 0) return;
    
    // Generate images for projects that don't have them yet and haven't been attempted
    projects.forEach((project, index) => {
      // Guard against undefined IDs and skip if already has image or was attempted
      if (project.id && !project.imageUrl && !attemptedIds.has(project.id)) {
        setAttemptedIds(prev => new Set(prev).add(project.id));
        
        // Stagger image generation to avoid overwhelming the API
        setTimeout(() => {
          generateImageMutation.mutate(project.id);
        }, index * 1000); // Stagger by 1 second per project
      }
    });
  }, [projects?.map(p => p?.id).filter(Boolean).join(',')]); // Only run when valid project IDs change

  return {
    isGenerating: generateImageMutation.isPending,
  };
}
