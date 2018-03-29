sp.namespace("sp.core.date.DateFormat",
             "sp.core.date.Date",
             "sp.core.date.DateField",
             "sp.core.date.TimeFormat",
             "sp.core.date.TimeFormatter",
             "sp.core.date.TimeField",
             "sp.core.date.TimeDialog");


sp.core.date.DateFormat = sp.core.data.ValueObject.extend
    (
        {
            __constructor: function (valueMap)
            {
                this.__super(valueMap);
            },

            setDefaults: function ()
            {
                this.order = "mdy";
                this.separator = "/";
                this.longFormat = ["D", ", ", "M", " ", "dS", " ", "yyyy"];
                this.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                this.longMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                this.shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                this.longDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                this.dayAbbreviations = ["S", "M", "T", "W", "T", "F", "S"];
                this.am = "am";
                this.pm = "pm";
                this.daySuffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];
            },

            getShortFormat: function ()
            {
                return [this.order[0], this.separator, this.order[1], this.separator, this.order[2]];
            },

            getMonthName: function (val)
            {
                return this.longMonthNames[val];
            },

            getShortMonthName: function (val)
            {
                return this.shortMonthNames[val];
            },

            getDayName: function (val)
            {
                return this.longDayNames[val];
            },

            getShortDayName: function (val)
            {
                return this.shortDayNames[val];
            },

            getDayLetter: function (val)
            {
                return this.dayAbbreviations[val];
            },

            getDateSuffix: function (val)
            {
                return this.daySuffixes[val];
            }

        }
    );

