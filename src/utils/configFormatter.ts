import chalk from 'chalk';
import type { Preset } from '../core/types';

/**
 * Format service configuration for console output
 * @param serviceName Service name
 * @param preset Preset configuration
 * @param scope Scope ('global' or 'local')
 * @returns Formatted string array
 */
export function formatServiceConfig(
  serviceName: string,
  preset: Preset,
  scope: 'global' | 'local'
): string[] {
  const lines: string[] = [];

  lines.push(`Name:     ${chalk.bold(serviceName)}`);
  lines.push(`Scope:    ${scope === 'global' ? 'Global' : 'Local'}`);

  if (preset.forceLoginMethod === 'claudeai') {
    lines.push(`Type:     Official Claude.ai Service`);
  } else {
    lines.push(`API:      ${chalk.gray(preset.env.ANTHROPIC_BASE_URL || 'N/A')}`);
    lines.push(`Model:    ${chalk.gray(preset.env.ANTHROPIC_MODEL || 'N/A')}`);
    lines.push(`Fast:     ${chalk.gray(preset.env.ANTHROPIC_SMALL_FAST_MODEL || 'N/A')}`);
  }

  return lines;
}

/**
 * Display service configuration
 * @param title Title
 * @param serviceName Service name
 * @param preset Preset configuration
 * @param scope Scope
 */
export function displayServiceConfig(
  title: string,
  serviceName: string,
  preset: Preset,
  scope: 'global' | 'local'
): void {
  console.log(chalk.bold.cyan(`\n${title}:`));
  const lines = formatServiceConfig(serviceName, preset, scope);
  lines.forEach(line => console.log(line));
  console.log();
}
