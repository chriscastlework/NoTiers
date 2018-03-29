sp.namespace("pb.model.fields");


function checkForDuplicates(items, item) { // sorry not sure where to put this function?
    for (var i = 0; i < items.length-1; i++) {
        if (item._id === items[i]._id) {
            return true;
        }
    }
    return false;
};

pb.model.fields.Fields = sp.core.events.EventDispatcher.extend
({
    __constructor:function(userFields,crmData)
    {
        this.__super();
        this.items = []; //new pb.model.fields.DefaultFields().getDefaultValues();
        di.resolve("CRMEntities").addEventListener(this,pb.model.LoadEvent.COMPLETE,this.onLoadCRMData);
    },
    loadData:function(data)
    {
        data = data || {};

        // set up the user defined values..
        var values = data.values || [];
        for(var i=0; i<values.length; i++)
        {
            this.items.push(this.createValue(values[i]));
        }
        this.addDefaults(this.items);

        var derived = data.derived || [];
        for(var i=0; i<derived.length; i++)
        {
            var item = this.createDerived(derived[i]);
            this.items.unshift(item);
        }
        var conditional = data.conditional || [];
        for(var i=0; i<conditional.length; i++)
        {
            var item = this.createConditional(conditional[i]);
            this.items.unshift(item);
        }



        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.LoadEvent.COMPLETE));
    },
    addDefaults:function(items)
    {
        new pb.model.fields.DefaultFields().addDefaultValues(items);
    },
    onLoadCRMData:function(event)
    {
        this.crmOrg = di.resolve("CRMEntities").getOrg();
    },
    getDefaultPageContext:function()
    {
        var crmFields = this.crmOrg.fields();
        if(crmFields.length) return crmFields[0];
    },
    isLoaded:function()
    {
        return this._isLoaded;
    },
    getCRMOrg:function()
    {
        return this.crmOrg;
    },
    forwardEvent:function(event)
    {
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    createValue:function(data)
    {
        var item = new pb.model.fields.ValueField(data)
        item.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardEvent);
        item.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onFieldDeleted);
        return item;
    },
    addValue:function()
    {
        var item = this.createValue();
        this.items.unshift(item);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
        return item;
    },
    createDerived:function(data)
    {
        var item = new pb.model.fields.DerivedField(data);
        item.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardEvent);
        item.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onFieldDeleted);
        return item;
    },
    addDerived:function()
    {
        var item = this.createDerived();
        this.items.unshift(item);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
    },
    createConditional:function(data)
    {
        var item = new pb.model.fields.ConditionalField(data);
        item.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardEvent);
        item.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onFieldDeleted);
        return item;
    },
    addConditional:function()
    {
        var item = this.createConditional();
        this.items.unshift(item);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
    },
    onFieldDeleted:function(event)
    {
        // triggered by any item when it is removed by the user..
        _.pull(this.items,event.target);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
    },
    getMappableItems:function()
    {
      return this.getItemsByFieldType((pb.model.fields.FieldType.VALUE))
              .concat(this.getItemsByFieldType(pb.model.fields.FieldType.DERIVED))
              .concat(this.getItemsByFieldType(pb.model.fields.FieldType.CONDITIONAL));
    },
    getItems:function()
    {
        return this.items;
    },
    getItemById:function(id)
    {
        for(var i=0; i<this.items.length; i++)
        {
            if(this.items[i].id()==id) return this.items[i];
        }
    },
    getItemsByObjectType:function(type)
    {
        var result = [];
        for(var i=0; i<this.items.length; i++)
        {
            if(this.items[i].objectType && this.items[i].objectType() && this.items[i].objectType().getType()==type) result.push(this.items[i]);
        }
        return result;
    },
    getItemsByFieldType:function(type)
    {
        var result = [];
        for(var i=0; i<this.items.length; i++)
        {
            if(this.items[i].fieldType && this.items[i].fieldType()==type) result.push(this.items[i]);
        }
        return result;
    },
    getItemsByValueType:function(type)
    {
        var result = [];
        var args = Array.prototype.slice.call(arguments);
        var items = this.getAllUserFields();
        for(var i=0; i<items.length; i++)
        {
            if(items[i].valueType && args.indexOf(items[i].valueType())!=-1) result.push(items[i]);
        }
        return result;
    },
    getPageContextFields:function()
    {
        return di.resolve("PageContext").getFields();
    },
    getFieldsByType:function(type)
    {
        // type is a number which ANDs out to the required types..
        var result = (type & pb.model.fields.FieldType.CRM)? di.resolve("CRMEntities").getAssignableFields() : [];
        for(var i=0; i<this.items.length; i++)
        {
            if(type & this.items[i].fieldType())
            {
                result.push(this.items[i]);
            }
        }
        return result;
    },
    getAllValues:function()
    {
        return this.getFieldsByType(pb.model.fields.FieldType.VALUE);
    },
    getAllDerivedValues:function()
    {
        return this.getFieldsByType(pb.model.fields.FieldType.DERIVED);
    },
    getAllUserFields:function()
    {
        return this.getFieldsByType(pb.model.fields.FieldType.DERIVED |
                                    pb.model.fields.FieldType.VALUE |
                                    pb.model.fields.FieldType.CONDITIONAL);
    },
    getAllFields:function()
    {
        return this.getFieldsByType(
                                          pb.model.fields.FieldType.CRM
                                        | pb.model.fields.FieldType.VALUE
                                        | pb.model.fields.FieldType.DERIVED
                                        | pb.model.fields.FieldType.CONDITIONAL
                                   );
    },
    deepSearchEntity:function(id,debug)
    {
        return this.crmOrg.deepSearchEntity(id,debug) || this.getItemById(id);
    },
    filterFieldsByFieldTypeAndObjectType:function(fieldType,objectType)
    {

    },
    getAllAtomicFields:function()
    {
        var fields = this.getFieldsByType(
                                                  pb.model.fields.FieldType.CRM
                                                | pb.model.fields.FieldType.VALUE
                                                | pb.model.fields.FieldType.DERIVED
                                         );
        var result = [];
        for(var i=0; i<fields.length; i++)
        {
           if(fields[i].objectType().isAtomic()) result.push(fields[i]);
        }
        return result;
    },
    getData:function()
    {
        var data = {};
        var values = this.getItemsByFieldType(pb.model.fields.FieldType.VALUE);
        data.values = [];

        for(var i=0; i<values.length; i++)
        {
            //  if(values[i].removeable()) data.values.push(values[i].getData());// We need it to save all the fields else the page viewer doesnt know about them
            data.values.push(values[i].getData()); // saves the fields 
        }
        var derived = this.getItemsByFieldType(pb.model.fields.FieldType.DERIVED);
        data.derived = [];
        for(var i=0; i<derived.length; i++)
        {
            data.derived.push(derived[i].getData());
        }
        var conditional = this.getItemsByFieldType(pb.model.fields.FieldType.CONDITIONAL);
        data.conditional = [];
        for(var i=0; i<conditional.length; i++)
        {
            data.conditional.push(conditional[i].getData());
        }
        return data;
    },
    findItemByFieldId:function(id)
    {
        return this.crmOrg.findItemByFieldId(id) || this.getItemById(id);
    },
    findFirstValueFieldWithValue:function(val)
    {
        var valueFields = this.getAllValues();
        for(var i=0; i<valueFields.length; i++)
        {
            if(valueFields[i].value()==val) return valueFields[i];
        }
    }
});
di.register("Fields")
    .as(pb.model.fields.Fields)
    .asSingleton();