sp.core.date.Date = Class.extend
    (
        {
            __constructor: function (date, format)
            {
                this.format = format || new sp.core.date.DateFormat();
                this.setDate(date || new Date());
            },

            setDate: function (d)
            {
                if (d instanceof sp.core.date.Date)
                {
                    this.date = d.getDate();
                }
                else if (!isNaN(Number(d)))
                {
                    this.date = sp.core.date.Date.numToDate(Number(d));
                }
                else if (d && d.toLowerCase != undefined)
                {
                    this.date = sp.core.date.Date.stringToDate(d);
                }
                else if (d && d.getMilliseconds != undefined)
                {
                    this.date = d;
                }
                else
                {
                    this.date = new Date();
                }
                if (!sp.core.date.Date.isValidDate(this.date))
                {
                    this.date = new Date();
                }
            },

            getDate: function ()
            {
                return this.date;
            },

            setFormat: function (format)
            {
                this.format = format;
                return this;
            },

            getFormat: function ()
            {
                return this.format;
            },

            setText: function (str)
            {
                this.date = sp.core.date.Date.stringToDate(str);
                return this;
            },

            getText: function ()
            {
                return sp.core.date.Date.dateToString(this.date);
            },

            setDateTimeString: function (str)
            {
                var parts = str.split(" ");
                try
                {
                    var dateParts = parts[0].split("-");
                    if (dateParts.length != 3) return;
                    this.date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    var timeParts = parts[1].split(":");
                    this.date.setHours(timeParts[0]);
                    this.date.setMinutes(timeParts[1]);
                    var sParts = timeParts[2].split(".");
                    this.date.setSeconds(sParts[0]);
                    this.date.setMilliseconds(sParts[1]);
                }
                catch (e)
                {

                }
                return this;
            },

            getDateTimeString: function ()
            {
                return this.getFullYear() + "-" + this.addLeading(this.getMonth()) + "-" + this.addLeading(this.getDayOfMonth()) + " " + this.addLeading(this.getHours()) + ":" + this.addLeading(this.getMinutes()) + ":" + this.addLeading(this.getSeconds()) + "." + this.getMilliseconds();
            },

            toFormattedString: function (f)
            {
                if (f == null) f = this.format.getShortFormat();
                var str = "";
                var sep = false;
                for (var i = 0; i < f.length; i++)
                {
                    str += (sep) ? f[i] : this.getDatePart(f[i]);
                    sep = !sep;
                }
                return str;
            },

            toLongString: function ()
            {
                return this.toFormattedString(this.format.longFormat);
            },

            getFullYear: function ()
            {
                return this.date.getFullYear();
            },

            getYear: function ()
            {
                return String(this.date.getFullYear()).substr(-2);
            },

            getMonth: function ()
            {
                return this.date.getMonth() + 1;
            },

            getFullMonth: function ()
            {
                return this.addLeading(this.date.getMonth() + 1, 2)
            },

            getRawMonth: function ()
            {
                return this.date.getMonth();
            },

            getMonthName: function ()
            {
                return this.format.getMonthName(this.date.getMonth());
            },

            getShortMonthName: function ()
            {
                return this.format.getShortMonthName(this.date.getMonth());
            },

            getDayOfMonth: function ()
            {
                return this.date.getDate();
            },

            getFullDayOfMonth: function ()
            {
                return this.addLeading(this.date.getDate(), 2);
            },

            getDay: function ()
            {
                return this.date.getDay();
            },

            getDayName: function ()
            {
                return this.format.getDayName(this.date.getDay());
            },

            getShortDayName: function ()
            {
                return this.format.getShortDayName(this.date.getDay());
            },

            getDayLetter: function ()
            {
                return this.format.getDayLetter(this.date.getDay());
            },

            getDateWithSuffix: function ()
            {
                return this.date.getDate() + this.format.getDateSuffix(this.date.getDate());
            },

            getHours: function ()
            {
                return this.date.getHours();
            },

            getMinutes: function ()
            {
                return this.date.getMinutes();
            },

            getSeconds: function ()
            {
                return this.date.getSeconds();
            },

            getMilliseconds: function ()
            {
                return this.date.getMilliseconds();
            },

            getTime: function()
            {
                return this.date.getTime();
            },

            setMilliseconds: function (val)
            {
                this.date.setMilliseconds(val);
                return this;
            },

            setSeconds: function (val)
            {
                this.date.setSeconds(val);
                return this;
            },

            setMinutes: function (val)
            {
                this.date.setMinutes(val);
                return this;
            },

            setHours: function (val)
            {
                this.date.setHours(val);
                return this;
            },

            setDayOfMonth: function (val)
            {
                this.date.setDate(val);
                return this;
            },

            setMonth: function (val)
            {
                this.date.setMonth(val - 1);
                return this;
            },

            setYear: function (val)
            {
                this.date.setFullYear(val);
                return this;
            },

            getLastDateInMonth: function()
            {
                return new Date(this.getYear(), this.getMonth(), 0).getDate();
            },

            setLastDateInMonth: function()
            {
                return this.setDayOfMonth(this.getLastDateInMonth());
            },

            getDatePart: function (p)
            {
                switch (p)
                {
                    case "y":
                        return "" + this.getFullYear();
                        break;
                    case "yy":
                        return "" + this.getYear();
                        break;
                    case "yyyy":
                        return "" + this.getFullYear();
                        break
                    case "m":
                        return "" + this.getMonth();
                        break;
                    case "mm":
                        return this.getFullMonth();
                        break
                    case "M":
                        return this.getMonthName();
                        break;
                    case "Ms":
                        return this.getShortMonthName();
                        break;
                    case "d":
                        return "" + this.getDayOfMonth();
                        break
                    case "dd":
                        return this.getFullDayOfMonth();
                    case "D":
                        return this.format.getDayName(this.date.getDay());
                        break;
                    case "Ds":
                        return this.format.getShortDayName(this.date.getDay());
                        break;
                    case "Dl":
                        return this.format.getDayLetter(this.date.getDay());
                        break;
                    case "dS":
                        return this.date.getDate() + this.format.getDateSuffix(this.date.getDate());
                        break;
                    case "h":
                        return this.addLeading(this.date.getHours(), 2);
                        break;
                    case "mn":
                        return this.addLeading(this.date.getMinutes(), 2);
                        break;
                    case "s":
                        return this.addLeading(this.date.getSeconds(), 2);
                        break;
                    case "mls":
                        return this.addLeading(this.date.getMilliseconds(), 3); //Mike Changed this from 4, to 3
                        break;
                }
                return "";
            },

            addLeading: function (val, min)
            {
                min = (min != undefined) ? min : 2;
                var str = "" + val;
                while (str.length < min)
                {
                    str = "0" + str;
                }
                return str;
            }
        }
    );

sp.core.date.Date.RoundDownDateTime = function (date)
{
    return date.valueOf() - date.valueOf() % 10000;
}

