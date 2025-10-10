import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../constants/theme';

/**
 * Header component
 */
export const Header: React.FC = () => {
  return (
    <Box flexDirection="column">
      {/* Title */}
      <Box justifyContent="space-between">
        <Text bold color={theme.colors.primary}>
          Agent Switch
        </Text>
        <Text color={theme.colors.muted}>v1.0</Text>
      </Box>

      {/* Divider */}
      <Box marginY={1}>
        <Text color={theme.colors.border}>
          ────────────────────────────────────────────────────────────────
        </Text>
      </Box>
    </Box>
  );
};
