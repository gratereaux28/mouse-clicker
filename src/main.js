const { app, BrowserWindow, ipcMain, Menu, nativeTheme, globalShortcut, Notification } = require('electron');
const { mouseClick, moveMouse, getMousePos } = require("robotjs");
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 510,
    height: 510,
    // autoHideMenuBar: true
    maximizable: false,
    resizable: false,
    show: false,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.once('did-finish-load', function () {
    setTimeout(() => {
      mainWindow.show();
      loadingWindow.close();
    }, 2000);
  });

  var loadingWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: (process.platform != 'linux'), // Transparency doesn't work on Linux.
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    title: "Loading..."
  });

  loadingWindow.loadURL(path.join(__dirname, '/content/img/loading.gif'));
  setMenu(mainWindow);
  handleInvokes(mainWindow);
  setGlobalShortcut(mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function setMenu(window) {
  const template = [
    {
      label: "Inicio",
      click: async () => {
        window.loadFile(path.join(__dirname, 'index.html'));
      }
    },
    {
      label: "Mouse Click",
      click: async () => {
        window.loadFile(path.join(__dirname, '/public/mouseclicker.html'));
      }
    },
    {
      label: "Mouse Mover",
      click: async () => {
        window.loadFile(path.join(__dirname, '/public/mousemover.html'));
      }
    },
    {
      label: "Event Register",
      click: async () => {
        window.loadFile(path.join(__dirname, '/public/eventregister.html'));
      }
    },
    {
      label: 'Herramientas',
      submenu: [
        {
          label: "Hide",
          click: async () => {
            window.hide();
            const notification = new Notification({
              title: 'Mouse Clicker',
              subtitle: 'Haz escondido la aplicaccion',
              body: 'Para reactivarla preciona CTRL + L',
              hasReply: true
            });
            notification.show();
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

const handleInvokes = (window) => {

  ipcMain.handle('dark-mode:toggle', (theme) => {
    nativeTheme.themeSource = theme;
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });

  ipcMain.handle('mouseClicker', (event, arg) => {
    mouseClick(arg.mouse, arg.action);
  });

  ipcMain.handle('mouseMover', () => {
    const mouse = getMousePos();
    moveMouse(mouse.x + 1, mouse.y + 1);
    setTimeout(() => moveMouse(mouse.x, mouse.y), 1000);
  });

  ipcMain.handle('registerClickerShortcut', (event, arg) => {
    setGlobalShortcut();
    globalShortcut.register(`CommandOrControl+${arg.start}`, () => {
      window.webContents.send('startMouseClicker');
    });
    globalShortcut.register(`CommandOrControl+${arg.stop}`, () => {
      window.webContents.send('stopMouseClicker');
    });
  });

  ipcMain.handle('registerMoverShortcut', (event, arg) => {
    setGlobalShortcut();
    globalShortcut.register(`CommandOrControl+${arg.start}`, () => {
      window.webContents.send('startMouseMover');
    });
    globalShortcut.register(`CommandOrControl+${arg.stop}`, () => {
      window.webContents.send('stopMouseMover');
    });
  });

  ipcMain.handle('minimize', () => {
      const window = BrowserWindow.getAllWindows()[0];
      window.minimize();
  })
}

function setGlobalShortcut(window) {
  globalShortcut.unregisterAll();
  globalShortcut.register('CommandOrControl+L', () => {
    if (window.isVisible())
      window.hide();
    else
      window.show();
  });
}