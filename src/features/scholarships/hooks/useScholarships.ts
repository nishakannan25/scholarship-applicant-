import { useState, useMemo } from 'react';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';

export interface ScholarshipFilters {
  searchTerm: string;
  category: string;
  educationLevel: string;
}

export function useScholarships() {
  const [filters, setFilters] = useState<ScholarshipFilters>({
    searchTerm: '',
    category: 'all',
    educationLevel: 'all',
  });

  const filteredScholarships = useMemo(() => {
    return SCHOLARSHIPS_DATA.filter((sch) => {
      // Search term check
      const matchesSearch =
        !filters.searchTerm.trim() ||
        sch.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        sch.organization.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        sch.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        sch.tags.some((t) => t.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      // Category check
      const matchesCategory =
        filters.category === 'all' || sch.category.toLowerCase() === filters.category.toLowerCase();

      // Education Level check
      const matchesLevel =
        filters.educationLevel === 'all' ||
        sch.educationLevel === 'all' ||
        sch.educationLevel === filters.educationLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [filters]);

  return {
    scholarships: filteredScholarships,
    filters,
    setFilters,
    totalCount: SCHOLARSHIPS_DATA.length,
  };
}
