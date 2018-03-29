ErrorDialogAppender = Logger.Appender.extend
(
{
    doAppend: function (loggingEvent) {
        if (loggingEvent.type === ErrorDialogLoggingEvent.ERROR_DIALOG_TYPE)
        {
            var options = loggingEvent.options || new ErrorOptions();
            var dialog = new ErrorDialog(new ErrorDialogOptions({ message: loggingEvent.message, error: loggingEvent.error }));
            dialog.open();
            if (options.callback) dialog.addEventListener(this, DialogEvent.CLOSE, options.callback);
        }
    }
}
);
LogManager.getLogger().addAppender(new ErrorDialogAppender());

ErrorDialogLoggingEvent = Logger.LoggingEvent.extend
(
{
    ERROR_DIALOG_TYPE: 'ERROR_DIALOG',

    __constructor: function(message, error, options)
    {
        this.__super(ErrorDialogLoggingEvent.ERROR_DIALOG_TYPE, Log, Logger.Level.ERROR, message, null);
        this.options = options;
        this.error = error;
    }
}
);

ErrorLog =
{
    error: function(err1, err2, options)
    {
        LogManager.getLogger().error(new ErrorDialogLoggingEvent(err1, err2, options));
    }
};

ErrorOptions = ValueObject.extend
(
{
    __constructor:function(valueMap)
    {
        this.__super(valueMap);
    },
    
    setDefaults:function()
    {
        this.code = 0;
        this.callback = null;
    }
}
);
