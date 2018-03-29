sp.namespace("ws.applet.Applet",
             "ws.applet.ApplicationData",
             "ws.applet.ContentData",
             "ws.applet.AppletParameters",
             "ws.applet.AppletEvent",
             "ws.applet.AppletData",
             "ws.applet.TestParameters");


ws.applet.Applet = Class.extend
(
{
    __constructor: function(appletParameters)
    {
        this.appletParameters = appletParameters;
        this.eventBus = new sp.core.events.EventDispatcher();
        this.__init();
    },

    __init: function()
    {
        $("#applet").hide();
        ws.applet.Applet.prototype.__INSTANCE = this;
        var __this = this;
        $(window).resize(function()
        {
            __this.resize();
        });

        /* applet */
        window.onbeforeunload = function()
        {
            __this.unlock();
            if (__this.dataHasChanged())
            {
                return "Clicking OK could result in lost data. \nEnsure you have saved any changes before exiting.";
            }
        };
        this.loadScripts();
        this.centerAppletWindow();
        this.init();
        this.load();

    },

    loadScripts: function()
    {
        //override...
    },

    dataHasChanged: function()
    {
        return (this.getSaveCompareXML() != this.lastSave);
    },

    openWindowWithPost: function(openURL, postURL, name, keys, values, script)
    {
        var newWindow = window.open(openURL, name);
        if (!newWindow) return false;
        var html = "";
        html += "<html><head></head><body><form id='formid' target='_blank' method='post' action='" + postURL + "'>";
        if (keys && values && (keys.length == values.length))
        {
            for (var i = 0; i < keys.length; i++)
            {
                html += "<input type='hidden' name='" + keys[i] + "' value='" + escape(values[i]) + "'/>";

            }
            html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit();</script><a href='javascript:window.close();'>Click here to close this window</a></body></html>";
            newWindow.document.write(html);
        }
        return newWindow;
    },

    getCRMType: function()
    {

    },

    resize: function(event)
    {
        var w = $(document).width();
        var h = $(document).height();
        this.onResize(w, h);
    },

    init:function()
    {
        // override..
    },

    load: function()
    {
        // override..
    },

    onResize: function(w, h)
    {

    },

    preSave: function()
    {
        // overwrite..
        if (this.preloader) this.preloader.show("Saving...");
    },

    postSave: function(result)
    {
        // overwrite..
        if (this.preloader) this.preloader.hide();
    },

    getAppletParameters: function()
    {
        return this.appletParameters;
    },

    unlock: function(callback)
    {
        var comms = new sp.core.comms.Comms(this.appletParameters);
        comms.load(this.appletParameters.UNLOCKURL);
        comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, callback);

    },

    close: function(event)
    {
        //if (this.appletParameters.UNLOCKURL && !ws.applet.ApplicationData.readOnly())
        //{
            //this.unlock(this.closeWindow);
        //}
        //else
        //{
            this.closeWindow({});
        //}
    },

    closeWindow: function(event)
    {
        if (!event.success)
        {
            //window.open(this.appletParameters.URL + this.appletParameters.UNLOCKURL + "?crmkey=" + this.appletParameters.CRMKEY, "unlock", "height=1,width=1,resizable=0");
            // before closing we must unlock the applet
            // we previously lock it, while editing
            $.ajax({
                url: this.appletParameters.URL + this.appletParameters.UNLOCKURL + "?crmkey=" + this.appletParameters.CRMKEY,
                type: "GET"
            });
        }
        window.onbeforeunload = function() { };
        window.close();
    },

    onConfirmExit: function(event)
    {
        if (event.result == sp.ui.dialogs.Dialog.OK) this.close();
    },

    exit: function()
    {
        if (this.dataHasChanged())
        {
            var options = new sp.ui.dialogs.MessageDialogOptions({ message: sp.core.locale.getString('PROMPT_SAVE') });
            var dialog = new sp.ui.dialogs.ConfirmDialog(options);
            dialog.open();
            dialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onConfirmExit);
        }
        else
        {
            this.close();
        }
    },

    showErrorMessage: function(msg, title, callback)
    {
        var options = new sp.ui.dialogs.MessageDialogOptions({ title: title || sp.core.locale.getString('MESSAGE_DIALOG_ERROR') || '', message: msg || '' });
        var dialog = new sp.ui.dialogs.MessageDialog(options);
        $(dialog.getGraphic()).css('text-align', 'center');
        dialog.open();
        if (callback)
        {
            dialog.addEventListener(this, sp.core.dialogs.DialogEvent.CLOSE, callback);
        }

    },

    restartAutoSave: function()
    {
        if(ws.applet.ApplicationData.isReadOnly()) return;
        if (this.getAutoSaveInterval())
        {
            var __this = this;
            this.saveInterval = setInterval(function() { __this.doAutoSave() }, this.getAutoSaveInterval() * 60000);
        }
    },

    getAutoSaveInterval: function()
    {
        return Number(ws.applet.ApplicationData.getReferenceData("AutoSave"));
    },

    getSaveCompareXML: function()
    {
        return this.saveXML();
    },

    saveXML: function()
    {
        return "<XML></XML>";
    },

    doAutoSave: function()
    {
        clearInterval(this.saveInterval);
        this.preAutoSave();
        var xmlStr = this.saveXML();
        var comms = new sp.core.comms.Comms(this.appletParameters);
        comms.load(this.appletParameters.FILESAVE, { xmlData: xmlStr, saveType: "AutoSave" });
        comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onAutoSave);
    },

    onAutoSave: function()
    {
        this.postAutoSave();
        this.restartAutoSave();
    },

    preAutoSave: function()
    {
    },

    postAutoSave: function()
    {

    },

    onSave: function(event)
    {
        var title = sp.core.locale.getString('MESSAGE_DIALOG_ERROR') || '';
        var err1 = sp.core.locale.getString('SAVE_ERROR') || '';
        var err2 = sp.core.locale.getString('SAVE_ERROR_DEFAULT_REASON') || '';
        this.postSave(event.success);
        if (event.success)
        {
            try
            {
                if (sp.core.data.DataUtils.toBoolean(event.target.parsedData.XML.Success))
                {
                    // update actions....
                    this.updateActions(event.target.parsedData);
                    this.lastSave = this.getSaveCompareXML();
                    this.eventBus.dispatchEvent(new ws.applet.AppletEvent(this, ws.applet.AppletEvent.SAVE));
                }
                else
                {
                    title = sp.core.data.DataUtils.valueAtPath(event.target.parsedData, "XML.DisplayMessage.Title") || title;
                    err2 = sp.core.data.DataUtils.valueAtPath(event.target.parsedData, "XML.DisplayMessage.MainMessage") || err2;

                    this.showErrorMessage(err1 + '<br/>' + err2, title);
                    this.eventBus.dispatchEvent(new ws.applet.AppletEvent(this, ws.applet.AppletEvent.SAVE_ERROR));
                    //ErrorLog.error(err1, err2);
                }
                this.refreshParentWindow();
            }
            catch(e)
            {
                this.showErrorMessage(err1 + '<br/>' + err2, title);
                this.eventBus.dispatchEvent(new ws.applet.AppletEvent(this, ws.applet.AppletEvent.SAVE_ERROR));
                //ErrorLog.error(err1, err2);
                sp.out("Error:" + e);
            }
        }
        else
        {
            this.showErrorMessage(err1 + '<br/>' + err2, title);
            //ErrorLog.error(err1, err2);
        }
    },

    updateActions:function(result)
    {

    },

    save: function(saveType)
    {
   
        this.preSave(saveType);
        var xmlStr = this.saveXML();
        var comms = new sp.core.comms.Comms(this.appletParameters);
        comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSave);
        comms.load(this.appletParameters.FILESAVE, { xmlData: xmlStr, saveType: "user" });
    },

    refreshParentWindow: function()
    {
        if (this.appletParameters.RETURNURL && parent.window.name != "NewAppletWindow")
        {
            if (navigator.userAgent.indexOf("Safari") != -1)
            {
                alert("This browser does not support refreshing of the CRM. Any changes made in the Applet will not be displayed until you press 'Command R'");
            }
        }
    },

    centerAppletWindow: function()
    {
        if(this.preventAppletCentering()) return;
        try
        {
            window.resizeTo(this.appletParameters.WINDOWWIDTH, this.appletParameters.WINDOWHEIGHT);
            window.moveTo((screen.width - this.appletParameters.WINDOWWIDTH) / 2, (screen.height - this.appletParameters.WINDOWHEIGHT) / 2);
        }
        catch(e) {}
    },

    preventAppletCentering:function()
    {
        if ( window.self === window.top ) return false; // not in iframe
        else return true; // iframe
    }


}
);
ws.applet.Applet.getInstance = function()
{
    return this.prototype.__INSTANCE;
};

