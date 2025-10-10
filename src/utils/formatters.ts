/**
 * 工具函数：格式化和辅助方法
 */

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证是否为空字符串
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * 生成服务 ID（从名称）
 */
export function generateServiceId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
