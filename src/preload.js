
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
        let validChannels = ["startMouseClicker", "stopMouseClicker", "startMouseMover", "stopMouseMover"];
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
    move: () => ipcRenderer.invoke('mouseMover')
})

contextBridge.exposeInMainWorld('darkMode', {
    set: (theme) => ipcRenderer.invoke('dark-mode:toggle', theme),
    system: () => ipcRenderer.invoke('dark-mode:system')
})