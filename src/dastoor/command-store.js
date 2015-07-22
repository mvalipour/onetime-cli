function CommandStore() {
    this.commandStore = {};
}

CommandStore.prototype.get = function (name) {
    return this.commandStore[name];
};

CommandStore.prototype.set = function (command) {
    this.commandStore[command.name] = command;
    return command;
};

CommandStore.prototype.getOrCreate = function (name, path) {
    return this.get(path + '.' + name) ||
           this.store(new Command(name, path));
};

module.exports = CommandStore;