pb.model.fields.DefaultFields = Class.extend
({
    getDefaultValues:function()
    {
        var yes = new pb.model.fields.ValueField( {
                                                     id:pb.model.fields.DefaultFields.YES,
                                                     name:"YES",
                                                     valueType:pb.model.fields.ValueType.BOOLEAN,
                                                     value:"true"});

        var no = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.NO,
                                                    name:"NO",
                                                    valueType:pb.model.fields.ValueType.BOOLEAN,
                                                    value:"false"});

        var today = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.TODAY,
                                                    name:"TODAY",
                                                    valueType:pb.model.fields.ValueType.DATE,
                                                    value: pb.model.fields.ValueType.TODAY
                                                    });

        var space = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.SPACE,
                                                    name:"SPACE_SYMBOL",
                                                    valueType:pb.model.fields.ValueType.SMALLTEXT,
                                                    value:" "});

        var comma = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.COMMA,
                                                    name:"COMMA",
                                                    valueType:pb.model.fields.ValueType.SMALLTEXT,
                                                    value:","});

        var pi = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.PI,
                                                    name:"PI",
                                                    valueType:pb.model.fields.ValueType.NUMBER,
                                                    value:Math.PI});

        var red = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.RED,
                                                    name:"RED",
                                                    valueType:pb.model.fields.ValueType.COLOR,
                                                    value:"#FF0000"});

        var amber = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.AMBER,
                                                    name:"AMBER",
                                                    valueType:pb.model.fields.ValueType.COLOR,
                                                    value:"#FF7f00"});

        var green = new pb.model.fields.ValueField( {
                                                    id:pb.model.fields.DefaultFields.GREEN,
                                                    name:"GREEN",
                                                    valueType:pb.model.fields.ValueType.COLOR,
                                                    value:"#00FF00"});

        var yearStart = new pb.model.fields.ValueField ({
                                                            id:pb.model.fields.DefaultFields.YEARSTART,
                                                            name:"YEAR START",
                                                            valueType:pb.model.fields.ValueType.YEARSTART,
                                                            value:pb.model.fields.ValueType.YEARSTART
                                                        });

        var yearEnd = new pb.model.fields.ValueField ({
                                                            id:pb.model.fields.DefaultFields.YEAREND,
                                                            name:"YEAR END",
                                                            valueType:pb.model.fields.ValueType.YEAREND,
                                                            value:pb.model.fields.ValueType.YEAREND
                                                        });

        var values =  [yes,no,today,yearStart,yearEnd,space,comma,pi,red,amber,green];
       
        for(var i=0; i<values.length; i++)
        {
            values[i].removeable(false);
        }
        return values;

    },
    addDefaultValues:function(arr)
    {
        // add any missing defaults..
        function checkExists(id)
        {
            for(var i=0; i<arr.length; i++)
            {
                if(arr[i].id()==id)
                {
                    return true;
                }
            }
        }
        var defaults = this.getDefaultValues();
        for(var i=0; i<defaults.length; i++)
        {
            var check = checkExists(defaults[i].id());
            if(!checkExists(defaults[i].id()))
            {
                arr.push(defaults[i]);
            }
        }
    }
});
pb.model.fields.DefaultFields.YES       = 1;
pb.model.fields.DefaultFields.NO        = 2
pb.model.fields.DefaultFields.TODAY     = 3;
pb.model.fields.DefaultFields.SPACE     = 4;
pb.model.fields.DefaultFields.COMMA     = 5;
pb.model.fields.DefaultFields.PI        = 6;
pb.model.fields.DefaultFields.RED       = 7;
pb.model.fields.DefaultFields.AMBER     = 8;
pb.model.fields.DefaultFields.GREEN     = 9;
pb.model.fields.DefaultFields.YEARSTART = 10;
pb.model.fields.DefaultFields.YEAREND = 11;

pb.model.fields.PageContext = sp.core.events.EventDispatcher.extend
({
    __constructor: function() {
        this.__super();
    },
    setContext: function(val) {
        var from = this._context;
        this._context = val;
        this.dispatchEvent(new pb.model.ModelEvent(this, pb.model.ModelEvent.CHANGE, "context", from, this._context));
    },
    getContext: function() {
        return this._context;
    },
    getFields: function() {
        return this.getContext().allFields();
    }
});

di.register("PageContext")
    .as(pb.model.fields.PageContext)
    .asSingleton();

pb.model.fields.Field = sp.core.events.EventDispatcher.extend
({
    __constructor:function(data)
    {
        this.__super();
        data = data || {};
        this._id = data.id || data.id || sp.guid(4);
        this._name = data.Name || data.name;
        this._fieldType;                 // the class of field - CRM, Value, Derived or Conditional
        this._objectType;                // the primary data type represented
        this._contentType;               // for collections and enums the object type managed by this object
        this._fields = [];               // any child properties of this field
        this._removeable = (data.removeable!=undefined)? data.removeable : true;
    },
    toString:function(tabs)
    {
        return "[Field name:" + this.name() + " type:" + this.fieldType() + " objectType:" + this.objectType() + " contentType:" + this.contents() + "]";
    },
    removeable:function(val)
    {
        if(arguments.length)
        {
            this._removeable = val;
        }
        return this._removeable
    },
    fieldType:function()
    {
        return this._fieldType;
    },
    // This is an association if it's a compound object and it is not a list
    isAssociation: function () {
        return this._objectType.isCompound() && !this._objectType.isCollection();
    },
    isCRMField:function()
    {
        return this._fieldType == pb.model.fields.FieldType.CRM;
    },
    isDerivedField:function()
    {
        return this._fieldType == pb.model.fields.FieldType.DERIVED;
    },
    isConditionalField:function()
    {
      return this._fieldType == pb.model.fields.FieldType.CONDITIONAL;
    },
    isValueField:function()
    {
      return this._fieldType == pb.model.fields.FieldType.VALUE;
    },
    isUserCreatedField:function()
    {
        return this.isValueField() || this.isDerivedField() || this.isConditionalField();
    },
    objectType:function()
    {
        return this._objectType;
    },
    contentType:function()
    {
        return this._contentType;
    },
    id:function()
    {
        return this._id;
    },
    name:function()
    {
        if(arguments.length)
        {
            var from = this._name;
            this._name = arguments[0];
            this.dispatchChangeEvent("name",from,this._name);
        }
        return this._name;
    },
    hasFields:function()
    {
        return this.fields().length;
    },
    fields:function()
    {
        // 17.5.2016 changed htis....not sure it is necessary switch back if problems..
       // return (this.contentType())? this.contentType().fields() : this._fields;
        return this._fields;
    },
    getFieldsForTypes:function()
    {
        var fields = this.fields();
        var result = [];
        for(var i=0; i<fields.length; i++)
        {
            if(args.indexOf(fields[i].objectType())!=-1) result.push(fields[i]);
        }
        return result;
    },
    getFieldById:function(id)
    {
        var fields = this.fields();
        for(var i=0; i<fields.length; i++)
        {
            if(fields[i].id()==id) return fields[i];
        }
    },
    getFieldByFieldId:function(id)
    {
        var fields = this.fields();
        for(var i=0; i<fields.length; i++)
        {
            if(fields[i].fieldId()==id) return fields[i];
        }
    },
    dispatchChangeEvent:function(prop,from,to)
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,prop,from,to));
    },
    allFields:function()
    {
        var result = [this];
        for(var i=0; i<this._fields.length; i++)
        {
            result = result.concat((this._fields[i].allFields()));
        }
        return result;
    },
    delete:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE))
    },
    isValid:function()
    {
        //allows objects to ensure that they have all valid properties set to be
        // consumed by the business logic or absent themselves from the list returned
        return true;
    },
    getData:function()
    {
        var data = {};
        data.id = this._id;
        data.name = this._name;
        data.fieldType = this._fieldType;
        data.objectType = this._objectType.getType();
        data.contentType = this._contentType;
        data.removeable = this._removeable;
        return data;
    },
    isRequired:function()
    {
        return false; // only CRM fields should really ever be required, so default is false...
    }
});

