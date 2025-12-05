import { Hero } from "@/components/hero/hero";
import { ProjectGrid } from "@/components/projects/project-grid";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { ContactCTA } from "@/components/contact/contact-cta";
import { getHeroCopy, getFeaturedProjects } from "@/lib/cms";
import { getLatestRepos } from "@/lib/github";

export const revalidate = 60;

export default async function Home() {
  const [hero, projects, repos] = await Promise.all([
    getHeroCopy(),
    getFeaturedProjects(),
    getLatestRepos(),
  ]);

  const totalStars = repos.reduce((acc, repo) => acc + repo.stars, 0);

  const heroStats = {
    shipped: {
      value: `${projects.length}+`,
      descriptor: "launches",
    },
    performance: {
      value: "99+",
      descriptor: "Lighthouse",
    },
    githubStars: {
      value: totalStars.toLocaleString(),
      suffix: "★",
    },
  };

  return (
    <div className="space-y-16 pb-20 pt-10">
      <Hero
        hero={{
          headline: hero.headline,
          subheadline: hero.subheadline,
          specialties: hero.specialties,
          availability: hero.availability,
        }}
        stats={heroStats}
      />
      <ProjectGrid projects={projects} repos={repos} />
      <ExperienceTimeline />
      <ContactCTA />
    </div>
  );
}
