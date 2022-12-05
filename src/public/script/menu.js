const { app, Menu, Notification, nativeTheme, ipcRenderer, ipcMain } = require('electron');
const path = require('path');

module.exports = { getMenu, tryMenu }

function getMenu(window) {
    const template = [
        {
            label: "Inicio",
            click: async () => {
                window.loadFile(path.join(__dirname, '../index.html'));
            }
        },
        {
            label: "Mouse Click",
            click: async () => {
                window.loadFile(path.join(__dirname, '../mouseclicker.html'));
            }
        },
        {
            label: "Mouse Mover",
            click: async () => {
                window.loadFile(path.join(__dirname, '../mousemover.html'));
            }
        },
        {
            label: "Event Register",
            click: async () => {
                window.loadFile(path.join(__dirname, '../eventregister.html'));
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
                {
                    label: "Toggle Dark Mode",
                    click: async () => {
                        let theme = 'light';
                        if (!nativeTheme.shouldUseDarkColors && nativeTheme.themeSource == 'system' || nativeTheme.themeSource == 'light')
                            theme = 'dark';
                        nativeTheme.themeSource = theme;
                        window.webContents.send('toggleDarkMode', theme);
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
    return Menu.buildFromTemplate(template)
}

function tryMenu(window) {
    const template = [
        {
            label: 'Show App', click: function () {
                window.show();
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true;
                app.quit();
            }
        },
        // { type: 'separator' },
        // {
        //     label: 'Mouse Clicker',
        //     submenu: [
        //         {
        //             label: "Start",
        //             click: async () => {
        //                 window.webContents.send('startMouseClicker');
        //             }
        //         },
        //         {
        //             label: "Stop",
        //             click: async () => {
        //                 window.webContents.send('stopMouseClicker');
        //             }
        //         }
        //     ]
        // },
        // {
        //     label: 'Mouse Mover',
        //     submenu: [
        //         {
        //             label: "Start",
        //             click: async () => {
        //                 window.webContents.send('startMouseMover');
        //             }
        //         },
        //         {
        //             label: "Stop",
        //             click: async () => {
        //                 window.webContents.send('stopMouseMover');
        //             }
        //         }
        //     ]
        // },
        // {
        //     label: 'Event Register',
        //     submenu: [
        //         {
        //             label: "Start",
        //             click: async (e) => {
        //                 if(e.label === 'Start'){
        //                     e.label = 'Stop';
        //                     ipcMain.emit('startKeyPress');
        //                 }
        //                 else{
        //                     e.label = 'Start';
        //                     ipcMain.emit('stoptKeyPress');
        //                 }

        //                 console.log(e);
        //                 return e;
        //             }
        //         }
        //     ]
        // },
    ];
    return Menu.buildFromTemplate(template);
}