pb.model.fields.ObjectType =  Class.extend
({
    // TODO ObjectType should really include both the type AND the contnt type
    // otherwise ENUMs have to decide if they are COMPOUND or ATOMIC without knowing what their
    // content type is. But actually an ENUM's status as atomic or compound is not a static property, it varies
    // depending on the content is represennts. So we need to rewrite this class to include both the type and the content
    // type. This will require a MAJOR refactor of the entire solution, because lots of things consume the content type
    // as a property of the parent Field, not as a property of the objectType
    __constructor:function(type)
    {
        this.type = type;
    },
    toString:function()
    {
        return "[ObjectType:" + pb.model.fields.ObjectType.objectTypeToString(this.type) + "]";
    },
    getType:function()
    {
        return this.type;
    },
    isAtomic:function()
    {
        return (this.getType() & (
                                      pb.model.fields.ObjectType.STRING
                                    | pb.model.fields.ObjectType.NUMBER
                                    | pb.model.fields.ObjectType.DATE
                                    | pb.model.fields.ObjectType.BOOLEAN
                                ))? true : false;
    },
    isCompound:function()
    {
        return (this.getType() & (
                                    pb.model.fields.ObjectType.CRMOBJECT
                                    | pb.model.fields.ObjectType.COLLECTION
                                    | pb.model.fields.ObjectType.ENUM
                                    | pb.model.fields.ObjectType.OBJECT
                                    | pb.model.fields.ObjectType.LINKLIST
                                    | pb.model.fields.ObjectType.LINK
                                 ))? true : false;
    },
    isString:function()
    {
        return this.type == pb.model.fields.ObjectType.STRING? true : false;
    },
    isBoolean:function()
    {
        return this.type == pb.model.fields.ObjectType.BOOLEAN;
    },
    isNumber:function()
    {
        return this.type == pb.model.fields.ObjectType.NUMBER;
    },
    isDate:function()
    {
        return this.type == pb.model.fields.ObjectType.DATE;
    },
    isObject:function()
    {
        return this.type == pb.model.fields.ObjectType.OBJECT;
    },
    isEnum:function()
    {
        return this.type == pb.model.fields.ObjectType.ENUM;
    },
    isCollection:function()
    {
        return this.type == pb.model.fields.ObjectType.COLLECTION;
    },
    isLink:function()
    {
        // ie this object represents a relationship between its content type and the context - eg a DealContact is an Association<Contact> which will be in the context of a deal
        return this.type == pb.model.fields.ObjectType.LINK;
    },
    isLinkList: function()
    {
        // ie this object represents a list of associated objects - eg a Deal has many associated Contacts
        return this.type == pb.model.fields.ObjectType.LINKLIST;
    },
    clone:function()
    {
        return new pb.model.fields.ObjectType(this.type);
    }
});

