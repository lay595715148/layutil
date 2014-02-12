var Utilities = require('util');

module.exports = exports = Utilities;

/**
 * 
 * @param target
 *            {Object}
 * @returns {Object}
 * @api public
 */
Utilities.extend = global.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function(source) {
        for( var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};
Utilities.clone = global.clone = function(target) {
    return Utilities.extend({}, target);
};
/**
 * convert to json format
 * @api public
 */
Utilities.json = global.json = function(target) {
    var obj;
    if(Utilities.isArray(target)) {
        obj = [];
        target.forEach(function(item, index, arr) {
            if(Utilities.isObject(item) || Utilities.isArray(item)) {
                obj[index] = Utilities.json(item);
            } else if(!Utilities.isFunction(item)) {
                obj[index] = item;
            }
        });
    } else if(Utilities.isObject(target)) {
        obj = {};
        for(var p in target) {
            var item = target[p];
            if(Utilities.isObject(item) || Utilities.isArray(item)) {
                obj[p] = Utilities.json(item);
            } else if(!Utilities.isFunction(item)) {
                obj[p] = item;
            }
        }
    } else if(Utilities.isFunction(target)) {
        obj = {};
    } else if(Utilities.isNull(target) || Utilities.isUndefined(target)) {
        obj = {};
    } else {
        obj = target;
    }
    return obj;
};
/**
 * string convert to json
 * @param {String}
 */
Utilities.toJson = global.toJson = function(str) {
    var json = {};
    
    if(!Utilities.isString(str))
        return json;
    
    try {
        json = JSON.parse(str);
    } catch(err) {
        try {
            json = (new Function("return " + str))();
        } catch(err) {
            //
        }
    }
    return json;
};
/**
 * @api public
 */
Utilities.toString = global.toString = function(json) {
    var str = '';
    
    if(Utilities.isNull(json) || Utilities.isUndefined(json) || Utilities.isError(json))
        return str;
    
    try {
        str = JSON.stringify(json);
    } catch(err) {
        //
    }
    return str;
};
/**
 * @api public
 */
Utilities.toArray = global.toArray = function (enu) {
    var arr = [];

    for (var i = 0, l = enu.length; i < l; i++)
      arr.push(enu[i]);

    return arr;
};

/**
 * Unpacks a buffer to a number.
 *
 * @api public
 */
Utilities.unpack = global.unpack = function (buffer) {
    var n = 0;
    for (var i = 0; i < buffer.length; ++i) {
      n = (i == 0) ? buffer[i] : (n * 256) + buffer[i];
    }
    return n;
};

/**
 * Left pads a string.
 *
 * @api public
 */
Utilities.padl = global.padl = function (s,n,c) { 
    return new Array(1 + n - s.length).join(c) + s;
};

global.isArray = Utilities.isArray;
global.isRegExp = Utilities.isRegExp;
global.isDate = Utilities.isDate;
global.isError = Utilities.isError;

/**
 * @api public
 */
Utilities.isString = global.isString = function(str) {
    return 'string' === typeof str ? true : false;
};
/**
 * @api public
 */
Utilities.isNumber = global.isNumber = function(num) {
    return 'number' === typeof num ? true : false;
};
/**
 * @api public
 */
Utilities.isBoolean = global.isBoolean = function(bool) {
    return 'boolean' === typeof bool ? true : false;
};
/**
 * @api public
 */
Utilities.isObject = global.isObject = function(obj) {
    return 'object' === typeof obj ? true : false;
};
/**
 * @api public
 */
Utilities.isPureObject = global.isPureObject = function(o) {
    return o !== undefined && o !== null && !Utilities.isFunction(o) && !Utilities.isString(o)
            && !Utilities.isNumber(o) && !Utilities.isBoolean(o) && !Utilities.isArray(o) && !Utilities.isDate(o)
            && !Utilities.isRegExp(o) && !Utilities.isError(o);
};
/**
 * @api public
 */
Utilities.isA = global.isA = function(o, O) {
    return Utilities.isFunction(O) && o instanceof O ? true : false;
};
/**
 * @api public
 */
Utilities.isDefined = global.isDefined = function(o) {
    return 'undefined' !== typeof o ? true : false;
};
/**
 * @api public
 */
Utilities.isUndefined = global.isUndefined = function(o) {
    return 'undefined' === typeof o ? true : false;
};
/**
 * @api public
 */
Utilities.isInteger = global.isInteger = function(int) {

};
/**
 * @api public
 */
Utilities.isFloat = global.isFloat = function(float) {

};
/**
 * @api public
 */
Utilities.isBinary = global.isBinary = function(bin) {

};
/**
 * @api public
 */
Utilities.isFunction = global.isFunction = function(f) {
    return 'function' === typeof f ? true : false;
};
/**
 * @api public
 */
Utilities.isNull = global.isNull = function(n) {
    return n === null ? true : false;
};
/**
 * @api public
 */
Utilities.isEmpty = global.isEmpty = function(o) {
    if(o === undefined || o === null)
        return true;
    if(Utilities.isArray(o) && o.length === 0)
        return true;
    if(Utilities.isString(o) && o.length === 0)
        return true;
    if(Utilities.isPureObject(o) && Object.keys(o).length === 0)
        return true;
    return false;
};
