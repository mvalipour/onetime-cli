var validator = require('validator');

module.exports = {
    required: function (i) {
        return !!i;
    },

    email: function(required) {
        return function (i) {
            if(!i && !required) return true;
            return validator.isEmail(i) ? true : 'Please enter a valid number.';
        };
    },

    number: function(required, done) {
        return function (i) {
            if(!i && !required) return true;
            if(!validator.isInt(i)) return 'Please enter a valid email address.';
            return done ? done.call(this, i) : true;
        };
    },

    float: function(required) {
        return function (i) {
            if(!i && !required) return true;
            return validator.isFloat(i) ? true : 'Please enter a valid floating-point number.';
        };
    },

    identifier: function (required) {
        return function (i) {
            if(!i && !required) return true;
            var res = /^[a-zA-Z][a-zA-Z0-9]*$/.test(i);
            if(!res) return 'Please enter a valid identifier.';
            return true;
        };
    }
};
