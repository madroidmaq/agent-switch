/**
 * 深度合并对象工具
 * 将 source 对象深度合并到 target 对象中
 * - 对于对象类型，递归合并
 * - 对于数组类型，直接覆盖
 * - 对于基础类型，直接覆盖
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = result[key];

    // 如果 source 的值是对象且不是数组，且 target 中也是对象
    if (
      isPlainObject(sourceValue) &&
      isPlainObject(targetValue)
    ) {
      // 递归合并
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      // 否则直接覆盖（包括数组、基础类型、null、undefined）
      result[key] = sourceValue as any;
    }
  }

  return result;
}

/**
 * 判断是否为普通对象（排除 null、数组等）
 */
function isPlainObject(value: any): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}
