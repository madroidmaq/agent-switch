import { z } from 'zod';

// ==================== Zod Schemas ====================

/**
 * Preset environment variables configuration Schema
 */
export const PresetEnvSchema = z.object({
  ANTHROPIC_BASE_URL: z.string().optional(),
  ANTHROPIC_AUTH_TOKEN: z.string().optional(),
  ANTHROPIC_MODEL: z.string().optional(),
  ANTHROPIC_SMALL_FAST_MODEL: z.string().optional(),
});

/**
 * Single preset configuration Schema
 */
export const PresetSchema = z.object({
  env: PresetEnvSchema,
  forceLoginMethod: z.enum(['console', 'claudeai']),
});

/**
 * Complete preset collection Schema (Record<string, Preset>)
 */
export const PresetsSchema = z.record(z.string(), PresetSchema);

// ==================== TypeScript Types ====================

export type PresetEnv = z.infer<typeof PresetEnvSchema>;
export type Preset = z.infer<typeof PresetSchema>;
export type Presets = z.infer<typeof PresetsSchema>;

/**
 * Service item for UI display
 */
export interface ServiceItem {
  id: string;                    // Service unique identifier
  name: string;                  // Display name
  isOfficial: boolean;           // Whether it's an official service
  baseUrl: string;               // API address
  model: string;                 // Main model name
  smallModel: string;            // Small model name
  tokenPreview: string;          // Masked token
  isActive: boolean;             // Whether it's the currently active service
}

/**
 * Application mode
 */
export type AppMode =
  | 'list'        // List browsing mode
  | 'add'         // Add service
  | 'edit'        // Edit service
  | 'delete'      // Delete confirmation
  | 'switching';  // Switching in progress

/**
 * Application state
 */
export interface AppState {
  mode: AppMode;
  services: ServiceItem[];
  selectedIndex: number;
  currentServiceId: string;
  isLoading: boolean;
  error?: string;
}

/**
 * Form data (add/edit service)
 */
export interface ServiceFormData {
  name: string;
  baseUrl: string;
  token: string;
  model: string;
  smallModel: string;
}

/**
 * Scope type
 */
export type Scope = 'global' | 'local';
