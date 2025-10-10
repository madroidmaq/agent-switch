import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { Header } from './Header';
import { ServiceList } from './ServiceList';
import { ServiceDetail } from './ServiceDetail';
import { StatusBar } from './StatusBar';
import { AddServiceForm } from './AddServiceForm';
import { EditServiceForm } from './EditServiceForm';
import { ConfirmDialog } from './ConfirmDialog';
import { ConfigDisplay } from './ConfigDisplay';
import { usePresets } from '../hooks/usePresets';
import { useServiceSwitch } from '../hooks/useServiceSwitch';
import { serviceSwitcher } from '../core/instances';
import type { AppMode, Scope, ServiceItem } from '../core/types';
import { theme } from '../constants/theme';
import { CONFIG_PATHS } from '../constants/config';
import { openInEditor } from '../utils/openInEditor';
import { openInBrowser } from '../utils/openInBrowser';

/**
 * Main application component
 */
export const App: React.FC = () => {
  const { exit } = useApp();
  const {
    services,
    currentServiceId,
    isLoading: isLoadingPresets,
    error: presetsError,
    loadPresets,
    addService,
    updateService,
    deleteService,
  } = usePresets();

  const {
    switchToService,
    isLoading: isSwitching,
    error: switchError,
  } = useServiceSwitch();

  const [mode, setMode] = useState<AppMode>('list');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedScope, setSelectedScope] = useState<Scope>('global');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isExiting, setIsExiting] = useState(false);
  const [globalService, setGlobalService] = useState<ServiceItem | undefined>();
  const [localService, setLocalService] = useState<ServiceItem | undefined>();

  // Initialize loading
  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  // Keyboard event handler (list mode)
  useInput(
    (input, key) => {
      if (mode !== 'list' || isExiting) return;

      // Up/down navigation
      if (key.upArrow) {
        setSelectedIndex((i) => Math.max(0, i - 1));
      }

      if (key.downArrow) {
        setSelectedIndex((i) => Math.min(services.length - 1, i + 1));
      }

      // Tab - toggle scope
      if (key.tab) {
        setSelectedScope((scope) => scope === 'global' ? 'local' : 'global');
      }

      // Enter - switch service
      if (key.return) {
        if (selectedIndex < services.length) {
          const serviceId = services[selectedIndex].id;
          handleSwitchService(serviceId, selectedScope);
        }
      }

      // E - edit config file
      if (input.toLowerCase() === 'e') {
        openInEditor(CONFIG_PATHS.PRESETS).catch((error) => {
          console.error('Failed to open editor:', error);
        });
      }

      // H - help
      if (input.toLowerCase() === 'h') {
        const { UI_CONFIG } = await import('../constants/config');
        openInBrowser(UI_CONFIG.HELP_URL).catch((error) => {
          console.error('Failed to open browser:', error);
        });
      }

      // Q - quit
      if (input.toLowerCase() === 'q' || key.escape) {
        exit();
      }
    },
    { isActive: mode === 'list' }
  );

  // Keyboard event handler (exit confirmation mode)
  useInput(
    () => {
      // Press any key to exit
      exit();
    },
    { isActive: isExiting }
  );

  /**
   * Handle service switching
   */
  const handleSwitchService = async (serviceId: string, scope: Scope) => {
    setMode('switching');
    const success = await switchToService(serviceId, scope);

    if (success) {
      // Switch successful, set exit state
      setIsExiting(true);

      // Display success message
      const serviceName = services.find(s => s.id === serviceId)?.name || serviceId;
      const scopeText = scope === 'local' ? 'local' : 'global';
      setSuccessMessage(`✓ Successfully switched to ${serviceName} (${scopeText})`);

      // Load current config info
      await loadCurrentConfigs();
    } else {
      // Switch failed, return to list
      setMode('list');
    }
  };

  /**
   * Load current configuration info
   */
  const loadCurrentConfigs = async () => {
    try {
      // Load global config
      const globalId = await serviceSwitcher.getCurrentServiceId('global');
      const globalSvc = services.find(s => s.id === globalId);
      setGlobalService(globalSvc);

      // Load local config (if exists)
      if (serviceSwitcher.configExists('local')) {
        const localId = await serviceSwitcher.getCurrentServiceId('local');
        const localSvc = services.find(s => s.id === localId);
        setLocalService(localSvc);
      }
    } catch (error) {
      console.error('Failed to load current configs:', error);
    }
  };

  /**
   * Handle add service
   */
  const handleAddService = async (data: { id: string; preset: any }) => {
    const success = await addService(data);
    if (success) {
      setMode('list');
      // Select newly added service
      const newIndex = services.findIndex((s) => s.id === data.id);
      if (newIndex >= 0) {
        setSelectedIndex(newIndex);
      }
    }
  };

  /**
   * Handle edit service
   */
  const handleEditService = async (data: { id: string; preset: any }) => {
    const success = await updateService(data);
    if (success) {
      setMode('list');
    }
  };

  /**
   * Handle delete service
   */
  const handleDeleteService = async () => {
    const serviceId = services[selectedIndex].id;
    const success = await deleteService(serviceId);

    if (success) {
      setMode('list');
      // Adjust selected index
      setSelectedIndex((i) => Math.min(i, services.length - 2));
    }
  };

  /**
   * Render loading state
   */
  if (isLoadingPresets) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color={theme.colors.primary}>
          <Spinner type="dots" /> Loading configuration...
        </Text>
      </Box>
    );
  }

  /**
   * Render error state
   */
  if (presetsError) {
    return (
      <Box flexDirection="column" padding={2} borderStyle="single" borderColor="red">
        <Text bold color={theme.colors.error}>
          {theme.icons.error} Failed to load
        </Text>
        <Box marginTop={1}>
          <Text color={theme.colors.error}>{presetsError}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Q to exit</Text>
        </Box>
      </Box>
    );
  }

  /**
   * Render content for different modes
   */
  const renderContent = () => {
    // If exiting, show success message and config info
    if (isExiting) {
      return (
        <Box
          flexDirection="column"
          borderStyle="single"
          borderColor="green"
          paddingX={2}
          paddingY={1}
        >
          <Text bold color={theme.colors.success}>
            {successMessage}
          </Text>
          <ConfigDisplay
            globalService={globalService}
            localService={localService}
          />
          <Box marginTop={1}>
            <Text color={theme.colors.muted} dimColor>
              Press any key to exit...
            </Text>
          </Box>
        </Box>
      );
    }

    switch (mode) {
      case 'list':
      case 'switching':
        return (
          <>
            <ServiceList
              services={services}
              selectedIndex={selectedIndex}
              currentServiceId={currentServiceId}
            />

            {/* Divider */}
            <Box paddingX={2}>
              <Text color={theme.colors.border}>
                ────────────────────────────────────────────────────────────────
              </Text>
            </Box>

            {selectedIndex < services.length && (
              <ServiceDetail service={services[selectedIndex]} />
            )}
          </>
        );

      case 'add':
        return (
          <AddServiceForm
            onSubmit={handleAddService}
            onCancel={() => setMode('list')}
          />
        );

      case 'edit':
        return (
          <EditServiceForm
            service={services[selectedIndex]}
            onSubmit={handleEditService}
            onCancel={() => setMode('list')}
          />
        );

      case 'delete':
        return (
          <ConfirmDialog
            message={`Are you sure you want to delete service "${services[selectedIndex].name}"?`}
            onConfirm={handleDeleteService}
            onCancel={() => setMode('list')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
    >
      {/* Header */}
      <Header />

      {/* Main content area */}
      <Box flexDirection="column" marginTop={1}>
        {renderContent()}
      </Box>

      {/* Error message */}
      {switchError && !isExiting && (
        <Box marginTop={1} paddingX={2}>
          <Text color={theme.colors.error}>
            {theme.icons.error} {switchError}
          </Text>
        </Box>
      )}

      {/* Status bar */}
      {!isExiting && <StatusBar mode={mode} isSwitching={isSwitching} selectedScope={selectedScope} />}
    </Box>
  );
};
