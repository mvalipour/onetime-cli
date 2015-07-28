var Command = require('./command');

function CommandBuilder() {
    this.commandStore = {};
}

CommandBuilder.prototype._get = function (path) {
    return this.commandStore[path];
};

CommandBuilder.prototype._set = function (command) {

    this.commandStore[command.path] = command;

    if(command.parentPath) {
        var parent = this.node(command.parentPath);
        parent.commands.push(command);
    }

    return command;
};

CommandBuilder.prototype.node = function (path, config) {
    if(typeof config === 'function'){
        config = { controller: config };
    }

    return (this._get(path) || this._set(new Command(path))).configure(config);
};

module.exports = CommandBuilder;
