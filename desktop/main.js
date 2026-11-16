const { app, BrowserWindow, dialog, ipcMain, Menu, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

let win;
let currentFile = null;

const editorUrl = () => `file://${path.join(__dirname, '..', 'motor', 'editor', 'index.html')}`;

function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        { label: 'Novo projeto', accelerator: 'Ctrl+N', click: () => win.webContents.executeJavaScript("document.getElementById('projeto-criar')?.click()") },
        { label: 'Abrir projeto…', accelerator: 'Ctrl+O', click: openProject },
        { label: 'Salvar projeto', accelerator: 'Ctrl+S', click: saveProject },
        { label: 'Salvar projeto como…', accelerator: 'Ctrl+Shift+S', click: () => saveProject(true) },
        { type: 'separator' },
        { label: 'Sair', role: 'quit' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'Ctrl+Z', click: () => win.webContents.executeJavaScript("document.getElementById('e-desfazer')?.click()") },
        { label: 'Refazer', accelerator: 'Ctrl+Y', click: () => win.webContents.executeJavaScript("document.getElementById('e-refazer')?.click()") }
      ]
    },
    {
      label: 'Exibir',
      submenu: [
        { label: 'Tela cheia', accelerator: 'F11', role: 'togglefullscreen' },
        { label: 'Ferramentas de desenvolvedor', accelerator: 'Ctrl+Shift+I', click: () => win.webContents.toggleDevTools() }
      ]
    },
    { label: 'Ajuda', submenu: [{ label: 'Documentação do Motor', click: () => shell.openExternal('https://github.com/kyanthx-dv/motor') }] }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function openProject() {
  const result = await dialog.showOpenDialog(win, {
    title: 'Abrir projeto do Motor',
    properties: ['openFile'],
    filters: [{ name: 'Projeto Motor', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePaths[0]) return;
  try {
    const text = await fs.readFile(result.filePaths[0], 'utf8');
    await win.webContents.executeJavaScript(`window.EditorArquivos.importar(${JSON.stringify(text)})`);
    currentFile = result.filePaths[0];
    win.setTitle(`Motor Editor — ${path.basename(currentFile)}`);
  } catch (error) {
    dialog.showErrorBox('Não foi possível abrir o projeto', error.message);
  }
}

async function saveProject(saveAs = false) {
  try {
    const payload = await win.webContents.executeJavaScript('JSON.stringify(window.EditorArquivos.exportar(), null, 2)');
    if (!payload) return;
    if (saveAs || !currentFile) {
      const result = await dialog.showSaveDialog(win, {
        title: 'Salvar projeto do Motor',
        defaultPath: currentFile || 'meu-projeto.json',
        filters: [{ name: 'Projeto Motor', extensions: ['json'] }]
      });
      if (result.canceled || !result.filePath) return;
      currentFile = result.filePath;
    }
    await fs.writeFile(currentFile, payload, 'utf8');
    win.setTitle(`Motor Editor — ${path.basename(currentFile)}`);
    await win.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('motor-desktop-saved'))");
  } catch (error) {
    dialog.showErrorBox('Não foi possível salvar o projeto', error.message);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0e1319',
    title: 'Motor Editor',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  });

  win.loadURL(editorUrl());
  win.webContents.once('did-finish-load', async () => {
    await win.webContents.insertCSS(await fs.readFile(path.join(__dirname, 'desktop.css'), 'utf8'));
    await win.webContents.executeJavaScript(await fs.readFile(path.join(__dirname, 'desktop-ui.js'), 'utf8'));
  });
  win.on('closed', () => { win = null; });
  createMenu();
}

ipcMain.handle('motor:open', openProject);
ipcMain.handle('motor:save', (_event, saveAs) => saveProject(saveAs));
ipcMain.handle('motor:about', () => dialog.showMessageBox(win, {
  type: 'info', title: 'Motor Editor', message: 'Motor Editor 0.1.0', detail: 'Editor desktop nativo para a engine Motor.\nProjeto separado de motor, sem modificar o repositório-base.'
}));

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
