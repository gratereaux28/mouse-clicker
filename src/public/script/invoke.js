const { BrowserWindow, ipcMain, nativeTheme, globalShortcut } = require('electron');
const { mouseClick, moveMouse, getMousePos } = require("robotjs");
const { GlobalKeyboardListener } = require('node-global-key-listener');
const { windowsHideNotification } = require('./notification');
const gkl = new GlobalKeyboardListener();

module.exports = { handleInvokes, setGlobalShortcut }

function handleInvokes(window) {
    setGlobalShortcut(window);

    ipcMain.handle('dark-mode:toggle', (event, theme) => {
        nativeTheme.themeSource = theme;
    });

    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system';
    });

    ipcMain.handle('mouseClicker', (event, arg) => {
        mouseClick(arg.mouse, arg.action);
    });

    ipcMain.handle('mouseMover', (event, arg) => {
        const mouse = getMousePos();
        moveMouse(arg.x, arg.y);
        setTimeout(() => moveMouse(mouse.x, mouse.y), arg.time);
    });

    ipcMain.handle('registerClickerShortcut', (event, arg) => {
        setGlobalShortcut(window);
        globalShortcut.register(`CommandOrControl+${arg.start}`, () => {
            window.webContents.send('startMouseClicker');
        });
        globalShortcut.register(`CommandOrControl+${arg.stop}`, () => {
            window.webContents.send('stopMouseClicker');
        });
    });

    ipcMain.handle('registerMoverShortcut', (event, arg) => {
        setGlobalShortcut(window);
        globalShortcut.register(`CommandOrControl+${arg.start}`, () => {
            window.webContents.send('startMouseMover');
        });
        globalShortcut.register(`CommandOrControl+${arg.stop}`, () => {
            window.webContents.send('stopMouseMover');
        });
    });

    ipcMain.handle('minimize', () => {
        window.minimize();
    });

    ipcMain.handle('startKeyPress', () => {
        gkl.addListener(calledOnce);
    });

    ipcMain.handle('stoptKeyPress', () => {
        gkl.removeListener(calledOnce);
    });
}

const calledOnce = (e) => {
    const window = BrowserWindow.getAllWindows()[0];
    if (e.state === "UP")
        window.webContents.send('sendKeyPressed', e.name);
}

function setGlobalShortcut(window) {
    globalShortcut.unregisterAll();
    globalShortcut.register('CommandOrControl+L', () => {
      if (window.isVisible())
        window.hide();
      else
        window.show();
    });
    globalShortcut.register('CommandOrControl+P', () => {
      gkl.addListener(calledOnce);
    });
    globalShortcut.register('CommandOrControl+O', () => {
        window.webContents.send('cleanKeyPressed');
    });
    globalShortcut.register('CommandOrControl+U', () => {
      gkl.removeListener(calledOnce);
    });
  }