sp.namespace("sp.core.log.LogManager",
             "sp.core.log.Log",
             "sp.core.log.Level",
             "sp.core.log.LogEvent",
             "sp.core.log.Layout",
             "sp.core.log.SimpleLayout",
             "sp.core.log.Appender",
             "sp.core.log.ConsoleAppender");


sp.core.log.Log = sp.core.events.EventDispatcher.extend
(
{
    logEvents: [],
    appenders: [],

    __constructor: function(name)
    {
        this.__super();
        this.name = name;
        this.level = sp.core.log.LogManager.getDefaultLogLevel();
        this.appenders = sp.core.log.LogManager.getDefaultAppenders();
    },

    addAppender: function(appender)
    {
        this.appenders.push(appender);
    },

    removeAppender: function(appender)
    {
        for (var i = 0; i < this.appenders.length; i++)
        {
            if (this.appenders[i] == appender)
            {
                this.appenders.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    setLevel: function(level)
    {
        this.level = level;
    },

    log: function(level, message, exception)
    {
        var event;
        if (typeof (message) == 'string')
        {
            event = new sp.core.log.LogEvent(this, sp.core.log.LogEvent.LOG, this, level, message, exception);
        }
        else
        {
            event = new sp.core.log.LogEvent(this, sp.core.log.LogEvent.LOG, this, level, sp.stringify(message), exception);
        }

        for (var i = 0, len = this.appenders.length; i < len; i++)
        {
            this.appenders[i].doAppend(event);
        }
    },

    isTraceEnabled: function()
    {
        return (this.level.valueOf() <= sp.core.log.Level.TRACE.valueOf());
    },

    trace: function(message)
    {
        if (this.isTraceEnabled()) this.log(sp.core.log.Level.TRACE, message);
    },

    isDebugEnabled: function()
    {
        return (this.level.valueOf() <= sp.core.log.Level.DEBUG.valueOf());
    },

    debug: function(message)
    {
        if (this.isDebugEnabled()) this.log(sp.core.log.Level.DEBUG, message);
    },

    isInfoEnabled: function()
    {
        return (this.level.valueOf() <= sp.core.log.Level.INFO.valueOf());
    },

    info: function(message)
    {
        if (this.isInfoEnabled()) this.log(sp.core.log.Level.INFO, message);
    },

    isWarnEnabled: function()
    {
       return (this.level.valueOf() <= sp.core.log.Level.WARN.valueOf());
    },

    warn: function(message)
    {
        if (this.isWarnEnabled()) this.log(sp.core.log.Level.WARN, message);
    },

    isErrorEnabled: function()
    {
        return (this.level.valueOf() <= sp.core.log.Level.ERROR.valueOf());
    },

    error: function(message)
    {
        if (this.isErrorEnabled()) this.log(sp.core.log.Level.ERROR, message);
    },

    isFatalEnabled: function()
    {
        return (this.level.valueOf() <= sp.core.log.Level.FATAL.valueOf());
    },

    fatal: function(message)
    {
        if (this.isFatalEnabled()) this.log(sp.core.log.Level.FATAL, message);
    }

}
);

sp.core.log.Level = Class.extend
(
{
    __constructor: function(level, name)
    {
        this.level = level;
        this.name = name;
    },

    valueOf: function()
    {
        return this.level;
    },

    toString: function()
    {
        return this.name;
    }
}
);
sp.core.log.Level.ALL_INT = Number.MIN_VALUE;
sp.core.log.Level.TRACE_INT = 1000;
sp.core.log.Level.DEBUG_INT = 2000;
sp.core.log.Level.INFO_INT = 3000;
sp.core.log.Level.WARN_INT = 4000;
sp.core.log.Level.ERROR_INT = 5000;
sp.core.log.Level.FATAL_INT = 6000;
sp.core.log.Level.OFF_INT = Number.MAX_VALUE;
sp.core.log.Level.ALL = new sp.core.log.Level(sp.core.log.Level.ALL_INT, 'ALL');
sp.core.log.Level.TRACE = new sp.core.log.Level(sp.core.log.Level.TRACE_INT, 'TRACE');
sp.core.log.Level.DEBUG = new sp.core.log.Level(sp.core.log.Level.DEBUG_INT, 'DEBUG');
sp.core.log.Level.INFO = new sp.core.log.Level(sp.core.log.Level.INFO_INT, 'INFO');
sp.core.log.Level.WARN = new sp.core.log.Level(sp.core.log.Level.WARN_INT, 'WARN');
sp.core.log.Level.ERROR = new sp.core.log.Level(sp.core.log.Level.ERROR_INT, 'ERROR');
sp.core.log.Level.FATAL = new sp.core.log.Level(sp.core.log.Level.FATAL_INT, 'FATAL');
sp.core.log.Level.OFF = new sp.core.log.Level(sp.core.log.Level.OFF_INT, 'OFF');


sp.core.log.LogEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, logger, level, message, exception)
    {
        this.__super(target, type);
        this.logger = logger;
        this.level = level;
        this.message = message;
        this.exception = exception;
    }
}
);
sp.core.log.LogEvent.LOG = "log";


