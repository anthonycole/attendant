import { useQuery } from '@tanstack/react-query';
import type { StrataScheme, SLA } from '@/types/strata';

// Fetch all strata schemes
export function useStrataSchemes() {
  return useQuery({
    queryKey: ['strata-schemes'],
    queryFn: async (): Promise<StrataScheme[]> => {
      // In production, this would be an API call
      try {
        const response = await fetch('/api/strata-schemes');
        if (!response.ok) throw new Error('API not available');
        return response.json();
      } catch {
        // Fallback to static data during development
        const strataSchemes = await import('@/data/strata-schemes.json');
        return strataSchemes.default as StrataScheme[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch SLAs for a specific strata scheme
export function useStrataSchemeSLAs(strataSchemeId: string | null) {
  return useQuery({
    queryKey: ['slas', strataSchemeId],
    queryFn: async (): Promise<SLA[]> => {
      if (!strataSchemeId) return [];
      
      // In production, this would be an API call
      try {
        const response = await fetch(`/api/strata-schemes/${strataSchemeId}/slas`);
        if (!response.ok) throw new Error('API not available');
        return response.json();
      } catch {
        // Fallback to static data during development
        const slas = await import('@/data/slas.json');
        const allSLAs = slas.default as SLA[];
        return allSLAs.filter(sla => sla.strata_scheme_id === strataSchemeId);
      }
    },
    enabled: !!strataSchemeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get business hours for a strata scheme
export function useStrataSchemeBusinessHours(strataSchemeId: string | null) {
  return useQuery({
    queryKey: ['business-hours', strataSchemeId],
    queryFn: async () => {
      if (!strataSchemeId) return [];
      
      // Default business hours for Australian strata schemes
      return [
        { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_working_day: true }, // Monday
        { day_of_week: 2, start_time: '09:00', end_time: '17:00', is_working_day: true }, // Tuesday
        { day_of_week: 3, start_time: '09:00', end_time: '17:00', is_working_day: true }, // Wednesday
        { day_of_week: 4, start_time: '09:00', end_time: '17:00', is_working_day: true }, // Thursday
        { day_of_week: 5, start_time: '09:00', end_time: '17:00', is_working_day: true }, // Friday
        { day_of_week: 6, start_time: '00:00', end_time: '00:00', is_working_day: false }, // Saturday
        { day_of_week: 0, start_time: '00:00', end_time: '00:00', is_working_day: false }, // Sunday
      ];
    },
    enabled: !!strataSchemeId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}