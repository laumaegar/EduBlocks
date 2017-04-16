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
  fileType: FileType;
  fileName: string | null;
  xml: string | null;
  python: string | null;
  pythonClean: boolean;
}

interface PageState {
  viewMode: ViewMode;
  terminalOpen: boolean;
  fileListModalOpen: boolean;
  files: string[];

  doc: Readonly<DocumentState>;
}

export default class Page extends Component<PageProps, PageState> {
  private blocklyView: BlocklyView;
  private pythonView: PythonView;
  public terminalView: TerminalView;

  constructor() {
    super();

    this.state = {
      viewMode: ViewModeBlockly,
      terminalOpen: false,
      fileListModalOpen: false,
      files: [],

      doc: {
        fileType: EduBlocksXML,
        fileName: null,
        xml: null,
        python: null,
        pythonClean: true,
      },
    };
  }

  private renameDocument(fileName: string) {
    const inferredType = getFileType(fileName);

    if (inferredType === null) {
      fileName = `${fileName}.${EduBlocksXML}`;
    }

    const fileType = inferredType || EduBlocksXML;

    if (this.state.doc.fileName) {
      if (fileType !== this.state.doc.fileType) {
        alert('You cannot change the file name extension');

        return;
      }
    }

    const doc: DocumentState = {
      fileType: this.state.doc.fileType,
      fileName,
      xml: this.state.doc.xml,
      python: this.state.doc.python,
      pythonClean: this.state.doc.pythonClean,
    };

    this.setState({ doc });

    if (fileType === PythonScript) {
      this.switchView(ViewModePython);
    } else {
      this.switchView(ViewModeBlockly);
    }
  }

  private readBlocklyContents(fileName: string, xml: string) {
    if (this.state.doc.xml === xml) { return; }

    const doc: DocumentState = {
      fileType: EduBlocksXML,
      fileName,
      xml,
      python: null,
      pythonClean: true,
    };

    this.setState({ doc });

    this.switchView(ViewModeBlockly);
  }

  private readPythonContents(fileName: string, python: string) {
    if (this.state.doc.python === python) { return; }

    const doc: DocumentState = {
      fileType: PythonScript,
      fileName,
      xml: null,
      python,
      pythonClean: false,
    };

    this.setState({ doc });

    this.switchView(ViewModePython);
  }

  private updateFromBlockly(xml: string, python: string) {
    if (
      this.state.doc.xml === xml &&
      this.state.doc.python === python
    ) {
      return;
    }

    if (this.state.doc.python !== python && !this.state.doc.pythonClean) {
      alert('Python changes have been overwritten!');
    }

    const doc: DocumentState = {
      fileType: EduBlocksXML,
      fileName: this.state.doc.fileName,
      xml,
      python,
      pythonClean: true,
    };

    this.setState({ doc });
  }

  private updateFromPython(python: string) {
    if (this.state.doc.python === python) { return; }

    const doc: DocumentState = {
      fileType: this.state.doc.fileType,
      fileName: this.state.doc.fileName,
      xml: this.state.doc.xml,
      python,
      pythonClean: false,
    };

    this.setState({ doc });
  }

  private new() {
    const doc: DocumentState = {
      fileType: EduBlocksXML,
      fileName: null,
      xml: null,
      python: null,
      pythonClean: true,
    };

    this.setState({ doc });

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
        if (!this.state.doc.pythonClean && this.state.doc.xml === null) {
          alert('Block view not available');

          return 0;
        }

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

      case null:
        alert('Unknown file type');

        return 0;
    }
  }

  public onBlocklyChange(xml: string, python: string) {
    this.updateFromBlockly(xml, python);
  }

  public onPythonChange(python: string) {
    this.updateFromPython(python);
  }

  public save(): 0 {
    if (!this.state.doc.fileName) {
      const fileName = prompt('Enter filename');

      if (fileName) {
        this.renameDocument(fileName);
      }
    }

    if (!this.state.doc.fileName) {
      alert('You must specify a filename in order to save');

      return 0;
    }

    switch (this.state.doc.fileType) {
      case EduBlocksXML:
        this.props.app.sendFileAsText(
          this.state.doc.fileName,
          this.state.doc.xml || '',
        );

        return 0;

      case PythonScript:
        this.props.app.sendFileAsText(
          this.state.doc.fileName,
          this.state.doc.python || '',
        );

        return 0;
    }
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
          sync={this.state.doc.pythonClean}

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

function getFileType(file: string): FileType | null {
  if (file.indexOf('.xml') === file.length - 4) {
    return EduBlocksXML;
  }

  if (file.indexOf('.py') === file.length - 3) {
    return PythonScript;
  }

  return null;
}
