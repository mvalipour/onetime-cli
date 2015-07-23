module.exports = {
    builder: new (require('./command-builder'))(),
    Runner: require('./runner')
};
