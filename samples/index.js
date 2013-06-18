//
// Getting all sensors data...
//
// @chamerling
//

var sensor = require('..');

sensor.sensors(function (err, ids) {
  if (err) {
    console.log('Can not get sensor IDs', err);
  } else {
    for (var id in ids) {
      sensor.temperature(ids[id], function (err, result) {
        if (err) {
          console.log('Can not get temperature from sensor', err);
        } else {
          console.log('[' + result.id + ']', result.value);
        }
      });
    }
  }
});
