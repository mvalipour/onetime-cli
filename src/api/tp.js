var btoa = require('btoa');
var extend = require('extend');
var request = require('request-promise-json').request;

var TargetProcess = (function() {
  function TargetProcess(opts) {
    this.subdomain = opts.domain;
    this.auth_string = btoa(opts.email + ':' + opts.password);
    this.full_url = "https://" + this.subdomain + ".tpondemand.com/api/v1";
    this.ajax_defaults = {
      type: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': "Basic " + this.auth_string,
        'Accept': 'application/json'
      }
    };
  }

  TargetProcess.prototype.build_ajax_options = function(uri, opts) {
    if (!opts) {
      opts = {};
    }
    return extend({ url: uri }, this.ajax_defaults, opts);
  };

  TargetProcess.prototype.getProjects = function(ajax_opts) {
    var projects_url;
    if (!ajax_opts) {
      ajax_opts = {};
    }
    projects_url = this.full_url + '/Projects';
    ajax_opts = this.build_ajax_options(projects_url, ajax_opts);
    return request(ajax_opts);
  };

  TargetProcess.prototype.getStories = function(projectId, ajax_opts) {
    var stories_url;
    if (!ajax_opts) {
      ajax_opts = {};
    }
    stories_url = this.full_url + '/Projects/' + projectId + '/Userstories';
    ajax_opts = this.build_ajax_options(stories_url, ajax_opts);
    return request(ajax_opts);
  };

  TargetProcess.prototype.getTasks = function(storyId, ajax_opts) {
    var tasks_url;
    if (!ajax_opts) {
      ajax_opts = {};
    }
    tasks_url = this.full_url + '/Userstories/' + storyId + '/Tasks';
    ajax_opts = this.build_ajax_options(tasks_url, ajax_opts);
    return request(ajax_opts);
  };

  TargetProcess.prototype.getTask = function(taskId, ajax_opts) {
    var url = this.full_url + '/Tasks/' + taskId;
    ajax_opts = this.build_ajax_options(url, ajax_opts);
    return request(ajax_opts);
  };

  TargetProcess.prototype.addTime = function(taskId, opts, ajax_opts) {
    var time_entry, time_struct, time_url;
    if (!ajax_opts) {
      ajax_opts = {};
    }
    opts = opts || {};
    if (!opts.spent) {
      return;
    }
    time_url = this.full_url + '/Times/';
    time_entry = {
      Description: opts.description,
      Spent: opts.spent,
      Remain: opts.remain,
      Date: opts.date,
      Assignable: {
        Id: taskId
      }
    };
    time_struct = {
      method: 'POST',
      json: time_entry
    };
    ajax_opts = this.build_ajax_options(time_url, time_struct);
    return request(ajax_opts);
  };

  return TargetProcess;

})();

module.exports = function () {
    var config = require('../config');
    var settings = config.readDomain('tp', ['domain', 'email', 'password']);
    return settings ? new TargetProcess(settings) : null;
};
