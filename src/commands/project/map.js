function controllers(args) {
    var utils = require('../../utils');
    var inquirer = require('inquirer');
    var data = require('../../data');
    var store = require('../../data/map');

    function addController() {
        data.getTPProjects(function (tpprojects) {
            data.getHarvestProjects(function (err, hprojects) {
                if(err) return utils.log(err);
                var qq = [{
                    type: 'list',
                    name: 'harvest',
                    choices: hprojects.map(function (p) { return { name: p.name, value: p.id }; }),
                    message: 'Harvest project:'
                }];
                inquirer.prompt(qq, function (hres) {
                    var hselected = hprojects.findBy('id', hres.harvest);

                    qq = [{
                        type: 'list',
                        name: 'tp',
                        choices: tpprojects.map(function (p) { return { name: p.name, value: p.id }; }),
                        message: 'Target-process project:'
                    }];
                    inquirer.prompt(qq, function (hres) {
                        var tpselected = tpprojects.findBy('id', hres.tp);
                        store.add(tpselected.id, {
                            harvest: hselected,
                            tp: tpselected
                        });
                        utils.log.succ('The mapping is created');
                    });
                });
            });
        });
    }

    function listController() {
        store.list(function (err, list) {
            if(err) return utils.log.err(err);
            var d = [];
            for(var k in list) d.push({
                harvest: list[k].harvest.name,
                'target process': list[k].tp.name
            });
            utils.log();
            if(d.length) console.table(d);
            else utils.log('no mappings added yet');
        });
    }

    function removeController() {
        store.list(function (err, list) {
            if(err) return utils.log.err(err);
            var d = [];
            for(var k in list) d.push({
                value: k,
                name: list[k].tp.name + ' --> ' + list[k].harvest.name
            });
            var q = {
                type: 'list',
                name: 'item',
                choices: d,
                message: 'Mapping:'
            };
            inquirer.prompt([q], function (res) {
                store.remove(res.item, function (err) {
                    if(err) return utils.log.err(err);
                    utils.log.succ('Mapping removed successfully.');
                });
            });
        });
    }

    return {
        add: addController,
        list: listController,
        remove: removeController
    };
}

var cli = require('dastoor').builder;

cli.node('onetime.project.map', {
    controller: controllers.rebind('add'),
    help: 'map harvest and target-process projects'
});

cli.node('onetime.project.map.list', {
    terminal: true,
    controller: controllers.rebind('list'),
    help: 'list harvest and target-process mappings'
});

cli.node('onetime.project.map.remove', {
    terminal: true,
    controller: controllers.rebind('remove'),
    help: 'remove harvest and target-process mappings'
});
