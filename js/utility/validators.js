namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.validate = (function () {
    'use strict';

    function validatePhoneNumber(str) {
        /**
             * Valid Formats:
                (123)456-7890
                (123) 456-7890
                123-456-7890
                123.456.7890
                1234567890
                +31636363634 (not working)
                075-63546725 (not working)
            */
        //var exp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        var exp = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        return exp.test(str);
    }

    var _validators = {
        phoneNumber: validatePhoneNumber
    };

    function validate(key, val) {
        return _validators[key](val);
    }

    return validate;
})();

module.exports = validators;