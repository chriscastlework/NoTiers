sp.namespace("spx.model.filedata.Field",
             "spx.model.filedata.Record",
             "spx.model.filedata.RecordSet",
             "spx.model.filedata.FieldTypes",
             "spx.model.filedata.FieldFactory");


spx.model.filedata.AtomicElement = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(refData)
        {
            this.__super();
            this.refData = refData;
            this.data = "";//this.refData.text || this.refData.textContent || "";
        },

        setData:function(xml)
        {
            this.data = $(xml).text();
            this.__setData(xml);
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
        },

        __setData:function(data)
        {
            //overwrite to handle complex data if required (eg. by Record, RecordSet etc)
        },

        getData:function()
        {
            return this.data;
        },

        getType:function()
        {
            return "Field";
        },

        getID:function()
        {
            if(!this.refData.getAttribute("id"))
            {
                this.refData.setAttribute("id",sp.guid());
            }
            return this.refData.getAttribute("id");
        },

        getBinding:function()
        {
            return this.refData.getAttribute("binding");
        },

        getDataSource:function()
        {
            return this.getBinding() || this.getID();
        },

        getXML:function()
        {
            if(!this.getBinding()) return "";
            var enc = (this.data!=undefined)? encodeURI(this.data) : "";
            var str = "<" + spx.model.filedata.FieldTypes.FIELD + " id='" + this.getBinding() + "'>" + enc + "</" + spx.model.filedata.FieldTypes.FIELD + ">";
            return str;
        },

        toString:function()
        {
            return "["+this.getType() + " " + this.getID() + " value:" + this.getData() + "]";
        },

        soundOff:function(tabs)
        {
            tabs = tabs || "";
            //sp.out(tabs + this);
        }
    }
);

spx.model.filedata.CompoundElement = spx.model.filedata.AtomicElement.extend
(
    {
        __constructor:function(refData)
        {
            this.__super(refData);
            this.elements = [];
        },

        soundOff:function(tabs)
        {
            tabs = tabs || "";
            //sp.out(tabs + this);
            for(var i=0; i<this.elements.length; i++)
            {
                //this.elements[i].soundOff(tabs + "\t");
            }
        }
    }
);

spx.model.filedata.Record = spx.model.filedata.CompoundElement.extend
(
    {
        __constructor:function(refData)
        {
            this.__super(refData);
            this.init();
        },

        init:function()
        {
            if(this.refData.hasChildNodes())
            {
                for (var i = 0; i < this.refData.childNodes.length; i++)
                {
                    var node = this.refData.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        var element = spx.model.filedata.FieldFactory.create(node.nodeName, node);
                        if(element) this.elements.push(element);
                    }
                }
            }
        },

        __setData:function(xml)
        {
            this.data = xml || {};
            for(var i=0; i<this.elements.length; i++)
            {
                var m = $(xml).find("[id="+this.elements[i].getDataSource()+"]")[0];
                this.elements[i].setData(m || xml);
            }
        },

        getElements:function()
        {
            return this.elements;
        },

        getElementByID:function(id)
        {
            if(!id) return;
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return this.elements[i];
        },

        getElementsByID:function(id)
        {
            var result = [];
            if(!id) return result;
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) result.push(this.elements[i]);
            return result;
        },

        getType:function()
        {
            return spx.model.filedata.FieldTypes.RECORD;
        },

        toString:function()
        {
            var str = "[Record, id:" + this.getID() +"]"
            return str;
        },

        getXML:function()
        {
            var str = "<"+spx.model.filedata.FieldTypes.RECORD+" id='"+this.getID()+"'>";
            for(var i=0; i<this.elements.length; i++)
            {
                str += this.elements[i].getXML();
            }
            str += "</" + spx.model.filedata.FieldTypes.RECORD+"/>";
            return str;
        }
    }
);

