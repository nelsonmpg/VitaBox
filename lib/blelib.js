'use strict'
require('colors');
var cp = require('child_process'),
  patientslib = require('./patientslib.js'),
  rawsensorlib = require('./rawsensorlib.js'),
  sktcon = null,
  bleChildProc = null;

module.exports = {
  addsktconn: function (skt) {
    sktcon = skt;
  },

  execBleDisp: function (req, res) {
    let dispBle = req.params.bleDisp;
    let userid = req.params.userid;
    dispBle = dispBle.toLowerCase();
    let execCommand = false;
    var args = {
      options: {},
      pacientId: userid,
      action: dispBle
    };

    patientslib.getPatientInfo(args.pacientId, args.action, res, function (pacientInfo) {
      rawsensorlib.getSensorsbleIdLastData(args.pacientId + "-" + pacientInfo.mac_addr, args.action, res, function (bleLastExec){
        bleChildProc = null;
        let gender = 1;
        if (pacientInfo.gender === 'female') {
          gender = 0;
        }
        let heights = (pacientInfo.height.toString()).split(/[,.]/g);
        let height = heights[0] + ((parseInt(heights[1]) < 10) ? parseInt(heights[1]) * 10 : parseInt(heights[1]));
        let age = getAge(pacientInfo.birthdate) > 99 ? 99 : getAge(pacientInfo.birthdate); // temporary fix
        args.macAddress = pacientInfo.mac_addr;
        args.boardId = pacientInfo.boardId;
        args.deviceId = pacientInfo.deviceId;
        args.BoardmodelId = pacientInfo.BoardmodelId;
        args.sensors = pacientInfo.Sensors;
        args.options = {
          bandfitness_auth: pacientInfo.bandfitness_auth,                         // autenticação da band
          user_grup: 1,                                                           // User group
          user_gender: gender, //1,                                               // gender: 1=male, 0=female
          user_level: 0,                                                          // level 0=normal
          user_height: height, //185, // height in cm (0-255)
          user_age: age, //39,                          // age (0-255)
          user_init_kg: pacientInfo.weight //1                                    // unit KG
        }
        // inicia p script e envia as configuracores do ficheiro inicial
        bleChildProc = cp.fork('./lib/bleServer.js');
        bleChildProc.send({
          "serverdata": args
        });
        bleChildProc.on('message', function (data) {
          if (data.proc === 'bluetooth') {
            // console.log(data);
            sktcon.sendMsgToPage(data.dataSend.sktTag, data.dataSend.sktData)
          } else if (data.proc === 'saveDataSensors') {
            // console.log(data);
            rawsensorlib.insertManyData(data.dataSend);
          } else if (data.proc === 'saveAuthPatient') {
            patientslib.updateFlagAuthBandFit(data.dataSend);
          }
        });

        res.json({
          status: true,
          data: "Inicio da execução.",
          lastExec: bleLastExec
        });
      });
  });
},
  cancelExame: function(req, res) {
    bleChildProc.kill('SIGINT');
    res.json({
      status: true,
      data: "Exame cancelado por ordem do utilizador."
    });
  }
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}