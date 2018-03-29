sp =
{

    namespace: function()
    {
        for (var a = 0; a < arguments.length; a++)
        {
            var parts = arguments[a].split(".");
            var ns = window;
            for (var i = 0; i < parts.length; i++)
            {
                ns = ns[parts[i]] = ns[parts[i]] || {};
            }
        }
    },

    out: function()
    {
        try
        {
            if (window.console && window.console.log) window.console.log.apply(window, arguments);
        }
        catch(e)
        {
            window.console.log(arguments[0]);
        }
    },

    stringify: function (obj, opts)
    {
        opts = opts || {
            // future list of default options
            skipObjects: false
        };

        var refs = [];
        refs.push(obj);

        var paths = [];
        paths.push('$');

        return function toString(obj, tabs, path)
        {
            var str = '';
            var indent = '';
            for (var i = 0; i < tabs; i++) indent += "\t";

            for (var prop in obj)
            {
                try
                {

                var propType = typeof(obj[prop]);
                if(prop == "__rawChildElements") continue;
                if ((opts.skipObjects && ((propType == 'object') || (propType == 'function'))) || (prop == "innerXML")) continue;

                if (!obj[prop])
                {
                    str+= "\n" + indent + prop + ": (null)";
                }
                else if ((propType == 'function') || (prop == '__super') || (prop == '__constructor'))
                {
                    str+= "\n" + indent + prop + ": (function)";
                }
                else if (propType == 'object')
                {
                    str += "\n" + indent + prop + ": ";

                    // circular reference tracking
                    var isRef = false;
                    var idxRef = 0;
                    for (var j = 0; j < refs.length; j++)
                    {
                        if (refs[j] === obj[prop])
                        {
                            isRef = true;
                            idxRef = j;
                            break;
                        }
                    }

                    if (isRef)
                    {
                        str += paths[idxRef] + '(reference)';
                    }
                    else
                    {
                        refs.push(obj[prop]);
                        paths.push(path + '::' + prop);
                        str += toString(obj[prop], tabs + 1, path);
                    }
                }
                else
                {
                    str += "\n" + indent + prop + ": " + obj[prop] + "(" + propType + ")";
                }

                }
                catch(error)
                {

                }
            }

            return str;
        } (obj, 0, '$');
    },

    listProps:function(obj,tabs)
    {
        if(!obj) return;
        var indent = '';
        for (var i = 0; i < tabs; i++) indent += "\t";
        for(var prop in obj)
        {
            sp.out(indent + prop);
            try
            {
                if(typeof(obj[prop])=="object")
                {
                    listProperties(obj[prop],tabs+1);
                }
            }
            catch(error)
            {

            }
        }
    },

    guid: function(len)
    {
        len = len || 12;
        var str = "";
        function getRand()
        {
            var r;
            while (true)
            {
                r = Math.floor(Math.random() * 123);
                if ((r >= 48 && r <= 57) || (r >= 65 && r <= 90) || (r >= 97 && r <= 122)) return r;
            }
        }
        while (len--) str += String.fromCharCode(getRand());
        return str;
    },

    safeHTML: function (html, options)
    {
        var o = {
            stripScripts: true,
            stripIFrames: true
        };
        $.extend(o, options);

        if(html && o.stripScripts){
            // Look for closed and unclosed (malformed) script attacks.
            html = html.replace(/<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>/ig, "");
            html = html.replace(/<\s*script\b([^<>]|\s)*>?/ig, "");
            html = html.replace(/<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>/ig, "");
        }

        if(html && o.stripIFrames){
            html = html.replace(/<\s*iframe[^>]*>((.|\s)*?)<\\?\/\s*iframe\s*>/ig, "");
        }

        return html;
    },

	isOnTablet: function()
	{
		if (!sp.__isOnTabletCached)
		{
			var tablets = ['Android', 'iPad', 'PlayBook'];
			for (var i = 0, tablet = tablets[i]; i < tablets.length; i++, tablet = tablets[i])
			{
				if (window.navigator.userAgent.indexOf(tablet) != -1)
				{
					sp.__isOnTabletCached = true;
					sp.__isOnTabletType = tablet;
					break;
				}
			}
		}
		return sp.__isOnTabletCached;
	},

    isOnIOSDevice: function()
    {
        if (!sp.__isOnIOSCached)
        {
            var deviceAgent = (window.navigator.userAgent).toLowerCase();
            if (deviceAgent.match(/(iphone|ipod|ipad)/))
            {
                sp.__isOnIOSCached = true;
            }
        }

        return sp.__isOnIOSCached;
    },

	getTabletType: function()
	{
		return sp.__isOnTabletType;
	}

};















/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
(function()
{
    var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b__super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function() { };

    // Create a new Class that inherits from this class
    Class.extend = function(prop)
    {
        var __super = this.prototype;
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;
        prototype.__superclass = __super;
        // Copy the properties over onto the new prototype
        for (var name in prop)
        {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
        typeof __super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn)
        {
            return function()
            {
                var tmp = this.__super;

                // Add a new .__super() method that is the same method
                // but on the super-class
                this.__super = __super[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);
                this.__super = tmp;

                return ret;
            };
        })(name, prop[name]) :
        prop[name];
        }

        // The dummy class constructor
        function Class()
        {
            // All construction is actually done in the init method
            if (!initializing && this.__constructor)
                this.__constructor.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();
