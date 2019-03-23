let online = false

var message = (callback) => {
  const { dialog } = require('electron').remote

  return dialog.showMessageBox({
    title: 'There\'s no internet',
    message: 'No internet available, do you want to try again?',
    type: 'warning',
    buttons: ['Try again please', 'I don\'t want to work anyway'],
    defaultId: 0
  }, (index) => {
    // if clicked "Try again please"
    if (index === 0) {
      if (callback) callback()
    }
  })
}

function isOnline (callback = null) {
  if (navigator.onLine) {
    online = true
    return online
  } else {
    online = false
    message(callback)
    return online
  }
}

export default { isOnline }
