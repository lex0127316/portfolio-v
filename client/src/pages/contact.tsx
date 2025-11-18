import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, Github, Linkedin, Twitter, Copy, Check } from "lucide-react";
import { useState } from "react";
import { contactFormSchema, type ContactForm } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { ResumeData } from "@shared/schema";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: resumeData } = useQuery<ResumeData>({
    queryKey: ["/api/resume"],
  });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out! I'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or email me directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const copyEmail = async () => {
    const email = resumeData?.social.email || "your@email.com";
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Email Copied",
      description: "Email address copied to clipboard",
    });
  };

  const socialLinks = [
    {
      icon: Github,
      href: resumeData?.social.github,
      label: "GitHub",
      testId: "link-github",
    },
    {
      icon: Linkedin,
      href: resumeData?.social.linkedin,
      label: "LinkedIn",
      testId: "link-linkedin",
    },
    {
      icon: Twitter,
      href: resumeData?.social.twitter,
      label: "Twitter",
      testId: "link-twitter",
    },
  ].filter(link => link.href);

  return (
    <div className="min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-16 md:mb-24"
        >
          <h1 className="text-5xl md:text-6xl font-normal tracking-tight">
            Contact
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Let's build something great together. Reach out for collaborations, opportunities, or just to say hello.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider mb-2">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          data-testid="input-name"
                          className="p-4 border border-input rounded-lg focus:ring-2 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider mb-2">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          data-testid="input-email"
                          className="p-4 border border-input rounded-lg focus:ring-2 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider mb-2">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project..."
                          data-testid="input-message"
                          className="min-h-[150px] p-4 border border-input rounded-lg focus:ring-2 transition-all resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                  className="w-full"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-12"
          >
            {/* Email */}
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-medium">Email</h3>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${resumeData?.social.email || "your@email.com"}`}
                  className="text-base md:text-lg text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-email"
                >
                  {resumeData?.social.email || "your@email.com"}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyEmail}
                  data-testid="button-copy-email"
                  className="h-8 w-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-medium">Connect</h3>
                <div className="flex gap-6" data-testid="list-social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={social.testId}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-4 pt-8 border-t border-border">
              <p className="text-base text-muted-foreground leading-relaxed">
                Available for freelance projects, full-time opportunities, and interesting collaborations.
              </p>
              <p className="text-sm text-muted-foreground">
                Response time: Usually within 24-48 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
