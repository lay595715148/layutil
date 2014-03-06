var Utilities = require('util');

module.exports = exports = global.$util = global.$util || Utilities;

/**
 * 
 * @param {Function}
 *            constructor
 * @param {Array}
 *            args
 * @returns {Object}
 */
Utilities.construct = global.construct = function(constructor, args) {
    args = Utilities.isArray(args) ? args : [];
    function fn() {
        return constructor.apply(this, args);
    }
    fn.prototype = constructor.prototype;
    return new fn();
};
/**
 * 
 * @param target
 *            {Object}
 * @returns {Object}
 * @api public
 */
Utilities.extend = global.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    target = Utilities.isObject(target) ? target || {} : {};
    sources.forEach(function(source) {
        //新方法参考merge-descriptors(https://www.npmjs.org/package/merge-descriptors,https://github.com/component/merge-descriptors)
        if(Utilities.isObject(source) && !Utilities.isEmpty(source)) {
            Object.getOwnPropertyNames(source).forEach(function (name) {
                var descriptor = Object.getOwnPropertyDescriptor(source, name);
                Object.defineProperty(target, name, descriptor);
            });
        }
        //下面是旧的方法，保留参考
        /*
        if(Utilities.isObject(source) && !Utilities.isEmpty(source)) {
            for( var prop in source) {
                //增加setter和getter条件
                var g = source.__lookupGetter__(prop), s = source.__lookupSetter__(prop);
                if(g || s) {
                    if(g)
                        target.__defineGetter__(prop, g);
                    if(s)
                        target.__defineSetter__(prop, s);
                } else {
                    target[prop] = source[prop];
                }
            }
        }*/
    });
    return target;
};
Utilities.merge = global.merge = function(target) {
    return Utilities.extend.apply(null, arguments);
};
Utilities.clone = global.clone = function(target) {
    return Utilities.extend({}, target);
};
/**
 * convert to json format
 * 
 * @api public
 */
Utilities.json = global.json = function(target, hasFun) {
    var obj;
    if(Utilities.isArray(target)) {
        obj = [];
        target.forEach(function(item, index, arr) {
            if(Utilities.isArray(item) || Utilities.isObject(item)) {
                obj[index] = Utilities.json(item, hasFun);
            } else if(Utilities.isFunction(item) && hasFun !== true) {
                //obj[index] = item;
            } else {
                obj[index] = item;
            }
        });
    } else if(Utilities.isObject(target) && !Utilities.isNull(target)) {
        obj = {};
        for( var p in target) {
            var item = target[p];
            if(Utilities.isObject(item) || Utilities.isArray(item)) {
                obj[p] = Utilities.json(item, hasFun);
            } else if(Utilities.isFunction(item) && hasFun !== true) {
                //obj[p] = item;
            } else {
                obj[p] = item;
            }
        }
    } else if(Utilities.isFunction(target) && hasFun !== true) {
        obj = undefined;
    } else {
        obj = target;
    }
    return obj;
};
/**
 * string convert to json
 * 
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
            $logger.error(err);
        }
    }
    return json;
};
/**
 * json convert to xml string
 * 
 * @param {String}
 */
Utilities.toXml = global.toXml = function(json) {
    var strXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    var regulStr = function(str) {
        if(str == "")
            return "";
        var s = str;
        var spacial = ["<", ">", "\"", "'", "&"];
        var forma = ["&lt;", "&gt;", "&quot;", "&apos;", "&amp;"];
        for(var i = 0; i < spacial.length; i++) {
            s = s.replace(new RegExp(spacial[i], "g"), forma[i]);
        }
        return s;
    };
    var appendText = function(str, s) {
        s = regulStr(s);
        return s == "" ? str : str + s + "\n";
    };
    var appendFlagBegin = function(str, s) {
        return str + "<" + s + ">\n";
    };
    var appendFlagEnd = function(str, s) {
        return str + "</" + s + ">\n";
    };

    if(arguments.length == 2) {
        strXml = arguments[1];
    }

    if(Utilities.isArray(json)) {
        json.forEach(function(item) {
            strXml = appendFlagBegin(strXml, 'item');
            strXml = Utilities.toXml(item, strXml);
            strXml = appendFlagEnd(strXml, 'item');
        });
    } else if(Utilities.isObject(json)) {
        for( var tag in json) {
            strXml = appendFlagBegin(strXml, tag);
            strXml = Utilities.toXml(json[tag], strXml);
            strXml = appendFlagEnd(strXml, tag);
        }
    } else if(Utilities.isString(json)) {
        strXml = appendText(strXml, json);
    } else {
        strXml = appendText(strXml, Utilities.toString(json));
    }

    return strXml;
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
        $logger.error(err);
    }
    return str;
};
Utilities.getClass = global.getClass = function(obj) {
    if($util.isObject(obj) && !$util.isNull(obj)) {
        return obj.constructor ? obj.constructor.name : 'Object';
    } else {
        return false;
    }
};
Utilities.time = global.time = function() {
    return Math.floor(new Date().getTime()/1000);
};
/**
 * @api public
 */
Utilities.toArray = global.toArray = function(enu) {
    var arr = [];

    for(var i = 0, l = enu.length; i < l; i++)
        arr.push(enu[i]);

    return arr;
};
Utilities.unique = global.unique = function(arr, equal) {
    equal = Utilities.isBoolean(equal)?equal:true;
    for(var i = 0; i < arr.length;) {
        var a = arr.splice(i, 1);
        if(!Utilities.inArray(a[0], arr)) {
            arr.splice(i, 0, a[0]);
            i++;
        }
    }
    return arr;
};
Utilities.inArray = global.inArray = function(k, arr, equal) {
    equal = Utilities.isBoolean(equal)?equal:true;
    return (function check(i) {
        if (i >= arr.length)
            return false;
        if (equal === true && arr[i] === k)
            return true;
        if (equal === false && arr[i] == k)
            return true;
        return check(i+1);
    }(0));
};
/**
 * number sort
 */
Utilities.nsort = global.nsort = function(arr, asc) {
    asc = Utilities.isBoolean(asc) ? asc : true;
    arr.sort(function(x, y) {
        return asc?parseFloat(x)-parseFloat(y):parseFloat(y)-parseFloat(x);
    });
    return arr;
};

/**
 * Unpacks a buffer to a number.
 * 
 * @api public
 */
Utilities.unpack = global.unpack = function(buffer) {
    var n = 0;
    for(var i = 0; i < buffer.length; ++i) {
        n = (i == 0) ? buffer[i] : (n * 256) + buffer[i];
    }
    return n;
};

/**
 * Left pads a string.
 * 
 * @api public
 */
Utilities.padl = global.padl = function(s, n, c) {
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
Utilities.isInteger = global.isInteger = function(n) {
    return 'number' === typeof n && n % 1 === 0 ? true : false;
};
/**
 * @api public
 */
Utilities.isFloat = global.isFloat = function(n) {
    return 'number' === typeof n && n !== parseInt(n, 10) && !isNaN(n) ? true : false;
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