/*------------------------------------------------------------------
// CRM Fields
--------------------------------------------------------------------*/
pb.model.fields.CRMField = pb.model.fields.Field.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.data = data;
        this._id = data.Id;
        this._fieldId = data.Id;
        this._name = data.Name;
        this._path = "";
        this._fieldType = pb.model.fields.FieldType.CRM;
        this._fields = [];
        this._contents = null;
        this._contentType = null;
        this._ancestry = [];
        this.setTypes(data.Type);
    },
    fieldId:function()
    {
        return this._fieldId;
    },
    id:function()
    {
        return (this.immediateAncestor())? this.immediateAncestor().id() + "." + this._id : this._id;
    },
    toString:function(tabs)
    {
        return "[CRMObject id:" + this.id() + "]";//"  objectType:  " + this.objectType() + " contentType:" + this.contentType()+"]";
        //Uncomment below in order to show a recursive representation of an object as its toString method
        /*tabs = tabs || 0;
        var str = "[CRMObject path:" + this.path() +"]";
        var tabStr = "";
        for(var t=0; t<tabs; t++)
        {
            tabStr += "  ";
        }
        for(var i=0; i<this._fields.length; i++)
        {
            str += "\n"+tabStr + this._fields[i].toString(tabs+1);
        }
        return str;*/
    },
    getObjectOrContentType:function()
    {
        return (this.objectType().isEnum())? this.contents() : this.objectType();
    },
    setTypes:function(type)
    {
        // parse the type and convert string object type into an actual  ObjectType instance
        var parts = type.split(/[\<\>]+/);
        this._objectType = new pb.model.fields.ObjectType(pb.model.fields.ObjectType.fromCRMType(parts[0]));


        // if the type includes an optional <CONTENTTYPE> then set his value for now... it will  be
        // converted into an actual instance of an entity in the populate method called by the CRMFields
        // instance after it has created all core entities
        if(parts[1])
        {
            this._contentType = parts[1];
            this._contents = new pb.model.fields.ObjectType(pb.model.fields.ObjectType.fromCRMType(parts[1]));
        }
    },
    contents:function()
    {
        //TODO this is a laste minute hack - very bad. We need to handle ENUMS which can represent atomic types Currently the whole code is
        // expecting that enums always represent compound field types like Contact or Task.
        // It's one hour before my holiday starts, and this was raised as a requirement an hour ago, so this will have to do as a dirty hack.
        // I am adding a _contents property which represents the original content type and is not overridden with a field in the populate function
        // later on we need update and amend the whol field and obkect type class to reflect the dual nature of ENUMS
        return this._contents;
    },
    contentType:function()
    {
        return this._contentType;
    },
    immediateAncestor:function()
    {
        return (this._ancestry && this._ancestry.length)? this._ancestry[this._ancestry.length-1] : null;
    },
    ancestry:function(val)
    {
        if(val!=undefined)
        {
            this._ancestry = val;
        }
        return this._ancestry;
    },
    name:function()
    {
        this.__super();
        return (this.objectType().isCollection() && this.contentType() && this.contentType().name)? this._name+"->"+this.contentType().name() : this._name;
    },
    isLookUp:function()
    {
        return (this.lookUpPath() && !this.isCollection())? true : false;
    },
    findAncestorById:function(id)
    {
        if(this.fieldId()==id) return this;
        var field = this.getFieldByFieldId(id);
        if(field) return field;
        if(this.immediateAncestor())
        {
            return this.immediateAncestor().findAncestorById(id);
        }
    },
    relatedObject:function()
    {
        sp.out(this + "\n RelatedField:" + this.data.RelatedField  +"\n ImmediateAncestor:" + this.immediateAncestor());
        if(this.data.RelatedField)
        {
            return this.findAncestorById(this.data.RelatedField);
            //return this.immediateAncestor().getFieldByFieldId(this.data.RelatedField);
        }
    },
    isCollection:function()
    {
        return this._objectType.getType()==pb.model.fields.ObjectType.COLLECTION;
    },
    lookUpPath:function()
    {
        return this.data.LookupPath;
    },
    hasAncestor:function(entity)
    {
        for(var i=0; i<this._ancestry.length; i++)
        {
            if(this._ancestry[i].fieldId()==entity.fieldId()) return true;
        }
    },
    numberOfAncestors:function()
    {
        return this._ancestry.length;
    },
    getAncestryWithSelf:function()
    {
        var result = this._ancestry.concat([this]);
        return result;
    },
    path:function()
    {
        var path = "";
        if(!this._ancestry) return this.name();
        for(var i=0; i<this._ancestry.length; i++)
        {
            path += (i)? "." : "";
            path += this._ancestry[i].name();
        }
        return (path)? path + "." + this.name() : this.name();
    },
    createDescendant:function(data,iterations)
    {
        var entity = new pb.model.fields.CRMField(data);
        if(this.hasAncestor(entity))
        {
            // if an entity in the cascade already has an ancestor of the same type,
            // then we ignore...
            return
        }
        if((this.objectType().isCollection() || this.hasCollectionAncestor()) && entity.objectType().isCollection())
        {
            // if this is a collection, or has a collection as an ancestor, and hits a descendant which
            // is also a collection, then we halt the cascade to prevent infinite recursion
           return;
        }
        entity.ancestry(this.getAncestryWithSelf());
        entity.populate(iterations); // ensure ancestor and path are set before triggering populate..
        this._fields.push(entity);
    },
    populate:function(iterations)
    {
        // Fields are created in a two stage process in order to handle compound field types.
        // First we create all the fields returned by the API description. Then we loop through again to populate
        // each field. This allows each field to see if it is a compound type and, if so, create actual instances
        // of CRM field types for its descendants. What we end up with is a hierarchical structure of all the possible
        // elements in the Org tree

        // There are checks in place to prevent infinite recursion, but just in case we checck for the number of recursions
        // and stop things if they start getting too recursive...
        iterations = (iterations)? iterations+1 : 1;
        if(iterations>5)
        {
            return [];
        }
        if(this.data.Fields)
        {
            for(var i=0; i<this.data.Fields.length; i++)
            {
                this.createDescendant(this.data.Fields[i],iterations);
            }
        }
        if(this.objectType().isCompound())
        {
            // For collections and objects, convert content type to an instance of the relevant entity
            var c = this._contentType;
            this._contentType = di.resolve("CRMEntities").getOrgEntity(this._contentType);
            if(this._contentType)
            {
                var fields = this._contentType.fields();
                for(var i=0; i<fields.length; i++)
                {
                    this.createDescendant(fields[i].data,iterations);
                }
            }
        }
    },
    deepSearchEntity:function(id,debug)
    {
        if(this.id()==id) return this;
        for(var i=0; i<this._fields.length; i++)
        {
            var field = this._fields[i].deepSearchEntity(id,debug)
            if(field) return field;
        }
    },
    isMemberOfCollection:function()
    {
        return (this.immediateAncestor() && this.immediateAncestor().objectType().getType()==pb.model.fields.ObjectType.COLLECTION);
    },
    hasCollectionAncestor:function()
    {
        // check for a collection in this entity's ancestry and if so, return it
        for(var i=0; i<this._ancestry.length; i++)
        {
            if(this._ancestry[i].objectType().getType() == pb.model.fields.ObjectType.COLLECTION) return this._ancestry[i];
        }
    },
    sharesCollectionAncestor:function(entity)
    {
        // check if the specified entity is a descendant of the same collection as this..
        return (entity.isCRMField() && this.hasCollectionAncestor()==entity.hasCollectionAncestor());
    },
    getAssignableFields:function()
    {
        var result = [];
        for(var i=0; i<this._fields.length; i++)
        {
            if(this._fields[i].objectType() && !this._fields[i].objectType().isCompound()) result.push(this._fields[i]);
        }
        return result;
    },
    allFields:function()
    {
        var result = [this];
        for(var i=0; i<this._fields.length; i++)
        {
            result = result.concat(this._fields[i].allFields());
        }
        function sort(a,b)
        {
            var aNum = a.numberOfAncestors();
            var bNum = b.numberOfAncestors();
            return (aNum > bNum)? 1 : (aNum < bNum)? -1 : 0;
        }
        result.sort(sort);
        return result;
    },
    soundOff:function(tabs)
    {
        if(!tabs) tabs = "";
        sp.out(tabs + this);
        for(var i=0; i<this._fields.length; i++)
        {
            this._fields[i].soundOff(tabs+"  ");
        }
    },
    hasRelatedField:function()
    {
        return (this.relatedObject())? true : false;
    },
    isKey:function()
    {
        return pb.model.Utils.toBoolean(this.data.IsKey);
    },
    isForeignKey:function()
    {
        return pb.model.Utils.toBoolean(this.data.IsForeignKey);
    },
    addChildObject:function()
    {
        // this is not very elegant. basically some collections are of linked entities. If these are displayed in a grid
        // then we should lookup a Contact, or create a new Contact but then create a DealContact with the current Deal and Contact
        // ... this AddChildObject field is a very clunky way to tell PB about this requirement, but it' a broadbrush
        // approach which means most of the time AddChildObject is null - we need a more sophisticated approach
        // Update 27.10 yes, very clunky. It means we need to search down and then up from the current field in
        // order to find the relevant entity...
        var obj = this.findItemByFieldId(this.data.AddChildObject) || this.findAncestorById(this.data.AddChildObject);
        if(this.data.AddChildObject) return obj;
    },
    findItemByFieldId:function(id)
    {
        // find is recursive, as opposed to get, which only looks in immediate child objects
        // id stores the full path to an item, but sometimes we want to
        // find an item using just the short id passed by the connector
        if(this.fieldId()==id) return this;
        for(var i=0; i<this._fields.length; i++)
        {
            var field = this._fields[i].findItemByFieldId(id)
            if(field) return field;
        }
    },
    isRequired:function()
    {
        return pb.model.Utils.toBoolean(this.data.Required);
    },
    canBeMappedToPage:function() {
        return pb.model.Utils.toBoolean(this.data.RootMappable);// back end don't want to change this!!
    }
});

