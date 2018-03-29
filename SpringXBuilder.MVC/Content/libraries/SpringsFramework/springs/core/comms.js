sp.namespace("sp.core.comms.Comms",
             "sp.core.comms.CommsEvent",
             "sp.core.comms.CommsMethodTypes",
             "sp.core.comms.SSOTokenHandler");



sp.core.comms.Comms = sp.core.events.EventDispatcher.extend
(
{

    __constructor: function(params,options)
    {
        this.__super();
        this.data = "";
        this.parsedData = {};
        this.params = params || {URL:""};
        this.options = options || new sp.core.comms.CommsOptions();
    },

    load: function(filePath, payload)
    {
        if (this.params.OODPOD && this.params.OODWEBLINK)
        {
            if (!payload) payload = {};
            var __this = this;
            var onLoad = function(ssoToken)
            {
                payload.ssotoken = ssoToken;
                __this.start(filePath, payload);
            };
            sp.core.comms.SSOTokenHandler.getInstance().getSSOToken(this.params, onLoad);
        }
        else
        {
            this.start(filePath, payload);
        }
    },

    start: function(filePath, payload)
    {
        var url = this.createURL(this.params.URL + filePath);
        if(this.options.showTraces) sp.out("Comms, loading:" + url);
        var o = this.options;
        o.url = url;
        o.listener =this;
        o.data = payload || {};
        o.timeout = this.getTimeOut();
        o.error = function(jqXHR, textStatus, errorThrown) { this.listener.onError(jqXHR, textStatus, errorThrown) };
        o.success = function(dat) { this.listener.onLoad(dat) };
        o.complete = function() { }
        $.ajax(o);
    },

    getTimeOut: function()
    {
        var num = sp.core.data.DataUtils.toNumber(this.params.SERVERTIMEOUT ||0) || 60;
        return num * 1000;
    },

    onError: function(jqXHR, textStatus, errorThrown)
    {
        if(this.options.showTraces) sp.out("Comms, error:" + textStatus + " : " + errorThrown  +" response:" + jqXHR.responseText);
        this.dispatchEvent(new sp.core.comms.CommsEvent(this, sp.core.comms.CommsEvent.COMPLETE, false, errorThrown, textStatus));
    },

    onLoad: function(dat)
    {
        if (this.options.dataType.indexOf('json') > -1)
        {
            this.data = this.parsedData = dat;
        }
        else
        {
            this.data = (dat.hasChildNodes)? dat : sp.core.comms.Comms.convertToXML(dat);
            this.parsedData = sp.utils.XMLUtils.xmlToObject(this.data);
        }
        if(this.options.showTraces) sp.out("Comms, onLoad:" + sp.utils.XMLUtils.strToXML(dat));
        this.dispatchEvent(new sp.core.comms.CommsEvent(this, sp.core.comms.CommsEvent.COMPLETE, true));
    },

    createURL: function(filePath)
    {
        var url = filePath;
        var getSign = function(){return (url.indexOf('?')> -1)? '&' : '?'};
        if(this.params.CRM) url += getSign() + "crm=" + this.params.CRM;
        if(this.params.CRMKEY) url += getSign() + "crmkey=" + this.params.CRMKEY;
        if(this.params.SESSIONID) url += getSign() + "sessionid=" + this.params.SESSIONID;
        if(this.params.PRODUCT) url += getSign() + "product=" + this.params.PRODUCT;
        if(this.params.PRODUCTKEY) url += getSign() + "productkey=" + this.params.PRODUCTKEY;
        if(this.params.SERVER) url += getSign() + "server=" + this.params.SERVER;
        if(this.params.USER) url += getSign() + "user=" + this.params.USER;
        if(this.params.SERVERTIMEOUT) url += getSign() + "servertimeout=" + this.params.SERVERTIMEOUT;
        if(this.params.COMID) url += getSign() + "comid=" + this.params.COMID;
        return url;
    }

}
);
sp.core.comms.Comms.convertToXML = function(str)
{
    // this is a near replica of the sp.utils.XMLUtils method strToXML but
    // the difference is that it returns the entire xml doc not just the node which
    // was created on the doc. The reason for this is to be consistent when converted to
    // a json object with any xml loaded AS xml by the comms class which will not have an XML prop
    var xmlDoc;
    if (window.DOMParser)
    {
        try
        {
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(str,"text/xml");
        }
        catch(e)
        {
            sp.out("Error:" + e);
        }
    }
    else // Internet Explorer
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(str);
    }
    return xmlDoc;
};

sp.core.comms.CommsEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, success, error, status)
    {
        this.__super(target, type);
        this.success = success;
        this.error = error;
        this.status = status;
    }
}
);
sp.core.comms.CommsEvent.COMPLETE = "complete";
sp.core.comms.CommsEvent.LOAD = "load";
sp.core.comms.CommsEvent.ERROR = "error";

sp.core.comms.CommsMethodTypes =
{
    DEFAULT: "default",
    OOD: "ood"
};

sp.core.comms.SSOTokenHandler = sp.core.events.EventDispatcher.extend
(
{

    __constructor: function()
    {
        this.__super();
        this.token = null;
        this.iframe = null;
    },

    getSSOToken: function(params, callback)
    {
        this.params = params;
        if (!this.iframe)
        {
            this.refreshToken();
            var __this = this;
            $(this.iframe).on("load",function(event) { $(this).off("load"); callback(__this.getToken()) });
        }
        else
        {
            callback(this.getToken());
        }
    },

    getToken: function()
    {
        try
        {
            var inHTML = this.iframe.contentWindow.document.body.innerHTML;
            var lowHTML = inHTML.toLowerCase();
            var p1 = lowHTML.indexOf("<sso>");
            var p2 = lowHTML.indexOf("</sso>");
            var token = "";
            if (p1 < 1 || p2 < 1)
            {
                sp.out("Failed to obtain SSO Token ");
                sp.out(inHTML + "/" + p1 + "/" + p2);
            }
            else
            {
               token = inHTML.substring(p1 + 5, p2);
            }
            return token;
        }
        catch (err)
        {
            sp.out("Error getting SSO Token " + err.description);
            return "";
        }
    },

    refreshToken: function()
    {
        if (!this.iframe)
        {
            this.iframe = document.createElement("iframe");
            $("body").append(this.iframe);
        }
        var url = "https://secure-" + this.params.OODPOD + ".crmondemand.com/OnDemand/SSOWebLink?WebLink.Object=Opportunity&WebLink.Ctrl=" + this.params.OODWEBLINK + "&rand=" + Math.random();
        $(this.iframe).attr("src", url);
        var __this = this;
        setTimeout(function() { __this.refreshToken() }, 60000);
    }
}
);

sp.core.comms.SSOTokenHandler.getInstance = function()
{
    if (!sp.core.comms.SSOTokenHandler.INSTANCE) sp.core.comms.SSOTokenHandler.INSTANCE = new sp.core.comms.SSOTokenHandler();
    return sp.core.comms.SSOTokenHandler.INSTANCE;
};

sp.core.comms.CommsOptions = sp.core.data.ValueObject.extend
(
    {
        setDefaults:function()
        {
            this.contentType = "application/x-www-form-urlencoded";
            this.dataType = "xml";
            this.type = "POST"
            this.headers = { "cache-control": "no-cache" };
            this.cache = false;
            this.showTraces = false;
        }
    }
)