import { program } from './cli';

// 如果没有提供子命令，启动 TUI 界面
if (!process.argv.slice(2).length) {
  (async () => {
    const { render } = await import('ink');
    const React = await import('react');
    const { App } = await import('./components/App');

    render(React.createElement(App));
  })();
} else {
  // 否则解析命令行参数
  program.parse(process.argv);
}
