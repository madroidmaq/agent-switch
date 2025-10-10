import { homedir } from 'os';
import { join } from 'path';

/**
 * 配置文件路径常量
 */
export const CONFIG_PATHS = {
  /** 全局配置文件路径: ~/.claude/settings.json */
  GLOBAL_SETTINGS: join(homedir(), '.claude', 'settings.json'),

  /** 本地配置文件路径: ./.claude/settings.local.json */
  LOCAL_SETTINGS: join(process.cwd(), '.claude', 'settings.local.json'),

  /** 预设配置文件路径: ~/.claude/presets.json */
  PRESETS: join(homedir(), '.claude', 'presets.json'),
} as const;

/**
 * Anthropic API 环境变量名称常量
 */
export const ANTHROPIC_ENV_KEYS = {
  BASE_URL: 'ANTHROPIC_BASE_URL',
  AUTH_TOKEN: 'ANTHROPIC_AUTH_TOKEN',
  MODEL: 'ANTHROPIC_MODEL',
  SMALL_FAST_MODEL: 'ANTHROPIC_SMALL_FAST_MODEL',
} as const;

/**
 * Token 掩码配置
 */
export const TOKEN_MASK_CONFIG = {
  /** Token 前缀显示长度 */
  PREFIX_LENGTH: 8,

  /** Token 后缀显示长度 */
  SUFFIX_LENGTH: 6,

  /** 最小 Token 长度（小于此长度不进行掩码） */
  MIN_LENGTH: 12,
} as const;

/**
 * UI 配置常量
 */
export const UI_CONFIG = {
  /** 切换成功后自动退出的延迟时间（毫秒） */
  AUTO_EXIT_DELAY: 3000,

  /** 帮助文档 URL */
  HELP_URL: 'https://github.com/madroidmaq/agent-switch#readme',
} as const;