spx.model.filedata.RecordSet = spx.model.filedata.CompoundElement.extend
(
    {
        __constructor:function(refData)
        {
            this.__super(refData);
            this.init();
        },

        addField:function(id)
        {

        },

        getType:function()
        {
            return spx.model.filedata.FieldTypes.RECORDSET;
        },

        init:function()
        {
            if(this.refData.hasChildNodes())
            {
                for (var i = 0; i < this.refData.childNodes.length; i++)
                {
                    var node = this.refData.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        this.record = spx.model.filedata.FieldFactory.create(node.nodeName, node);
                        break;
                    }
                }
            }
        },

        __setData:function(xml)
        {
            this.elements = [];
            if(!this.record) return;
            var nodes = xml.childNodes;
            for(var i=0; i<nodes.length; i++)
            {
                if(nodes[i].nodeName!="#text")
                {
                    var element = spx.model.filedata.FieldFactory.create(this.record.getType(), nodes[i]);
                    if(element)
                    {
                        element.setData(nodes[i]);
                        this.elements.push(element);
                    }
                }

            }
        },

        length:function()
        {
            return this.elements.length;
        },

        getElements:function()
        {
            return this.elements;
        },

        getElementAt:function(index)
        {
            if(this.elements.length>=index) return this.elements[index];
        },

        getElementByID:function(id)
        {
            if(!id) return;
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return this.elements[i];
        },

        getElementsByID:function(id)
        {
            var result = [];
            if(!id) return result;
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) result.push(this.elements[i]);
            return result;
        },

        indexOfElementByID:function()
        {
            if(!id) return -1;
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return i;
            return -1;
        },

        add:function()
        {
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
        },

        remove:function(record)
        {
            if(!record) return;
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i]==record)
                {
                    this.elements.splice(i,1);
                    this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
                    break;
                }
            }
        },

        toString:function()
        {
            var str = "[RecordSet, id:" + this.getID() +"]"
            return str;
        },

        getXML:function()
        {
            if(!this.getBinding()) return "";
            var str = "<" + spx.model.filedata.FieldTypes.RECORDSET + " id='" + this.getBinding() + "'>";
            for(var i=0; i<this.elements.length; i++)
            {
                str += this.elements[i].getXML();
            }
            str += "</" + spx.model.filedata.FieldTypes.RECORDSET + ">";
            return  str;
        }
    }
);

spx.model.filedata.Text = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.TEXT;
        }
    }
);

spx.model.filedata.Date = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.DATE;
        },

        getFormat:function()
        {

        }
    }
);

spx.model.filedata.Number = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.NUMBER;
        }
    }
);

spx.model.filedata.CurrencyValue = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.CURRENCYVALUE;
        }
    }
);

spx.model.filedata.Boolean = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.BOOLEAN;
        },

        __setData:function(val)
        {
            this.data = sp.core.data.DataUtils.toBoolean(val);
        }
    }
);

spx.model.filedata.Contact = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.CONTACT;
        }
    }
);

spx.model.filedata.SelectionIndex = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.SELECTIONINDEX;
        },

        __setData:function(val)
        {
            this.data = (val)? val.index : null;
        }
    }
);

spx.model.filedata.SelectionValue = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.SELECTIONVALUE;
        },

        setData:function(val)
        {
            this.data = (val)? val.value : null;
        }
    }
);

spx.model.filedata.SelectionLabel = spx.model.filedata.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.filedata.FieldTypes.SELECTIONLABEL;
        },

        setData:function(val)
        {
            this.data = (val)? val.label : null;
        }
    }
);

spx.model.filedata.FieldTypes =
{
    FIELD:"field",
    RECORDSET:"recordset",
    RECORD:"record",
    TEXT:"Text",
    NUMBER:"Number",
    CURRENCYVALUE:"CurrencyValue",
    DATE:"Date",
    BOOLEAN:"Boolean",
    CONTACT:"Contact",
    SELECTIONINDEX:"SelectionIndex",
    SELECTIONVALUE:"SelectionValue",
    SELECTIONLABEL:"SelectionLabel"
}

spx.model.filedata.FieldFactory =
{
    create:function(type,data)
    {
        switch (type)
        {
            case spx.model.filedata.FieldTypes.RECORD:
                return new spx.model.filedata.Record(data);
            case spx.model.filedata.FieldTypes.RECORDSET:
                return new spx.model.filedata.RecordSet(data);
            case spx.model.filedata.FieldTypes.FIELD:
                return new spx.model.filedata.AtomicElement(data);
        }
    }
}