sp.core.date.Date.ReturnDateStringAsNumericValue = function (str) {
    function looksLikeADate(str)
    {
        var parts = str.split(".");
        if(parts.length!=3) return false;
        var d = Number(parts[2]);
        var m = Number(parts[1]);
        var y = Number(parts[0]);
        if(isNaN(d) || isNaN(m) || isNaN(y)) return false;
        if(d<0 || d>31) return false;
        if(m<1 || m>12) return false;
        if(y<0) return false;
        return true;
    }

    try {
        if(looksLikeADate(str))
        {
            sp.out("looks like a date..");
            var parts = str.split(".");
            var date = new Date(Number(parts[0]), Number(parts[1] - 1), Number(parts[2]));
            return sp.core.date.Date.RoundDownDateTime(date);
        }
        if(str == "1024")
        {
            var dateNow = new Date();
            return sp.core.date.Date.RoundDownDateTime(dateNow);
        }
        //var dateTime = Date.parse(str); Dont do this "1024" comes out as -248746 
        //if(dateTime)
        //{
        //    return sp.core.date.Date.RoundDownDateTime(dateTime);
        //}
    }
    catch (e) {

    }
    return str;
};

sp.core.date.Date.stringToDate = function (str)
{
    try
    {
        var parts = str.split(".");
        return new Date(Number(parts[0]), Number(parts[1] - 1), Number(parts[2]));
    }
    catch (e)
    {

    }
    return new Date();
};
sp.core.date.Date.dateToString = function (d)
{
    return (d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate()).replace(/(^|\.)(\d)(?=(\.|$))/g, "$10$2");
};
sp.core.date.Date.numToDate = function (num)
{
    try
    {
        var d = new Date(num);
        return d;
    }
    catch (e)
    {

    }
    return new Date();
};
sp.core.date.Date.numToString = function (num)
{
    return sp.core.date.Date.dateToString(sp.core.date.Date.numToDate(num));
};
sp.core.date.Date.dateToNum = function (d)
{
    return d.getMilliseconds();
};
sp.core.date.Date.stringToNum = function (str)
{
    return sp.core.date.Date.dateToNum(sp.core.date.Date.stringToDate(str));
};
sp.core.date.Date.isValidDateTimeString = function (str)
{
    if (str.split == undefined) return false;
    var parts = str.split(" ");
    try
    {
        var dateParts = parts[0].split("-");
        if (dateParts.length == 3) return true;
    }
    catch (e)
    {

    }
    return false;
};
sp.core.date.Date.isValidDate = function (date)
{
    return !isNaN(date);
};
sp.core.date.Date.today = function ()
{
    return new sp.core.date.Date().getText();
};

sp.core.date.Date.getOffsetDate = function(offset, start,type)
{
    var d = start || new Date();
    var unit = offset.substr(0,1);
    var val = Number(offset.substr(1));
    var od = new sp.core.date.OffsetDate(d,unit,val);
    return (type=="string")? od.toFormattedString(['y','.', 'm', '.', 'd']) : (type=="date")? od : od;
};

sp.core.date.OffsetDate = sp.core.date.Date.extend
(
{
    __constructor: function(date, unit, val)
    {
        if(!date || (unit!="m" && unit!="d" && unit!="y" && unit!="w") || isNaN(val)) return this.__super();
        this.__super(date);

        if(unit=="m"){
            this.setMonth(this.getMonth()+val);
        }else if(unit=="y"){
            this.setYear(this.getYear()+val);
        }else if(unit=="d"){
            this.setDayOfMonth(this.getDayOfMonth()+val);
        }else if(unit=="w"){
            this.setDayOfMonth(this.getDayOfMonth()+(val*7));
        }
    }
}
);


