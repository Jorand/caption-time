# Caption time

A while ago i made [Addic7ed bot](https://github.com/Jorand/addic7ed-bot) to get subtitle automatically from [Addic7ed](https://www.addic7ed.com/) when i was watching a show on Popcorn-Time.

This is a new version inspired by [Caption](https://github.com/gielcobben/caption) with the possibility to automatically search subtitles for your show being played in Popcorn-Time !

I'm using the great package [Caption Core](https://github.com/gielcobben/caption-core) to get the subtitles.


## Install

###### Test environment info:
- System:
  - macOS 10.14.3
- Binaries:
  - node: 8.12.0
  - npm: 6.9.0
- npmGlobalPackages:
  - @vue/cli: 3.5.1

###### Setup:

```
npm install
```

###### Compiles and hot-reloads for development
```
npm start
```

###### Compiles and minifies for production
```
npm run build
```

###### Run your tests
```
npm run test
```

###### Lints and fixes files
```
npm run lint
```

## Todo


## Resources

###### Dark theme:

* [Dark theme electron](https://medium.com/missive-app/make-your-electron-app-dark-mode-compatible-c23dcfdd0dfa)

###### Popcorn time:

* [Popcorn time Api](https://github.com/liszd/Popcorn-Time-Desktop/blob/master/docs/json-rpc-api.md)
* [Remote Popcorn-Time](https://github.com/MickdeGraaf/popcorn-time-remote)
* [Node Butter Remote](https://github.com/ThaTiemsz/butter-remote)


## Troubleshooting
* iconv-lite: [`__webpack_require__(...) is not a function`](https://github.com/ashtuchkin/iconv-lite/issues/204)
* addic7ed-api: [`StatusCodeError {name: "StatusCodeError", statusCode: 301, message: "301`](https://github.com/same31/addic7ed-api/issues/9)
