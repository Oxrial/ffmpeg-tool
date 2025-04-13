const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js')
		}
	})

	if (process.env.NODE_ENV === 'development') {
		mainWindow.loadURL('http://localhost:3000')
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