pb.model.fields.CRMEntities = sp.core.events.EventDispatcher.extend
({

    __constructor:function()
    {
        this.__super();
        this.org;
        this._isLoaded = false;
        this.load();
    },
    toString:function()
    {
        return this.org.toString();
    },
    load:function()
    {
        //var url = "mockdata/crmdata.json";
        var param = function(p){ return window.appletParameters.getParam(p); }
        if (param('debugschema'))
        {
            url = param('debugschema');
        }
        else
        {
            url = param('url') + param('orgschema') + '?crmkey=' + encodeURIComponent(param('crmkey'));
        }

        var __this = this;
        $.ajax( url,
                {
                    success:function(data,status,jqHXR)
                    {
                        __this.onLoad(data);
                    },
                    error:function(jqHXR,status,error)
                    {
                        __this.onLoadError(status,error);
                    }
                });
    },
    isLoaded:function()
    {
        return this._isLoaded;
    },
    onLoadError:function(status,error)
    {
        this.dispatchEvent(new pb.model.LoadEvent(this,pb.model.LoadEvent.COMPLETE,null,false,error));
    },
    onLoad: function (data, status) {

        sp.out('data' + JSON.stringify(data, null," "));
        if(!data)
        {
            this.dispatchEvent(new pb.model.LoadEvent(this,pb.model.LoadEvent.COMPLETE,null,false,"No schema data found"));
        }

        // First we create our org...
        this.org = new pb.model.fields.CRMField(data);

        // First we create our top level entities.
        // We do this because fields in the org structure may refer to a foreign key, and we want our data structure
        // to place the actual object referred to in the list of fields for that object.
        // It needs to exist before the entity can check whether to create a simple value field or
        // a pointer to the element. For example, imagine an Account has a field 'Owner' which refers to a User entity.This way
        // field  in the Account entity will be a pointed to the actual User entity.
        this.entities = [];
        var entities = _.castArray(data.Fields);
        for(var i=0; i<entities.length; i++)
        {
            var field = new pb.model.fields.CRMField(entities[i]);
            field.ancestry([this.org]);
            this.entities.push(field);
        }

        //Now we can populate our entities, knowing that all the primary CRMObject type
        for(var i=0; i<this.entities.length; i++)
        {
            this.entities[i].populate(this);
        }
        //Now we can create our top level org entity knowing that all the crm entities can be referenced...
        this.org.populate(this);
        // Set a pointer to prevent the data being loaded every time  it is requested...
        this._isLoaded = true;
        this.dispatchEvent(new pb.model.LoadEvent(this,pb.model.LoadEvent.COMPLETE,data,true,null));

        // this.org.soundOff(); // recursive sound off to examine the built hierarchy... debug only
    },
    getOrgEntity:function(fieldId)
    {
        // retrieves a top level entity by its field ID, rather than
        // a field in the hierarchy...
        for(var i=0; i<this.entities.length; i++)
        {
            if(this.entities[i].fieldId()==fieldId) return this.entities[i];
        }
    },
    getOrg:function()
    {
        return this.org;
    },
    getAssignableFields:function()
    {
        var result = [];
        for(var i=0; i<this.entities.length; i++)
        {
            result = result.concat(this.entities[i].getAssignableFields());
        }
        return result;
    }

});
di.register("CRMEntities")
    .as(pb.model.fields.CRMEntities)
    .asSingleton();

/*------------------------------------------------------------------
 // User Fields
 --------------------------------------------------------------------*/
pb.model.fields.ValueField = pb.model.fields.Field.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this._fieldType = pb.model.fields.FieldType.VALUE;
        this._valueType = data.valueType || pb.model.fields.ValueType.NUMBER;
        this._objectType = pb.model.fields.ObjectType.fromValueType(this._valueType);
        this._value =  (data.value!=undefined)? data.value : this.getDefaultValue();
        this._name = this._name || ("Value_" + this._id);
    },
    toString:function()
    {
        return "[ValueField id:" + this._id + " name:" + this._name +" type:" + this._fieldType +" valueType:" + this.valueType() + " objectType:" + this.objectType() +" value:"+ this.value() + "]";
    },
    valueType:function(val)
    {
        if(val!=undefined)
        {
            if(val!=this._valueType)
            {
                delete this._value;
            }
            this._valueType = val;
            if(this._value==undefined) this._value = this.getDefaultValue();
            this._objectType = pb.model.fields.ObjectType.fromValueType(this._valueType);
            this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));

        }
        return this._valueType;
    },
    getDefaultValue:function()
    {
        switch(this.valueType())
        {
            case pb.model.fields.ValueType.NUMBER:
            case pb.model.fields.ValueType.DAYS:
            case pb.model.fields.ValueType.WEEKS:
            case pb.model.fields.ValueType.MONTHS:
            case pb.model.fields.ValueType.YEARS:
                return 0;
            case pb.model.fields.ValueType.DATE:
                var today = new Date();
                return (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
            case pb.model.fields.ValueType.SMALLTEXT:
            case pb.model.fields.ValueType.LARGETEXT:
                return "Enter your text here..";
            case pb.model.fields.ValueType.BOOLEAN:
                return "true";
            case pb.model.fields.ValueType.COLOR:
                return "#000000";
        }
    },
    value:function(val)
    {
        if(val!=undefined)
        {
            this._value = val;
            this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
        }
        return this._value;
    },
    isNumber:function()
    {
        return this.valueType()==pb.model.fields.ValueType.NUMBER;
    },
    isDateRelated:function()
    {
        return [pb.model.fields.ValueType.DATE,
                pb.model.fields.ValueType.WEEKS,
                pb.model.fields.ValueType.MONTHS,
                pb.model.fields.ValueType.YEARS,
                pb.model.fields.ValueType.DAYS].indexOf(this.valueType())!=-1;
    },
    isText:function()
    {
        return this.valueType()==pb.model.fields.ValueType.SMALLTEXT ||
               this.valueType()==pb.model.fields.ValueType.LARGETEXT;
    },
    isBoolean:function()
    {
        return this.valueType()==pb.model.fields.ValueType.BOOLEAN;
    },
    isCompatibleWith:function(objectType)
    {
        if(this.isNumber())
        {
            return objectType.getType()==pb.model.fields.ObjectType.NUMBER;
        }
        else if(this.isDateRelated())
        {
            return objectType.getType()==pb.model.fields.ObjectType.DATE;
        }
        else if(this.isText())
        {
            return true;
        }
        else if(this.isBoolean())
        {
            return  objectType.getType() == pb.model.fields.ValueType.BOOLEAN;
        }
    },
    getData:function()
    {
        var data = this.__super();
        data.valueType = this._valueType;
        data.value =  this._value;
        return data;
    }
});

