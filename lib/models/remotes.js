'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var RemoteSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  task: { type: String, required: true },
  timed_flg: { type: Boolean, default: false }
});

var Remote = function(){
  this.remotedb = mongoose.model('Remote', RemoteSchema);
};

Remote.prototype.insertRemoteCmd = function(name, code, task, timed_flg) {
      this.remotedb.create({
          name: name,
          code: code,
          task: task,
          timed_flg: timed_flg
      }, (err, remote) => {
        if (err) {
          return console.log(err);
        }
        console.log(remote);
      });
};

Remote.prototype.countRemoteCmd = function(callback){
  this.remotedb.count(function(err, remote) {
    if (err) {
        return console.log("Error", err);
    }
    if (remote <= 0) {
        callback();
    }
  });
};

Remote.prototype.insertAllRemoteCmd = function(params){
  this.remotedb.insertMany(params, function(err, result) {
        if (err) {
            return console.log(err);
        }
        console.log('insertAllRemoteCmd inserted!' /*, result*/ );
    });
};

module.exports = Remote;