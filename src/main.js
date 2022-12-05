const { app, BrowserWindow, Menu, shell, Tray, dialog } = require('electron');
const path = require('path');
const { getMenu, tryMenu } = require('./public/script/menu');
const { windowsHideNotification } = require('./public/script/notification');
const { handleInvokes } = require('./public/script/invoke');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'Mouse Clicker',
    width: 510,
    height: 510,
    // autoHideMenuBar: true
    maximizable: false,
    resizable: false,
    show: false,
    icon: path.join(__dirname, '/public/content/img/favicon.ico'),
    // alwaysOnTop: true,
    webPreferences: {
      // nodeIntegration: false,
      // enableRemoteModule: false,
      // webviewTag: true,
      // contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/public/index.html'));

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
    icon: path.join(__dirname, '/public/content/img/favicon.ico'),
    transparent: (process.platform != 'linux'), // Transparency doesn't work on Linux.
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    roundedCorners: true,
    title: "Loading..."
  });

  loadingWindow.loadURL(path.join(__dirname, '/public/content/img/loading.gif'));

  mainWindow.on('close', async function (event) {
    if (!app.hasAnswerOnClose) {
      var choice = dialog.showMessageBoxSync(this,
        {
          type: 'info',
          buttons: ['Sí', 'No'],
          title: 'Confirmación',
          message: 'Está seguro que desea cerrar la aplicación?',
          detail: 'La aplicación siempre recordara su decisión.'
        });
      if (choice == 0) {
        app.isQuiting = true;
        app.allwaysClose = true;
      }
      else if (choice == 1) {
        app.isQuiting = false;
        app.allwaysClose = false;
      }
      else {
        event.preventDefault();
      }

      app.hasAnswerOnClose = true;
    }

    if (app.allwaysClose)
      event.returnValue = true;
    else if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });

  let tray = new Tray(path.join(__dirname, '/public/content/img/favicon.ico'));

  mainWindow.on('hide', function (event) {
    tray = new Tray(path.join(__dirname, '/public/content/img/favicon.ico'));
    tray.setContextMenu(tryMenu(mainWindow));
    windowsHideNotification();
  });

  mainWindow.on('show', function (event) {
    tray.destroy();
  });

  Menu.setApplicationMenu(getMenu(mainWindow));
  handleInvokes(mainWindow);
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

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    //
    // See the following item for considerations regarding what
    // URLs should be allowed through to shell.openExternal.
    if (isSafeForExternalOpen(url)) {
      setImmediate(() => {
        shell.openExternal(url)
      })
    }

    return { action: 'deny' }
  })
})

app.on('before-quit', function () {
  app.isQuiting = true;
});