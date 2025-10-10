import React from 'react';
import { Box, Text } from 'ink';
import { AddServiceForm } from './AddServiceForm';
import type { ServiceItem } from '../core/types';
import type { Preset } from '../core/types';
import { theme } from '../constants/theme';

interface EditServiceFormProps {
  service: ServiceItem;
  onSubmit: (data: { id: string; preset: Preset }) => void;
  onCancel: () => void;
}

/**
 * Edit service form component
 * Reuses AddServiceForm but pre-fills with existing data
 */
export const EditServiceForm: React.FC<EditServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  // Official services cannot be edited
  if (service.isOfficial) {
    return (
      <Box flexDirection="column" borderStyle="single" borderColor="yellow" paddingX={2} paddingY={1}>
        <Text bold color={theme.colors.warning}>
          {theme.icons.warning} Cannot edit official service
        </Text>
        <Box marginTop={1}>
          <Text color={theme.colors.muted}>
            Official Claude.ai service configuration cannot be edited
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press any key to return...</Text>
        </Box>
      </Box>
    );
  }

  // Edit functionality simplified to show a message
  // Full implementation requires pre-filling AddServiceForm initial values
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="cyan" paddingX={2} paddingY={1}>
      <Text bold color={theme.colors.primary}>
        {theme.icons.edit} Edit Service: {service.name}
      </Text>

      <Box flexDirection="column" marginTop={1}>
        <Text color={theme.colors.muted}>
          Edit functionality coming soon...
        </Text>
        <Box marginTop={1}>
          <Text color={theme.colors.muted}>
            Current service information:
          </Text>
          <Text>Name: {service.name}</Text>
          <Text>API: {service.baseUrl}</Text>
          <Text>Model: {service.model}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Esc to return</Text>
        </Box>
      </Box>
    </Box>
  );
};
