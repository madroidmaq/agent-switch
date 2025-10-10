import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type { AppMode, Scope } from '../core/types';
import { theme } from '../constants/theme';

interface StatusBarProps {
  mode: AppMode;
  isSwitching?: boolean;
  selectedScope?: Scope;
}

/**
 * Status bar component
 */
export const StatusBar: React.FC<StatusBarProps> = ({ mode, isSwitching = false, selectedScope = 'global' }) => {
  // Special state when switching
  if (isSwitching) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <Box paddingX={0}>
          <Text color={theme.colors.border}>
            ────────────────────────────────────────────────────────────────
          </Text>
        </Box>
        <Box paddingX={2} paddingY={1}>
          <Text color={theme.colors.warning}>
            <Spinner type="dots" /> Switching service...
          </Text>
        </Box>
      </Box>
    );
  }

  // Keyboard shortcuts for different modes
  const shortcuts: Record<AppMode, string> = {
    list: '↑↓ Select │ Tab Toggle │ Enter Confirm │ H Help │ Q Quit',
    add: 'Enter Next │ Esc Cancel',
    edit: 'Enter Next │ Esc Cancel',
    delete: 'Y Confirm │ N Cancel',
    switching: 'Switching...',
  };

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* Divider */}
      <Box paddingX={0}>
        <Text color={theme.colors.border}>
          ────────────────────────────────────────────────────────────────
        </Text>
      </Box>

      {/* Scope (only shown in list mode) */}
      {mode === 'list' && (
        <Box paddingX={2} paddingY={0}>
          <Text color={theme.colors.muted}>Switch to: </Text>
          <Text color={selectedScope === 'global' ? theme.colors.selected : 'white'}>
            {selectedScope === 'global' ? '[Global]' : ' Global '}
          </Text>
          <Text color={selectedScope === 'local' ? theme.colors.selected : 'white'}>
            {selectedScope === 'local' ? ' [Local]' : ' Local'}
          </Text>
        </Box>
      )}

      {/* Shortcuts */}
      <Box paddingX={2} paddingY={1}>
        <Text color={theme.colors.muted}>{shortcuts[mode]}</Text>
      </Box>
    </Box>
  );
};
