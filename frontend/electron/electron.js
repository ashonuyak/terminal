const { app, BrowserWindow } = require('electron')
const { join } = require('path')

let width = 800
let height = 600

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    height,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    width,
    autoHideMenuBar: true,
  })

  mainWindow.loadFile(join(__dirname, '../build/index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (!mainWindow) createWindow()
})
