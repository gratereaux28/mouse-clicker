const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('app', {
    minimize: () => ipcRenderer.invoke('minimize')
})

contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        let validChannels = [];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    invoke: (channel, data) => {
        let validChannels = [];
        if (validChannels.includes(channel)) {
            ipcRenderer.invoke(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["startMouseClicker", "stopMouseClicker", "startMouseMover", "stopMouseMover", "toggleDarkMode", "initActiveProcess", "stopActiveProcess"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
})

contextBridge.exposeInMainWorld('shortcut', {
    clickRegister: (arg) => ipcRenderer.invoke('registerClickerShortcut', arg),
    moveRegister: (arg) => ipcRenderer.invoke('registerMoverShortcut', arg),
})

contextBridge.exposeInMainWorld('mouse', {
    click: (arg) => ipcRenderer.invoke('mouseClicker', arg),
    move: (arg) => ipcRenderer.invoke('mouseMover',arg)
})

contextBridge.exposeInMainWorld('darkMode', {
    set: (theme) => ipcRenderer.invoke('dark-mode:toggle', theme),
    system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('keyPress', {
    start: () => ipcRenderer.invoke('startKeyPress'),
    stop: () => ipcRenderer.invoke('stoptKeyPress')
})

ipcRenderer.on("sendKeyPressed", (event, key) => {
    let keypressed = window.localStorage.getItem('keypressed');
    keypressed = (keypressed) ? keypressed : '';
    keypressed = keypressed.concat(` ${key}`);
    window.localStorage.setItem('keypressed', keypressed);
});

ipcRenderer.on("cleanKeyPressed", (event, key) => {
    window.localStorage.removeItem('keypressed');
});