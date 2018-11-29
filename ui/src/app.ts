// import { newServer } from './server';
import { App, TerminalInterface, Extension } from './types';
import { getIo } from './io';
import { newSamples } from './samples';
import { getHexFile } from './lib/hexlify';
import { getBeforeScript } from './blocks/index';

async function newApp(): Promise<App> {
  // const client = await newServer();
  const io = getIo();
  const samples = newSamples();

  function runCode(code: string) {
    // return client.runCode(code); 
  }

  function openFile() {
    return io.openFile();
  }

  function saveFile(data: string | Uint8Array, ext: string, type: string) {
    return io.saveFile(data, ext, type);
  }

  function getCombinedScript(python: string, extensions: Extension[]) {
    const beforeScript = getBeforeScript(extensions);
    let newpy = python
    newpy = newpy.replace('from gigglebot import *', '');
    newpy = newpy.replace('from scrollbit import *', '');

    const combinedScript = (beforeScript ? (beforeScript + '\n\n') : '') + newpy;

    return combinedScript;
  }

  async function exportPython(python: string, extensions: Extension[]) {
    const combinedScript = getCombinedScript(python, extensions);

    await io.saveFile(combinedScript, 'py', 'text/python;charset=utf-8');
  }

  async function saveHex(python: string, extensions: Extension[]) {
    const combinedScript = getCombinedScript(python, extensions);

    const hex = getHexFile(combinedScript);

    await io.saveFile(hex, 'hex', 'application/octet-stream');
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
      'Vivid',
      'DarkRed',
      'Celestial',
      'Pacific',
      'Dark',
    ];
  }

  function getExtensions(): Extension[] {
    return [
      'scroll:bit',
      'GiggleBot',
      'prueba',
      
    ];
  }

  return {
    runCode,
    openFile,
    saveFile,
    exportPython,
    saveHex,
    assignTerminal,
    getThemes,
    getExtensions,
    ...samples,
  };
}

export {
  newApp,
};
