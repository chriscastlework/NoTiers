sp.namespace("spx.model.resources.Resources");


spx.model.resources.Resources =
{

    resources:[],

    setData:function(data)
    {
        this.resources = [];
        if(data != undefined)
        if(data.childNodes)
        {
            for(var i=0; i<data.childNodes.length; i++)
            {
                if(data.childNodes[i].nodeName!="#text")
                {
                    this.resources.push(new spx.model.resources.Resource(data.childNodes[i], data));
                }
            }
        }


    },

    getResourceByID:function(id, context)
    {
        for(var i=0; i<this.resources.length; i++)
        {
            try
            {
                if (this.resources[i].getID() == id)
                {
                    return this.resources[i].getResource(context);
                }
            }
            catch(e)
            {
                sp.out("[Resources] Unable to identify a resource. Looking for id:" + id + " resource:" + this.resources[i] + " Error:" + e.message);
            }
        }
    },

    getCustomFieldResourceByID: function (id, path) {
        for (var i = 0; i < this.resources.length; i++) {
            try {
                if (this.resources[i].getID() == id) {
                    return this.resources[i].raw;
                }
            }
            catch (e) {
                sp.out("[Resources] Unable to identify a resource. Looking for id:" + id + " resource:" + this.resources[i] + " Error:" + e.message);
            }
        }
    },

    getRawResourceByID:function(id, path)
    {
        for(var i=0; i<this.resources.length; i++)
        {
            try
            {
                if (this.resources[i].getID() == id) {
                    var result = this.resources[i].getRawResource(path);
                    return result;
                }
            }
            catch(e)
            {
                sp.out("[Resources] Unable to identify a resource. Looking for id:" + id + " resource:" + this.resources[i] + " Error:" + e.message);
            }
        }
    },

    getResource:function(val)
    {
        /* resources can be referenced in two ways in the ui:

            1. Named reference - for example

                <field id="sample" type="combo">
                    <dataProvider>
                        <resource>my_data_provider</resource>
                    </dataProvider>
                </field>

            2. Anonymous inline - for example

                <field id="sample" type="combo">
                    <dataProvider>
                        <selection>....</selection>
                    </dataProvider>
                </field>

            this methods allows any framework class to access either a named or anonymous resource easily, as well as using a direct id */
        if(val && val.nodeName)
        {
            if(val.nodeName=="resourceid") // return a resource specified with a <resource> value inside ui..
            {
                var res = this.getResourceByID(val.firstChild.nodeValue);
                return res;
            }
            else
            {
                return spx.model.resources.ResourceFactory.create(val); // return an anonymous resource specified inline..
            }
        }
        else
        {
            return this.getResourceByID(val); // return a resource specified by its id alone..
        }
    }
};

spx.model.resources.Resource = function(resourceXML, context)
{

    this.id = spx.decode(resourceXML.getAttribute("id"));
    var resource = spx.model.resources.ResourceFactory.create(sp.utils.XMLUtils.firstChild(resourceXML) || $(resourceXML).text());
    this.resource = resource.evaluated ?  resource.evaluated : resource;
    this.raw = resource.raw ? resource.raw : resource;
    this.getResource = function(context)
    {
        this.id = spx.decode(resourceXML.getAttribute("id"));
        var resource = spx.model.resources.ResourceFactory.create(sp.utils.XMLUtils.firstChild(resourceXML) || $(resourceXML).text(), context);
        this.resource = resource.evaluated ? resource.evaluated : resource;
        this.raw = resource.raw ? resource.raw : resource;
      return this.resource;
    };

    this.getRawResource = function (path)
    {
        if (path.charAt(0) == '{' && path.charAt(path.length - 1) == '}') // if this is a parameter it could be a date
        {
            return sp.core.date.Date.ReturnDateStringAsNumericValue(this.raw)
        }

        return this.raw;
    };

    this.getID = function()
    {
        return this.id;
    };

    this.toString = function()
    {
          return "[Resource id:" + this.id  + " resource:" + this.resource +"]";
    };
};


spx.model.resources.List = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(data)
        {
            this.__super();
            this.data = data;
            this.init();
        },

        init:function()
        {
            this.resources = [];
            if(this.data.hasChildNodes())
            {
                for (var i = 0; i < this.data.childNodes.length; i++)
                {
                    var node = this.data.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        var resource = spx.model.resources.ResourceFactory.create(node);
                        if(resource) this.resources.push(resource);
                    }
                }
            }
        },

        getElementByID:function(id)
        {
            //for(var i=0; i<this.resources.length; i++) if(this.resources[i].getID()==id) return this.resources[i].getResource();
            for(var i=0; i<this.resources.length; i++)
            {
                try
                {
                    if(this.resources[i].getID()==id) return this.resources[i].getResource();
                }
                catch(e)
                {
                    sp.out("[ResourceList] Unable to identify a resource. Looking for id:" + id + " resource:" + this.resources[i] + " Error:" + e.message);
                }
            }
        },

        getElements:function()
        {
            return this.resources;
        },

        toString:function()
        {
            var str = "[List ";
            for(var i=0; i<this.resources.length; i++)
            {
                str += "\n\t" + this.resources[i];
            }
            str += "\n]";
            return str;
        },

        length:function()
        {
            return this.resources.length;
        },

        get:function(index)
        {
               return this.resources[index];
        }
    }
);

