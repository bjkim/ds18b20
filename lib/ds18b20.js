//
// Get information from connected devices.
//
// @chamerling
//
"use strict";

var utils = require('./utils'), fs = require('fs'); 
//
// Get all connected sensor IDs as array
// @param callback(err, array)
//
var sensors = function (callback) {
  callback = utils.safe(callback);

  fs.readFile('/sys/bus/w1/devices/w1_bus_master1/w1_master_slaves', 'utf8', function (err, data) {
    if (err) {
      callback(err);
    } else {
      var parts = data.split("\n");
      parts.pop();
      if (parts.toString() === 'not found.') {
        callback(new Error('There is no sensors'));
      } else {
        callback(null, parts);
      }
    }
  });
};
exports.sensors = sensors;

//
// Get the temperature of a given sensor
// @param sensor : The sensor ID
// @param callback : callback (err, {id, value})
//
var temperature = function (sensor, callback) {
  callback = utils.safe(callback);

  fs.readFile('/sys/bus/w1/devices/' + sensor + '/w1_slave', 'utf8', function (err, data) {
    if (err) {
      callback(err);
    } else {
      var crc = data.match(/YES/g); 
      
      if (crc) {
        var output = data.match(/t=(\-?\d+)/i);
        if (output) {
          callback(null, {id : sensor, value: output[1] / 1000});
        } else {
          callback(new Error('Can not read temperature for sensor ' + sensor));
        }
      } else {
        callback(null, {id : sensor, value: 0xffff});
      } 
    }
  });
};
exports.temperature = temperature;
