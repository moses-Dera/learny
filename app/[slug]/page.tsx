import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VALID_PAGES: Record<string, { title: string; description: string }> = {
  "pricing": { title: "Pricing & Plans", description: "Simple, transparent pricing for learners and teams." },
  "certificates": { title: "Verified Certificates", description: "Showcase your achievements with verifiable credentials." },
  "enterprise": { title: "Learny for Enterprise", description: "Upskill your entire workforce with our corporate plans." },
  "about": { title: "About Us", description: "Learn about our mission to democratize education." },
  "careers": { title: "Careers", description: "Join our team and help build the future of learning." },
  "blog": { title: "Learny Blog", description: "Insights, tutorials, and news from the Learny team." },
  "contact": { title: "Contact Support", description: "We're here to help. Get in touch with our team." },
  "terms": { title: "Terms of Service", description: "Read the rules and guidelines for using our platform." },
  "privacy": { title: "Privacy Policy", description: "Learn how we collect, use, and protect your data." },
  "cookies": { title: "Cookie Policy", description: "Information about how we use cookies on our site." },
  "guidelines": { title: "Community Guidelines", description: "Our standards for maintaining a safe, respectful learning environment." },
};

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const pageData = VALID_PAGES[slug];
  
  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-[70vh] bg-background pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="max-w-3xl mx-auto space-y-8 text-center animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-sm border border-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{pageData.title}</h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {pageData.description}
        </p>
        
        <div className="pt-8 p-6 bg-card border border-border border-dashed rounded-xl inline-block text-left mx-auto">
          <p className="text-sm text-muted-foreground italic mb-4">
            Note: This is a placeholder page generated for demonstration purposes. In a production environment, this route would render content from a headless CMS or statically generated markdown files.
          </p>
          <Button asChild variant="default" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