sp.core.date.DateField = sp.core.graphics.Graphic.extend
    (
        {
            __constructor: function (graphic, format, options)
            {
                this.__super(graphic);
                this.format = format || new sp.core.date.DateFormat();
                this.date = new sp.core.date.Date(null, format);
                this.options = options || {};
                this.init();
            },

            init: function ()
            {
                this.__enabled = true;
                $(this.getGraphic()).attr("readonly", "readonly");
                var __this = this;
                var f = this.getFormatString();
                $(this.getGraphic()).datepicker({ dateFormat: this.getFormatString(), onSelect: function (dateText, inst)
                {
                    __this.onDateChanged(dateText, inst)
                }, onClose: function () {
                    __this.onPlaceholderBlur();
                },changeMonth: this.options.changeMonth,
                changeYear: this.options.changeYear,
                numberOfMonths: this.options.numberOfMonths});

                var locale = sp.core.locale.getLocale();
                var localization = locale.getDatepickerLocalization();
                if (localization)
                {
                    $(this.getGraphic()).datepicker( $.datepicker.regional[ "en" ] = localization);
                    $(this.getGraphic()).datepicker( $.datepicker.setDefaults($.datepicker.regional['en']));
                }
            },

            setEnabled:function(val)
            {
                this.__enabled = val;
                $(this.getGraphic()).datepicker((this.__enabled)? "enable" : "disable");
            },

            getEnabled:function()
            {
                return this.__enabled;
            },

            getFormatString: function ()
            {
                var order = this.format.order.split("");
                var str = "";
                for (var i = 0; i < order.length; i++)
                {
                    str += (i > 0) ? this.format.separator : "";
                    str += (order[i] == "y") ? "yy" : order[i];
                }
                return str;
            },

            onDateChanged: function (dateText, inst)
            {
                this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
            },

            convertInputToDate: function ()
            {
                try
                {
                    var t = $(this.getGraphic()).val();
                    if (!t) return '';
                    var dp = t.split(this.format.separator);
                    var order = this.format.order.split("");
                    var ndp = [];
                    for (var i = 0; i < order.length; i++)
                    {
                        var pos = (order[i] == "y") ? 0 : (order[i] == "m") ? 1 : 2;
                        ndp[pos] = dp[i];
                    }
                    var d = new sp.core.date.Date();
                    d.setDate(ndp[0] + "." + ndp[1] + "." + ndp[2]);
                    return d;
                }
                catch (e)
                {

                }
                return new sp.core.date.Date();
            },

            formatField: function ()
            {
                $(this.getGraphic()).val(this.date.toFormattedString());
            },

            setDate: function (date)
            {
                if (!date)
                {
                    $(this.getGraphic()).datepicker( "setDate" , null);
                }
                else
                {
                    this.date.setDate(date);
                    this.formatField();
                }
                this.onPlaceholderBlur();
            },

            getDate: function ()
            {
                return this.convertInputToDate();
            },

            getDateString: function ()
            {
                var date = this.getDate();
                return (date)? date.getText() : '';
            },

            getValueWithFormat: function (format, seperator)
            {
                var formattedValue = "";
                var formatParts = format.split(".");
                for (var i = 0; i < formatParts.length; i++)
                {
                    formattedValue += this.getDate().getDatePart(formatParts[i]);
                    formattedValue += i < formatParts.length - 1 ? seperator : "";
                }
                return formattedValue;
            }
        }
    );

sp.core.date.TimeFormat = sp.core.data.ValueObject.extend
    (
        {
            __constructor: function (valueMap)
            {
                this.__super(valueMap);
            },

            setDefaults: function ()
            {
                this.separator = ":";
                this.millisecondSeparator = ".";
                this.useHours = true;
                this.useMinutes = true;
                this.useSeconds = false;
                this.useMilliseconds = false;
            },

            getSeparator: function ()
            {
                return this.separator;
            },
            getMillisecondSeparator: function ()
            {
                return this.millisecondSeparator;
            },
            getUseHours: function ()
            {
                return this.useHours;
            },
            getUseMinutes: function ()
            {
                return this.useMinutes;
            },
            getUseSeconds: function ()
            {
                return this.useSeconds;
            },
            getUseMillieconds: function ()
            {
                return this.useMilliseconds;
            }
        }
    );

sp.core.date.TimeFormatter = Class.extend
    (
        {
            __constructor: function (format)
            {
                this.format = format || new sp.core.date.TimeFormat();
            },

            getFormattedValue: function (time)
            {
                var formattedValue = "";
                if (this.format.useHours)
                {
                    var hrs = this.getHours(time);
                    formattedValue += hrs < 10 ? "0" + hrs : hrs;
                    if (this.format.useMinutes) formattedValue += this.format.separator;
                }
                if (this.format.useMinutes)
                {
                    var mins = this.getMinutes(time);
                    formattedValue += mins < 10 ? "0" + mins : mins;
                    if (this.format.useSeconds) formattedValue += this.format.separator;
                }
                if (this.format.useSeconds)
                {
                    var secs = this.getSeconds(time);
                    formattedValue += secs < 10 ? "0" + secs : secs;
                    if (this.format.useMilliseconds) formattedValue += this.format.millisecondSeparator;
                }
                if (this.format.useMilliseconds)
                {
                    var milli = this.getMilliseconds(time);
                    var fmt = milli < 1000 && milli < 100 ? "00" : "";
                    fmt = milli < 1000 && milli > 99 ? "0" : fmt;
                    formattedValue += fmt + milli;
                }
                return formattedValue;
            },

            getHours: function (time)
            {
                var hrs = this.parseTime(time).getHours();
                return hrs;
            },

            getMinutes: function (time)
            {
                return this.parseTime(time).getMinutes();
            },
            getSeconds: function (time)
            {
                return this.parseTime(time).getSeconds();
            },
            getMilliseconds: function (time)
            {
                return this.parseTime(time).getMilliseconds();
            },
            parseTime: function (time)
            {
                var dt = new sp.core.date.Date();
                if (!time.getMonth)
                {
                    dt.setDateTimeString("1970-1-1" + " " + time);
                }
                else
                {
                    dt = new sp.core.date.Date(time);
                }
                return dt;
            },

            getUnFormattedValue: function (time)
            {
                time = this.stripIllegalChars(time);
                return time;
            },

            getRawValue: function (time)
            {
                return this.stripFormattingChars(time);
            },

            stripFormattingChars: function (time)
            {
                time = time || "";
                time = time.toString();
                time = time.replace(this.format.separator, "");
                return time;
            },

            stripIllegalChars: function (time)
            {
                var tTime = "";
                time = time || "";
                var timeStr = time.toString();
                for (var i = 0; i < timeStr.length; i++)
                {
                    var ch = timeStr[i];
                    if (!isNaN(Number(ch)) || this.isFormattingCharacter(ch)) tTime += ch;
                }
                return tTime;
            },

            isFormattingCharacter: function (character)
            {
                return (character == this.format.separator || character == this.format.millisecondSeparator)
            }
        }
    );

