import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			sandbox: false,
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js')
		}
	})

	// 隐藏菜单栏
	mainWindow.setMenu(null)
	if (process.env.NODE_ENV === 'development') {
		mainWindow.loadURL(import.meta.env.VITE_BASE_URL)
		mainWindow.webContents.openDevTools()
	} else {
		mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
	}
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// IPC通信
ipcMain.handle('open-folder-dialog', async () => {
	const result = await dialog.showOpenDialog({
		properties: ['openDirectory'],
		title: '选择FLV文件目录'
	})
	return result.canceled ? null : result.filePaths[0]
})