pb.model.fields.DerivedField = pb.model.fields.Field.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this._fieldType = pb.model.fields.FieldType.DERIVED;
        this.loadedData = data || {};
        this._name = this.loadedData.name || ("Value_" + this._id);
        this._objectType =  new pb.model.fields.ObjectType(this.loadedData.objectType || pb.model.fields.ObjectType.UNDEFINED);
        this._operations = [];
        if(this.loadedData.operations)
        {
            for(var i=0; i<this.loadedData.operations.length; i++)
            {
                this.addOperation(this.loadedData.operations[i]);
            }
        }
        if(this._operations.length==0) this.addOperation();
        di.resolve("PageContext").addEventListener(this,pb.model.ModelEvent.CHANGE,this.onPageContextChanged);
        di.resolve("Fields").addEventListener(this,pb.model.LoadEvent.COMPLETE,this.onFieldsLoaded);
    },
    onFieldsLoaded:function()
    {
        this.sourceFieldId(this.loadedData.sourceFieldId);
    },
    toString:function()
    {
       return "[DerivedField " + this._name +" type:" + this._fieldType +" ]";
    },
    isValid:function()
    {
        for(var i=0; i<this._operations.length; i++)
        {
            if(!this._operations[i].isValid()) return false;
        }
        return (this._sourceField && this._sourceField.isValid())? true : false;
    },
    onPageContextChanged:function()
    {
         //TODO remove?
    },
    valueType:function()
    {
        if(this._sourceField)
        {
            if(this._sourceField.isCRMField())
            {
                return pb.model.fields.ValueType.fromObjectType(this._sourceField.objectType().getType());
            }
            else if(this._sourceField.valueType)
            {
                return this._sourceField.valueType();
            }
        }
        return null;
    },
    valueTypeString:function()
    {
      return pb.model.fields.ValueType.valueToString(this.valueType());
    },
    objectTypeString:function()
    {
        return pb.model.fields.ObjectType.objectTypeToString(this._objectType.getType());
    },
    getAvailableSourceFields:function()
    {
        var result = [];
        var crmFields = di.resolve("Fields").getPageContextFields();
        for(var i=0; i<crmFields.length; i++)
        {
            if(crmFields[i].objectType().isAtomic()) result.push(crmFields[i]);
        }
        var userFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.VALUE | pb.model.fields.FieldType.DERIVED | pb.model.fields.FieldType.CONDITIONAL);
        _.remove(userFields,this);
        result = result.concat(userFields);
        return result;
    },
    sourceField:function(val)
    {
        if(arguments.length)
        {
            var from = this._sourceField;
            this._sourceField = val;
            this._objectType = pb.model.fields.ObjectType.fromValueType(this.valueType());
            this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"sourceField",from,this._sourceField));
        }
        return this._sourceField;
    },
    sourceFieldId:function(val)
    {
        if(val!=undefined)
        {
           var fields = di.resolve("Fields");
           this.sourceField(fields.deepSearchEntity(val));
        }
        return (this.sourceField())? this.sourceField().id() : "";
    },
    onRemoveOperation:function(event)
    {
        _.pull(this._operations,event.target);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
    },
    addOperation:function(data)
    {
        var operation = new pb.model.fields.DerivedFieldOperation(data,this);
        operation.sourceField(this.sourceField());
        operation.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onRemoveOperation);
        this._operations.push(operation);
    },
    operations:function()
    {
        return this._operations;
    },
    isFirst:function(operation)
    {
        return this._operations[0] == operation;
    },
    getData:function()
    {
        var data = this.__super();
        data.name = this._name;
        data.sourceFieldId = this.sourceFieldId();
        data.objectType =  this._objectType.getType();
        data.operations = [];
        for(var i=0; i<this._operations.length; i++)
        {
            data.operations.push(this._operations[i].getData());
        }
        return data;
    }
});

pb.model.fields.DerivedFieldOperation = sp.core.events.EventDispatcher.extend
({
    __constructor:function(data,parent)
    {
        this.__super();
        this.loadedData = data || {};
        this.id = this.loadedData.id || sp.guid();
        this.parent = parent;
        this._operator = this.loadedData.operator;
        this.parent.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onParentChanged);
        di.resolve("Fields").addEventListener(this,pb.model.LoadEvent.COMPLETE,this.onFieldsLoaded);
    },
    id:function()
    {
        return this._id;
    },
    onFieldsLoaded:function()
    {
        this.operandId(this.loadedData.operandId);
    },
    toString:function()
    {
      return "[DerivedFieldOperation operator:" + this._operator + " operand:" + this._operand + "]";
    },
    onParentChanged:function(event)
    {
        if(event.property=="sourceField")
        {
            event.currentTarget = this;
            this.dispatchEvent(event);
        }
    },
    sourceField:function()
    {
        return this.parent.sourceField();
    },
    isValid:function()
    {
        if(this.operatorIsDerivedDateCalculation())
        {
            return true;
        }
        else
        {
            return (this._operator && this._operand)? true : false;
        }

    },
    operator:function(val)
    {
        if(arguments.length)
        {
            var from = this._operator;
            this._operator = val;
            this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"operator",from,this._operator));
        }
        return this._operator;
    },
    operandId:function(val)
    {
        if(val!=undefined)
        {
            var fields = di.resolve("Fields");
            this.operand(fields.deepSearchEntity(val));
        }
        return (this.operand())? this.operand().id() : "";
    },
    operand:function(val)
    {
        if(val!=undefined)
        {
            this._operand = val;
        }
        return this._operand;
    },
    remove:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE));
    },
    getAvailableOperators:function()
    {
        var operators = pb.model.fields.OperatorTypes.getOperatorsForType(this.getSourceValueType());
        return pb.model.fields.OperatorTypes.getOperatorsForType(this.getSourceValueType());
    },
    operatorIsDerivedDateCalculation:function()
    {
        if(!this.sourceField()) return false;
        var sourceType = this.sourceField().objectType().getType();
        if(sourceType==pb.model.fields.ObjectType.DATE)
        {
            var operator = this.operator();
            var check = [pb.model.fields.OperatorTypes.FIRSTOFMONTH,
                pb.model.fields.OperatorTypes.FIRSTOFYEAR,
                pb.model.fields.OperatorTypes.FIRSTOFWEEK,
                pb.model.fields.OperatorTypes.LASTOFWEEK,
                pb.model.fields.OperatorTypes.LASTOFMONTH,
                pb.model.fields.OperatorTypes.LASTOFYEAR];
            return check.indexOf(operator)!=-1;
        }
    },
    getAvailableOperands:function()
    {
        var result = [];

        if(this.sourceField())
        {

            var sourceType = this.sourceField().objectType().getType();

            // if you have selected a date and applied one of the 'one shot' operations to it (first of year, last of month etc)
            // then you can't select an operand
            if(this.operatorIsDerivedDateCalculation())
            {
                return [];
            }


            var crmFields = di.resolve("Fields").getPageContextFields();
            for(var i=0; i<crmFields.length; i++)
            {
                if (crmFields[i].objectType().isAtomic() && (crmFields[i].objectType().getType() == sourceType))
                {
                    if(!crmFields[i].hasCollectionAncestor() || crmFields[i].sharesCollectionAncestor(this.sourceField()))
                    {
                        result.push(crmFields[i]);
                    }
                }
            }
            var userFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.VALUE | pb.model.fields.FieldType.DERIVED);
            _.remove(userFields, this.parent);

            for (var i = 0; i < userFields.length; i++)
            {
                if (userFields[i].objectType().getType() == sourceType) result.push(userFields[i]);
            }
        }
        return result;
    },
    getSourceValueType:function()
    {
        return (this.sourceField())? this.sourceField().objectType().getType() : null;
    },
    showDeleteIcon:function()
    {
        return !this.parent.isFirst(this);
    },
    disableOperands:function()
    {
        var operator = this.operator();
        var check = [pb.model.fields.OperatorTypes.FIRSTOFMONTH,
                     pb.model.fields.OperatorTypes.FIRSTOFYEAR,
                     pb.model.fields.OperatorTypes.FIRSTOFWEEK,
                     pb.model.fields.OperatorTypes.LASTOFWEEK,
                     pb.model.fields.OperatorTypes.LASTOFMONTH,
                     pb.model.fields.OperatorTypes.LASTOFYEAR];
                return (check.indexOf(operator)!=-1);
    },
    getData:function()
    {
        var data = {};
        data.id = this.id;
        data.operandId = this.operandId();
        data.operator = this.operator();
        return data;
    }


});




















