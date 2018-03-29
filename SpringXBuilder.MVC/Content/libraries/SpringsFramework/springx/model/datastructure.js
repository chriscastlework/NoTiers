sp.namespace("spx.model.datastructure.Field",
             "spx.model.datastructure.Record",
             "spx.model.datastructure.RecordSet",
             "spx.model.datastructure.FieldTypes",
             "spx.model.datastructure.FieldFactory");


spx.model.datastructure.Field = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(refData,parent)
        {
            this.__super();
            this.refData = refData || sp.utils.XMLUtils.createEmptyXMLNode();
            this.parent = parent;
            this.data = "";
            if(!this.refData.getAttribute("id"))
            {
                this.refData.setAttribute("id",sp.guid());
            }
        },

        setData:function(val,ninjaMode, path)
        {
            if (typeof(val) == 'string' && sp.core.data.DataUtils.isJSON(val)) val = JSON.parse(val);

            if (path)
            {
                if (path.split('.')[0].match(/\[(\w+)=(\w+)\]/)) //updating an element in array by prop value
                {
                    if ($.type(this.data) != 'array') this.data = sp.core.data.DataUtils.toArray(this.data);
                }
                else
                {
                    if (typeof(this.data) != 'object') this.data = {};
                }

                sp.core.data.DataUtils.setValueAtPath(this.data, path, val);
            }
            else
            {
                this.data = val;
            }
            // ninjaMode suppresses the change event and makes this a 'stealth' update. It is defined to be compatible with the
            // updateFields method on the Record object, and is not intended to be used externally. USE WITH CAUTION!
            if(!ninjaMode) this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
        },

        getData:function(path)
        {
            if (path)
            {
                if (path.split('.')[0].match(/\[(\w+)=(\w+)\]/)) //updating an element in array by prop value
                {
                    if ($.type(this.data) != 'array') this.data = sp.core.data.DataUtils.toArray(this.data);
                }

                return sp.core.data.DataUtils.valueAtPath(this.data, path);
            }
            else
            {
                return this.data;
            }
        },

        getType:function()
        {
            return spx.model.datastructure.FieldTypes.FIELD;
        },

        getID:function()
        {
            // lazy definition of id doesn't seem very sensible and seemed to be causing problems
            // when deleting items which had been added via search... moved this to constructor, leaving here in case..
            //if(!this.refData.getAttribute("id"))
            //{
            //    this.refData.setAttribute("id",sp.guid());
            //}
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

        getParentRecord:function()
        {
            return this.parent || {};
        },

        setXML:function(xml)
        {
            if(xml && $(xml).text()) this.setData($(xml).text());

        },

        getXML:function()
        {
            if(!this.getDataSource()) return "";
            var enc = '';
            var data = this.data;
            if (data != undefined)
            {

                if ($.type(data) == 'object' || $.type(data) == 'array')
                {
                    data = JSON.stringify(data);
                }
                enc = spx.encode(data);
            }
            return "<" + spx.model.datastructure.FieldTypes.FIELD + " id='" + this.getDataSource() + "'>" + enc + "</" + spx.model.datastructure.FieldTypes.FIELD + ">";
        },

        toString:function()
        {
            return "["+this.getType() + " " + this.getID() + " value:" + this.getData() + "]";
        },

        soundOff:function(tabs)
        {
            tabs = tabs || "";
            sp.out(tabs + this);
        },

        autopopulate:function()
        {
            this.dispatchEvent(new spx.events.TestEvent(this,spx.events.TestEvent.AUTOPOPULATE));
        },

        findSibling:function(id)
        {
            //sp.out("Looking on " + this + " for sibling with id:" + id);
            if(this.parent)
            {
                //sp.out("this.parent:" + this.parent);
                var el = this.parent.getElementByID(id);
                //sp.out("found..:" + el);
            }
        },

        findCousin:function(id)
        {
           // sp.out("Looking on " + this + " for element wth id:" + id);
            if(this.parent)
            {
                var el = this.parent.getElementByID(id);
                if(el)
                {
                    return el;
                }
                else
                {
                    return this.parent.findCousin(id);
                }
            }
        }
    }
);

