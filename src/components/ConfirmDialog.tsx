import React from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../constants/theme';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog component
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  useInput((input, key) => {
    if (input.toLowerCase() === 'y') {
      onConfirm();
    } else if (input.toLowerCase() === 'n' || key.escape) {
      onCancel();
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="yellow"
      paddingX={2}
      paddingY={1}
    >
      <Text bold color={theme.colors.warning}>
        {theme.icons.warning} Confirm Action
      </Text>

      <Box marginTop={1}>
        <Text>{message}</Text>
      </Box>

      <Box marginTop={2} justifyContent="center" gap={2}>
        <Text color={theme.colors.success}>[Y] Confirm</Text>
        <Text color={theme.colors.error}>[N] Cancel</Text>
      </Box>
    </Box>
  );
};
