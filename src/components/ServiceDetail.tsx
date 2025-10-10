import React from 'react';
import { Box, Text } from 'ink';
import type { ServiceItem } from '../core/types';
import { theme } from '../constants/theme';

interface ServiceDetailProps {
  service: ServiceItem;
}

/**
 * Service detail component
 */
export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} marginTop={1}>
      <Text bold color={theme.colors.primary}>
        Service Details:
      </Text>

      <Box flexDirection="column" marginTop={1} gap={0}>
        {/* Service name */}
        <Box>
          <Text color={theme.colors.muted}>Name: </Text>
          <Text bold>{service.name}</Text>
        </Box>

        {/* Main model */}
        <Box>
          <Text color={theme.colors.muted}>Model: </Text>
          <Text>{service.model}</Text>
        </Box>

        {/* Fast model */}
        <Box>
          <Text color={theme.colors.muted}>Fast: </Text>
          <Text>{service.smallModel}</Text>
        </Box>

        {/* Only show API and Token for non-official services */}
        {!service.isOfficial && (
          <>
            <Box>
              <Text color={theme.colors.muted}>API: </Text>
              <Text>{service.baseUrl}</Text>
            </Box>

            <Box>
              <Text color={theme.colors.muted}>Token: </Text>
              <Text dimColor>{service.tokenPreview}</Text>
            </Box>
          </>
        )}

        {/* Official service description */}
        {service.isOfficial && (
          <Box marginTop={1}>
            <Text color={theme.colors.muted} italic>
              Official Claude.ai service, uses browser login
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
