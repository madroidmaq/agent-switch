import chalk from 'chalk';
import type { Preset } from '../core/types';

/**
 * Format service configuration for console output
 * @param serviceName Service name
 * @param preset Preset configuration
 * @param scope Scope ('global' or 'local')
 * @param dimmed Whether to display in dimmed/gray style (indicating overridden)
 * @returns Formatted string array
 */
export function formatServiceConfig(
  serviceName: string,
  preset: Preset,
  scope: 'global' | 'local',
  dimmed: boolean = false
): string[] {
  const lines: string[] = [];

  const nameValue = dimmed ? chalk.gray.bold(serviceName) : chalk.bold(serviceName);
  const scopeValue = scope === 'global' ? 'Global' : 'Local';
  const dimColor = chalk.gray;

  lines.push(`Name:     ${nameValue}`);
  lines.push(dimmed ? chalk.gray(`Scope:    ${scopeValue}`) : `Scope:    ${scopeValue}`);

  if (preset.forceLoginMethod === 'claudeai') {
    const typeText = `Type:     Official Claude.ai Service`;
    lines.push(dimmed ? chalk.gray(typeText) : typeText);
  } else {
    const apiText = `API:      ${preset.env.ANTHROPIC_BASE_URL || 'N/A'}`;
    const modelText = `Model:    ${preset.env.ANTHROPIC_MODEL || 'N/A'}`;
    const fastText = `Fast:     ${preset.env.ANTHROPIC_SMALL_FAST_MODEL || 'N/A'}`;

    lines.push(dimmed ? chalk.gray(apiText) : `API:      ${dimColor(preset.env.ANTHROPIC_BASE_URL || 'N/A')}`);
    lines.push(dimmed ? chalk.gray(modelText) : `Model:    ${dimColor(preset.env.ANTHROPIC_MODEL || 'N/A')}`);
    lines.push(dimmed ? chalk.gray(fastText) : `Fast:     ${dimColor(preset.env.ANTHROPIC_SMALL_FAST_MODEL || 'N/A')}`);
  }

  return lines;
}

/**
 * Display service configuration
 * @param title Title
 * @param serviceName Service name
 * @param preset Preset configuration
 * @param scope Scope
 * @param dimmed Whether to display in dimmed/gray style (indicating overridden by local config)
 */
export function displayServiceConfig(
  title: string,
  serviceName: string,
  preset: Preset,
  scope: 'global' | 'local',
  dimmed: boolean = false
): void {
  const titleSuffix = dimmed ? chalk.cyan.dim(' (overridden by local config)') : '';
  const titleText = dimmed ? chalk.cyan.dim.bold(`\n${title}:${titleSuffix}`) : chalk.bold.cyan(`\n${title}:`);
  console.log(titleText);
  const lines = formatServiceConfig(serviceName, preset, scope, dimmed);
  lines.forEach(line => console.log(line));
  console.log();
}
