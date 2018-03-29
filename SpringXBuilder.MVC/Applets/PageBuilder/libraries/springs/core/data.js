sp.namespace("sp.core.data.DataUtils",
             "sp.core.data.DataEvent",
             "sp.core.data.IndexedDataList",
             "sp.core.data.Filter",
             "sp.core.data.ValueObject",
             "sp.core.data.SelectionDataOptions",
             "sp.core.data.SelectionData",
             "sp.core.data.LookUp",
             "sp.core.data.ArrayLookUp");


sp.core.data.ValueObject = Class.extend
(
    {
        __constructor: function(valueMap)
        {
            this.setDefaults();
            for (var prop in valueMap)
            {
                this[prop] = valueMap[prop];
            }
        },

        setDefaults: function() { }
    }
);

sp.core.data.DataUtils =
{

    valueOrEmpty: function (value)
    {
        var type = typeof(value);
        if (type==='undefined' || value===null) return "";
        return value;
    },

    isUndefined: function(item)
    {
        return typeof(item) === 'undefined';
    },

    getTimeStamp: function()
    {
        return Math.round(+new Date() / 1000);
    },

    toArray: function(obj)
    {
        if (!obj) return [];
        if (obj.splice) return obj;
        return [obj];
    },

    toBoolean: function(val,strVals)
    {
        if(val.toLowerCase) val = val.toLowerCase();
        strVals = strVals || [];
        if($.inArray("true",strVals)==-1) strVals.push("true");
        return (val)? (isNaN(Number(val)) && val.toLowerCase!=undefined)? $.inArray(val,strVals)!=-1 : Boolean(Number(val)) : false;
    },

    toNumber: function(val)
    {
        return (isNaN(Number(val))) ? 0 : Number(val);
    },

    deepCopy: function(obj)
    {
        var copy = {};
        for (var prop in obj)
        {
            if (typeof (obj[prop]) == "object")
            {
                if(!obj[prop]) return null;
                if (obj[prop].unshift != undefined)
                {
                    copy[prop] = [];
                    for (var i = 0; i < obj[prop].length; i++)
                    {
                        if (typeof (obj[prop][i] == "object"))
                        {
                            copy[prop][i] = sp.core.data.DataUtils.deepCopy(obj[prop][i]);
                        }
                        else
                        {
                            copy[prop][i] = obj[prop][i];
                        }
                    }
                }
                else
                {
                    copy[prop] = sp.core.data.DataUtils.deepCopy(obj[prop]);
                }
            }
            else
            {
                copy[prop] = obj[prop];
            }
        }
        return copy;
    },

    valueAtPath: function(obj, path)
    {
        if (!obj || !path) return;
        var parts = path.split(".");
        if (parts.length > 1)
        {
            var prop = parts.shift();
            return this.valueAtPath(obj[prop], parts.join("."));
        }
        return obj[path];
    }
};

sp.core.data.DataEvent = sp.core.events.Event.extend
(
{
	__constructor:function(target,type,data)
	{
		this.__super(target,type);
        this.data = data;
	}
}
);
sp.core.data.DataEvent.CHANGE = "data_change";
sp.core.data.DataEvent.ADD = "data_add";
sp.core.data.DataEvent.REMOVE = "data_remove";
sp.core.data.DataEvent.EDIT = "data_edit";
sp.core.data.DataEvent.SET = "data_set";
sp.core.data.DataEvent.LOADED = "data_loaded";
sp.core.data.DataEvent.SAVED = "data_saved";
sp.core.data.DataEvent.SAVE = "data_save";


// TODO deprecate..? //
sp.core.data.ItemDataEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target,type,list,action)
    {
        this.__super(target,type);
        this.list = list;
        this.action = action;
    }
}
);
sp.core.data.ItemDataEvent.CHANGE = 'dataitemchange';
sp.core.data.ItemDataEvent.ADD = 'dataitemadd';
sp.core.data.ItemDataEvent.DELETE = 'dataitemdelete';
sp.core.data.ItemDataEvent.UPDATE = 'dataitemupdate';


