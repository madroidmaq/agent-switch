import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 使用系统默认浏览器打开 URL
 * - macOS: 使用 open 命令
 * - Linux: 使用 xdg-open 命令
 * - Windows: 使用 start 命令
 */
export async function openInBrowser(url: string): Promise<void> {
  const platform = process.platform;

  let command: string;

  switch (platform) {
    case 'darwin': // macOS
      command = `open "${url}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${url}"`;
      break;
    default: // Linux and others
      command = `xdg-open "${url}"`;
      break;
  }

  try {
    await execAsync(command);
  } catch (error) {
    throw new Error(`无法打开浏览器: ${error instanceof Error ? error.message : String(error)}`);
  }
}