sp.core.log.Appender = Class.extend
(
{
    doAppend: function()
    {
        // override
    },

    setLayout: function(layout)
    {
        this.layout = layout;
    },

    getLayout: function()
    {
        return this.layout;
    }
}
);


sp.core.log.Layout = Class.extend
(
{
    LINE_SEP: "\n",

    format: function(logEvent)
    {
        return '';
    },

    getContentType: function()
    {
        return 'text/plain';
    },

    getHeader: function()
    {
        return '';
    },

    getFooter: function()
    {
        return '';
    }
}
);


sp.core.log.SimpleLayout = sp.core.log.Layout.extend
(
{
    format: function(logEvent)
    {
        var loggerName = logEvent.logger.name + ' :: ';
        if (logEvent.logger.name === sp.core.log.LogManager.getDefaultLogName()) loggerName = '';
        return '[' + logEvent.level.toString() + '] ' + loggerName + logEvent.message;
    }
}
);


sp.core.log.ConsoleAppender = sp.core.log.Appender.extend
(
{
    layout: new sp.core.log.SimpleLayout(),
    doAppend: function(logEvent)
    {
        if (window.console && window.console.log && logEvent)
        {
            window.console.log(this.getLayout().format(logEvent));
        }
    }
}
);


sp.core.log.LogManager =
{
    loggers: {},

    DEFAULT_LOGGER_NAME: '__default',
    DEFAULT_LOGGER_LEVEL: sp.core.log.Level.ALL,
    DEFAULT_APPENDERS: [new sp.core.log.ConsoleAppender],

    getLog: function(name)
    {
        var loggerName = name || sp.core.log.LogManager.DEFAULT_LOGGER_NAME;
        if (!sp.core.log.LogManager.loggers[loggerName]) sp.core.log.LogManager.loggers[loggerName] = new sp.core.log.Log(loggerName);

        return sp.core.log.LogManager.loggers[loggerName];
    },

    getDefaultLogName: function()
    {
        return this.DEFAULT_LOGGER_NAME;
    },

    setDefaultLogLevel: function(defaultLogLevel)
    {
        this.DEFAULT_LOGGER_LEVEL = defaultLogLevel;
    },

    getDefaultLogLevel: function()
    {
        return this.DEFAULT_LOGGER_LEVEL;
    },

    addDefaultAppender: function(appender)
    {
        this.DEFAULT_APPENDERS.push(appender);
    },

    removeDefaultAppender: function(appender)
    {
        for (var i = 0; i < this.DEFAULT_APPENDERS.length; i++)
        {
            if (this.DEFAULT_APPENDERS[i] == appender)
            {
                this.DEFAULT_APPENDERS.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    getDefaultAppenders: function()
    {
        return this.DEFAULT_APPENDERS;
    }
};