const { app, Menu, Notification, nativeTheme, BrowserWindow } = require('electron');
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
        }
    ];
    return Menu.buildFromTemplate(template);
}