sp.core.date.TimeField = sp.core.graphics.Graphic.extend
    (
        {
            __constructor: function (graphic, format, time)
            {
                this.time = this.checkValid(time);
                this.__super(graphic);
                this.format = format || new sp.core.date.TimeFormat();
                this.formatter = new sp.core.date.TimeFormatter(this.format);
                this.init();
            },
            init: function ()
            {
                this.addEventListener(this, sp.core.events.MouseEvent.CLICK, this.showDialog);
                this.addEventListener(this, sp.core.events.UIEvent.FOCUS, this.showDialog);
                $(this.getGraphic()).attr("readonly", "readonly");
                var __this = this;
                $(this.getGraphic()).click(function ()
                {
                    __this.dispatchEvent(new sp.core.events.ButtonEvent(this, sp.core.events.MouseEvent.CLICK));
                });
                $(this.getGraphic()).focus(function ()
                {
                    __this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.FOCUS));
                });
                this.dialog = new sp.core.date.TimeDialog("Time", this);
                this.dialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.dialogClosed);
                this.onChanged();
            },

            showDialog: function (event)
            {
                this.dialog.open(false);
            },
            hideDialog: function (event)
            {
                this.dialog.close();
            },

            dialogClosed: function (event)
            {
                if (event.result == sp.ui.dialogs.Dialog.OK)
                {
                    this.time = this.dialog.getTime();
                    this.onChanged();
                }
            },

            onChanged: function ()
            {
                var dat = null;
                if (this.time != null && this.time.getMonth)
                    dat = this.time;
                else
                {
                    dat = this.time == null ? $(this.getGraphic()).val() : this.time;
                    dat = this.formatter.getUnFormattedValue(dat);
                }
                dat = this.checkValid(dat);
                dat = this.formatter.getFormattedValue(dat);
                $(this.getGraphic()).val(dat);
                this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
            },

            getTime: function ()
            {
                return this.time;
            },

            setTime: function (time)
            {
                if (time == null)
                    time = "00:00:00.000";
                if (!time.getMonth)
                {
                    time = this.formatter.stripIllegalChars(time);
                    time = this.formatter.stripFormattingChars(time);
                }
                this.time = time;
                this.dialog.setTime(this.time);
                this.onChanged();
            },

            getText: function ()
            {
                return this.formatter.getFormattedValue($(this.getGraphic()).val());
            },

            setText: function (time)
            {
                this.time = this.checkValid(time);
                $(this.getGraphic()).val(this.time);
            },

            getValueWithFormat: function (format, seperator, millisecondsseperator)
            {
                var formattedValue = "";
                var formatParts = format.split(".");
                var dt = this.formatter.parseTime(this.time);
                for (var i = 0; i < formatParts.length; i++)
                {
                    var val = dt.getDatePart(formatParts[i]);
                    formattedValue += val;
                    var sep = seperator;
                    if (formatParts.length >= i + 2)
                        if (formatParts[i + 1] == "mls") sep = millisecondsseperator;
                    formattedValue += i < formatParts.length - 1 ? sep : "";
                }
                return formattedValue;
            },

            checkValid: function (time)
            {
                var isNull = false;
                if (time == null || time == "")
                    isNull = true;
                if (isNull)
                    time = "00:00:00.000";
                return time;
            }
        }
    );

