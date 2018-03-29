// core springs functions
sp =
{
    namespace: function()
    {
        //given one or more string definitions of namespace paths (eg 'sp.core.events'), build the path if it doesn't exist
        var ns,parts;
        for (var a = 0; a < arguments.length; a++)
        {
            ns = window;
            parts = arguments[a].split(".");
            for (var i = 0; i < parts.length; i++) ns = ns[parts[i]] = ns[parts[i]] || {};
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
            window.console.log(new  Date().getMilliseconds() + " : " + arguments[0]);
        }
    },

    guid:function(len)
    {
        len = Math.round(Math.max(0,len || 12));
        var guid = "";
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY1234567890";
        while(len--) guid += chars.substr(Math.floor(Math.random()*chars.length),1);
        return guid;
    }
};










/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype


// (With a few minor alterations for springs framework...__super instead of parent etc...)
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
