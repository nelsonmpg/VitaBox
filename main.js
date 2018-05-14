'use strict'
require('colors');
var cp = require('child_process'),
  exec = require('child_process').exec,
  fs = require('fs'),
  config = null,
  mode = process.env.NODE_ENV || "DEV";

var Main = function () {
  let pathCfg = './config-' + mode.toLowerCase() + '/config.js';
  console.log('Path Config -', pathCfg);
  config = require(pathCfg);

  var args = {
    port: config.serverHttp.port,
    mongodb: config.mongodb,
    TimersConfig: config.TimersConfig,
    env_dev: (mode.toLowerCase() === 'dev' ? true : false),
  };
  // inicia p script e envia as configuracores do ficheiro ini
  var child2 = cp.fork('./lib/server.js');
  var child3 = cp.fork('./lib/serverBoardRegister.js');
  var child4 = cp.fork('./lib/serverBoardListener.js');

  /*
   * Starts the border-router process
   */
  exec('make TARGET=zoul --directory contiki-ng/examples/rpl-border-router/ savetarget');
  startBorderRouter();

  child2.send({ "serverdata": args });
  child2.on('message', function (responce) {
    if (responce.node_id_list) {
      child3.send({
        "configsRegister": config.ServerBoardRegisterConfigs,
        "node_id_list": responce.node_id_list
      });
    }
  });
  
  child4.send({ "configsListener": config.ServerBoardListenerConfigs });
  child4.on('message', function (responce) {
    console.log('responce');
    console.log(responce);
    if (responce.sensorData) {
      child2.send({ sensorData: data });
    }
  });

};

new Main();

module.exports = Main;

function startBorderRouter(config) {
  let connectRouter = exec('make --directory contiki-ng/examples/rpl-border-router/ connect-router');
  isRunning('connect-router').then((v) => console.log('connect-router - ', v));
  connectRouter.stdout.on('data', (data) => {
    console.log('stdout:');
    console.log(data);
  });

  connectRouter.stderr.on('data', (data) => {
    if (data.split('Error ')[1]) {
      console.log('A Reiniciar...');
      console.log('Code: ', data.split('Error ')[1]);
      setTimeout(() => {
        startBorderRouter(config);
      }, 10000);
    }
  });
}

function isRunning(linux) {
  return new Promise(function (resolve, reject) {
    const plat = process.platform
    const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
    const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
    if (cmd === '' || proc === '') {
      resolve(false)
    }
    exec(cmd, function (err, stdout, stderr) {
      resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
    })
  })
}
