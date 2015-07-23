function controller() {
    var utils = require('../../utils');
    var config = require('../../config');
    var props = ['domain', 'email'];

    function showDomain(name, key) {
        var settings = config.readDomain(key, props);
        if(!settings) return;

        utils.log();
        utils.log('    ' + name);
        props.forEach(function (p) {
            utils.log('      ' + utils.pad(p, 10) + settings[p]);
        });
        utils.log();
    }

    showDomain('Harvest', 'harvest');
    showDomain('Target Process', 'tp');
}

require('dastoor').builder
.terminal('onetime.config.show', controller)
.help({
    description: 'show onetime configurations'
});