ws.applet.ApplicationData = new sp.core.events.EventDispatcher();
ws.applet.ApplicationData.data = [];
ws.applet.ApplicationData.isReadOnly = function()
{
   return sp.core.data.DataUtils.toBoolean(sp.core.data.DataUtils.valueAtPath(this.data,"ReadOnly"));
};
ws.applet.ApplicationData.setData = function(dat)
{
    this.data = dat || {};
};
ws.applet.ApplicationData.getUserID = function()
{
    return sp.core.data.DataUtils.valueAtPath(this.data,"UserData.UserID");
};
ws.applet.ApplicationData.getUser = function()
{
    var DataUtils = sp.core.data.DataUtils;
    return DataUtils.valueAtPath(this.data, "UserData.User") || DataUtils.valueAtPath(this.data, "UserData.UserName") || "";
};
ws.applet.ApplicationData.getReferenceData = function(path)
{
    return sp.core.data.DataUtils.valueAtPath(this.data,path);
};
ws.applet.ApplicationData.getSelectionString = function(path)
{
	var obj = ws.applet.ApplicationData.getReferenceData(path).Option || ws.applet.ApplicationData.getReferenceData(path).Item;
	var arr = sp.core.data.DataUtils.toArray(obj);
	var htmlStr = "";
	for(var i=0; i<arr.length; i++)
	{
		htmlStr += "<Option value='"+(arr[i].ID || arr[i].id)+"'>" + (arr[i].Label || arr[i].label) + "</Option>";
	}
	return htmlStr;
};
ws.applet.ApplicationData.getUserDateFormat = function()
{
    if (!this.dateFormat)
    {
        this.dateFormat = new sp.core.date.DateFormat();
        this.dateFormat.order = this.getReferenceData("UserData.DateFormat.DisplayOrder") || "mdy";
        this.dateFormat.separator = this.getReferenceData("UserData.DateFormat.Separator") || "/";
    }
    return this.dateFormat;
};
ws.applet.ApplicationData.getUserCurrencyFormat = function()
{
    return { currencySymbol: this.getReferenceData("UserData.CurrencyFormat.Symbol") || '$',
             decimalSeperator: this.getReferenceData("UserData.CurrencyFormat.Decimals") || '.',
             thousandSeperator: this.getReferenceData("UserData.CurrencyFormat.Thousands") || ',',
             symbolPosition: this.getReferenceData("UserData.CurrencyFormat.Position") || 'before'
    };
};
ws.applet.ApplicationData.getUserPercentageFormat = function()
{
    return { percentageSymbol: this.getReferenceData("UserData.PercentageFormat.Symbol") || "%",
        decimalSeperator: this.getReferenceData("UserData.PercentageFormat.Decimals") || ".",
        decimalPlaces: this.getReferenceData("UserData.PercentageFormat.DecimalPlaces") || 2
    };
};
ws.applet.ApplicationData.getUserNumberFormat = function()
{
    return { decimalSeperator: this.getReferenceData("UserData.CurrencyFormat.Decimals"),
             thousandSeperator: this.getReferenceData("UserData.CurrencyFormat.Thousands")
    };
};
ws.applet.ApplicationData.readOnly = function()
{
    return sp.core.data.DataUtils.toBoolean(this.getReferenceData("ReadOnly"));
};

