"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function CatalogFilters({
  categories
}: {
  categories: { id: string; name: string; slug: string }[]
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");
  const currentQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(currentQuery);

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query !== currentQuery) {
        createQueryString("q", query);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <button
          onClick={() => createQueryString("category", "")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border shrink-0",
            !currentCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => createQueryString("category", category.slug)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border shrink-0",
              currentCategory === category.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
