import { writeFile, readFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { existsSync } from 'fs';
import type { PresetsManager } from './presets';
import type { Scope, Preset } from './types';
import { deepMerge } from '../utils/deepMerge';
import { CONFIG_PATHS, ANTHROPIC_ENV_KEYS } from '../constants/config';

/**
 * Service Switcher
 * Responsible for switching Claude Code configuration to different presets
 */
export class ServiceSwitcher {
  constructor(private presetsManager: PresetsManager) {}

  /**
   * Switch to the specified service
   * @param presetId Preset ID
   * @param scope Scope: 'global' writes to ~/.claude/settings.json, 'local' writes to ./.claude/settings.local.json
   */
  async switchTo(presetId: string, scope: Scope = 'global'): Promise<void> {
    const preset = this.presetsManager.get(presetId);
    if (!preset) {
      throw new Error(`Preset "${presetId}" does not exist`);
    }

    try {
      // Update different configuration files based on scope
      await this.updateSettings(preset, presetId, scope);
    } catch (error) {
      throw new Error(
        `Failed to switch service: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Read existing configuration file
   * @param settingsPath Configuration file path
   */
  private async readSettings(settingsPath: string): Promise<any> {
    if (!existsSync(settingsPath)) {
      return {};
    }

    const content = await readFile(settingsPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Clean Anthropic API related environment variables
   * @param env Environment variables object
   */
  private cleanAnthropicEnv(env: any): any {
    if (!env) return {};

    const cleaned = { ...env };
    delete cleaned[ANTHROPIC_ENV_KEYS.BASE_URL];
    delete cleaned[ANTHROPIC_ENV_KEYS.AUTH_TOKEN];
    delete cleaned[ANTHROPIC_ENV_KEYS.MODEL];
    delete cleaned[ANTHROPIC_ENV_KEYS.SMALL_FAST_MODEL];

    return cleaned;
  }

  /**
   * Build preset configuration object
   * @param preset Preset configuration
   * @param presetId Preset ID
   * @param existingEnv Existing environment variables configuration
   */
  private buildPresetConfig(preset: Preset, presetId: string, existingEnv: any): any {
    const presetConfig: any = {
      currentPreset: presetId,
      forceLoginMethod: preset.forceLoginMethod,
    };

    // If it's claudeai service, clear API related fields
    if (preset.forceLoginMethod === 'claudeai') {
      presetConfig.env = this.cleanAnthropicEnv(existingEnv);
    } else {
      // For non-claudeai services, use preset's env configuration
      if (preset.env && Object.keys(preset.env).length > 0) {
        presetConfig.env = preset.env;
      }
    }

    return presetConfig;
  }

  /**
   * Write configuration file
   * @param settingsPath Configuration file path
   * @param settings Configuration content
   */
  private async writeSettings(settingsPath: string, settings: any): Promise<void> {
    // Ensure directory exists
    const dir = dirname(settingsPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    // Write configuration
    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
  }

  /**
   * Update configuration file
   * Deep merge preset configuration into corresponding configuration file
   * @param preset Preset configuration
   * @param presetId Preset ID
   * @param scope Scope
   */
  private async updateSettings(preset: Preset, presetId: string, scope: Scope): Promise<void> {
    // Determine configuration file path based on scope
    const settingsPath = scope === 'global' ? CONFIG_PATHS.GLOBAL_SETTINGS : CONFIG_PATHS.LOCAL_SETTINGS;

    // Read existing configuration
    const settings = await this.readSettings(settingsPath);

    // Build preset configuration
    const presetConfig = this.buildPresetConfig(preset, presetId, settings.env);

    // Deep merge configurations
    let mergedSettings = deepMerge(settings, presetConfig);

    // If it's claudeai service, ensure API related fields are cleared again (prevent deep merge from bringing them back)
    if (preset.forceLoginMethod === 'claudeai') {
      mergedSettings.env = this.cleanAnthropicEnv(mergedSettings.env);
    }

    // Write configuration file
    await this.writeSettings(settingsPath, mergedSettings);
  }

  /**
   * Get current active service ID
   * @param scope Scope: 'global' reads from ~/.claude/settings.json, 'local' reads from ./.claude/settings.local.json
   */
  async getCurrentServiceId(scope: Scope = 'global'): Promise<string> {
    const settingsPath = scope === 'global' ? CONFIG_PATHS.GLOBAL_SETTINGS : CONFIG_PATHS.LOCAL_SETTINGS;

    try {
      if (!existsSync(settingsPath)) {
        // If configuration file doesn't exist, default to claudeai
        return 'claudeai';
      }

      const content = await readFile(settingsPath, 'utf-8');
      const settings = JSON.parse(content);

      // Prioritize returning recorded preset ID
      if (settings.currentPreset) {
        return settings.currentPreset;
      }

      // If no preset ID is recorded, infer from env configuration
      if (!settings.env || !settings.env[ANTHROPIC_ENV_KEYS.BASE_URL]) {
        return 'claudeai';
      }

      // Try to match preset based on baseUrl
      const presets = this.presetsManager.getAll();
      const baseUrl = settings.env[ANTHROPIC_ENV_KEYS.BASE_URL];

      for (const [id, preset] of Object.entries(presets)) {
        if (preset.env.ANTHROPIC_BASE_URL === baseUrl) {
          return id;
        }
      }

      // Unable to match, return default value
      return 'claudeai';
    } catch (error) {
      console.error('Failed to get current service:', error);
      return 'claudeai';
    }
  }

  /**
   * Check if configuration file exists
   * @param scope Scope
   */
  configExists(scope: Scope = 'global'): boolean {
    const settingsPath = scope === 'global' ? CONFIG_PATHS.GLOBAL_SETTINGS : CONFIG_PATHS.LOCAL_SETTINGS;
    return existsSync(settingsPath);
  }
}
