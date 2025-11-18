import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { ResumeData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const { data: resumeData, isLoading } = useQuery<ResumeData>({
    queryKey: ["/api/resume"],
  });

  const { data: heroImage } = useQuery<{ url: string }>({
    queryKey: ["/api/images/hero-background"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with AI-Generated Background */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background - AI image or elegant fallback gradient */}
        <div className="absolute inset-0 z-0">
          {heroImage?.url ? (
            <>
              <img
                src={heroImage.url}
                alt="Abstract background"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            {isLoading ? (
              <>
                <Skeleton className="h-20 md:h-28 w-3/4 mx-auto" />
                <Skeleton className="h-8 md:h-12 w-2/3 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-8" />
              </>
            ) : (
              <>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter text-foreground">
                  {resumeData?.name || "Your Name"}
                </h1>
                <p className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-muted-foreground">
                  {resumeData?.role || "Developer & Designer"}
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="pt-8"
                >
                  <a
                    href="#experience"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm md:text-base backdrop-blur-md bg-foreground/5 border border-foreground/10 rounded-lg hover-elevate active-elevate-2 transition-all duration-200"
                    data-testid="button-scroll-experience"
                  >
                    Explore My Work
                  </a>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
              About
            </h2>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                {resumeData?.bio || "Passionate about creating exceptional digital experiences with clean code and thoughtful design."}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
              Experience
            </h2>
            
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-12" data-testid="list-experience">
                {resumeData?.experience.map((exp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="border-l-2 border-border pl-6 space-y-3"
                    data-testid={`item-experience-${idx}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="text-xl md:text-2xl font-medium">
                        {exp.position}
                      </h3>
                      <span className="text-sm uppercase tracking-wider text-muted-foreground font-light">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-base font-normal text-foreground">
                      {exp.company}
                    </p>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
              Skills
            </h2>
            
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="flex flex-wrap gap-3" data-testid="list-skills">
                {resumeData?.skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
