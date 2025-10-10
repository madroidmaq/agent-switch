import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { existsSync } from 'fs';
import type { Presets, Preset, ServiceItem } from './types';
import { PresetsSchema } from './types';
import { CONFIG_PATHS, TOKEN_MASK_CONFIG } from '../constants/config';

/**
 * Presets Manager
 * Responsible for reading, writing, and managing ~/.claude/presets.json
 */
export class PresetsManager {
  private presets: Presets = {};

  /**
   * Load preset configurations
   */
  async load(): Promise<Presets> {
    try {
      if (!existsSync(CONFIG_PATHS.PRESETS)) {
        // If the file doesn't exist, create default configuration
        await this.createDefaultPresets();
      }

      const content = await readFile(CONFIG_PATHS.PRESETS, 'utf-8');
      const data = JSON.parse(content);

      // Validate data using Zod
      this.presets = PresetsSchema.parse(data);

      return this.presets;
    } catch (error) {
      console.error('Failed to load presets:', error);
      throw new Error(`Failed to load preset configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Save preset configurations
   */
  async save(): Promise<void> {
    try {
      // Ensure directory exists
      const dir = dirname(CONFIG_PATHS.PRESETS);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      const content = JSON.stringify(this.presets, null, 2);
      await writeFile(CONFIG_PATHS.PRESETS, content, 'utf-8');
    } catch (error) {
      console.error('Failed to save presets:', error);
      throw new Error(`Failed to save preset configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create default preset configuration
   */
  private async createDefaultPresets(): Promise<void> {
    this.presets = {
      claudeai: {
        env: {},
        forceLoginMethod: 'claudeai',
      },
    };
    await this.save();
  }

  /**
   * Get all presets
   */
  getAll(): Presets {
    return this.presets;
  }

  /**
   * Get a single preset
   */
  get(id: string): Preset | undefined {
    return this.presets[id];
  }

  /**
   * Add a new preset
   */
  async add(id: string, preset: Preset): Promise<void> {
    if (this.presets[id]) {
      throw new Error(`Preset "${id}" already exists`);
    }
    this.presets[id] = preset;
    await this.save();
  }

  /**
   * Update a preset
   */
  async update(id: string, preset: Preset): Promise<void> {
    if (!this.presets[id]) {
      throw new Error(`Preset "${id}" does not exist`);
    }
    this.presets[id] = preset;
    await this.save();
  }

  /**
   * Delete a preset
   */
  async delete(id: string): Promise<void> {
    if (!this.presets[id]) {
      throw new Error(`Preset "${id}" does not exist`);
    }

    // Do not allow deletion of official service
    if (this.presets[id].forceLoginMethod === 'claudeai') {
      throw new Error('Cannot delete official service');
    }

    delete this.presets[id];
    await this.save();
  }

  /**
   * Get service list (for UI display)
   */
  getServiceList(currentServiceId?: string): ServiceItem[] {
    return Object.entries(this.presets).map(([id, preset]) => ({
      id,
      name: id,
      isOfficial: preset.forceLoginMethod === 'claudeai',
      baseUrl: preset.env.ANTHROPIC_BASE_URL || 'claude.ai',
      model: preset.env.ANTHROPIC_MODEL || 'claude-sonnet-4',
      smallModel: preset.env.ANTHROPIC_SMALL_FAST_MODEL || 'claude-3-5-haiku',
      tokenPreview: this.maskToken(preset.env.ANTHROPIC_AUTH_TOKEN || ''),
      isActive: id === currentServiceId,
    }));
  }

  /**
   * Mask token for display
   */
  private maskToken(token: string): string {
    if (!token || token.length < TOKEN_MASK_CONFIG.MIN_LENGTH) {
      return token ? '***' : 'N/A';
    }
    return `${token.slice(0, TOKEN_MASK_CONFIG.PREFIX_LENGTH)}...${token.slice(-TOKEN_MASK_CONFIG.SUFFIX_LENGTH)}`;
  }

  /**
   * Check if preset exists
   */
  exists(id: string): boolean {
    return id in this.presets;
  }

  /**
   * Get preset count
   */
  count(): number {
    return Object.keys(this.presets).length;
  }
}
