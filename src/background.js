/* jshint node: true */
'use strict'

import { app, protocol, BrowserWindow, systemPreferences, Menu } from 'electron'

import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

console.time('init')
process.argv.forEach(onOpen)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 390, // 450
    height: 500, // 350
    minWidth: 350,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    opacity: 1 // 0.98
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    app.exit()
    app.quit()
  })

  // var template = require('./menu')
  // const menu = Menu.buildFromTemplate(template)
  // Menu.setApplicationMenu(menu)

  mainWindow.setProgressBar(-1)
  console.timeEnd('init')
}

app.on('open-file', onOpen)
app.on('open-url', onOpen)

app.on('will-finish-launching', function () {
  // crashReporter.init()
  // autoUpdater.init()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

if (process.platform === 'darwin') {
  const setTheme = () => {
    let theme = systemPreferences.isDarkMode() ? 'dark' : 'light'

    console.log('theme :', theme)
    // updateMyAppTheme(systemPreferences.isDarkMode())
  }

  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    setTheme
  )

  setTheme()
}

function onOpen (e, torrentId) {
  // e.preventDefault()
  console.log(e, torrentId)
  if (app.ipcReady) {
    // windows.main.send('dispatch', 'onOpen', torrentId)
    // Magnet links opened from Chrome won't focus the app without a setTimeout. The
    // confirmation dialog Chrome shows causes Chrome to steal back the focus.
    // Electron issue: https://github.com/atom/electron/issues/4338
    // setTimeout(function () {
    //   windows.focusWindow(windows.main)
    // }, 100)
  } else {
    // argv.push(torrentId)
  }
}
