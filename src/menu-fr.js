const electron = require('electron')
const { app, shell } = electron.remote
const isDev = require('electron-is-dev')
const packageJson = require('../package.json')

const template = [
  {
    label: 'Fichier',
    submenu: [
      {
        label: 'Ouvrir le fichier...',
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
    label: 'Modifier',
    submenu: [
      { label: 'Annuler', role: 'undo' },
      { label: 'Rétablir', role: 'redo' },
      { type: 'separator' },
      { label: 'Couper', role: 'cut' },
      { label: 'Copier', role: 'copy' },
      { label: 'Coller', role: 'paste' },
      { label: 'Coller en adaptant le style', role: 'pasteandmatchstyle' },
      { label: 'Supprimer', role: 'delete' },
      { label: 'Tout sélectionner', role: 'selectall' },
      {
        label: 'Voix',
        submenu: [
          { label: 'Commencer à parler', role: 'startspeaking' },
          { label: 'Arrêter de parler', role: 'stopspeaking' }
        ]
      }
    ]
  },
  {
    label: 'Afficher',
    submenu: isDev ? [
      { role: 'reload', label: 'Actualiser cette page' },
      { role: 'forcereload', label: 'Forcer l\'actualisation de cette page' },
      { role: 'toggledevtools', label: 'Outils de développement' },
      { type: 'separator' },
      { role: 'resetzoom', label: 'Taille réelle' },
      { role: 'zoomin', label: 'Zoom avant' },
      { role: 'zoomout', label: 'Zopm arrière' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Activer le mode plein écran' }
    ] : [
      { role: 'reload', label: 'Actualiser cette page' },
      { role: 'forcereload', label: 'Forcer l\'actualisation de cette page' },
      { type: 'separator' },
      { role: 'resetzoom', label: 'Taille réelle' },
      { role: 'zoomin', label: 'Zoom avant' },
      { role: 'zoomout', label: 'Zopm arrière' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Activer le mode plein écran' }
    ]
  },
  {
    label: 'Fenêtre',
    role: 'window',
    submenu: [
      { role: 'minimize', label: 'Réduire' },
      { role: 'close', label: 'Fermer la fenêtre' }
    ]
  },
  {
    label: 'Aide',
    role: 'help',
    submenu: [
      {
        label: 'Faire un don',
        click: (menuItem, browserWindow, event) => {
          // analytics Donated
          var focusedWindow = browserWindow || electron.remote.BrowserWindow.getFocusedWindow()
          focusedWindow.show()
          focusedWindow.webContents.send('donateClick')

          shell.openExternal('https://www.paypal.me/jorandlepape')
        }
      },
      {
        label: 'En savoir plus',
        click () { shell.openExternal(packageJson.repository.url) }
      },
      {
        label: 'Aide',
        click: () => shell.openExternal('https://twitter.com/jorandlepape')
      },
      {
        label: 'Signaler un problème…',
        click: () =>
          shell.openExternal(packageJson.repository.url + '/issues/new')
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
        label: 'À propos de ' + app.getName(),
        click: (menuItem, browserWindow, event) => {
          var focusedWindow = browserWindow || electron.remote.BrowserWindow.getFocusedWindow()
          focusedWindow.show()
          focusedWindow.webContents.send('openAbout')
        }
      },
      { type: 'separator' },
      {
        label: 'Préférences...',
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
      { role: 'hide', label: 'Masquer ' + app.getName() },
      { role: 'hideothers', label: 'Masquer les autres' },
      { role: 'unhide', label: 'Tout afficher' },
      { type: 'separator' },
      { role: 'quit', label: 'Quitter ' + app.getName() }
    ]
  })
}

module.exports = template
