import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
	on: (channel, callback) => {
		ipcRenderer.on(channel, (event, ...args) => callback(...args))
	}
})