sp.core.date.TimeDialog = sp.ui.dialogs.Dialog.extend
    (
        {
            __constructor: function (title, timeField)
            {
                this.title = title;
                this.timeField = timeField;
                this.__super(null);
                $(this.getGraphic()).addClass("TimePickerDialog");
                this.time = this.timeField.time;
                this.init();
            },

            getDefaultSettings: function ()
            {
                var settings = { autoOpen: false, draggable: false, buttons: this.getButtonOptions(), modal: false, title: this.title, resizable: false };
                var overridden = this.getSettings() || {};
                for (var prop in overridden)
                    settings[prop] = overridden[prop];
                return settings;
            },

            init: function ()
            {
                this.container = this.addElement(this.createElement("div", { id: "timeDialogContainer" }, ["timeDialogContainer"]));
                if (this.timeField.format.useHours)
                {
                    this.hourPart = this.createPart("Hours", 23, 0);
                    $(this.container).append(this.hourPart.Container);
                    $(this.hourPart.Field).val(this.timeField.formatter.getHours(this.time));
                }
                if (this.timeField.format.useMinutes)
                {
                    this.minutePart = this.createPart("Minutes", 59, 0);
                    $(this.container).append(this.minutePart.Container);
                    $(this.minutePart.Field).val(this.timeField.formatter.getMinutes(this.time));
                }
                if (this.timeField.format.useSeconds)
                {
                    this.secondPart = this.createPart("Seconds", 59, 0);
                    $(this.container).append(this.secondPart.Container);
                    $(this.secondPart.Field).val(this.timeField.formatter.getSeconds(this.time));
                }
                if (this.timeField.format.useMilliseconds)
                {
                    this.millisecondPart = this.createPart("Milliseconds", 999, 0);
                    $(this.container).append(this.millisecondPart.Container);
                    $(this.millisecondPart.Field).val(this.timeField.formatter.getMilliseconds(this.time));
                }
            },

            setTime: function (time)
            {
                this.time = time;
                if (this.timeField.format.useHours)
                    $(this.hourPart.Field).val(this.timeField.formatter.getHours(this.time));
                if (this.timeField.format.useMinutes)
                    $(this.minutePart.Field).val(this.timeField.formatter.getMinutes(this.time));
                if (this.timeField.format.useSeconds)
                    $(this.secondPart.Field).val(this.timeField.formatter.getSeconds(this.time));
                if (this.timeField.format.useMilliseconds)
                    $(this.millisecondPart.Field).val(this.timeField.formatter.getMilliseconds(this.time));
            },

            createPart: function (label, maxVal, minVal)
            {
                var containerDiv = this.createElement("div", {}, ["timeFieldContainer"]);
                var labelDiv = this.createElement("div", {}, ["label"]);
                $(labelDiv).text(label);
                $(containerDiv).append(labelDiv);
                var fieldContainer = this.createElement("div", {});
                $(containerDiv).append(fieldContainer);
                var field = this.createElement("input", {}, [""], { type: "text" });
                $(fieldContainer).append(field);
                var controller = new sp.core.numeric.NumericInput(field, new sp.core.numeric.NumberFormat({ maxValue: maxVal, minValue: minVal }), true);
                return { Container: containerDiv, Label: label, Field: field, Controller: controller };
            },

            setDialogPosition: function (x, y)
            {
                $(this.dialog).setX(x);
                $(this.dialog).setY(y);
            },

            getTime: function ()
            {
                this.time = "";
                if (this.timeField.format.useHours)
                {
                    var hrs = $(this.hourPart.Field).val();
                    this.time += (hrs < 10 ? "0" + hrs : hrs) + ":";
                }
                else this.time += "00:";
                if (this.timeField.format.useMinutes)
                {
                    var mins = $(this.minutePart.Field).val();
                    this.time += (mins < 10 ? "0" + mins : mins) + ":";
                }
                else this.time += "00:";
                if (this.timeField.format.useSeconds)
                {
                    var secs = $(this.secondPart.Field).val();
                    this.time += (secs < 10 ? "0" + secs : secs) + ".";
                }
                else this.time += "00.";
                if (this.timeField.format.useMilliseconds)
                {
                    var mls = $(this.millisecondPart.Field).val();
                    var fmt = mls < 1000 && mls < 100 ? "00" : "";
                    fmt = mls < 1000 && mls > 99 ? "0" : fmt;
                    this.time += fmt + mls;
                }
                else this.time += "000";
                return this.time;
            }
        }
    );
