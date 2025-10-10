import { useState, useCallback, useEffect } from 'react';
import { presetsManager, serviceSwitcher } from '../core/instances';
import type { ServiceItem, Preset } from '../core/types';

/**
 * Presets management hook
 */
export const usePresets = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [currentServiceId, setCurrentServiceId] = useState<string>('claudeai');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load presets
   */
  const loadPresets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await presetsManager.load();

      // Get currently active service
      const currentId = await serviceSwitcher.getCurrentServiceId('global');
      setCurrentServiceId(currentId);

      // Get service list
      const serviceList = presetsManager.getServiceList(currentId);
      setServices(serviceList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load presets';
      setError(errorMessage);
      console.error('Failed to load presets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add service
   */
  const addService = useCallback(async (data: { id: string; preset: Preset }) => {
    try {
      await presetsManager.add(data.id, data.preset);

      // Refresh service list
      const serviceList = presetsManager.getServiceList(currentServiceId);
      setServices(serviceList);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add service';
      setError(errorMessage);
      console.error('Failed to add service:', err);
      return false;
    }
  }, [currentServiceId]);

  /**
   * Update service
   */
  const updateService = useCallback(async (data: { id: string; preset: Preset }) => {
    try {
      await presetsManager.update(data.id, data.preset);

      // Refresh service list
      const serviceList = presetsManager.getServiceList(currentServiceId);
      setServices(serviceList);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update service';
      setError(errorMessage);
      console.error('Failed to update service:', err);
      return false;
    }
  }, [currentServiceId]);

  /**
   * Delete service
   */
  const deleteService = useCallback(async (id: string) => {
    try {
      await presetsManager.delete(id);

      // Refresh service list
      const serviceList = presetsManager.getServiceList(currentServiceId);
      setServices(serviceList);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete service';
      setError(errorMessage);
      console.error('Failed to delete service:', err);
      return false;
    }
  }, [currentServiceId]);

  return {
    services,
    currentServiceId,
    isLoading,
    error,
    loadPresets,
    addService,
    updateService,
    deleteService,
  };
};
