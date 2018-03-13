// declare class Terminal {
//   constructor(args?: TermNewArgs);

//   on(event: 'data', handler: (data: string) => void): void;

//   open(element: Node, focus: boolean): void;
//   fit(): void;
//   focus(): void;
//   write(text: string): void;
//   reset(): void;

//   cols: number;
//   rows: number;

//   element: HTMLElement;
// }

declare var brython: (args: any) => any;

declare var __BRYTHON__: {
  builtins_scope: any;
  builtins: any;

  _run_script: (script: any) => void;
  py2js: (script: any, a: any, b: any, c: any) => { to_js(): string };
};

interface Window {
  sleep(n: number): Promise<void>;
}

interface TermNewArgs {

}
