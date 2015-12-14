function clearController() {
  var cache = require('../../cache');
  var utils = require('../../utils');

  cache.clear(function () {
    utils.log.succ('Cache cleared.');
  });
}

var cli = require('dastoor').builder;

cli.node('onetime.cache', {
    help: 'manage onetime cache'
});

cli.node('onetime.cache.clear', {
    help: 'clears onetime cached data',
    controller: clearController
});
