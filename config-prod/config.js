'use strict'
var fs = require('fs');


module.exports = {
  coapConfigs: {
    rate: {
      hour: 0,
      min: 15,
      sec: 0
    }
  },
  postRate: {
    hour: 0,
    min: 0,
    sec: 5,
    noData: {
      hour: 0,
      min: 0,
      sec: 10
    }
  },
  ReconnectRate: {
    hour: 0,
    min: 0,
    sec: 5,
    extra: {
      hour: 0,
      min: 5,
      sec: 0
    }
  },
  TimersConfig: {
    waitingTimeTillNextWarning: {
      hour: 0,
      min: 0,
      sec: 50
    },
    waitingTimeTillCheckForCecIsAlive: {
      hour: 0,
      min: 0,
      sec: 4
    },
    deleteRate: {
      hour: 0,
      min: 10,
      sec: 0
    }
  },
  RemoteConfigs: {
    remoteserver: "192.168.161.132",
    remoteport: 8080
  },
  ServerBoardWarningConfigs: {
    port: 10000,
    host: 'fd00::1'
  },
  ServerBoardRegisterConfigs: {
    port: 10001,
    host: 'fd00::1'
  },
  websockets: {
    //host: 'vitasenior-ws.eu-gb.mybluemix.net'
    host: 'http://192.168.161.115:8008/'
  },
  ServerConfigs: {
    key: fs.readFileSync('.key').toString().trim(),
    pass: 'passvita',
    //pass: 'Mqa1Uf8pFy',
    //port: 443,
    port: 8080,
    //host: 'vitasenior.eu-gb.mybluemix.net'
    host: '192.168.161.94'
  },
  serverHttp: {
    port: 8080
  },
  mongodb: 'mongodb://localhost:27017/VitaBoxProd2'
}
