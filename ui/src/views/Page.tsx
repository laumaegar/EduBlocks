import React = require('preact');
import { Component } from 'preact';

import Nav from './Nav';
import BlocklyView from './BlocklyView';
import PythonView from './PythonView';
import TerminalView from './TerminalView';
import FileListModal from './FileListModal';

const ViewModeBlockly = 'blockly';
const ViewModePython = 'python';

type ViewMode = typeof ViewModeBlockly | typeof ViewModePython;

const EduBlocksXML = 'xml';
const PythonScript = 'py';

type FileType = typeof EduBlocksXML | typeof PythonScript;

interface PageProps {
  app: App;
}

interface DocumentState {
  fileName: string | null;
  xml: string | null;
  python: string | null;
  inSync: boolean;
}

interface MutablePageState {
  viewMode: ViewMode;
  terminalOpen: boolean;
  fileListModalOpen: boolean;
  files: string[];
}

interface PageState extends MutablePageState {
  doc: Readonly<DocumentState>;
}

export default class Page extends Component<PageProps, PageState> {
  private blocklyView: BlocklyView;
  private pythonView: PythonView;
  public terminalView: TerminalView;

  constructor() {
    super();

    this.state = {
      viewMode: 'blockly',
      terminalOpen: false,
      fileListModalOpen: false,
      files: [],

      doc: {
        fileName: null,
        xml: null,
        python: null,
        inSync: true,
      },
    };
  }

  /** Prevent setting of doc property */
  setState<K extends keyof MutablePageState>(state: Pick<PageState, K>): void {
    super.setState(state);
  }

  private renameDocument(fileName: string) {
    const doc = {
      fileName,
      xml: this.state.doc.xml,
      python: this.state.doc.python,
      inSync: this.state.doc.inSync,
    };

    super.setState({ doc });
  }

  private readBlocklyContents(fileName: string, xml: string) {
    const doc = {
      fileName,
      xml,
      python: null,
      inSync: false,
    };

    super.setState({ doc });

    this.switchView('blockly');
  }

  private readPythonContents(fileName: string, python: string) {
    const doc = {
      fileName,
      xml: null,
      python,
      inSync: false,
    };

    super.setState({ doc });

    this.switchView('python');
  }

  private updateFromBlockly(xml: string, python: string) {
    if (this.state.doc.python !== python && !this.state.doc.inSync) {
      alert('Python changes have been overwritten!');
    }

    const doc = {
      fileName: this.state.doc.fileName,
      xml,
      python,
      inSync: true,
    };

    super.setState({ doc });
  }

  private updateFromPython(python: string) {
    if (this.state.doc.python === python) { return; }

    const doc = {
      fileName: this.state.doc.fileName,
      xml: this.state.doc.xml,
      python,
      inSync: false,
    };

    super.setState({ doc });
  }

  private new() {
    const doc = {
      fileName: null,
      xml: null,
      python: null,
      inSync: true,
    };

    super.setState({ doc });

    this.switchView('blockly');
  }

  protected componentDidMount() {

  }

  private toggleView(): 0 {
    switch (this.state.viewMode) {
      case ViewModeBlockly:
        return this.switchView(ViewModePython);

      case ViewModePython:
        return this.switchView(ViewModeBlockly);
    }
  }

  private switchView(viewMode: ViewMode): 0 {
    switch (viewMode) {
      case ViewModeBlockly:
        this.setState({ viewMode: 'blockly' });

        return 0;

      case ViewModePython:
        this.setState({ viewMode: 'python' });

        return 0;
    }
  }

  private sendCode() {
    if (!this.terminalView) { throw new Error('No terminal'); }

    if (!this.state.doc.python) {
      alert('There is no code to run');

      return;
    }

    this.setState({ terminalOpen: true });
    this.terminalView.focus();

    this.props.app.runCode(this.state.doc.python);

    setTimeout(() => this.terminalView.focus(), 250);
  }

  public openFileListModal() {
    this.props.app.listFiles().then((files) => {
      this.setState({ fileListModalOpen: true, files });
    });
  }

  public closeFileListModal() {
    this.setState({ fileListModalOpen: false });
  }

  public openFile(file: string) {
    this.closeFileListModal();

    this.props.app.getFileAsText(file).then((contents) => this.handleFileContents(file, contents));
  }

  private handleFileContents(file: string, contents: string): 0 {
    switch (getFileType(file)) {
      case EduBlocksXML:
        this.readBlocklyContents(file, contents);

        return 0;

      case PythonScript:
        this.readPythonContents(file, contents);

        return 0;
    }
  }

  public onBlocklyChange(xml: string, python: string) {
    this.updateFromBlockly(xml, python);
  }

  public onPythonChange(python: string) {
    this.updateFromPython(python);
  }

  public save() {
    if (!this.state.doc.fileName) {
      alert('No filename');
      return;
    }

    this.props.app.sendFileAsText(this.state.doc.fileName, this.state.doc.python || '');
  }

  private onSelectFile(file: File) {
    this.props.app.sendFile(file);
  }

  private onTerminalClose() {
    this.setState({ terminalOpen: false });
  }

  public render() {
    return (
      <div id="page">
        <Nav
          filename={this.state.doc.fileName}
          sync={this.state.doc.inSync}

          sendCode={() => this.sendCode()}
          downloadPython={() => { }}
          openCode={() => this.openFileListModal()}
          saveCode={() => this.save()}
          newCode={() => this.new()}

          onChangeName={(file) => this.renameDocument(file)}
          onSelectFile={(file) => this.onSelectFile(file)} />

        <section id="workspace">
          <button
            id="toggleViewButton"
            onClick={() => this.toggleView()}>

            {this.state.viewMode}

          </button>

          <BlocklyView
            ref={(c) => this.blocklyView = c}
            visible={this.state.viewMode === 'blockly'}
            xml={this.state.doc.xml}
            onChange={(xml, python) => this.onBlocklyChange(xml, python)} />

          <PythonView
            ref={(c) => this.pythonView = c}
            visible={this.state.viewMode === 'python'}
            python={this.state.doc.python}
            onChange={(python) => this.onPythonChange(python)} />
        </section>

        <TerminalView
          ref={(c) => this.terminalView = c}
          visible={this.state.terminalOpen}
          onClose={() => this.onTerminalClose()} />

        <FileListModal
          files={this.state.files}
          visible={this.state.fileListModalOpen}
          onOpenFile={(file) => this.openFile(file)}
          onCancel={() => this.closeFileListModal()} />
      </div>
    );
  }
}

function getFileType(file: string): FileType {
  if (file.indexOf('.xml') === file.length - 4) {
    return EduBlocksXML;
  }

  if (file.indexOf('.py') === file.length - 3) {
    return PythonScript;
  }

  throw new Error('Invalid file');
}
