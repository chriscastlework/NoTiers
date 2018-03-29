sp.namespace("spx.model.Strings",
             "spx.model.Strings.__INSTANCE");

spx.model.Strings = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function()
        {
            this.__super();
            this.xml = null;
            this.assignedElements = [];
        },

        setData:function(xml)
        {
            this.xml = xml;
            this.elements = {};
            try
            {
                var strings = this.xml.getElementsByTagName("string");
                for (var i = 0,string; string=strings[i]; i++) if(string.getAttribute("id")) this.elements[string.getAttribute("id")] = $(string).text();
                this.updateAssignedElements();
                this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
            }
            catch(e)
            {

            }
        },

        assignStringToElement:function(domElement,id,def)
        {
            if(!domElement || id ==undefined) return;
            var el = this.getAssignedElement(domElement);
            if(el)
            {
                el.id = id;
            }
            else
            {
                el = {element:domElement,
                      id:id}
                this.assignedElements.push(el);
            }
            this.populate(el.element, el.id);
        },

        updateAssignedElements:function()
        {
            for(var i= 0, element; element = this.assignedElements[i]; i++) this.populate(element.element, element.id);
        },

        populate:function(domElement,stringID)
        {
            $(domElement).html(this.getLocalOr(stringID));
        },

        getAssignedElement:function(element)
        {
            for(var i=0; i<this.assignedElements.length; i++)
            {
                if(this.assignedElements[i].element==element) return this.assignedElements[i] ;
            }
        },

        getLocal:function(id)
        {
            return this.elements[id] || "";
        },

        getLocalOr:function(id,alt)
        {
            return this.getLocal(id) || alt || id || "";
        },

        toString:function()
        {
            var str = "[Strings";
            for(var prop in this.elements)
            {
                str += "\t" + prop + " : " + this.elements[prop];
            }
            str += "]";
            return str;
        }
    }
);
spx.model.Strings.getInstance = function()
{
    if(!spx.model.Strings.__INSTANCE) spx.model.Strings.__INSTANCE = new spx.model.Strings();
    return spx.model.Strings.__INSTANCE;
};
