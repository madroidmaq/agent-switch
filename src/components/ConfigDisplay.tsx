import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../constants/theme';
import type { ServiceItem } from '../core/types';

interface ConfigDisplayProps {
  globalService?: ServiceItem;
  localService?: ServiceItem;
}

/**
 * Configuration display component
 */
export const ConfigDisplay: React.FC<ConfigDisplayProps> = ({
  globalService,
  localService,
}) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color={theme.colors.primary}>Current Configuration:</Text>

      {/* Global configuration */}
      {globalService && (
        <Box flexDirection="column" marginTop={1} paddingLeft={2}>
          <Text bold color={theme.colors.success}>Global Configuration:</Text>
          <Box flexDirection="column" paddingLeft={2}>
            <Text>Name:     <Text bold>{globalService.name}</Text></Text>
            <Text>Scope:    Global</Text>
            {globalService.isOfficial ? (
              <Text>Type:     Official Claude.ai Service</Text>
            ) : (
              <>
                <Text>API:      <Text dimColor>{globalService.baseUrl}</Text></Text>
                <Text>Model:    <Text dimColor>{globalService.model}</Text></Text>
                <Text>Fast:     <Text dimColor>{globalService.smallModel}</Text></Text>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Local configuration */}
      {localService && (
        <Box flexDirection="column" marginTop={1} paddingLeft={2}>
          <Text bold color={theme.colors.success}>Local Configuration:</Text>
          <Box flexDirection="column" paddingLeft={2}>
            <Text>Name:     <Text bold>{localService.name}</Text></Text>
            <Text>Scope:    Local</Text>
            {localService.isOfficial ? (
              <Text>Type:     Official Claude.ai Service</Text>
            ) : (
              <>
                <Text>API:      <Text dimColor>{localService.baseUrl}</Text></Text>
                <Text>Model:    <Text dimColor>{localService.model}</Text></Text>
                <Text>Fast:     <Text dimColor>{localService.smallModel}</Text></Text>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* If neither exists */}
      {!globalService && !localService && (
        <Box marginTop={1} paddingLeft={2}>
          <Text color={theme.colors.warning}>No service configuration found</Text>
        </Box>
      )}
    </Box>
  );
};
