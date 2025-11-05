import { Command } from 'commander';
import { presetsManager, serviceSwitcher } from './core/instances';
import chalk from 'chalk';
import { displayServiceConfig } from './utils/configFormatter';

/**
 * Display current configuration information
 */
async function displayCurrentConfigs(): Promise<void> {
  await presetsManager.load();

  let hasAnyConfig = false;

  // Display global configuration
  const globalId = await serviceSwitcher.getCurrentServiceId('global');
  const globalPreset = presetsManager.get(globalId);

  if (globalPreset) {
    displayServiceConfig('Global Configuration', globalId, globalPreset, 'global');
    hasAnyConfig = true;
  }

  // Display local configuration (if exists)
  if (serviceSwitcher.configExists('local')) {
    const localId = await serviceSwitcher.getCurrentServiceId('local');
    const localPreset = presetsManager.get(localId);

    if (localPreset) {
      displayServiceConfig('Local Configuration', localId, localPreset, 'local');
      hasAnyConfig = true;
    }
  }

  // If no configuration found
  if (!hasAnyConfig) {
    console.log(chalk.yellow('No service configuration found'));
  }
}

const program = new Command();

program
  .name('agent-switch')
  .description('AI Agent configuration switcher - Supports Claude Code, Copilot, Gemini, etc.')
  .version('1.0.0');

/**
 * Main command - Launch TUI interface
 */
program
  .command('switch')
  .description('Launch TUI interface for service switching')
  .action(async () => {
    // Dynamically import ink and App component (avoid loading in non-TUI commands)
    const { render } = await import('ink');
    const React = await import('react');
    const { App } = await import('./components/App');

    render(React.createElement(App));
  });

/**
 * Quick switch command
 */
program
  .command('use <service>')
  .description('Quickly switch to specified service (default: global scope)')
  .option('-l, --local', 'Local switch (current project only)')
  .option('-g, --global', 'Global switch (all projects, default)')
  .action(async (service: string, options: { global?: boolean; local?: boolean }) => {
    try {
      await presetsManager.load();

      // If --local specified, use local; otherwise default to global
      const scope = options.local ? 'local' : 'global';

      // Check if service exists
      if (!presetsManager.exists(service)) {
        console.error(chalk.red(`✖ Service "${service}" not found`));
        console.log(chalk.gray('\nAvailable services:'));

        const services = presetsManager.getServiceList();
        services.forEach((s) => {
          console.log(chalk.cyan(`  - ${s.name}`));
        });

        process.exit(1);
      }

      await serviceSwitcher.switchTo(service, scope);
      console.log(
        chalk.green(`✓ Switched to ${chalk.bold(service)} (${scope === 'global' ? 'global' : 'local'})`)
      );

      // Display current configuration
      console.log(chalk.bold.cyan('\nCurrent Configuration:'));
      await displayCurrentConfigs();
    } catch (error) {
      console.error(chalk.red(`✖ Switch failed: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

/**
 * List command
 */
program
  .command('list')
  .alias('ls')
  .description('List all available services with activation status')
  .option('-l, --local', 'Show local scope activation status')
  .option('-g, --global', 'Show global scope activation status')
  .action(async (options: { global?: boolean; local?: boolean }) => {
    try {
      await presetsManager.load();

      // Smart default: if local config exists, prioritize showing local activation status
      const hasLocal = serviceSwitcher.configExists('local');
      const scope = options.local ? 'local' :
                    options.global ? 'global' :
                    (hasLocal ? 'local' : 'global');

      const currentId = await serviceSwitcher.getCurrentServiceId(scope);
      const services = presetsManager.getServiceList(currentId);

      // Display current scope
      const scopeLabel = scope === 'local' ? 'Local' : 'Global';
      const scopeInfo = hasLocal && !options.global && !options.local
        ? ` (${scopeLabel} scope - detected local config)`
        : ` (${scopeLabel} scope)`;

      console.log(chalk.bold.cyan(`\nAvailable Services${scopeInfo}:\n`));

      services.forEach((service) => {
        // Use fixed spacing: show "✓ " for active, "  " (two spaces) for inactive
        const prefix = service.isActive ? chalk.green('✓ ') : '  ';
        const paddedName = service.name.padEnd(15); // Fixed width alignment
        const name = service.isActive ? chalk.bold.green(paddedName) : chalk.white(paddedName);
        const desc = service.isOfficial ? 'Official Service' : service.baseUrl;

        console.log(`${prefix}${name} ${chalk.gray(desc)}`);
      });

      console.log(chalk.gray(`\nTotal: ${services.length} service${services.length !== 1 ? 's' : ''}\n`));
    } catch (error) {
      console.error(chalk.red(`✖ Failed to load: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

/**
 * Current service command
 */
program
  .command('current')
  .description('Display currently active service (default: all scopes)')
  .option('-l, --local', 'Show local service only')
  .option('-g, --global', 'Show global service only')
  .action(async (options: { global?: boolean; local?: boolean }) => {
    try {
      await presetsManager.load();

      if (options.local) {
        // Show local configuration only
        if (serviceSwitcher.configExists('local')) {
          const localId = await serviceSwitcher.getCurrentServiceId('local');
          const localPreset = presetsManager.get(localId);

          if (localPreset) {
            displayServiceConfig('Local Configuration', localId, localPreset, 'local');
          } else {
            console.log(chalk.yellow('No local service configuration found'));
          }
        } else {
          console.log(chalk.yellow('No local service configuration found'));
        }
      } else if (options.global) {
        // Show global configuration only
        const globalId = await serviceSwitcher.getCurrentServiceId('global');
        const globalPreset = presetsManager.get(globalId);

        if (globalPreset) {
          displayServiceConfig('Global Configuration', globalId, globalPreset, 'global');
        } else {
          console.log(chalk.yellow('No global service configuration found'));
        }
      } else {
        // Show all configurations
        await displayCurrentConfigs();
      }
    } catch (error) {
      console.error(chalk.red(`✖ Failed to get: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

export { program };
