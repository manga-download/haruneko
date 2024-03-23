import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
    invoke: ipcRenderer.invoke,
    on: ipcRenderer.on,
});