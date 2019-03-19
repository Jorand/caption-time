import axios from 'axios'
import tnp from 'torrent-name-parser'

export default function ({
  username = 'popcorn',
  password = 'popcorn',
  ip = '127.0.0.1',
  port = '8008',
  debug = false
} = {}) {
  this.isConnected = false

  this.connect = () => {
    console.info('[INFO] Try connecting to Popcorn-Time...')
    return this.ping()
  }

  this.call = (method, params) => {
    return new Promise((resolve, reject) => {
      axios.post('http://' + ip + ':' + port, {
        id: Math.floor((Math.random() * 100) + 1),
        jsonrpc: '2.0',
        method,
        params: params || []
      }, {
        headers: {
          'Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
          'Accept': 'application/json'
        },
        timeout: 3000
      })
        .then(response => {
          this.log(response)
          // console.log(response)
          const data = response.data.result ? response.data.result : response.data
          this.handleData(data, method)

          if (!this.isConnected) {
            throw new Error('Invalid login: Check username and password.')
          } else if (data.error !== undefined) {
            // Use "soft" to diff from connection error
            throw new CustomError('Popcorn-Time not responding: ' + data.error.message, 'soft')
          } else {
            return resolve(data)
          }
        })
        .catch(error => {
          this.log(error.message)
          // Fire disconnect only if it's a connection error
          if (!error.type || error.type !== 'soft') {
            this.disconnect()
          }
          return reject(error.message)
        })

      function CustomError (message, type) {
        const error = new Error(message)
        error.type = type
        return error
      }
    })
  }

  this.handleData = (data, method) => {
    if (method === 'ping') {
    // console.log(data);
      if (data.error !== undefined) {
        this.disconnect()
      } else {
        this.connected()
      }
    }
  }

  this.paseTitle = (rawTitle) => {
    console.log('[INFO] Parser In:', rawTitle)
    // Clean title to extract Titre Saison Episode …
    var titleTpn = rawTitle
      // .replace(/ - /g, ' ')
      .replace(/,/g, '')
      .replace(/Season |Saison /g, 'S')
      .replace(/Episode |Épisode /g, 'E')
      .replace(/&amp;/g, '')

    var regexp = new RegExp(/([S|E])([0-9]+)/, 'ig')

    var self = this
    titleTpn = titleTpn.replace(regexp,
      function (match, p1, p2, p3, offset, string) {
        return p1 + '' + self.pad(p2)
      })

    if (!regexp.test(titleTpn)) {
      titleTpn += ' -Film'
    }

    console.log('[INFO] Parser Out:', titleTpn)

    return tnp(titleTpn)
  }

  this.pad = (n) => {
    return (n < 10) ? ('0' + n) : n
  }

  this.disconnect = () => {
    if (this.isConnected) {
      this.isConnected = false
      console.warn('[WARN] Popcorn-Time disconnected !')
    }
  }

  this.connected = () => {
    if (!this.isConnected) {
      this.isConnected = true
      console.info('[INFO] Popcorn-Time is Connected !')
    }
  }

  this.log = (msg) => {
    if (debug === true) console.log(msg)
  }

  // CUSTOM GETTER

  this.getPlayingTitle = (callback) => {
    const sendError = (error) => {
      if (callback) {
        var er = { error: error }
        callback(er)
      }
    }

    const whenConnected = () => {
      this.getPlaying()
        .then(result => isShowPlaying(result))
        .catch(error => sendError(error))
    }

    const isShowPlaying = (data, last = false) => {
      this.log(data)
      var show = {}
      if (data && data.title) {
        show = {
          title: data.title,
          duration: data.duration,
          quality: data.quality,
          selectedSubtitle: data.selectedSubtitle
        }
        if (callback) callback(show)
      } else if (last !== true) {
        this.getLoading()
          .then(result => isShowPlaying(result, true))
          .catch(error => sendError(error))
      } else {
        if (callback) callback(show)
      }
    }

    if (!this.isConnected) {
      console.info('[INFO]: New connection attempt.')
      this.ping()
        .then(result => whenConnected())
        .catch(error => this.log('Cannot reach Popcorn-Time: ', error))
    } else {
      whenConnected()
    }
  }

  // Popcorn time API
  // https://github.com/liszd/Popcorn-Time-Desktop/blob/master/docs/json-rpc-api.md

  this.ping = () => {
    return this.call('ping', false)
  }

  this.getPlaying = () => {
    return this.call('getplaying', false)
  }

  this.getLoading = () => {
    return this.call('getloading', false)
  }

  this.getViewStack = () => {
    return this.call('getviewstack', false)
  }
}
