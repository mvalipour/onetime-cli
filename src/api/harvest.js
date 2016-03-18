module.exports = function () {
    var config = require('../config');
    var cache = require('../cache');
    var Harvest = require('harvest');
    var entities = require('entities');

    var settings = config.readDomain('harvest', true);

    var result = new Harvest({
        subdomain: settings.domain,
        email: settings.email,
        password: settings.password
    });

    var prefixes = {
        userStoryPrefix: '> user_story #',
        taskPrefix: '> task #',
        bugPrefix: '> bug #',
        finishedPrefix: '> finished'
    };
    result.prefixes = prefixes;

    function extractId(l, prefix) {
        if(l.indexOf(prefix) === 0) {
            var p = l.substring(prefix.length).split(' ');
            var id = +p[0];
            var rest = p.slice(1).join(' ');
            return { id: id, name: rest };
        }
    }

    function processResult(client, cb) {
        return function () {
            Array.prototype.slice.call(arguments).forEach(function (arg) {
                if(!!arg && !!arg.day_entries) {
                    arg.day_entries.forEach(function (e) {
                        if(!e.notes) return;

                        var parts = [];
                        var tp_user_story_id, tp_task_id;
                        e.notes.match(/[^\r\n]+/g).forEach(function (l) {
                            l = entities.decodeHTML(l);
                            var us = extractId(l, prefixes.userStoryPrefix);
                            var task = extractId(l, prefixes.taskPrefix);
                            var bug = extractId(l, prefixes.bugPrefix);
                            var finished = l.trim() === prefixes.finishedPrefix;

                            if(us) e.tp_user_story = us;
                            else if(task) { e.tp_task = task; e.tp_task.type = 'task'; }
                            else if(bug) { e.tp_task = bug; e.tp_task.type = 'bug'; }
                            else if(finished) e.finished = true;
                            else parts.push(l);
                        });

                        e.full_notes = e.notes;
                        e.notes = parts.join(' ');
                        e.running = !!e.timer_started_at;
                    });
                }
            });

            cb.apply(client, arguments);
        };
    }

    var baseClient = result.TimeTracking.client;
    result.TimeTracking.client = newClient = {};
    ['get', 'patch', 'post', 'put', 'delete'].forEach(function (m) {
        newClient[m] = function (url, data, cb) {
            baseClient[m].call(result, url, data, processResult(result, cb));
        };
    });

    result.getProjects = cache.apply(function (cb) {
      result.TimeTracking.daily({}, function (err, res) {
        if(err) return cb(err);
        return cb(null, res.projects);
      });
    }, 'harvest_TimeTracking_getProjects');

    return result;
};
