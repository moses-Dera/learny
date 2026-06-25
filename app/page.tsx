import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WebGLGradient } from "@/components/ui/webgl-gradient";

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] lg:min-h-[calc(100vh-4rem)] flex items-center overflow-hidden py-12 lg:py-24">
        <WebGLGradient />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left pt-8 lg:pt-0">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tighter mb-6 animate-slide-up leading-tight">
                <span className="bg-primary text-[#15110F] px-2 rounded-md box-decoration-clone">The</span> <span className="gradient-text">Smarter</span> <span className="bg-primary text-[#15110F] px-2 rounded-md box-decoration-clone">Way to</span><br className="hidden lg:block" /> <span className="bg-primary text-[#15110F] px-2 rounded-md box-decoration-clone leading-[1.5] mt-1 inline-block">Learn & Teach Online</span>
              </h1>
              
              <p className="text-base sm:text-lg text-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "100ms" }}>
                Join 10,000+ learners accessing world-class courses with paywall-protected video, progress tracking, and verified certificates.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <Link href="/courses" className={`${buttonVariants({ size: "lg" })} w-full sm:w-auto h-11 px-8 text-sm font-semibold bg-primary text-white border border-transparent hover:bg-transparent hover:border-primary hover:text-primary transition-all`}>
                  Start Learning Free
                </Link>
                <Link href="/register" className={`${buttonVariants({ size: "lg", variant: "outline" })} w-full sm:w-auto h-11 px-8 text-sm font-semibold bg-transparent text-foreground border border-foreground/30 hover:bg-foreground hover:!text-black transition-all`}>
                  Become an Instructor
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block flex-1 w-full max-w-lg relative animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
                {/* Decorative Design Elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-background to-primary/10" />
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full mix-blend-screen filter blur-[60px] opacity-20 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent rounded-full mix-blend-screen filter blur-[60px] opacity-10" />
                <div className="absolute inset-6 glass rounded-xl flex flex-col p-4 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-background border border-border animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-24 h-2 bg-muted rounded-full" />
                      <div className="w-16 h-2 bg-muted rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg bg-background border border-border flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300">
                      <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
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
                Everything <br/><span className="text-muted-foreground">you need to</span><br/>scale knowledge.
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