/*------------------------------------------------------------------
// ENUMS
 --------------------------------------------------------------------*/
pb.model.fields.ValueType = {
    UNDEFINED:0,
    NUMBER:1,
    SMALLTEXT:2,
    LARGETEXT:4,
    DATE:8,
    DAYS:16,
    WEEKS:32,
    MONTHS:64,
    YEARS:128,
    BOOLEAN:256,
    COLOR:512,
    TODAY:1024,
    YEARSTART:2048,
    YEAREND:4096
}
pb.model.fields.ValueType.fromObjectType = function(val)
{
    switch(val)
    {
        case pb.model.fields.ObjectType.NUMBER:
            return pb.model.fields.ValueType.NUMBER;
        case pb.model.fields.ObjectType.STRING:
            return pb.model.fields.ValueType.SMALLTEXT;
        case pb.model.fields.ObjectType.DATE:
            return pb.model.fields.ValueType.DATE;
        case pb.model.fields.ObjectType.BOOLEAN:
            return pb.model.fields.ValueType.BOOLEAN;
        default:
            return pb.model.fields.ValueType.STRING;
    }
}
pb.model.fields.ValueType.valueToString = function(val)
{
    switch(val)
    {
        case pb.model.fields.ValueType.NUMBER:
            return "NUMBER";
        case pb.model.fields.ValueType.SMALLTEXT:
            return "SMALLTEXT";
        case pb.model.fields.ValueType.LARGETEXT:
            return "LARGETEXT";
        case pb.model.fields.ValueType.DATE:
            return "DATE";
        case pb.model.fields.ValueType.DAYS:
            return "DAYS";
        case pb.model.fields.ValueType.WEEKS:
            return "WEEKS";
        case pb.model.fields.ValueType.MONTHS:
            return "MONTHS";
        case pb.model.fields.ValueType.YEARS:
            return "YEARS";
        case pb.model.fields.ValueType.BOOLEAN:
            return "BOOLEAN";
        case pb.model.fields.ValueType.COLOR:
            return "COLOR";
        case pb.model.fields.ValueType.TODAY:
            return "TODAY";
        case pb.model.fields.ValueType.YEARSTART:
            return "YEARSTART";
        case pb.model.fields.ValueType.YEAREND:
            return "YEAREND";
        default:
            return "none";
    }
}


pb.model.fields.FieldType = {
    VALUE:1,
    DERIVED:2,
    CONDITIONAL:4,
    CRM:8
};
pb.model.fields.OperatorTypes = {
    GREATERTHAN:">",
    LESSTHAN:"<",
    EQUAL:"=",
    GREATERTHANOREQUAL:">=",
    LESSTHANOREQUAL:"<=",
    NOT:"<>",
    CONTAINS:"contains",
    NOTCONTAINS:"notcontains",
    ADD:"+",
    SUBTRACT:"-",
    DIVIDE:"/",
    MULTIPLY:"*",
    MODULO:"%",
    AND:"&&",
    NAND:"NAND",
    OR:"|",
    NOR:"NOR",
    XOR:"XOR",
    XAND:"XAND",
    FIRSTOFYEAR:"FIRSTOFYEAR",
    FIRSTOFMONTH:"FIRSTOFMONTH",
    FIRSTOFWEEK:"FIRSTOFWEEK",
    LASTOFYEAR:"LASTOFYEAR",
    LASTOFMONTH:"LASTOFMONTH",
    LASTOFWEEK:"LASTOFWEEK",
    STRINGOPERATORS:function()
    {
        return [
                    {
                        id:this.ADD,
                        label:"combine with"
                    }
                ]
    },
    NUMBEROPERATORS:function()
    {
        return [
                    {
                        id:this.ADD,
                        label:"+"
                    },
                    {
                        id:this.SUBTRACT,
                        label:"-"
                    },
                    {
                        id:this.MULTIPLY,
                        label:"x"
                    },
                    {
                        id:this.DIVIDE,
                        label:"÷"
                    },
                    {
                        id:this.MODULO,
                        label:"%"
                    }
                ]
    },
    DATEOPERATORS:function()
    {
        return  [
                    {
                        id:this.ADD,
                        label:"+"
                    },
                    {
                        id:this.SUBTRACT,
                        label:"-"
                    },
                    {
                        id:  this.FIRSTOFYEAR,
                        label:"First day of relevant year"
                    },
                    {
                        id:  this.FIRSTOFMONTH,
                        label:"First day of relevant month"
                    },
                    {
                        id:  this.FIRSTOFWEEK,
                        label:"First day of relevant week"
                    },
                    {
                        id:  this.LASTOFYEAR,
                        label:"Last day of relevant year"
                    },
                    {
                        id:  this.LASTOFMONTH,
                        label:"Last day of relevant month"
                    },
                    {
                        id:  this.LASTOFWEEK,
                        label:"Last day of relevant week"
                    }
                ]
    },
    BOOLEANOPERATORS:function()
    {
        return [

                   {
                        id:this.AND,
                        label:"AND"
                   },
                   {
                        id:this.NAND,
                        label:"NAND"
                   },
                   {
                       id:this.OR,
                       label:"OR"
                   },
                   {
                       id:this.NOR,
                       label:"NOR"
                   },
                   {
                       id:this.XOR,
                       label:"XOR"
                   },
                   {
                       id:this.XAND,
                       label:"XAND"
                   }
               ]
    },
    STRINGCOMPARISONS:function()
    {
        return  [
                    {

                        id:this.EQUAL,
                        label:"is the same as"
                    },
                    {
                        id:this.NOT,
                        label:"is different to"
                    },
                    {
                        id:this.CONTAINS,
                        label:"contains"
                    },
                    {
                        id:this.NOTCONTAINS,
                        label:"does not contain"
                    }
                ];
    },
    NUMBERCOMPARISONS:function()
    {
        return  [
                      {
                          id:this.EQUAL,
                          label:"="
                      },
                      {
                          id:this.NOT,
                          label:"<>"
                      },
                      {
                          id:this.GREATERTHAN,
                          label:">"
                      },
                      {
                          id:this.LESSTHAN,
                          label:"<"
                      },
                      {
                          id:this.GREATERTHANOREQUAL,
                          label:">="
                      },
                      {
                          id:this.LESSTHANOREQUAL,
                          label:"<="
                      }
                ]
    },
    BOOLEANCOMPARISONS:function()
    {
        return [
                    {
                        id:this.EQUAL,
                        label:"is"
                    },
                    {
                        id:this.NOT,
                        label:"is not"
                    }
               ]
    },
    DATECOMPARISONS:function()
    {
        return [
                   {
                       id:this.EQUAL,
                       label:"is"
                   },
                   {
                       id:this.NOT,
                       label:"is not"
                   },
                   {
                       id:this.LESSTHAN,
                       label:"is before"
                   },
                   {
                       id:this.GREATERTHAN,
                       label:"is after"
                   },
                   {
                       id:this.LESSTHANOREQUAL,
                       label:"is, or is before"
                   },
                   {
                       id:this.GREATERTHANOREQUAL,
                       label:"is, or is after"
                   }
                ]
    },
    getOperatorsForType:function(type)
    {
        switch(type)
        {
            case pb.model.fields.ObjectType.STRING:
                return this.STRINGOPERATORS();
            case pb.model.fields.ObjectType.NUMBER:
                return this.NUMBEROPERATORS();
            case pb.model.fields.ObjectType.BOOLEAN:
                return this.BOOLEANOPERATORS();
            case pb.model.fields.ObjectType.DATE:
                return this.DATEOPERATORS();
        }
        return [];
    },
    getComparisonsForType:function(type)
    {
        switch(type)
        {
            case pb.model.fields.ObjectType.STRING:
                return this.STRINGCOMPARISONS();
            case pb.model.fields.ObjectType.NUMBER:
                return this.NUMBERCOMPARISONS();
            case pb.model.fields.ObjectType.BOOLEAN:
                return this.BOOLEANCOMPARISONS();
            case pb.model.fields.ObjectType.DATE:
                return this.DATECOMPARISONS();
        }
        return [];
    }
}