ws.applet.ApplicationData.isLockedField = function(fieldName)
{
    return sp.core.data.DataUtils.toBoolean(this.getReferenceData("Options.LockFields."+fieldName));
}

ws.applet.ContentData = {};
ws.applet.ContentData.setData = function (data)
{
    var locale = sp.core.locale.getLocale();
    locale.setTranslationData(data);
}
ws.applet.ContentData.getLocal = function(id)
{
    return sp.core.locale.getLocale().getString(id, id);
};
ws.applet.ContentData.getLocalOr = function(id, or)
{
    return sp.core.locale.getLocale().getString(id, or);
};

ws.applet.AppletParameters = Class.extend
(
    {
        __constructor:function()
        {
            this.init();
        },

        init:function()
        {
            var raw = {};
            document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function()
            {
                function decode(s)
                {
                    try
                    {
                        return decodeURIComponent(s.split("+").join(" "));
                    }
                    catch(e)
                    {
                        return unescape(s.split("+").join(" "));
                    }
                }
                raw[decode(arguments[1])] = decode(arguments[2]);
            });
            this.raw = raw;
            this.FILEHELP = this.raw.FILEHELP || this.raw.filehelp || "Help.aspx";
            this.POSTLIMIT = this.raw.POSTLIMIT || this.raw.postlimit || "80000";
            this.PRODUCTKEY = this.raw.PRODUCTKEY || this.raw.productkey;
            this.PRODUCT = this.raw.PRODUCT || this.raw.product;
            this.CRMKEY  = this.raw.CRMKEY || this.raw.crmkey;
            this.CRM = this.raw.CRM || this.raw.crmkey || "";
            this.HELPFILE = this.raw.HELPFILE || this.raw.helpfile || "Help.aspx";
            this.REPORTFILE = this.raw.REPORTFILE || this.raw.reportfile || "Printing/print.aspx";
            this.FILEPRINT = this.raw.FILEPRINT || this.raw.fileprint || "output/PrintPDF.aspx";
            this.EXPORTPPT = this.raw.EXPORTPPT || this.raw.exportppt|| "output/ExportPPT.aspx";
            this.FILESAVE = this.raw.FILESAVE || this.raw.filesave || "Save.aspx";
            this.FILEOPEN = this.raw.FILEOPEN || this.raw.fileopen || "Applet/Load";
            this.CONTACTSEARCH = this.raw.CONTACTSEARCH || this.raw.contactsearch || "Search.aspx";
            this.WEB = this.raw.WEB || this.raw.web || "true";
            this.DOENCODE = this.raw.DOENCODE || this.raw.doencode || 1;
            this.SERVER = this.raw.SERVER || this.raw.server || "";
            this.USER = this.raw.USER || this.raw.user || "";
            this.SERVERTIMEOUT = this.raw.SERVERTIMEOUT || this.raw.servertimeout || "60";
            this.REPOSITORYSEARCH = this.raw.REPOSITORYSEARCH || this.raw.repositorysearch || "";
            this.UNLOCK = this.raw.UNLOCK || this.raw.unlock || "";
            this.COMID = this.raw.COMID || this.raw.comid || "";
            this.URL = this.raw.URL || this.raw.url || "";
            this.DEBUG = (this.raw.DEBUG != undefined) ? sp.core.data.DataUtils.toBoolean(this.raw.DEBUG) : true;
            this.RETURNURL = this.raw.RETURNURL || this.raw.returnURL || this.raw.returnurl;
            this.WINDOWWIDTH = this.raw.WINDOWWIDTH || this.raw.WINDOWWIDTH || "1000";
            this.WINDOWHEIGHT = this.raw.WINDOWHEIGHT || this.raw.WINDOWHEIGHT || "740";
            this.UNLOCKURL = this.raw.UNLOCKURL || "unlock.aspx";
            this.OODPOD = this.raw.oodpod || this.raw.OODPOD || "";
            this.OODWEBLINK = this.raw.oodweblink || this.raw.OODWEBLINK || "";
            this.FILTER = this.raw.filter || this.raw.FILTER || "Filter.aspx";
            this.FILEUPLOAD = this.raw.FILEUPLOAD || this.raw.fileupload || "FileUpload.aspx";
        },

        getParam:function(prop)
        {
            return this[prop] || this.raw[prop] || "";
        },

        toString:function()
        {
            var str = "[AppletParameters:";
            for(var prop in this)
            {
                if(typeof(this[prop])!="function") str += "\n\t" + prop  +" : " + this[prop];
            }
            str += "]";
            return str;
        }

    }
);


