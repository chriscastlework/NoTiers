sp.namespace("spx.model.Model");
sp.namespace("spx.model.CustomFields");


spx.model.Model = ws.applet.AppletData.extend
(
    {

        __constructor: function(parameters)
        {
            this.__super(parameters);
            this.init();
            var __this = this;

           // setInterval(__this.maintainSession(), 30000);

        },
        //maintainSession: function () {
        //    var __this = this;
        //    var param = window.appletParameters.getParam; // throws error
        //    var url = '/MaintainSession.aspx?';
        //    var u = url + $.param({
        //        RecordId: param('recordid'),
        //        CustomObjectKey: param('customobjectkey'),
        //        CRMKey: param('crmkey')
        //    });
        //    //sp.out("url:" + u);
        //    $.ajax(url + $.param({
        //        RecordId: param('recordid'),
        //        CustomObjectKey: param('customobjectkey'),
        //        CRMKey: param('crmkey')
        //    }),
        //          {
        //              success: function (data, status, jqHXR) {
        //                  //if (!data) data = {};
        //                  //__this.onPageLoad(data, status, null);
        //              },
        //              error: function (jqHXR, status, error) {
        //                  //__this.onPageLoad(null, status, error);
        //              }
        //          }
        //    );
        //},

        init:function()
        {
            this.menuData = new sp.ui.navigation.NavigationMenu.DataProvider();
        },

        loadXML: function()
        {
             //clear unnecessary standard parameters, add new ones, perform encryption
            var params = this.parameters;
            var loadlocal = params.getParam("loadlocal");
            if(loadlocal) // use this for loading a local xml file
            {
                var comms = new sp.core.comms.Comms({URL:""},{dataType:"xml",showTraces:true});
                comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onComms);
                comms.load(loadlocal);
                return;
            }
            params.CRM = "";
            params.SERVERTIMEOUT = "";
            params.CRMKEY = encodeURIComponent(params.CRMKEY);
            this.__super({ recordid: params.getParam('recordid'), pageid : params.getParam('pageid') });
        },

        onLoad: function(event)
        {
            try
            {
                $(event.target.data).find("*").contents().filter(function(){return this.nodeType == 8;}).each(function(i, e){$(e).remove();});
                $(event.target.data).find("*").contents().filter(function(){return this.nodeType == 3;}).each(function(i, e){e.nodeValue = spx.decode(e.nodeValue)});
            }catch(e)
            {
                
            }
            var stringsXML = $(event.target.data).find("strings")[0];
            spx.model.Strings.getInstance().setData(stringsXML);

            var customXML = $(event.target.data).find("custom")[0];
            spx.model.CustomFields.setData(customXML);
            var globalsXML = $(event.target.data).find("globals")[0];
            spx.model.Globals.setData(globalsXML);


            this.menuData.setData(ws.applet.ApplicationData.getReferenceData("Menu.Item"));
            var applicationXML = $(event.target.data).find("ui")[0];
            this.applicationModel = new spx.model.layout.Application(applicationXML,customXML);
            var recordXML = $(event.target.data).find("data")[0];
            this.recordModel = new spx.model.datastructure.Record(recordXML);
            var fileXML = $(event.target.data).find("xml>record")[0];
            //this.recordModel.setXML(fileXML);
            var resourceXML = $(event.target.data).find("resources")[0];

            spx.model.resources.Resources.setData(resourceXML);

            var loadedData = spx.model.datalayer.FRRSLayer.convert(fileXML);
            this.recordModel.setData(loadedData);


            //this.recordModel.soundOff();
        },

        getApplicationModel:function()
        {
            return this.applicationModel;
        },

        getMenuData:function()
        {
            return this.menuData;
        },

        getRecordModel:function()
        {
            return this.recordModel;
        },

        saveXML: function()
        {
            return this.recordModel.getXML();
        },

        autopopulate:function()
        {
            this.recordModel.autopopulate();
        },

        save: function () {
            spx.setMomorycurrentWindowLocation();
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.SAVE));
            var xmlStr = this.saveXML();
            var comms = new sp.core.comms.Comms(this.parameters);
            comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSave);
            comms.load(this.parameters.FILESAVE, { xmlData: xmlStr, recordid: this.parameters.getParam('recordid') });
        },

        onSave:function(event)
        {

        }

    }
);

spx.model.CustomFields =
{
    setData:function(xml)
    {
        this.xml = xml;
    },

    getField:function(id)
    {
        if(!this.xml) return null;
        try
        {
            var result = $(this.xml).find("*[id=" + id +"]")[0];
            return result;
        }
        catch(e)
        {

        }
    }
}

spx.model.Globals =
{
    setData:function(xml)
    {
        this.xml = xml;
    },

    get:function(id)
    {
        if(!this.xml) return null;
        try
        {
            var result = $(this.xml).find("*[id=" + id +"]")[0];
            return $(result).text();
        }
        catch(e)
        {

        }
        return null;
    }
}

spx.model.DataWrapper = sp.core.events.EventDispatcher.extend
(
    // basic abstract class for objects with properties created from xml
    {
        __constructor:function(xml)
        {
            this.__super();
            this.data = sp.utils.XMLUtils.xmlToObject(xml);
        },

        get:function(prop)
        {
            return this.data[prop];
        },

        set:function(prop,val)
        {
            this.data[prop] = val;
        },

        toString:function()
        {
            var str = "[DataWrapper";
            for(var prop in this.data)
            {
                str += "\n\t\t" + prop + " : " + this.data[prop];
            }
            return str + "\n]";
        }
    }
);