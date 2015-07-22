var expect = require("chai").expect;
var validator = require('../../src/utils/validation');

describe('method: time()', function () {
    function fail(method, input) {
        it('should fail for `' + input + '`', function () {
            expect(method(input)).to.equal('Please enter a valid time (00:00 or 0.00 format).');
        });
    }

    function pass(method, input) {
        it('should pass for `' + input + '`', function () {
            expect(method(input)).to.equal(true);
        });
    }

    describe('optional', function () {
        var m = validator.time();

        pass(m, null);
        pass(m, undefined);
        pass(m, '');
        pass(m, ':10');
        pass(m, '1:10');
        pass(m, '23:00');
        pass(m, '23:59');

        fail(m, ' ');
        fail(m, 'a');
        fail(m, 'a:1');
        fail(m, ':1');
        fail(m, '1:1');
        fail(m, '111:1');
        fail(m, '1:60');
        fail(m, '24:00');
        fail(m, '25:00');
    });

    describe('required', function () {
        var m = validator.time(true);

        fail(m, null);
        fail(m, undefined);
        fail(m, '');
    });

});

describe('method: convertTime()', function () {
    var m = validator.convertTime;

    function row(input, expected) {
        it('should return `'+expected+'` for `' + input + '`', function () {
            expect(m(input)).to.equal(expected);
        });
    }

    row(null, false);
    row(undefined, false);
    row('', false);
    row('a', false);
    row(':1', false);
    row('24:00', false);

    row(':20', 0.33.toFixed(2));
    row('1:10', 1.17.toFixed(2));
    row('23:30', 23.5.toFixed(2));
    row('23:45', 23.75.toFixed(2));

});
