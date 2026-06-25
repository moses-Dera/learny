import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { WebGLGradient } from "@/components/ui/webgl-gradient";

export default function LandingPage() {
  return (
    <>
      <section className="relative min-h-[50vh] lg:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-16 lg:py-32">
        <WebGLGradient />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          {/* 1. Top Left - Spring/Scribble */}
          <div className="hidden lg:block absolute left-[5%] xl:left-[10%] top-[15%] opacity-30 pointer-events-none -rotate-12 hover:rotate-12 transition-transform duration-1000">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary stroke-current">
              <path d="M 20,80 C 40,100 80,90 90,60 C 100,30 60,10 40,30 C 20,50 30,80 60,90 C 90,100 100,70 100,70" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-[spin_20s_linear_infinite]" />
            </svg>
          </div>

          {/* 2. Mid Left - Sparkle */}
          <div className="hidden lg:block absolute left-[8%] xl:left-[15%] top-[45%] opacity-40 pointer-events-none animate-pulse">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground stroke-current">
              <path d="M 50,10 L 50,90 M 10,50 L 90,50 M 20,20 L 80,80 M 20,80 L 80,20" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 3. Bottom Left - Abstract Arrow */}
          <div className="hidden lg:block absolute left-[12%] xl:left-[20%] bottom-[20%] opacity-50 pointer-events-none -rotate-6">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary stroke-current">
              <path d="M 80,80 C 60,80 30,60 20,20" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 20,20 L 40,25 M 20,20 L 25,40" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 4. Top Right - Dashed Orbit */}
          <div className="hidden lg:block absolute right-[8%] xl:right-[15%] top-[20%] opacity-30 pointer-events-none rotate-12 hover:-rotate-12 transition-transform duration-1000">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground stroke-current">
              <circle cx="50" cy="50" r="40" strokeWidth="3" strokeDasharray="6 8" />
              <path d="M 50,20 L 50,80 M 20,50 L 80,50" strokeWidth="3" strokeLinecap="round" />
              <circle cx="80" cy="20" r="4" fill="currentColor" className="text-primary" />
            </svg>
          </div>

          {/* 5. Mid Right - Plus Cluster */}
          <div className="hidden lg:block absolute right-[5%] xl:right-[10%] top-[50%] opacity-40 pointer-events-none">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground stroke-current">
              <path d="M 20,10 L 20,30 M 10,20 L 30,20" strokeWidth="4" strokeLinecap="round" />
              <path d="M 80,40 L 80,60 M 70,50 L 90,50" strokeWidth="4" strokeLinecap="round" />
              <path d="M 40,80 L 40,100 M 30,90 L 50,90" strokeWidth="4" strokeLinecap="round" className="text-primary" />
            </svg>
          </div>

          {/* 6. Bottom Right - Wavy Scribble */}
          <div className="hidden lg:block absolute right-[12%] xl:right-[18%] bottom-[25%] opacity-50 pointer-events-none rotate-6">
            <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary stroke-current">
              <path d="M 10,50 Q 25,20 50,50 T 90,50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 20,60 Q 35,30 60,60 T 100,60" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 animate-slide-up leading-[1.1] max-w-4xl">
            The <span className="font-serif italic font-normal text-primary pr-2">Smarter</span> Way to <br className="hidden md:block" />
            Learn & Teach <span className="font-serif italic font-normal text-muted-foreground/60 pr-2">Online.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-foreground/80 mb-10 max-w-xl animate-slide-up" style={{ animationDelay: "100ms" }}>
            Join 10,000+ learners accessing world-class courses with paywall-protected video, progress tracking, and verified certificates.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 animate-slide-up mb-12 w-full max-w-md mx-auto" style={{ animationDelay: "200ms" }}>
            <Link href="/courses" className={`${buttonVariants({ size: "lg" })} w-full sm:w-auto min-w-[240px] h-14 rounded-full text-base font-semibold bg-primary text-white shadow-[0_0_30px_rgba(224,108,25,0.3)] hover:shadow-[0_0_50px_rgba(224,108,25,0.5)] transition-all hover:scale-105`}>
              Start Learning Free
            </Link>
            
            <Link href="/register" className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              or Become an Instructor 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Minimal Trust Element (No Pill) */}
          <div className="animate-fade-in flex flex-col sm:flex-row items-center gap-4 opacity-90" style={{ animationDelay: "400ms" }}>
            <div className="flex -space-x-3">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background overflow-hidden relative shadow-sm">
                 <Image src="https://t4.ftcdn.net/jpg/18/98/30/85/240_F_1898308559_89XeveVfEafXMkOQqC60SMGoUsulv8qW.jpg" alt="Student" fill unoptimized className="object-cover" />
               </div>
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background overflow-hidden relative shadow-sm">
                 <Image src="https://t4.ftcdn.net/jpg/20/52/27/89/240_F_2052278943_dKvrOA3R1V3dluuhKI72rz0YyOgZhBum.jpg" alt="Student" fill unoptimized className="object-cover" />
               </div>
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center relative z-10 shadow-sm">
                 <span className="text-[10px] sm:text-xs font-bold text-primary">10k+</span>
               </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-foreground">10,000+</span> active learners
            </div>
          </div>

        </div>
      </section>

      {/* ─── Social Proof ────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-foreground/70 mb-8">
            Trusted by learners from innovative companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 grayscale">
            {/* Dummy logos */}
            {["Microsoft", "Spotify", "Amazon", "Netflix", "Google"].map((company) => (
              <div key={company} className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
                <div className="w-6 h-6 rounded bg-current opacity-50" />
                <span className="text-xl font-bold tracking-tighter">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features (Organic Boxless) ──────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        {/* Subtle background glow to ground the section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-start">
            
            {/* Left Column: Huge Sticky Title */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[1.1]">
                Everything <br/><span className="font-serif italic font-normal text-primary pr-2">you need to</span><br/>scale knowledge.
              </h2>
              <p className="text-xl text-muted-foreground max-w-md">
                We stripped away the noise and generic boxes to focus entirely on the learning experience.
              </p>
            </div>

            {/* Right Column: Flowing Features */}
            <div className="lg:col-span-6 lg:col-start-7 space-y-24 mt-12 lg:mt-0">
              
              {/* Feature 1 */}
              <div className="relative group">
                <div className="absolute -left-8 -top-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-700 transform scale-[4] -rotate-12 pointer-events-none">
                  <LockIcon />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-bold text-primary tracking-widest uppercase">01</span>
                    <div className="h-px w-12 bg-primary/30" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Paywall-Protected Video</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Secure streaming via Mux with signed playback tokens to ensure your premium content is strictly isolated and only accessible to enrolled students.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative group lg:ml-12">
                <div className="absolute -right-8 -top-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-700 transform scale-[4] rotate-12 pointer-events-none">
                  <ChartIcon />
                </div>
                <div className="relative z-10 text-right lg:text-left">
                  <div className="flex items-center justify-end lg:justify-start gap-4 mb-4">
                    <span className="text-sm font-bold text-primary tracking-widest uppercase">02</span>
                    <div className="h-px w-12 bg-primary/30" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Track Your Progress</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Automatic save-states. Your students can pick up exactly where they left off with precise second-by-second video progress tracking.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative group">
                <div className="absolute -left-8 top-0 text-primary/10 group-hover:text-primary/20 transition-colors duration-700 transform scale-[4] -rotate-6 pointer-events-none">
                  <BadgeIcon />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-bold text-primary tracking-widest uppercase">03</span>
                    <div className="h-px w-12 bg-primary/30" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Earn Certificates</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Showcase new skills with verifiable completion certificates awarded automatically upon reaching 100% progress.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── Course Preview ──────────────────────────────────────────────── */}
      <section className="py-24 bg-card/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Courses</h2>
              <p className="text-muted-foreground">Explore our most popular premium content.</p>
            </div>
            <Link href="/courses" className={`${buttonVariants({ variant: "link" })} hidden sm:inline-flex`}>
              View all courses &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard 
              title="Advanced UI/UX Design"
              author="Jane Smith"
              price={149}
              imageColor="bg-blue-500/20"
            />
            <CourseCard 
              title="Python Backend Mastery"
              author="John Doe"
              price={199}
              imageColor="bg-yellow-500/20"
            />
            <CourseCard 
              title="Startup Fundamentals"
              author="Alice Johnson"
              price={99}
              imageColor="bg-green-500/20"
            />
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Inline Components ──────────────────────────────────────────────────────



function CourseCard({ title, author, price, imageColor }: { title: string, author: string, price: number, imageColor: string }) {
  return (
    <div className="glass rounded-xl overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 duration-300">
      <div className={`w-full aspect-video ${imageColor} relative`}>
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[12px] border-l-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{author}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="font-bold text-primary">${price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── SVGs ───────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 17V7"/>
    </svg>
  );
}
