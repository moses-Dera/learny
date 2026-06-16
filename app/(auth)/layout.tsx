import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Auth Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative bg-background">
        <div className="absolute top-8 left-8 sm:top-12 sm:left-16 lg:left-24">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#15110F]"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            Learny
          </Link>
        </div>
        <div className="w-full max-w-sm mx-auto mt-24 lg:mt-0">
          {children}
        </div>
      </div>
      
      {/* Right side - Branding/Image (hidden on mobile) */}
      <div className="hidden lg:block relative bg-[#1A1614] border-l border-border overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
           <div className="max-w-lg space-y-6 text-center">
              <h2 className="text-4xl font-bold text-foreground leading-tight tracking-tight">
                Empower your teaching & learning journey.
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of instructors and students in the most advanced, beautifully designed learning ecosystem.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