pb.model.fields.SourceType =
{
    SPECIFY:1,
    GENERIC:2
}
pb.model.fields.ObjectType.UNDEFINED = 0;
pb.model.fields.ObjectType.CRMOBJECT = 1;
pb.model.fields.ObjectType.STRING = 2;
pb.model.fields.ObjectType.BOOLEAN = 4;
pb.model.fields.ObjectType.NUMBER = 8;
pb.model.fields.ObjectType.DATE = 16;
pb.model.fields.ObjectType.COLLECTION = 32;
pb.model.fields.ObjectType.ENUM = 64;
pb.model.fields.ObjectType.OBJECT = 128;
pb.model.fields.ObjectType.LINK = 256; // represents an object from a link table - eg. a Contact associated with a Deal (DealContact)
pb.model.fields.ObjectType.LINKLIST = 512; // represents a list of linked objects... eg. Deal has a list of DealContacts
pb.model.fields.ObjectType.objectTypeToString = function(val)
{
    switch(val)
    {
        case pb.model.fields.ObjectType.CRMOBJECT:
            return "CRMOBJECT";
        case pb.model.fields.ObjectType.STRING:
            return "STRING";
        case pb.model.fields.ObjectType.BOOLEAN:
            return "BOOLEAN";
        case pb.model.fields.ObjectType.NUMBER:
            return "NUMBER";
        case pb.model.fields.ObjectType.DATE:
            return "DATE";
        case pb.model.fields.ObjectType.COLLECTION:
            return "COLLECTION";
        case pb.model.fields.ObjectType.ENUM:
            return "ENUM";
        case pb.model.fields.ObjectType.OBJECT:
            return "OBJECT";
        case pb.model.fields.ObjectType.LINK:
            return "LINK";
        case pb.model.fields.ObjectType.LINKLIST:
            return "LINKLIST";
        default:
            return "none";
    }
};

pb.model.fields.ObjectType.fromCRMType = function(val)
{
    // convert string values output by API to the numeric values
    // used in Page Builder. If API changes, this look up method needs
    // to be overridden
    switch (val)
    {
        case "CrmObject":
            return pb.model.fields.ObjectType.CRMOBJECT;
        case "String":
            return pb.model.fields.ObjectType.STRING;
        case "Boolean":
            return pb.model.fields.ObjectType.BOOLEAN;
        case "Number":
            return pb.model.fields.ObjectType.NUMBER;
        case "Date":
            return pb.model.fields.ObjectType.DATE;
        case "Collection":
            return pb.model.fields.ObjectType.COLLECTION;
        case "Enum":
            return pb.model.fields.ObjectType.ENUM;
        case "Association":
            return pb.model.fields.ObjectType.LINK;
        case "Object":
            return pb.model.fields.ObjectType.OBJECT;
        case "LinkList":
            return pb.model.fields.ObjectType.LINKLIST;
    }
}
pb.model.fields.ObjectType.fromValueType = function(val)
{
    switch(val)
    {
        case pb.model.fields.ValueType.NUMBER:
        case pb.model.fields.ValueType.COLOR:
            return new pb.model.fields.ObjectType(pb.model.fields.ObjectType.NUMBER);
        case pb.model.fields.ValueType.SMALLTEXT:
        case pb.model.fields.ValueType.LARGETEXT:
            return new pb.model.fields.ObjectType(pb.model.fields.ObjectType.STRING);
        case pb.model.fields.ValueType.DAYS:
        case pb.model.fields.ValueType.WEEKS:
        case pb.model.fields.ValueType.MONTHS:
        case pb.model.fields.ValueType.YEARS:
        case pb.model.fields.ValueType.DATE:
            return new pb.model.fields.ObjectType(pb.model.fields.ObjectType.DATE);
        case pb.model.fields.ValueType.BOOLEAN:
            return new pb.model.fields.ObjectType(pb.model.fields.ObjectType.BOOLEAN);
        default:
            return new pb.model.fields.ObjectType(pb.model.fields.ObjectType.STRING);
    }
}



/*------------------------------------------------------------------------------------------

Steps for adding a new type

1. Add a static variable to pb.model.fields.ObjectType
    Types are a binary progression, eg. 1,2,4,8,16 etc. This allows us to use binary logic to easily extract information about
    object types. Use the next value available (which will be double the previous one)

2. Add case statement to pb.model.fields.ObjectType.objectTypeToString()
    This is a factory method. If you don't add a line to this method, the routine which creates all the objects will
    not know what to create with the new type, so you will get an undefined entity instead of the correct ObjectType instance

2. Add case statement to pb.model.fields.ObjectType.fromCRMType()
    This method converts the string type passed from the connector into a more easily manageable integer to use in the code. Make sure you
    handle the new type here, or you will have code trying to manipulate a string when they want a number

3. Update either isCompound() or isAtomic() in the pb.model.fields.Field class. Your new type should always be one or the other. This
     will not cause any direct errors, but it will mean that your new field type will not be recognised as being either atomic or compound
     and some code could fall over when it is trying to decide what to display etc... it could be that we could make isAtomic() return !isCompound()
     to avoid this requirement, but it might cause other logic fails elsewhere if there are types which SHOULD be ignored...so better to
     update and make the status explicit


4. Add an isXXXX() method to pb.model.fields.Field if you need to be able to consume this new type. Eg. if you add a new type
     called 'Foo' then add a method isFoo() to the Field class. You COULD avoid this step and check the getType() directly in the controller or view code, but
     it would be inelegant and hard to maintain. Better to let the model tell you what it is.

--------------------------------------------------------------------------------------------*/
