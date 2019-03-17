const axios = require('axios');

export default function ({
    username = 'popcorn', 
    password = 'popcorn',
    ip = "127.0.0.1",
    port = "8008",
    debug = false
  } = {}) {
    
  this.call = function (method, params) {
    return new Promise((resolve, reject) => {
      try {
        axios.post('http://'+ ip +':'+ port, {
          id: Math.floor((Math.random()*100)+1),
          jsonrpc: "2.0",
          method,
          params : params || []
        }, {
          headers: {
            'Authorization': Buffer.from(`${username}:${password}`).toString("base64"),
            'Accept': 'application/json'
          },
          timeout: 3000
        })
        .then(response => {
          //console.log(response);
          const data = response.data.result ? response.data.result : response.data
          //this.handleData(data, method)
          return resolve(data)
        })
      } catch (err) {
        console.log("Connection timed out: cannot reach Butter.")
        return reject(err)
      }
    });
  }
  
  this.ping = () => { 
    return this.call("ping", false)
  }
  
  this.getViewStack = () => {
    return this.call("getviewstack", false)
  }
  
}
