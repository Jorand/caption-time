const electron = require('electron')
const { app, shell } = electron.remote
const isDev = require('electron-is-dev')
const packageJson = require('../package.json')

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File...',
        accelerator: 'CmdOrCtrl+O',
        click: (menuItem, browserWindow, event) => {
          var focusedWindow = browserWindow || electron.remote.BrowserWindow.getFocusedWindow()
          focusedWindow.show()
          focusedWindow.webContents.send('openFile')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: isDev ? [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ] : [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Donate',
        click: (menuItem, browserWindow, event) => {
          // analytics Donated
          var focusedWindow = browserWindow || electron.remote.BrowserWindow.getFocusedWindow()
          focusedWindow.show()
          focusedWindow.webContents.send('donateClick')

          shell.openExternal('https://www.paypal.me/jorandlepape')
        }
      },
      {
        label: 'Learn More',
        click () { shell.openExternal(packageJson.repository.url) }
      },
      {
        label: 'Support',
        click: () => shell.openExternal('https://twitter.com/jorandlepape')
      },
      {
        label: 'Report Issue',
        click: () =>
          shell.openExternal(packageJson.repository.url + '/issues/new')
      },
      {
        label: 'Search Issues',
        click: () =>
          shell.openExternal(packageJson.repository.url + '/issues')
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about',
        click: (menuItem, browserWindow, event) => {
          var focusedWindow = browserWindow || electron.remote.BrowserWindow.getFocusedWindow()
          focusedWindow.show()
          focusedWindow.webContents.send('openAbout')
        }
      },
      { type: 'separator' },
      {
        label: 'Preferences...',
        accelerator: 'CmdOrCtrl+,',
        click: (menuItem, browserWindow, event) => {
          var focusedWindow = browserWindow || electron.remote.BrowserWindow.getFocusedWindow()
          focusedWindow.show()
          focusedWindow.webContents.send('openUserSettings')
        }
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // // Edit menu
  // template[1].submenu.push(
  //   { type: 'separator' },
  //   {
  //     label: 'Speech',
  //     submenu: [
  //       { role: 'startspeaking' },
  //       { role: 'stopspeaking' }
  //     ]
  //   }
  // )
  //
  // // Window menu
  // template[3].submenu = [
  //   { role: 'close' },
  //   { role: 'minimize' },
  //   { role: 'zoom' },
  //   { type: 'separator' },
  //   { role: 'front' }
  // ]
}

module.exports = template
