var utils = require('./');

module.exports.setup = function (load) {
    return {
        get: function (m) {
            try {
                return load(m);
            }
            catch (e) {
                if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
                    utils.log.err('Could not find command `'+m+'`');
                else throw e;
            }
        }
    };
};