spx.model.resources.Object = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(data)
        {
            this.__super();
            this.xmlData = data;
            this.data = sp.utils.XMLUtils.xmlToObject(data);
        },

        getID: function()
        {
            return this.get('id');
        },

        getResource: function()
        {
            return this.data;
        },

        getAttribute: function(attr)
        {
            return this.xmlData.getAttribute(attr);
        },

        get:function(prop)
        {
            return spx.model.Strings.getInstance().getLocalOr(this.data[prop]);
        },

        toString:function()
        {
            var str ="[Object , get:" + this.get;
            for(var prop in this.data)
            {
                str += " " + prop + ":" + this.data[prop];
            }
            str += "]";
            return str;
        }
    }
);

spx.model.resources.SelectionData = sp.core.data.SelectionData.extend
(
    {
        __constructor:function(data, options)
        {
            this.__super(data, options);
        },

        getHTML: function()
        {
            var htmlStr = "";
            for (var i = 0; i < this.data.length; i++) htmlStr += "<Option value='" + this.data[i][this.options.idProp] + "'>" + spx.model.Strings.getInstance().getLocalOr(this.options.getLabel(this.data[i])) + "</Option>";
            return htmlStr;
        }
    }
);

spx.model.resources.RadioGroupData = sp.core.data.RadioGroupData.extend
(
{

}
);

spx.model.resources.URL = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(xml)
        {
            this.target = xml.getAttribute("target") || "__blank";
            this.url = $(xml).text() || "";
        },

        getTarget:function()
        {
            return this.target;
        },

        getURL:function()
        {
            return this.url;
        },

        getSource:function()
        {
            return this.url;
        },

        toString:function()
        {
           return "[URL src=" + this.getURL() + " target:" + this.getTarget() + "]";
        }
    }
);

spx.model.resources.Value = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(xml)
        {
            this.value = $(xml).text() || "";
        },

        getValue:function()
        {
            return this.value || "";
        }
    }
);




spx.model.resources.ResourceTypes =
{
    RESOURCE:"resource",
    FORMAT:"format",
    SELECTION:"selection",
    RADIOGROUP:"radiogroup",
    LIST:"list",
    CONTACT:"contact",
    URL:"url",
    OBJECT:"object",
    XML:"xml",
    VALUE:"value",
    ORGCHARTOPTIONS:"orgchartoptions"
};

spx.model.resources.ResourceFactory =
{

    create:function(xml, context)
    {
        if(!xml) return;
        switch (xml.nodeName)
        {
            case spx.model.resources.ResourceTypes.RESOURCE:
                return new spx.model.resources.Resource(xml);
            case spx.model.resources.ResourceTypes.FORMAT:
                return spx.model.format.FormatFactory.create(xml);
            case spx.model.resources.ResourceTypes.SELECTION:
               return this.createSelection(xml);
            case spx.model.resources.ResourceTypes.RADIOGROUP:
                return this.createRadioGroup(xml);
            case spx.model.resources.ResourceTypes.LIST:
               return new spx.model.resources.List(xml);
            case spx.model.resources.ResourceTypes.XML:
               return xml;
            case spx.model.resources.ResourceTypes.OBJECT:
               return new spx.model.resources.Object(xml);
            case spx.model.resources.ResourceTypes.URL:
                return new spx.model.resources.URL(xml);
        }
        try
        {
            var obj = eval("new " + xml.nodeName  +"(xml)");
            if(obj) return obj;
        }
        catch(e)
        {
            // uncomment the line below if you are having trouble identifying bugs in the resource being created because of the try catch
            //sp.out("Error trying to evaluate resource" + xml.nodeName + " e:" + e.message);
        }
        if(xml.nodeType==4) xml = xml.nodeValue;

        return {
            raw: xml,
            evaluated: spx.evaluate(xml, context)
        };
    },

    createSelection:function(data)
    {
        var arr = [];
        var childNodes = sp.utils.XMLUtils.childNodes(data);
        for(var i=0; i<childNodes.length; i++)
        {
            arr.push({value:childNodes[i].getAttribute("id"),
                      label:(childNodes[i].firstChild)? childNodes[i].firstChild.nodeValue : ""})
        }
        var selOptions = new sp.core.data.SelectionDataOptions({idProp:"value",labelProp:"label", clearableSelection: false});
        return new spx.model.resources.SelectionData(arr,selOptions);
    },

    createRadioGroup:function(data)
    {
        var arr = [];
        var childNodes = sp.utils.XMLUtils.childNodes(data);
        for(var i=0; i<childNodes.length; i++)
        {
            arr.push({value:childNodes[i].getAttribute("id"),
                label:(childNodes[i].firstChild)? childNodes[i].firstChild.nodeValue : ""})
        }
        var selOptions = new sp.core.data.SelectionDataOptions({idProp:"value",labelProp:"label", clearableSelection: false});
        return new spx.model.resources.RadioGroupData(arr,selOptions);
    }
};


