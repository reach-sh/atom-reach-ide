'use babel';

import ReachIdeView from './reach-ide-view';
import { CompositeDisposable } from 'atom';
import { spawn } from 'child_process';
import * as path from 'path'

export default {

  reachIdeView: null,
  modalPanel: null,
  subscriptions: null,
  consolePanel: null,

  activate(state) {
    // Install required extension dependencies
    require('atom-package-dependencies').install();

    this.reachIdeView = new ReachIdeView(state.reachIdeViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'reach-ide:compile': () => this.compile(),
      'reach-ide:run': () => this.run()
    }));

  },

  deactivate() {
    this.consolePanel.destroy();
    this.subscriptions.dispose();
    this.reachIdeView.destroy();
  },

  consumeConsolePanel(consolePanel) {
    this.consolePanel = consolePanel;
  },

  execOnFile(reahCmd, trimExt = true) {
    return new Promise((resolve, reject) => {

      if (!this.consolePanel) {
        console.warn('Console Panel is not initialized');
        return reject();
      }

      this.consolePanel.clear();

      const activeTextEditor = atom.workspace.getActiveTextEditor();
      const filePath = activeTextEditor.buffer.file.path;
      const fileName = trimExt
        ? filePath.replace('.rsh', '').replace('.mjs', '')
        : filePath;

      let cmd = spawn('reach', [reahCmd, fileName], { });


      cmd.stdout.on('data', data => {
        this.consolePanel.log(`${data}`);
      });

      cmd.stderr.on('data', data => {
        this.consolePanel.log(`${data}`);
      });

      cmd.on('close', code => {
        this.consolePanel.log(`Exited with code: ${code}`);
      });

      return resolve();
    });
  },

  compile() {
    this.execOnFile('compile', false);
  },

  run() {
    this.execOnFile('run');
  }

};
