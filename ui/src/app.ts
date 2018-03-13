// import { newServer } from './server';
import { App, TerminalInterface } from './types';
import { getIo } from './io';
import { newSamples } from './samples';

async function newApp(): Promise<App> {
  // const client = await newServer();
  const io = getIo();
  const samples = newSamples();

  function runCode(code: string) {
    // return client.runCode(code);

    // __BRYTHON__._run_script({ "name": "__main__", "url": "/lib/brython/console.py", "src": code });

    let js;

    js = __BRYTHON__.py2js(code, '__main__', '__main__', __BRYTHON__.builtins_scope);

    js = js.to_js().replace('$B.$call($B.$getattr($B.$check_def("time",$locals___main__["time"]),"sleep"))(', 'await sleep(');

    js = '(async function() { ' + js + ' })()';

    eval.call(__BRYTHON__.builtins, js);
  }

  function openFile() {
    return io.openFile();
  }

  function saveFile(data: string, ext: string) {
    return io.saveFile(data, ext);
  }

  function assignTerminal(terminal: TerminalInterface) {
    // client.on('data', (data) => terminal.write(data));

    // client.on('reconnect', () => {
    //   terminal.reset();

    //   client.resizeTerminal(terminal.cols, terminal.rows);
    // });

    // terminal.on('data', client.sendData);
    // terminal.on('resize', client.resizeTerminal);

    // if (terminal.cols && terminal.rows) {
    //   client.resizeTerminal(terminal.cols, terminal.rows);
    // }
  }

  function getThemes() {
    return [
      'Default',
      'Tangerine',
      'DarkRed',
      'Celestial',
      'Pacific',
      'Dark',
    ];
  }

  return {
    runCode,
    openFile,
    saveFile,
    assignTerminal,
    getThemes,
    ...samples,
  };
}

export {
  newApp,
};