ws.applet.AppletEvent = sp.core.events.Event.extend({});
ws.applet.AppletEvent.SAVE = "app_data_saved";
ws.applet.AppletEvent.SAVE_ERROR = "app_data_save_error";


ws.applet.AppletData = sp.core.events.EventDispatcher.extend
(
    {

        __constructor: function(parameters)
        {
            this.__super();
            this.parameters = parameters;
            this.__init();
        },

        __init:function()
        {
            this.init();
            this.loadXML();
        },

        init:function()
        {

        },

        loadXML: function(postParameters)
        {
            var comms = new sp.core.comms.Comms(this.parameters);
            comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onComms);
            comms.load(this.parameters.FILEOPEN, postParameters);
        },

        onComms: function(event)
        {
            if (event.success) this.__onLoad(event);
            this.dispatchEvent(event);
        },

        __onLoad: function(event)
        {
            this.applicationDataXML = sp.utils.XMLUtils.xmlToStr($(event.target.data).find("ApplicationData:first")[0]);
            var xml = event.target.data;
            this.rawData = sp.utils.XMLUtils.xmlToObject(xml);
            try
            {
                var contentDataXML = $(xml).find("ContentData:first")[0];
                var cObj = sp.utils.XMLUtils.xmlToObject(contentDataXML);
                ws.applet.ContentData.setData(sp.core.data.DataUtils.toArray(cObj.Item));
                contentDataXML.parentNode.removeChild(contentDataXML);
            }
            catch (e)
            {
                //sp.out("No content data:" + e);
            }
            this.data = sp.utils.XMLUtils.xmlToObject(xml, function(val) { return ws.applet.ContentData.getLocal(val) }).XML;
            this.fileData = sp.core.data.DataUtils.valueAtPath(this.data, "FileData");
            ws.applet.ApplicationData.setData(sp.core.data.DataUtils.valueAtPath(this.data, "ApplicationData"));
            this.onLoad(event);
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.LOADED));
        },

        onLoad:function(event)
        {
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.LOADED));
        },

        getApplicationDataXML: function()
        {
            return this.applicationDataXML || "";
        },

        getFileDataValue: function(path)
        {
            return sp.core.data.DataUtils.valueAtPath(this.fileData, path);
        },

        saveXML: function()
        {
            var xmlStr = "";
            return xmlStr;
        },

        save:function()
        {
            var comms = new sp.core.comms.Comms(this.parameters);
            comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSave);
            comms.load(this.parameters.FILESAVE, { xmlData: this.saveXML(), saveType: "user" });
        },

        onSave:function()
        {
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.SAVED));
        }
    }
);

ws.applet.TestParameters = ws.applet.AppletParameters.extend
(
{
    __constructor:function()
    {
        this.__super();
        this.URL = "";
        this.FILEOPEN = "inputXML.php";
        this.PRODUCTKEY = "";
        this.PRODUCT = "";
        this.CRMKEY = "";
        this.CRM = "";
        this.SERVERTIMEOUT = "";
        this.SERVER = "";
        this.USER = "";
        this.COMID = "";
    },

    toString:function()
    {
     return "[New TestParameters, url:" + this.FILEOPEN;
    }

}
);
