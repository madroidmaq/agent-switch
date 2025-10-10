import { PresetsManager } from './presets';
import { ServiceSwitcher } from './switcher';

/**
 * Global singleton instances
 * Ensures the entire application uses the same PresetsManager and ServiceSwitcher instances
 */
export const presetsManager = new PresetsManager();
export const serviceSwitcher = new ServiceSwitcher(presetsManager);
