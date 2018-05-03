'use strict'
var RawSensor = require('./models/rawsensors.js');
RawSensor = new RawSensor();
module.exports = {
  insert: function (data, sensors, callback) {
    let sensor = sensors.findIds(data.node_id, data.sensortype);
    if (sensor) {
      RawSensor.insert({
        data: {
          board_id: sensor.board_id,
          sensor_id: sensor.sensor_id,
          datetime: data.datetime,
          value: data.value
        },
        sensorData: sensor
      }, callback);
    }
  },
  updateAvg: function (data, callback) {
    RawSensor.updateAvg(data.data, callback);
  },
  updateFlg: function (data, callback) {
    RawSensor.updateFlg(data, callback);
  },
  getByBoardID: function (board_id, callback) {
    RawSensor.getByBoardID(board_id, callback);
  },
  getBySensorID: function (sensor_id, callback) {
    RawSensor.getBySensorID(sensor_id, callback);
  },
  getBySensorIDBoardID: function (board_id, sensor_id, callback) {
    RawSensor.getBySensorIDBoardID(board_id, sensor_id, callback);
  },
  getSensorData: function(req, res){
    RawSensor.getSensorData(res);
  },
  delete: function (data) {
    RawSensor.delete(data);
  }
}

Array.prototype.findIds = function (node_id, sensortype) {
  var i = this.length;
  while (i--) {
    if (this[i].node_id === node_id && this[i].sensortype === sensortype) {
      return {
        board_id: this[i].board_id,
        sensor_id: this[i].sensor_id,
        sensor: this[i]
      };
    }
  }
}