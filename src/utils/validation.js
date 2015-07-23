var validator = require('validator');

function formatTime(time) {
    var result = false, m;
    var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
    if ((m = time.match(re))) {
        result = (m[1].length == 2 ? "" : "0") + m[1] + ":" + m[2];
    }
    return result;
}

function convertTime(i) {
    if(!i) return false;
    if(validator.isFloat(i)) return +i;

    if(i[0] === ':') i = '0' + i;
    if(!formatTime(i)) return false;

    var hoursMinutes = i.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return (hours + minutes / 60).toFixed(2);
}

function required(i) {
    return !!i;
}

function email(required) {
    return function (i) {
        if(!i && !required) return true;
        return validator.isEmail(i) ? true : 'Please enter a valid email address.';
    };
}

function number(required, done) {
    return function (i) {
        if(!i && !required) return true;
        if(!validator.isInt(i)) return 'Please enter a valid number.';
        return done ? done.call(this, i) : true;
    };
}

function float(required) {
    return function (i) {
        if(!i && !required) return true;
        return validator.isFloat(i) ? true : 'Please enter a valid floating-point number.';
    };
}

function time(required) {
    return function (i) {
        if(!i && !required) return true;
        var t = convertTime(i);
        return (t || t === 0) ? true : 'Please enter a valid time (00:00 or 0.00 format).';
    };
}

function identifier(required) {
    return function (i) {
        if(!i && !required) return true;
        var res = /^[a-zA-Z][a-zA-Z0-9]*$/.test(i);
        if(!res) return 'Please enter a valid identifier.';
        return true;
    };
}

module.exports = {
    required: required,
    email: email,
    number: number,
    float: float,
    time: time,
    convertTime: convertTime,
    identifier: identifier
};
