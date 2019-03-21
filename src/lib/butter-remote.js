import axios from 'axios'
import tnp from 'torrent-name-parser'

const defaultConfig = {
  username: 'popcorn',
  password: 'popcorn',
  ip: '127.0.0.1',
  port: '8008'
}

export default function ({
  username = defaultConfig.username,
  password = defaultConfig.password,
  ip = defaultConfig.ip,
  port = defaultConfig.port,
  debug = false
} = {}) {
  let isConnected = false
  let topics = {}
  let butterInterval = null
  let lastTitle = ''

  this.pad = (n) => {
    return (n < 10) ? ('0' + n) : n
  }

  this.disconnect = () => {
    clearInterval(butterInterval)
    disconnect()
    return 'DONE'
  }

  this.updateSettings = (data) => {
    // if parameters are empty set to default
    username = data.username || defaultConfig.username
    password = data.password || defaultConfig.password
    ip = data.ip || defaultConfig.ip
    port = data.port || defaultConfig.port

    console.log('[INFO] Butter Settings:', { username, password, ip, port })
  }

  this.connect = () => {
    this.updateSettings({ username, password, ip, port })
    clearInterval(butterInterval)
    butterInterval = setInterval((function x () {
      if (isConnected) {
        // Do work for subscribers
        fireSubscribersCall()
        // make sure we are connected and fire disconnected if not
        call('ping', false)
      } else {
        console.log('[INFO] New connection attempt to Popcorn-Time...')
        // try to find the good ip
        call('ping', false)
      }
      return x
    }()), 2000)
  }

  const fireSubscribersCall = () => {
    if (isEmpty(topics)) {
      return
    }
    for (const key in topics) {
      switch (key) {
        case 'ping':
          call('ping', false)
            .then(function (result) {
              console.log(result)
              // catch
            })
          break
        case 'playingtitle':
          call('getplaying', false)
            .then((data) => {
              const result = isShowPlaying(data)
              return result.title ? result : call('getloading', false)
            })
            .then((data) => {
              if (data !== false) {
                const result = isShowPlaying(data)
                if (result.title) {
                  if (result.title !== lastTitle) {
                    result.tnp = paseTitle(result.title)
                    lastTitle = result.title
                    publish('playingtitle', result)
                  }
                } else {
                  publish('playingtitle', {})
                }
              }
            })
          break
      }
    }
  }

  const call = (method, params, testIp = null) => {
    // Popcorn time API
    // https://github.com/liszd/Popcorn-Time-Desktop/blob/master/docs/json-rpc-api.md
    var callIp = testIp || ip
    log('[CALL]', method, callIp)

    return new Promise((resolve, reject) => {
      axios.post('http://' + callIp + ':' + port, {
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
          const data = response.data.result ? response.data.result : response.data

          if (data.error !== undefined) {
            // Use "soft" to diff from connection error
            throw new CustomError('Popcorn-Time not responding: ' + data.error.message, 'soft')
          } else {
            connect()
            data.callIp = response.config.url.replace('http://', '').replace(':' + port, '')
            return resolve(data)
          }
          // For now if credetials are wrond its catched in catch
          // if (!isConnected) {
          //   throw new Error('Invalid login: Check username and password.')
          // }
        })
        .catch(error => {
          // Fire disconnect only if it's a connection error
          if (!error.type || error.type !== 'soft') {
            disconnect()
            console.log(error.message)
            // Change IP handle in connect
          } else {
            // Popcorn-Time is not responding
            // TODO: maybe add a timeout
          }
          // return reject()
        })
    })
  }

  const disconnect = () => {
    if (isConnected) {
      isConnected = false
      console.warn('[WARN] Popcorn-Time disconnected !')
      publish('disconnected')
    }
  }

  const connect = () => {
    if (!isConnected) {
      isConnected = true
      console.info('[INFO] Popcorn-Time is Connected !')
      publish('connected')
    }
  }

  const isShowPlaying = (data) => {
    let show = {}
    if (data && data.title) {
      show = {
        title: data.title,
        duration: data.duration,
        quality: data.quality,
        selectedSubtitle: data.selectedSubtitle
      }
    }
    return show
  }

  const paseTitle = (rawTitle) => {
    log('[INFO] Parser In:', rawTitle)
    // Clean title to extract Titre Saison Episode …
    let titleTpn = rawTitle
      // .replace(/ - /g, ' ')
      .replace(/,/g, '')
      .replace(/Season |Saison /g, 'S')
      .replace(/Episode |Épisode /g, 'E')
      .replace(/&amp;/g, '')

    let regexp = new RegExp(/([S|E])([0-9]+)/, 'ig')

    let self = this
    titleTpn = titleTpn.replace(regexp,
      function (match, p1, p2, p3, offset, string) {
        return p1 + '' + self.pad(p2)
      })

    if (!regexp.test(titleTpn)) {
      titleTpn += ' -Film'
    }

    log('[INFO] Parser Out:', titleTpn)

    return tnp(titleTpn)
  }

  function isEmpty (obj) {
    return (Object.getOwnPropertyNames(obj).length === 0)
  }

  const CustomError = function (message, type) {
    const error = new Error(message)
    error.type = type
    return error
  }

  const log = (msg) => {
    if (debug === true) console.log(msg)
  }

  // Publish / Subscribe
  // https://codepen.io/RobHowells/pen/vZqxaV?editors=0010

  this.subscribe = (topic, listener) => {
    // make sure there is a topic and listener
    if (!topic || !listener) {
      console.warn('[WARN] Subscribe: Missing parameter. ')
      return
    }
    // create the topic if not yet created
    if (!topics[topic]) {
      topics[topic] = []
    }
    // add the listener to queue
    topics[topic].push(listener)
  }

  function publish (topic, data) { // Publish is private
    // make sure the topic and listeners exist
    if (!topics[topic] || topics[topic].length < 1) {
      return
    }
    // send the event to all listeners
    topics[topic].forEach(function (listener) {
      listener(data || {})
    })
  }
}
