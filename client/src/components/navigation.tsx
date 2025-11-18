import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "About" },
  { path: "/work", label: "Work" },
  { path: "/contact", label: "Contact" },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  <span
                    className="relative text-sm md:text-base font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 cursor-pointer"
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-[1.5rem] md:-bottom-[1.75rem] left-0 right-0 h-[2px] bg-foreground"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
