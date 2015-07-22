var CommandStore = require('./command-store');
var commandStore = new CommandStore();

function Command(name, parentPath) {
    this.parentPath = parentPath;
    this.name = name;
    this.path = (parentPath ? parentPath + '.' : '') + name;
    this.help = {};
    this.commands = [];
    this.terminal = false;
    this.action = false;
}

Command.prototype.asTerminal = function () {
    this.terminal = true;
    return this;
};

Command.prototype.withCommands = function (names) {
    this.commands = names.map(function (n) {
        return commandStore.getOrCreate(n, this.path);
    });

    return this;
};

Command.prototype._getChild = function (name) {
    return this.command.filter(function (c) {
        return c.name === name;
    })[0];
};

Command.prototype.withHelp = function (options) {
    this.help = options;
    return this;
};

Command.prototype.whenAction = function (action) {
    this.action = action;
    return this;
};

module.exports = Command;
