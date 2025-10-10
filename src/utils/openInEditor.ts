import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 使用系统默认编辑器打开文件
 * - macOS: 使用 open 命令
 * - Linux: 使用 xdg-open 命令
 * - Windows: 使用 start 命令
 */
export async function openInEditor(filePath: string): Promise<void> {
  const platform = process.platform;

  let command: string;

  switch (platform) {
    case 'darwin': // macOS
      command = `open "${filePath}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${filePath}"`;
      break;
    default: // Linux and others
      command = `xdg-open "${filePath}"`;
      break;
  }

  try {
    await execAsync(command);
  } catch (error) {
    throw new Error(`无法打开文件: ${error instanceof Error ? error.message : String(error)}`);
  }
}
