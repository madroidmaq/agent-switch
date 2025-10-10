import { useState, useCallback } from 'react';
import { serviceSwitcher } from '../core/instances';
import type { Scope } from '../core/types';

/**
 * Service switching hook
 */
export const useServiceSwitch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Switch to specified service
   */
  const switchToService = useCallback(async (
    serviceId: string,
    scope: Scope = 'global'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await serviceSwitcher.switchTo(serviceId, scope);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch service';
      setError(errorMessage);
      console.error('Failed to switch service:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get current service ID
   */
  const getCurrentServiceId = useCallback(async (scope: Scope = 'global') => {
    try {
      return await serviceSwitcher.getCurrentServiceId(scope);
    } catch (err) {
      console.error('Failed to get current service:', err);
      return 'claudeai';
    }
  }, []);

  return {
    switchToService,
    getCurrentServiceId,
    isLoading,
    error,
  };
};