spx.model.datastructure.Record = spx.model.datastructure.Field.extend
(
    {
        __constructor:function(refData,parent)
        {
            this.__super(refData,parent);
            this.elements = {};
            this.__init();
        },

        __init:function()
        {
            if(this.refData.hasChildNodes())
            {
                for (var i = 0; i < this.refData.childNodes.length; i++)
                {
                    var node = this.refData.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        var element = spx.model.datastructure.FieldFactory.create(node.nodeName, node, this);
                        element.addEventListener(this,sp.core.data.DataEvent.CHANGE,this.onFieldChange);
                        if(element) this.elements[element.getID()] = element;
                    }
                }
            }
            /* This is not an ideal solution, but necessary to allow the UI to access the 'special' id attribute of a
               record directly, as if it were a regular field */
            this.idElement = this.getIdElement();
            //new spx.model.datastructure.Field(sp.utils.XMLUtils.strToXML("<field id='id'/>"));
            //this.idElement.setData(this.refData.getAttribute("id"));
            //this.elements["id"] = this.idElement;
        },

        getIdElement:function()
        {
            if(!this.idElement)
            {
                this.idElement = new spx.model.datastructure.Field(sp.utils.XMLUtils.strToXML("<field id='id'/>"));
                this.idElement.setData(this.refData.getAttribute("id"));
                this.elements["id"] = this.idElement;
            }
            return this.idElement
        },

        setID:function(id)
        {
            this.getIdElement.setData(id);
        },

        getID:function()
        {
             return this.idElement.getData() || this.refData.getAttribute('id') || '';
        },

        onFieldChange:function(event)
        {
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE,event.target));
        },

        setData:function(data, path)
        {
            data = data || {};
            for(var prop in this.elements)
            {
                var ds = this.elements[prop].getDataSource();
                this.elements[prop].setData(data[ds], path);
            }
            this.__super(data, path);
        },

        getData:function()
        {
            return this.getElements();
        },

        addElement:function(element)
        {
            if(element && element.getID())
            {
                element.addEventListener(this,sp.core.data.DataEvent.CHANGE,this.onFieldChange);
                this.elements[element.getID()] = element;
            }
        },

        getElements:function()
        {
            var result = [];
            for(var prop in this.elements)
            {
                result.push(this.elements[prop]);
            }
            return result;
        },

        getElementByID:function(id, getTrailingPath)
        {
            if (id.indexOf('.') > -1)
            {
                if (id.indexOf('getId()') > -1)
                {
                    id = id.replace('getId()', '[CrmId=' + this.getID() +']');
                }

                var dataPathArray = id.split('.');
                var currentPart = dataPathArray.shift();
                var el;
                if (currentPart == 'parent' && this.parent)
                {
                    el = this.parent.parent; //we don't need the parent recordset context, but the parent above.
                }
                else if (currentPart == 'root')
                {
                    el = spx.Model.getRecordModel();
                }
                else
                {
                    el = this.getElementByID(currentPart, getTrailingPath);
                }

                if (el)
                {
                    if (el.getType() == spx.model.datastructure.FieldTypes.FIELD)
                    {
                        if (getTrailingPath)
                        {
                            return {element: el, path: dataPathArray.join('.')};
                        }
                        else
                        {
                            return el;
                        }
                    }
                    else
                    {
                        return el.getElementByID(dataPathArray.join('.'), getTrailingPath);
                    }
                }
            }
            else
            {
                return this.elements[id];
            }
        },

        getElementValue:function(id)
        {
            var el = this.getElementByID(id, true);
            if (el)
            {
               return el.element ? el.element.getData(el.path) : el.getData(el.path);
            }
        },

        getType:function()
        {
            return spx.model.datastructure.FieldTypes.RECORD;
        },

        toString:function()
        {
            return "[Record, id:" + this.getID() +"]";
        },

        setXML:function(xml)
        {
            if(!xml) return;
            for(var prop in this.elements)
            {
                var m = $(xml).find("[id="+this.elements[prop].getDataSource()+"]")[0];
                this.elements[prop].setXML(m || xml);
            }
        },

        getXML:function()
        {
            var str = "<"+spx.model.datastructure.FieldTypes.RECORD+" id='"+this.getID()+"'>";
            for(var prop in this.elements)
            {
                if(prop!="id") str += this.elements[prop].getXML();
            }
            str += "</" + spx.model.datastructure.FieldTypes.RECORD+">";
            return str;
        },

        updateField:function(field,value)
        {
            var el = this.getElementByID(field,true);
            if(el)
            {
                el.element.setData(value);
            }
        },

        updateFields:function(hashmap,ninjaMode)
        {
            // accepts a hash map in the format [{prop1:val1, prop2:val2}
            for(var prop in hashmap)
            {
                try
                {
                    if (prop.indexOf('.') > -1)
                    {
                        var el = this.getElementByID(prop, true);
                        sp.out("   " + prop + " : "  + el);
                        if (el) el.element.setData(hashmap[prop], ninjaMode, el.path);
                    }
                    else
                    {
                        this.getElementByID(prop).setData(hashmap[prop],ninjaMode);
                        this.data[prop] = hashmap[prop];
                    }
                }
                catch(e)
                {
                    //TODO log error
                }
            }
        },

        soundOff:function(tabs)
        {
           tabs = tabs || "";
           sp.out(tabs + this);
           for(var prop in this.elements)
           {
               this.elements[prop].soundOff(tabs+"\t");
           }
        },

        autopopulate:function()
        {
            for(var prop in this.elements)
            {
                this.elements[prop].autopopulate();
            }
        }

    }
);

