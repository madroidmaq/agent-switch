/**
 * UI 主题配置
 */
export const theme = {
  /**
   * 颜色配置
   */
  colors: {
    primary: 'cyan',        // 主色调
    success: 'green',       // 成功
    warning: 'yellow',      // 警告
    error: 'red',           // 错误
    accent: 'magenta',      // 强调
    muted: 'gray',          // 次要文本
    border: 'gray',         // 边框
    active: 'green',        // 激活状态
    selected: 'cyan',       // 选中状态
  },

  /**
   * 图标配置
   */
  icons: {
    active: '✓',
    inactive: '○',
    selected: '●',
    unselected: '  ',
    arrow: '→',
    info: 'ℹ',
    warning: '⚠',
    error: '✖',
    add: '+',
    edit: '✎',
    delete: '🗑',
    global: '🌍',
    local: '📁',
    service: '📍',
  },

  /**
   * 边框样式
   */
  borders: {
    main: 'double',
    section: 'single',
    subtle: 'round',
  } as const,

  /**
   * 间距配置
   */
  spacing: {
    padding: 1,
    margin: 1,
    gap: 1,
  },
} as const;
