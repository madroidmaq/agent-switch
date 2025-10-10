import React from 'react';
import { Box, Text } from 'ink';
import type { ServiceItem } from '../core/types';
import { theme } from '../constants/theme';

interface ServiceListProps {
  services: ServiceItem[];
  selectedIndex: number;
  currentServiceId: string;
}

/**
 * Service list component
 */
export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  selectedIndex,
  currentServiceId,
}) => {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text bold color={theme.colors.primary}>
        Available Services:
      </Text>

      <Box flexDirection="column" marginTop={1}>
        {services.map((service, index) => {
          const isSelected = index === selectedIndex;
          const isActive = service.id === currentServiceId;

          return (
            <Box key={service.id}>
              {/* Active indicator - fixed width */}
              <Text color={isActive ? theme.colors.active : 'white'}>
                {isActive ? '✓ ' : '  '}
              </Text>

              {/* Service name - fixed width */}
              <Text color={isSelected ? theme.colors.selected : 'white'}>
                {service.name.padEnd(15)}
              </Text>

              {/* Service description */}
              <Text color={theme.colors.muted}>
                {' '}{service.isOfficial ? 'Official Service' : service.baseUrl}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