spx.model.datastructure.RecordSet = spx.model.datastructure.Field.extend
(
    {
        __constructor:function(refData,parent)
        {
            this.__super(refData,parent);
            this.elements = [];
            this.__init();
        },

        __init:function()
        {

        },

        addField:function(id)
        {

        },

        getType:function()
        {
            return spx.model.datastructure.FieldTypes.RECORDSET;
        },

        setData:function(data)
        {
            data = data || [];
            this.elements = [];
            var refRecord = sp.utils.XMLUtils.firstChild(this.refData);
            if(refRecord)
            {
                for(var i=0; i<data.length; i++)
                {
                    var element = spx.model.datastructure.FieldFactory.create(refRecord.nodeName, refRecord, this);
                    if(element)
                    {
                        element.addEventListener(this,sp.core.data.DataEvent.CHANGE,this.onRecordChange);
                        element.setData(data[i]);
                        this.elements.push(element);
                    }
                }
            }
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.SET));
        },

        getData:function()
        {
            return this.getElements();
        },

        onRecordChange:function(event)
        {
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE,event.target));
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
            var match = /^\[(.*?)\]/g.exec(id);
            if(match && match[1])
            {
                var index = match[1];
                var bits = id.split("]");
                bits.shift();
                var residual = bits.join("]");
                if(this.elements[index])
                {
                    return (residual && this.elements[index].getElementByID)? this.elements[index].getElementByID(residual) : this.elements[index];
                }
            }
            else
            {
                for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return this.elements[i];
            }
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

        getElementByFieldValue:function(prop,val)
        {
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].getElementValue(prop) == val) return this.elements[i];
            }
        },

        create:function(data)
        {
            // this will create an empty record based on the data 'template' defined in the
            // data structure in the applet definition. it will then populate it with 'real' values
            var refRecord = sp.utils.XMLUtils.firstChild(this.refData);
            if(refRecord)
            {
                var element = spx.model.datastructure.FieldFactory.create(refRecord.nodeName, refRecord, this);
                data = data || {};
                if(!data.id) // we need to ensure the data has an id as a minimum..
                {
                    data.id = sp.guid();
                }
                if(element) element.setData(data);
                return element;
            }

        },

        add:function(record)
        {
            sp.out("Adding record:" + record + " id:"  + record.getID());
            record = record || this.create();
            sp.out("looking for existing element:" + this.getElementByID(record.getID()));
            if(this.getElementByID(record.getID()))
            {
                sp.out("[RecordSet Error: attempted to add a record which already exists");
                //sp.out("--Sound off-------------------");
                //this.soundOff();
                //sp.out("------------------------------");
                return;
            }
            record.addEventListener(this,sp.core.data.DataEvent.CHANGE,this.onRecordChange);
            this.elements.push(record);
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.ADD,record));
            //this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE,record));
            return record;
        },

        remove:function(record)
        {
            if(!record) return;
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i]==record)
                {
                    var el = this.elements[i];
                    this.elements.splice(i,1);
                    this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.REMOVE,el));
                    //this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE,el));
                    break;
                }
            }
        },

        toString:function()
        {
            var str = "[RecordSet, id:" + this.getID() +"]"
            return str;
        },

        setXML:function(xml)
        {
            this.elements = [];
            if(!this.record) return;
            var nodes = xml.childNodes;
            for(var i=0; i<nodes.length; i++)
            {
                if(nodes[i].nodeName!="#text")
                {
                    var element = spx.model.datastructure.FieldFactory.create(this.record.getType(), nodes[i], this);
                    if(element)
                    {
                        element.setXML(nodes[i]);
                        this.elements.push(element);
                    }
                }

            }
        },

        getXML:function()
        {
            if(!this.getDataSource()) return "";
            var str = "<" + spx.model.datastructure.FieldTypes.RECORDSET + " id='" + this.getDataSource() + "'>";
            for(var i=0; i<this.elements.length; i++)
            {
                str += this.elements[i].getXML();
            }
            str += "</" + spx.model.datastructure.FieldTypes.RECORDSET + ">";
            return  str;
        },

        soundOff:function(tabs)
        {
            tabs = tabs || "";
            sp.out(tabs + this);
            for(var i=0; i<this.elements.length; i++)
            {
                this.elements[i].soundOff(tabs+"\t");
            }
        }
    }
);

spx.model.datastructure.FieldTypes =
{
    FIELD:"field",
    RECORDSET:"recordset",
    RECORD:"record"
};

spx.model.datastructure.FieldFactory =
{
    create:function(type,node,parent)
    {
        try
        {
            if(node.getAttribute("model")) return eval("new " + node.getAttribute("model")  +"(node,parent)");
        }
        catch(e)
        {

        }
        switch (type)
        {
            case spx.model.datastructure.FieldTypes.RECORD:
                return new spx.model.datastructure.Record(node,parent);
            case spx.model.datastructure.FieldTypes.RECORDSET:
                return new spx.model.datastructure.RecordSet(node,parent);
            case spx.model.datastructure.FieldTypes.FIELD:
                return new spx.model.datastructure.Field(node,parent);
        }
    }
}



