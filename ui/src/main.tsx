import * as React from 'preact';

import Page from './views/Page';
import { newApp } from './app';

async function main() {
  brython({ 'debug': 1, 'profile': 2 })

  const app = await newApp();
  Blockly.HSV_VALUE = 0.9;


  const pageDiv = getElementByIdSafe('page');

  if (!pageDiv.parentElement) { return; }

  React.render(<Page app={app} ref={rendered} />, pageDiv.parentElement, pageDiv);

  function rendered(page: Page) {
    app.assignTerminal(page.terminalView);
  }

  function getElementByIdSafe(id: string): HTMLElement {
    const element = document.getElementById(id);

    if (!element) { throw new Error(`Could not find element with "${id}"`); }

    return element;
  }
}

window.addEventListener('load', main);

// Time sleep bodge
window.sleep = (n: number) => {
  return new Promise<void>(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
};
