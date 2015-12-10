function controllers() {
    var utils = require('../../utils');
    var config = require('../../config');

    function baseController(d, args) {
      var key = args._[0];
      if(typeof key !== 'string') {
        return utils.log.err('Please provide a <key>');
      }

      var options = config.getKeyOptions(d, key);
      if(!options) {
        return utils.log.err('Invalid key: `'+key+'`');
      }

      var value = args._[1];
      if(typeof value === 'undefined') {
        return utils.log.err('Please provide a <value>');
      }

      if(options.values && options.values.indexOf(value) < 0) {
        return utils.log.err('Invalid value `'+value+'` for key `'+key+'`');
      }

      config.set(d + '_' + key, value);
      utils.log.succ('Successfully set the configuration value `'+value+'` for key `'+key+'`');
    }

    function tpController(args) {
      baseController('tp', args);
    }

    function harvestController(args) {
      baseController('harvest', args);
    }

    function cachingController(args) {
      baseController('caching', args);
    }

    return {
      tp: tpController,
      harvest: harvestController,
      caching: cachingController
    };
}

var cli = require('dastoor').builder;

cli.node('onetime.config.set', {
    help: 'set configuration settings'
});

var options = [
  { name: '<key>', description: 'configuration key' },
  { name: '<value>', description: 'configuration value' }
];
var usage = ['onetime config set tp <key> <value>'];
cli.node('onetime.config.set.harvest', {
    controller: controllers.rebind('harvest'),
    help: {
      description: 'set a configuration setting for harvest',
      options: options,
      usage: usage,
    },
    terminal: true
});

cli.node('onetime.config.set.tp', {
    controller: controllers.rebind('tp'),
    help: {
      description: 'set a configuration setting for target-process',
      options: options,
      usage: usage,
    },
    terminal: true
});

cli.node('onetime.config.set.caching', {
    controller: controllers.rebind('caching'),
    help: {
      description: 'set a configuration setting for caching',
      options: options,
      usage: usage,
    },
    terminal: true
});