sp.core.data.IndexedDataList = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(dat,options)
    {
        this.__super();
        this.options = options || new sp.core.data.IndexedDataListOptions();
        this.__data = this.cleanData(sp.core.data.DataUtils.toArray(dat));
    },

    getData: function(filter)
    {
        this.__data = this.cleanData(this.__data);
        return this.__data;
    },

    setData: function(dat)
    {
        this.__data = this.cleanData(sp.core.data.DataUtils.toArray(dat));
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.SET));
        return this;
    },

    filter: function(func)
    {
        var result = [];
        for (var i = 0; i< this.__data.length; i++)
        {
            if (func(this.__data[i])) result.push(this.__data[i]);
        }
        return result;
    },

    getItemByID: function(id)
    {
        var index = this.indexOfItemByProperty(this.options.idProp, id);
        if (index != undefined) return this.__data[index];
    },

    removeItemByID: function(id)
    {
        return this.removeItemByProperty(this.options.idProp, id);
    },

    removeItemByProperty: function(prop, val)
    {
        var index = this.indexOfItemByProperty(prop, val);
        if (index != undefined)
        {
            this.removeItem(this.__data[index]);
            return true;
        }
    },

    removeItem: function(item)
    {
        var index = this.indexOf(item);
        if (index != undefined)
        {
            this.__data.splice(index, 1);
            this.dispatchEvent(new sp.core.data.ItemDataEvent(item, sp.core.data.ItemDataEvent.CHANGE, this, sp.core.data.ItemDataEvent.DELETE));
            this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
            this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.REMOVE,item));
        }
    },

    add:function(obj)
    {
        return this.updateItem(obj); // add is just a nicer-sounding method to call for explicitly pushing stuff into the list...
    },

    get:function(index)
    {
        return this.__data[index];
    },

    getItemByProperty: function(prop, val)
    {
        for (var i = 0; i < this.__data.length; i++) if (this.__data[i][prop] != undefined && this.__data[i][prop] == val) return this.__data[i];
    },

    indexOfItemByProperty: function(prop, val)
    {
        for (var i = 0; i < this.__data.length; i++) if (this.__data[i][prop] != undefined && this.__data[i][prop] == val) return i;
    },

    indexOf: function(item)
    {
        for (var i = 0; i < this.__data.length; i++) if (this.__data[i] == item) return i;
    },

    cleanData: function(dat)
    {
        for (var i = 0; i < dat.length; i++) dat[i] = this.cleanItem(dat[i]);
        return dat;
    },

    lastItem: function()
    {
        return (this.__data.length) ? this.__data[this.__data.length - 1] : null;
    },

    cleanItem: function(item)
    {
        if(item[this.options.idProp]==undefined) item[this.options.idProp] = sp.guid();
        return item;
    },

    updateItem: function(item)
    {
        var index = this.indexOfItemByProperty(this.options.idProp, item[this.options.idProp]);
        if (index != undefined)
        {
            for (var prop in item)
            {
                this.__data[index][prop] = item[prop];
            }
            this.__data[index] = this.cleanItem(this.__data[index]);
            this.dispatchEvent(new sp.core.data.ItemDataEvent(this.__data[index], sp.core.data.ItemDataEvent.CHANGE, this, sp.core.data.ItemDataEvent.UPDATE));
            this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.EDIT,this.__data[index]));

        }
        else
        {
            item = this.cleanItem(item);
            this.__data.push(item);
            this.dispatchEvent(new sp.core.data.ItemDataEvent(item, sp.core.data.ItemDataEvent.CHANGE, this, sp.core.data.ItemDataEvent.ADD));
            this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.ADD,item));
        }
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
        return item;
    },

    replaceItem: function(item)
    {
        item = this.cleanItem(item);
        var index = this.indexOfItemByProperty(this.options.idProp, item[this.options.idProp]);
        if (index != undefined)
        {
            this.__data[index] = item;
            this.dispatchEvent(new sp.core.data.ItemDataEvent(item, sp.core.data.ItemDataEvent.CHANGE, this, sp.core.data.ItemDataEvent.UPDATE));
        }
        else
        {
            this.__data.push(item);
            this.dispatchEvent(new sp.core.data.ItemDataEvent(item, sp.core.data.ItemDataEvent.CHANGE, this, sp.core.data.ItemDataEvent.ADD));
        }
        this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.EDIT, item));
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
    },

    getPropertyFromID: function(id, prop)
    {
        var item = this.getItemByID(id);
        if (item) return item[prop] || "";
        return "";
    },

    saveXML: function()
    {
        var xmlStr = "";
        return xmlStr;
    },

    length:function()
    {
        return this.__data.length;
    }

});

