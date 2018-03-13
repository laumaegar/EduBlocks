import React = require('preact');
import { Component } from 'preact';

import { TerminalInterface, TerminalEvents } from '../types';

interface TerminalViewProps {
  visible: boolean;

  onClose(): void;
}

const stub = () => void 0;

export default class TerminalView extends Component<TerminalViewProps, {}> implements TerminalInterface {
  // private termDiv?: Element;
  // private term: Terminal;

  public cols: number;
  public rows: number;

  private eventHandlers: TerminalEvents = {
    data: stub,
    resize: stub,
  };

  private fit() {
    // if (!this.term) return;

    // this.term.fit();

    // if (this.cols !== this.term.cols || this.rows !== this.term.rows) {
    //   this.cols = this.term.cols;
    //   this.rows = this.term.rows;

    //   this.eventHandlers.resize(this.cols, this.rows);
    // }
  }

  protected componentDidMount() {
    // if (!this.termDiv) throw new Error('No term');

    // this.term = new Terminal();

    // this.term.open(this.termDiv, true);

    // this.term.on('data', (data) => {
    //   this.eventHandlers.data(data);

    //   if (data.length === 1 && data.charCodeAt(0) === 27) {
    //     this.props.onClose();
    //   }
    // });

    // this.term.write('\x1b[31mWelcome to EduBlocks!\x1b[m\r\n');
    // this.term.write('Press [ESC] to exit the terminal\r\n');

    // this.fit();

    __BRYTHON__._run_script({ "name": "__main__", "url": "/lib/brython/console.py", "src": "import sys\nimport traceback\n\nfrom browser import document as doc\nfrom browser import window, alert, console\n\n_credits = \"\"\"    Thanks to CWI, CNRI, BeOpen.com, Zope Corporation and a cast of thousands\n    for supporting Python development.  See www.python.org for more information.\"\"\"\n\n_copyright = \"\"\"Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com\nAll Rights Reserved.\n\nCopyright (c) 2001-2013 Python Software Foundation.\nAll Rights Reserved.\n\nCopyright (c) 2000 BeOpen.com.\nAll Rights Reserved.\n\nCopyright (c) 1995-2001 Corporation for National Research Initiatives.\nAll Rights Reserved.\n\nCopyright (c) 1991-1995 Stichting Mathematisch Centrum, Amsterdam.\nAll Rights Reserved.\"\"\"\n\n_license = \"\"\"Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\nRedistributions of source code must retain the above copyright notice, this\nlist of conditions and the following disclaimer. Redistributions in binary\nform must reproduce the above copyright notice, this list of conditions and\nthe following disclaimer in the documentation and/or other materials provided\nwith the distribution.\nNeither the name of the <ORGANIZATION> nor the names of its contributors may\nbe used to endorse or promote products derived from this software without\nspecific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\nARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE\nLIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR\nCONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF\nSUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS\nINTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN\nCONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)\nARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE\nPOSSIBILITY OF SUCH DAMAGE.\n\"\"\"\n\ndef credits():\n    print(_credits)\ncredits.__repr__ = lambda:_credits\n\ndef copyright():\n    print(_copyright)\ncopyright.__repr__ = lambda:_copyright\n\ndef license():\n    print(_license)\nlicense.__repr__ = lambda:_license\n\ndef write(data):\n    doc['code'].value += str(data)\n\n\nsys.stdout.write = sys.stderr.write = write\nhistory = []\ncurrent = 0\n_status = \"main\"  # or \"block\" if typing inside a block\n\n# execution namespace\neditor_ns = {'credits':credits,\n    'copyright':copyright,\n    'license':license,\n    '__name__':'__main__'}\n\ndef cursorToEnd(*args):\n    pos = len(doc['code'].value)\n    doc['code'].setSelectionRange(pos, pos)\n    doc['code'].scrollTop = doc['code'].scrollHeight\n\ndef get_col(area):\n    # returns the column num of cursor\n    sel = doc['code'].selectionStart\n    lines = doc['code'].value.split('\\n')\n    for line in lines[:-1]:\n        sel -= len(line) + 1\n    return sel\n\n\ndef myKeyPress(event):\n    global _status, current\n    if event.keyCode == 9:  # tab key\n        event.preventDefault()\n        doc['code'].value += \"    \"\n    elif event.keyCode == 13:  # return\n        src = doc['code'].value\n        if _status == \"main\":\n            currentLine = src[src.rfind('>>>') + 4:]\n        elif _status == \"3string\":\n            currentLine = src[src.rfind('>>>') + 4:]\n            currentLine = currentLine.replace('\\n... ', '\\n')\n        else:\n            currentLine = src[src.rfind('...') + 4:]\n        if _status == 'main' and not currentLine.strip():\n            doc['code'].value += '\\n>>> '\n            event.preventDefault()\n            return\n        doc['code'].value += '\\n'\n        history.append(currentLine)\n        current = len(history)\n        if _status == \"main\" or _status == \"3string\":\n            try:\n                _ = editor_ns['_'] = eval(currentLine, editor_ns)\n                if _ is not None:\n                    write(repr(_)+'\\n')\n                doc['code'].value += '>>> '\n                _status = \"main\"\n            except IndentationError:\n                doc['code'].value += '... '\n                _status = \"block\"\n            except SyntaxError as msg:\n                if str(msg) == 'invalid syntax : triple string end not found' or \\\n                    str(msg).startswith('Unbalanced bracket'):\n                    doc['code'].value += '... '\n                    _status = \"3string\"\n                elif str(msg) == 'eval() argument must be an expression':\n                    try:\n                        exec(currentLine, editor_ns)\n                    except:\n                        traceback.print_exc()\n                    doc['code'].value += '>>> '\n                    _status = \"main\"\n                elif str(msg) == 'decorator expects function':\n                    doc['code'].value += '... '\n                    _status = \"block\"\n                else:\n                    traceback.print_exc()\n                    doc['code'].value += '>>> '\n                    _status = \"main\"\n            except:\n                traceback.print_exc()\n                doc['code'].value += '>>> '\n                _status = \"main\"\n        elif currentLine == \"\":  # end of block\n            block = src[src.rfind('>>>') + 4:].splitlines()\n            block = [block[0]] + [b[4:] for b in block[1:]]\n            block_src = '\\n'.join(block)\n            # status must be set before executing code in globals()\n            _status = \"main\"\n            try:\n                _ = exec(block_src, editor_ns)\n                if _ is not None:\n                    print(repr(_))\n            except:\n                traceback.print_exc()\n            doc['code'].value += '>>> '\n        else:\n            doc['code'].value += '... '\n\n        cursorToEnd()\n        event.preventDefault()\n\ndef myKeyDown(event):\n    global _status, current\n    if event.keyCode == 37:  # left arrow\n        sel = get_col(doc['code'])\n        if sel < 5:\n            event.preventDefault()\n            event.stopPropagation()\n    elif event.keyCode == 36:  # line start\n        pos = doc['code'].selectionStart\n        col = get_col(doc['code'])\n        doc['code'].setSelectionRange(pos - col + 4, pos - col + 4)\n        event.preventDefault()\n    elif event.keyCode == 38:  # up\n        if current > 0:\n            pos = doc['code'].selectionStart\n            col = get_col(doc['code'])\n            # remove current line\n            doc['code'].value = doc['code'].value[:pos - col + 4]\n            current -= 1\n            doc['code'].value += history[current]\n        event.preventDefault()\n    elif event.keyCode == 40:  # down\n        if current < len(history) - 1:\n            pos = doc['code'].selectionStart\n            col = get_col(doc['code'])\n            # remove current line\n            doc['code'].value = doc['code'].value[:pos - col + 4]\n            current += 1\n            doc['code'].value += history[current]\n        event.preventDefault()\n    elif event.keyCode == 8:  # backspace\n        src = doc['code'].value\n        lstart = src.rfind('\\n')\n        if (lstart == -1 and len(src) < 5) or (len(src) - lstart < 6):\n            event.preventDefault()\n            event.stopPropagation()\n\n\ndoc['code'].bind('keypress', myKeyPress)\ndoc['code'].bind('keydown', myKeyDown)\ndoc['code'].bind('click', cursorToEnd)\nv = sys.implementation.version\ndoc['code'].value = \"Brython %s.%s.%s on %s %s\\n>>> \" % (\n    v[0], v[1], v[2], window.navigator.appName, window.navigator.appVersion)\n#doc['code'].value += 'Type \"copyright\", \"credits\" or \"license\" for more information.'\ndoc['code'].focus()\ncursorToEnd()\n\n" });

    window.addEventListener('resize', () => this.fit());
  }

  protected componentDidUpdate() {
    this.fit();
  }

  public focus() {
    // if (!this.term) return;

    // this.term.focus();
  }

  public reset() {
    // if (!this.term) return;

    // console.info('RESET TERM');

    // this.term.reset();
  }

  public write(s: string) {
    // this.term.write(s);
  }

  public on<K extends keyof TerminalEvents>(eventType: K, handler: TerminalEvents[K]) {
    this.eventHandlers[eventType] = handler;
  }

  public onCloseClick() {
    this.props.onClose();
  }

  public onStopClick() {
    // Send Ctrl+C
    this.eventHandlers.data('\x03');
  }

  public render() {
    return (
      <div style={{ display: this.props.visible ? 'block' : 'none' }} id="terminal-dialog">
        <div class="terminal-help">
          <span class="help-item" onClick={() => this.onCloseClick()}>
            <span class="key">ESC</span> = Close terminal
          </span>
          <span class="help-item" onClick={() => this.onStopClick()}>
            <span class="key">Ctrl</span> + <span class="key">C</span> = Stop program
          </span>
        </div>
        {/* <div id="term" ref={(div) => this.termDiv = div}></div> */}
        <textarea id="code" class="codearea" rows={20}></textarea>
      </div>
    );
  }
}
