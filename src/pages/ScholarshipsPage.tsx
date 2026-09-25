import React, { useState, useEffect } from 'react';
import { useScholarships } from '../features/scholarships/hooks/useScholarships';
import { ScholarshipCard } from '../features/scholarships/components/ScholarshipCard';
import { Search, Award, Sparkles, SlidersHorizontal } from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  const { scholarships, filters, setFilters, totalCount } = useScholarships();

  // Local state for debounced search bar
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchTerm: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
          <Award className="h-4 w-4" /> Discovery Hub
        </div>
        <h1 className="text-2xl font-bold text-foreground">Scholarship Directory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Explore and filter verified funding opportunities tailored to your student profile.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, category, provider, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="px-3 py-1.5 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="Merit">Merit Based</option>
              <option value="Need Based">Need Based</option>
              <option value="Minority">Minority / Inclusion</option>
              <option value="Sports">Sports & Athletics</option>
              <option value="Research">Research & Innovation</option>
            </select>

            {/* Education Level Filter */}
            <select
              value={filters.educationLevel}
              onChange={(e) => setFilters((prev) => ({ ...prev, educationLevel: e.target.value }))}
              className="px-3 py-1.5 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Education Levels</option>
              <option value="college">College / University</option>
              <option value="school">High School</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground font-semibold">{scholarships.length}</strong> of {totalCount} scholarships
        </span>
      </div>

      {/* Grid of Scholarship Cards */}
      {scholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scholarships.map((sch) => (
            <ScholarshipCard key={sch.id} scholarship={sch} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-3">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Scholarships Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or filter selections to find matching opportunities.
          </p>
        </div>
      )}
    </div>
  );
};
