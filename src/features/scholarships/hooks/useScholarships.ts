import { useState, useMemo, useEffect } from 'react';
import { SCHOLARSHIPS_DATA, ScholarshipDetail } from '../data/scholarships';

export interface ScholarshipFilters {
  searchTerm: string;
  category: string;
  educationLevel: string;
}

export function useScholarships() {
  const [scholarshipsList, setScholarshipsList] = useState<ScholarshipDetail[]>(SCHOLARSHIPS_DATA);
  const [filters, setFilters] = useState<ScholarshipFilters>({
    searchTerm: '',
    category: 'all',
    educationLevel: 'all',
  });

  useEffect(() => {
    async function fetchLiveScholarships() {
      try {
        const backendHost = import.meta.env.VITE_BACKEND_URL || 'https://scholarship-applicant.onrender.com';
        const res = await fetch(`${backendHost}/api/scholarships`);
        if (res.ok) {
          const liveData = await res.json();
          if (Array.isArray(liveData) && liveData.length > 0) {
            // Map admin format to applicant format
            const mapped: ScholarshipDetail[] = liveData.map((s: any) => ({
              id: s.id || `sch-${Date.now()}`,
              title: s.title,
              organization: s.provider || 'Scholarship Authority',
              amount: typeof s.amount === 'number' ? s.amount : parseInt(s.amount) || 50000,
              deadline: s.deadline || '2026-12-31',
              category: ((s.categories && s.categories[0]) || 'Merit') as any,
              educationLevel: 'college' as const,
              region: (s.regions && s.regions[0]) || 'National',
              description: s.description || 'Verified scholarship program.',
              eligibilityCriteria: s.eligibleRoles || ['All eligible students'],
              requiredDocuments: s.requiredDocuments || ['Income Certificate', 'Academic Transcript'],
              tags: s.tags || ['Merit', 'Grant'],
              factVersion: 'v4.0.0',
            }));
            setScholarshipsList(mapped);
          }
        }
      } catch (e) {
        console.warn('Backend fetch error, using local fallback:', e);
      }
    }

    fetchLiveScholarships();
  }, []);

  const filteredScholarships = useMemo(() => {
    return scholarshipsList.filter((sch) => {
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
  }, [filters, scholarshipsList]);

  return {
    scholarships: filteredScholarships,
    filters,
    setFilters,
    totalCount: scholarshipsList.length,
  };
}