sp.core.data.IndexedDataListOptions = sp.core.data.ValueObject.extend
(
    {
        setDefaults:function()
        {
            this.idProp = "ID";
        }
    }
);

sp.core.data.SelectionDataOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.idProp = "ID";
        this.labelProp = "Label";
        this.clearableSelection = sp.core.data.SelectionData.AddBlankOptionDefault;
    },

    getLabel: function(dat)
    {
        return dat[this.labelProp] || "";
    }
}
);

sp.core.data.SelectionData = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(data, options)
    {
        this.__super();
        this.data = sp.core.data.DataUtils.toArray(data);
        this.options = options || new sp.core.data.SelectionDataOptions();
        if (this.options.clearableSelection) this.addBlankOption();
    },

    setDataProvider:function(data)
    {
        this.data = sp.core.data.DataUtils.toArray(data);
        if (this.options.clearableSelection) this.addBlankOption();
        this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
    },

    addBlankOption: function()
    {
        if (this.data.length == 0 || (this.data.length > 0 && (this.data[0][this.options.labelProp] != '' &&  this.data[0][this.options.labelProp] != undefined)))
        {
            var blankOption = {};
            blankOption[this.options.idProp] = '';
            blankOption[this.options.labelProp] = '';
            this.prepend(blankOption);
        }
    },
    
    prepend:function(option)
    {
        this.data.unshift(option);
        this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
    },
    
    append:function(option)
    {
        this.data.push(option);
        this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
    },

    getHTML: function()
    {
        var htmlStr = "";
        for (var i = 0; i < this.data.length; i++) htmlStr += "<Option value='" + this.data[i][this.options.idProp] + "'>" + this.options.getLabel(this.data[i]) + "</Option>";
        return htmlStr;
    },

    valueToLabel: function(val)
    {
        for (var i = 0; i < this.data.length; i++) if (this.data[i][this.options.idProp] == val) return this.options.getLabel(this.data[i]);
    },

    labelToValue: function(label)
    {
        for (var i = 0; i < this.data.length; i++) if (this.data[i][this.options.labelProp] == label) return this.data[i][this.options.idProp];
    },

    valueToIndex:function(val)
    {
        for (var i = 0; i < this.data.length; i++) if (this.data[i][this.options.idProp] == val) return i;
    },

    getValue:function(index)
    {
        try
        {
            return this.data[index][this.options.idProp];
        }
        catch(e)
        {

        }
        return null;
    },

    getLabel:function(index)
    {
        try
        {
            return this.data[index][this.options.labelProp];
        }
        catch(e)
        {

        }
        return "";
    },

    toString: function()
    {
        return this.getHTML();
    }

}
);

sp.core.data.SelectionData.AddBlankOptionDefault = false;

sp.core.data.LookUp = Class.extend
(
{
	__constructor:function(values)
	{
		this.values = values;
	},
	
	lookup:function(val)
	{
		for(var i=0; i<this.values.length; i++) if(this.values[i]==val) return i;
		return -1;
	},
	
	match:function(val,vals)
	{
		var index = this.lookup(val);
		return (index!=-1)? vals[index] || "" : "";
	}	
}
);

sp.core.data.ArrayLookUp = Class.extend
(
{
    __constructor: function(a, b)
    {
        this.a = a;
        this.b = b;
    },

    aToB: function(val)
    {
        for (var i = 0; i < this.a.length; i++) if (this.a[i] == val) return this.b[i];
    },
    
     bToA: function(val)
    {
        for (var i = 0; i <this.b.length; i++) if (this.b[i] == val) return this.a[i];
    }
}
);
