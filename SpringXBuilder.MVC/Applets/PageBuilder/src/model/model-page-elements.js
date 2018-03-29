sp.namespace("pb.model.ElementFactory",
             "pb.model.Element",
             "pb.model.Section",
             "pb.model.Accordion",
             "pb.model.FloatingView",
             "pb.model.TextLabel",
             "pb.model.TextInput",
             "pb.model.Numeric",
             "pb.model.Picklist",
             "pb.model.Checkbox",
             "pb.model.DatePicker",
             "pb.model.Image",
             "pb.model.RadioButtons",
             "pb.model.Slider",
             "pb.model.TextArea",
             "pb.model.List",
             "pb.model.Grid",
             "pb.model.Chart",
             "pb.model.Button",
             "pb.model.TaggedText",
             "pb.model.ColorPicker",
             "pb.model.CollectionEditMethods");



/*-------------------------------------------------------------------------------------------
 OBJECT CREATION & UTILITIES
 --------------------------------------------------------------------------------------------*/
pb.model.ElementFactory = Class.extend
({
      __constructor:function()
      {

      },
      createElementWithType:function(id)
      {
          var Element = pb.model.Element;
          switch(id)
          {
              case Element.SECTION:
                  return new pb.model.Section();
              case Element.TEXTLABEL:
                  return new pb.model.TextLabel();
              case Element.TEXTINPUT:
                  return new pb.model.TextInput();
              case Element.NUMERIC:
                  return new pb.model.NumericInput();
              case Element.PICKLIST:
                  return new pb.model.PickList();
              case Element.CHECKBOX:
                  return new pb.model.Checkbox();
              case Element.DATEPICKER:
                  return new pb.model.DatePicker();
              case Element.IMAGE:
                  return new pb.model.Image();
              case Element.RADIOBUTTONS:
                  return new pb.model.RadioButtons();
              case Element.SLIDER:
                  return new pb.model.Slider();
              case Element.TEXTAREA:
                  return new pb.model.TextArea();
              case Element.LOOKUP:
                  return new pb.model.LookUp();
              case Element.LIST:
                  return new pb.model.List();
              case Element.GRID:
                  return new pb.model.Grid();
              case Element.CHART:
                  return new pb.model.Chart();
              case Element.MAP:
                  return new pb.model.Map();
              case Element.BUTTON:
                  return new pb.model.Button();
              case Element.TAGGEDTEXT:
                  return new pb.model.TaggedText();
              case Element.COLORPICKER:
                  return new pb.model.ColorPicker();
              default:
                  return new pb.model.Element(id);
          }
      },
      createElementWithModel:function(model)
      {
           var Element = pb.model.Element;
           switch(model.type)
           {
                case Element.SECTION:
                    return new pb.model.Section(model);
                case Element.TEXTLABEL:
                    return new pb.model.TextLabel(model);
                case Element.TEXTINPUT:
                    return new pb.model.TextInput(model);
                case Element.NUMERIC:
                    return new pb.model.NumericInput(model);
                case Element.PICKLIST:
                    return new pb.model.PickList(model);
                case Element.CHECKBOX:
                    return new pb.model.Checkbox(model);
                case Element.DATEPICKER:
                    return new pb.model.DatePicker(model);
                case Element.IMAGE:
                    return new pb.model.Image(model);
                case Element.RADIOBUTTONS:
                    return new pb.model.RadioButtons(model);
                case Element.SLIDER:
                    return new pb.model.Slider(model);
                case Element.TEXTAREA:
                    return new pb.model.TextArea(model);
                case Element.LIST:
                    return new pb.model.List(model);
                case Element.GRID:
                    return new pb.model.Grid(model);
                case Element.CHART:
                    return new pb.model.Chart(model);
                case Element.BUTTON:
                    return new pb.model.Button(model);
                case Element.TAGGEDTEXT:
                    return new pb.model.TaggedText(model);
                case Element.COLORPICKER:
                    return new pb.model.ColorPicker(model);
                case Element.LOOKUP:
                   return new pb.model.LookUp(model);
                case Element.MAP:
                   return new pb.model.Map(model);
                case Element.COLLECTIONLOOKUP:
                   return new pb.model.CollectionLookUp(model);
                default:
                    return new pb.model.Element(model);
            }
        }
});
di
    .register("ElementModelFactory")
    .as(pb.model.ElementFactory)
    .asSingleton();

pb.model.Utils =
 {
    typeAsString:function(type,pretty)
    {
        var types = (pretty)? this.getPrettyTypes() : this.getTypes();
        for(var prop in types)
        {
            if(types[prop]==type) return prop.charAt(0).toUpperCase() + prop.slice(1).toLowerCase();
        }
        return "Undefined";
    },
    getPrettyTypes:function()
    {
        return {
            "Element":pb.model.Element.ELEMENT,
            "Page":pb.model.Element.PAGE,
            "Section":pb.model.Element.SECTION,
            "Label":pb.model.Element.TEXTLABEL,
            "TextField":pb.model.Element.TEXTINPUT,
            "NumberField":pb.model.Element.NUMERIC,
            "Picklist":pb.model.Element.PICKLIST,
            "Checkbox":pb.model.Element.CHECKBOX,
            "DateChooser":pb.model.Element.DATEPICKER,
            "Image":pb.model.Element.IMAGE,
            "RadioButtons":pb.model.Element.RADIOBUTTONS,
            "Slider":pb.model.Element.SLIDER,
            "TextArea":pb.model.Element.TEXTAREA,
            "List":pb.model.Element.LIST,
            "Grid":pb.model.Element.GRID,
            "Chart":pb.model.Element.CHART,
            "Button":pb.model.Element.BUTTON,
            "TaggedText":pb.model.Element.TAGGEDTEXT,
            "ColorChooser":pb.model.Element.COLORPICKER
        };
    },
    getTypes:function()
    {
        return {
            "ELEMENT":pb.model.Element.ELEMENT,
            "PAGE":pb.model.Element.PAGE,
            "SECTION":pb.model.Element.SECTION,
            "TEXTLABEL":pb.model.Element.TEXTLABEL,
            "TEXTINPUT":pb.model.Element.TEXTINPUT,
            "NUMERIC":pb.model.Element.NUMERIC,
            "PICKLIST":pb.model.Element.PICKLIST,
            "CHECKBOX":pb.model.Element.CHECKBOX,
            "DATEPICKER":pb.model.Element.DATEPICKER,
            "IMAGE":pb.model.Element.IMAGE,
            "RADIOBUTTONS":pb.model.Element.RADIOBUTTONS,
            "SLIDER":pb.model.Element.SLIDER,
            "TEXTAREA":pb.model.Element.TEXTAREA,
            "LIST":pb.model.Element.LIST,
            "GRID":pb.model.Element.GRID,
            "CHART":pb.model.Element.CHART,
            "BUTTON":pb.model.Element.BUTTON,
            "TAGGEDTEXT":pb.model.Element.TAGGEDTEXT,
            "COLORPICKER":pb.model.Element.COLORPICKER
        };
    },
    whatAreTheTypesAgainPlease:function()
    {
        var types = this.getTypes();
        for(var prop in types)
        {
            sp.out("pb.model.Element." + prop + " :" + types[prop]);
        }
    },
    toNumber:function(val)
    {
        return (isNaN(Number(val)))? 0 : Number(val);
    },
    toBoolean:function(val)
    {
        return val=="true" || val==true;
    }
}

/*-------------------------------------------------------------------------------------------
 MODEL CLASSES
 --------------------------------------------------------------------------------------------*/
pb.model.Model = sp.core.events.EventDispatcher.extend
({
    __constructor:function(data)
    {
        this.__super();
        data = data || {};
        this.type = this.getType();
        this.id = data.id || sp.guid();
        this.index = data.index;
    },
    onChanged:function(prop,oldVal,newVal,caller)
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,prop,oldVal,newVal,caller));
    },
    updateProperty:function(prop,val,caller)
    {
        var old = this[prop];
        var event = new pb.model.ModelEvent(this,pb.model.ModelEvent.WILLCHANGE,prop,old,val);
        this.dispatchEvent(event);
        if(event.isPrevented())
        {
            return false; // to indicate that property was updated...
        }
        this[prop] = val;
        this.onChanged(prop,old,val,this.updateProperty.caller);
        return true;
    },
    getType:function()
    {
        return "";
    },
    getData:function()
    {
        return {type:this.getType(),id:this.id, index:this.index};
    },
    cloneData:function()
    {
        return this.getData();
    },
    clone:function()
    {
        var data = this.cloneData();
        return di.resolve("ElementModelFactory").createElementWithModel(data);
    },
    setIndex:function(index)
    {
        this.updateProperty("index",index);
    },
    getIndex:function()
    {
        return this.index;
    },
    remove:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE));
    }
});

pb.model.MappableObject = pb.model.Model.extend
({
    //abstract class, do not instantiate directly..
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        var fields = di.resolve("Fields");
        fields.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onFieldsChanged);
        if(data.mappingContextId) this.mappingContext = fields.deepSearchEntity(data.mappingContextId);
        if(data.mappedEntityId) this.mappedEntity = fields.deepSearchEntity(data.mappedEntityId);
    },
    onFieldsChanged:function()
    {
        // triggered when any fields change... need to check any mapped entity is still valid..
        if(this.mappedEntity)
        {
            if(!this.mappedEntity.isValid() || !this.canBeMappedToEntity(this.mappedEntity))
            {
                //sp.out(this + " no longer valid:" + this.mappedEntity + " valid:" + this.mappedEntity.isValid() + " can be mapped:" + this.canBeMappedToEntity(this.mappedEntity));
                this.setMappedEntity();
            }
        }
    },
    isMapped:function()
    {
        return (this.getMappedEntity())? true : false;
    },
    isMappedToCRMField:function()
    {
        return (this.getMappedEntity() && this.getMappedEntity().isCRMField());
    },
    mappingContextIsCRMField:function()
    {
        return (this.getMappingContext() && this.getMappingContext().isCRMField());
    },
    onMappedEntityChange:function(event)
    {
        // forwards a change event from the mapped entity so the UI can update...
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"mappedEntity",this.mappedEntity,this.mappedEntity));
    },
    getMappedEntityId:function()
    {
        return (this.getMappedEntity())? this.getMappedEntity().id() : null;
    },
    setMappedEntityId:function(id)
    {
        this.setMappedEntity(di.resolve("Fields").deepSearchEntity(id));
    },
    getMappingContextId:function()
    {
        return (this.mappingContext)? this.mappingContext.id() : null;
    },
    setMappedEntity:function(val)
    {
        var currentMappedEntity = this.mappedEntity;
        var result = this.updateProperty("mappedEntity",val);
        if(result)
        {
            // then no one invoked a preventDefault on the change...
            if(currentMappedEntity) currentMappedEntity.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            if(this.mappedEntity) this.mappedEntity.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            this.onMappedEntityChanged(this.mappedEntity); // callback which can be overridden..
        }
        return result;
    },
    getMappedEntity:function()
    {
        return this.mappedEntity;
    },
    setMappingContext:function(entity)
    {
        // returns a boolean indicating that the context was changed or not
        // mapping context is not changed if the entity passed in is already
        // the mapping context. this means that no change event is triggered if
        // the mapping context is staying the same - eg. if an element is redropped into
        // its current parent, or into another container with the same mapping context.
        // this prevents unwanted behaviour, like a section updating the mapping context on its
        // children when they already have contexts set..
        if(entity && entity == this.mappingContext) return;
        var old = this.mappingContext;
        this.mappingContext = entity;
        this.onMappingContextChanged(this.mappingContext); // callback which can be overridden..
        this.onChanged("mappingContext",old,this.mappingContext);
        if(this.isMappedToCRMField())
        {
            this.setMappedEntity(null);
        }
        return true;
    },
    getMappingContext:function()
    {
        return this.mappingContext;
    },
    getMappableFields:function(debug)
    {
        var fields = this.getCandidateMappingFields();
        var mappableFields = [];
        for(var i=0; i<fields.length; i++)
        {
            if(this.checkForMappingCompatibility(fields[i],debug) && fields[i].isValid()) mappableFields.push(fields[i]);
        }
        return mappableFields;
    },
    getCandidateMappingFields:function()
    {
        // can be overridden to change the potential fields for mapping...if in doubt, stick to the default
        return (this.getMappingContext())? this.getMappingContext().fields() : [];
    },
    checkForMappingCompatibility:function(entity,debug)
    {
        if(debug) sp.out("  check for compatibility:" + entity);
        if (entity.isDerivedField())
        {
            var source = entity.sourceField();
            if(!source || !source.fieldType()) return false;
            if(source.fieldType()==pb.model.fields.FieldType.CRM && this.getMappingContext() && this.getMappingContext().fieldType()==pb.model.fields.FieldType.CRM)
            {
                if (this.getMappingContext().hasCollectionAncestor() || source.hasCollectionAncestor())
                {
                    if (!this.getMappingContext().sharesCollectionAncestor(source) && this.getMappingContext()!=source.immediateAncestor())
                    {
                        if(debug) sp.out("false");
                        return false;
                    }
                }
            }
        }
        else if(entity.isCRMField() && !this.allowForeignKeyMapping()) // horrible hacking, but the way foreign keys work really needs work to make it more consistent with everything else..
        {
            if(entity.isKey() || entity.isForeignKey()) return false; // this means it is an CrmId...
        }
        return this.canBeMappedToEntity(entity);
    },
    allowForeignKeyMapping:function()
    {
        // override if a subclass wants to be able to map to foreign keys..
        // this is hacky because we really need to redesign the schema in a way that
        // foreign keys are not an after thought..but will have to do this for now TW - 14/10/2016
        return false;
    },
    canBeMappedToEntity:function(entity)
    {
        return this.isMappable();
    },
    onMappingContextChanged:function(context)
    {
        // override as necessary..
    },
    onMappedEntityChanged:function(entity)
    {
        //override as necessary..
    },
    isMappable:function()
    {
        return true;
    },
    getData:function()
    {
        var data = this.__super();
        data.mappedEntityId = this.getMappedEntityId();
        data.mappingContextId = this.getMappingContextId();
        return data;
    },
    cloneData:function()
    {
        return this.getData();
    }
})

// Object doesn't support property or method 'assign' problem in IE
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

pb.model.Element = pb.model.MappableObject.extend
({
    // abstract class do not instantiate directly..
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.name = data.name || this.getDefaultName();
        this.visibility = new pb.model.Visibility(data.visibility);
        var fields = di.resolve("Fields");
        this.parent;
    },
    getParent:function()
    {
        return this.parent;
    },
    setParent:function(parent)
    {
        this.updateProperty("parent",parent);
    },
    getParentType:function()
    {
        return (this.parent)? this.parent.getType() : null
    },
    getType:function()
    {
        return pb.model.Element.ELEMENT;
    },
    getDefaultName:function()
    {
        return pb.model.Utils.typeAsString(this.getType(),true) + "_" + sp.guid(4);
    },
    onChanged:function(prop,from,to,caller)
    {
        // helper function - constructs and sends a change event..
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,prop,from,to,caller));
    },
    forwardChildEvent:function(event)
    {
        // helper function - forwards any event from a child element..
        var newEvent = Object.assign({},event);
        newEvent.originalEvent = event;
        newEvent.currentTarget = this;
        this.dispatchEvent(newEvent);
    },
    toString:function()
    {
       return "[Element type:" + this.type + " name:" + this.name + " id:" + this.id + "]";
    },
    getID:function()
    {
      return this.id;
    },
    getName:function()
    {
        return this.name;
    },
    setName:function(val)
    {
        if(!val) return;
        var from = this.name;
        this.name = val;
        this.onChanged("name",from,this.name);
    },
    getVisibility:function()
    {
        return this.visibility;
    },
    getData:function()
    {
        var data = this.__super();
        data.id = this.id;
        data.type = this.type;
        data.name = this.name || "";
        data.visibility = this.visibility.getData();
        return data;
    },
    mappedEntityFormatting:function(val)
    {
        return "[" + val + "]";
    },
    valueFieldFormatting:function(val,field)
    {
        return "*" + val;
    },
    cloneData:function()
    {
        var data = this.__super();
        data.id = sp.guid();
        data.name = null;
        data.visibility = this.visibility.getData();
        return data;
    }
});

pb.model.Container = pb.model.Element.extend
({
    //abstract class do not instantiate directly..
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.elements = [];
        if(data.elements)
        {
            this.createElements(data.elements);
        }
    },
    createElements:function(els)
    {
        var factory = di.resolve("ElementModelFactory");
        for(var i=0; i<els.length; i++)
        {
            var element = factory.createElementWithModel(els[i]);
            element.setMappingContext(this.getMappedEntity() || this.getMappingContext());
            element.setParent(this);
            this.elements.push(element);
        }
    },
    removeAllElements:function()
    {
        this.elements = [];
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVEALL));
    },
    getType:function()
    {
        return pb.model.Element.CONTAINER;
    },
    insertElementAtIndex:function(element,index)
    {
        this.elements.splice(index,0,element);
        for(var i=0; i<this.elements.length; i++)
        {
            this.elements[i].setIndex(i);
        }
        element.setParent(this);
        element.setMappingContext(this.getMappedEntity() || this.getMappingContext());
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,element,index));
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.INSERT,element,index));
    },
    removeElement:function(element)
    {
        var index;
        for(var i=0; i<this.elements.length; i++)
        {
            if(this.elements[i]==element)
            {
                this.elements[i].setParent();
                this.elements.splice(i,1);
                index = i;
                break;
            }
        }
        if(index==undefined)
        {
            var str = "Attempt to delete an element which is not recognised as a child of this element. Report this as a bug during testing";
            str += "\nContainer:" + this;
            str += "\nElement:" + element;
            alert(str);
        }
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,element,index));
    },
    getNumberOfElements:function()
    {
        return this.elements.length;
    },
    isEmpty:function()
    {
        return this.getNumberOfElements()==0;
    },
    hasElements:function()
    {
        return this.getNumberOfElements()>0;
    },
    getElements:function()
    {
        return this.elements;
    },
    getElementIds:function()
    {
        var result = [];
        for(var i=0; i<this.elements.length; i++)
        {
            result.push(this.elements[i].getId())
        };
        return result;
    },
    getData:function()
    {
        var data = this.__super();
        data.elements = [];
        for(var i=0; i<this.elements.length; i++)
        {
            data.elements.push(this.elements[i].getData());
        }
        return data;
    },
    cloneData:function()
    {
        var data = this.__super();
        data.elements = [];
        for(var i=0; i<this.elements.length; i++)
        {
            data.elements.push(this.elements[i].clone());
        }
        return data;
    },
    setMappedEntity:function(entity)
    {
        var result = this.__super(entity);
        if(result)
        {
            for(var i=0; i<this.elements.length; i++)
            {
                this.elements[i].setMappingContext(this.getMappedEntity() || this.getMappingContext());
            }
        }
        return result;
    },
    setMappingContext:function(entity)
    {
        if(!this.__super(entity)) return; // because the superclass detected that the context is the same..
        // this function would be called when moving an element from one place to another
        // or dropping a cloned element. But it could also be called when simply changing the mapping
        // context manually. So we need to check whether the mapped entity is still valid, and if so, we
        // should set that on the children. On the other hand, if the mappedEntity is no longer a valid
        // child of the mappedContext, then we should reset all children to inherit the new mapping context..
        for(var i=0; i<this.elements.length; i++)
        {
            this.elements[i].setMappingContext(this.getMappedEntity() || this.getMappingContext());
        }
    },
    canBeMappedToEntity:function(entity)
    {
        return (     entity
                &&   entity.isValid()
                &&  !entity.objectType().isAtomic()
                &&  !entity.objectType().isCollection()
                &&  !entity.objectType().isEnum()
                );
    }
})

pb.model.Page = pb.model.Container.extend
({
   
    __constructor:function(data)
    {
         this.__super(data);
        this.data = data || {};
        this.name = this.data.name || "My Page";
        //this.dataMappingOption = new pb.model.DataMappingOption(this.data.dataMappingOption);
        //this.dataMappingOption.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        var crmEntities = di.resolve("CRMEntities");
        if(crmEntities.isLoaded())
        {
            this.onSchemaLoaded();
        }
        else
        {
            crmEntities.addEventListener(this,sp.core.data.DataEvent.LOADED,this.onSchemaLoaded);
        }
    },
    onSchemaLoaded:function()
    {
        var fields = di.resolve("CRMEntities");
        // order is important...
        this.setMappingContext(fields.getOrg());
        this.setMappedEntity(this.mappedEntity || this.getMappableFields()[0]); // this line will cause the PageContext to be updated, and will also ensure that if there is no saved mappedEntity, then it will default to the first CRM entity available..
           },
    /*getDataMappingOption:function()
    {
        return this.dataMappingOption;
    },*/
    getType:function()
    {
        return pb.model.Element.PAGE;
    },
    setName:function(val)
    {
        this.updateProperty("name",val);
    },
    getName:function()
    {
        return this.name;
    },
    setDescription:function(val)
    {
        this.updateProperty("description",val);
    },
    getDescription:function()
    {
        return this.description;
    },
    setVersion:function(val)
    {
        this.updateProperty("version",val);
    },
    getVersion:function()
    {
        return this.version;
    },
    setMappedEntity:function(val)
    {
        var result = this.__super(val);
        if(result)
        {
            // then nothing invoked a preventDefault on the event...
            di.resolve("PageContext").setContext(val);
            //this.dataMappingOption.setMappingContext(val);
        }
        else
        {
            this.onChanged("mappedEntity",this.mappedEntity,this.mappedEntity);
        }
    },
    getData:function()
    {
        var data = this.__super();
        //data.dataMappingOption = this.dataMappingOption.getData();
        return data;
    },
    canBeMappedToEntity: function (entity) {
        if (this.__super(entity)) return entity.canBeMappedToPage();
    }

});
/*
pb.model.DataMappingOption = pb.model.MappableObject.extend
({
    __constructor:function(data)
    {
        this.__super(data);
    },
    toString:function()
    {
        return "[DataMappingOption, mappedEntity:" + this.mappedEntity + "]";
    },
    canBeMappedToEntity:function(entity)
    {
        return (entity.objectType().getType()==pb.model.fields.ObjectType.STRING);
    }
})
*/
pb.model.Section = pb.model.Container.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width || {size:"full"});
        this.width.addEventListener(this, pb.model.ModelEvent.CHANGE, this.forwardChildEvent);
        this.layoutDirection = new pb.model.LayoutDirection(data.layoutDirection);
        this.layoutDirection.addEventListener(this, pb.model.ModelEvent.CHANGE, this.onLayoutDirectionChange);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.borderColor = new pb.model.Color(data.borderColor);
        this.borderColor.addEventListener(this, pb.model.ModelEvent.CHANGE, this.forwardChildEvent);
    },
    getWidth:function()
    {
        return this.width;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getBorderColor:function()
    {
        return this.borderColor;
    },
    onLayoutDirectionChange:function(event)
    {
        event.property = "layoutDirection";
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    getType:function()
    {
        return pb.model.Element.SECTION;
    },
    toString:function()
    {
        return "[Section id:" + this.getID() + "]";
    },
    getLayoutDirection:function()
    {
        return this.layoutDirection;
    },
    getData:function()
    {
        var data = this.__super();
        data.width = this.width.getData();
        data.layoutDirection = this.layoutDirection.getData();
        data.backgroundColor = this.backgroundColor.getData();
        data.borderColor = this.borderColor.getData();
        return data;
    },
    allowForeignKeyMapping:function()
    {
        // we want to be able to map sections to foreign keys, because we might have a one-to-one custom relationship
        // which we want to associate with a section, so we can display the fields on the associated object. Eg.
        // a Deal which has an 'AssociatedAlien' object would possibly need a section where we show the details of the
        // associated item.
        return true;
    }

});

pb.model.Width = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.size = data.size || "small";
        this.width = data.width || 0;
    },
    toString:function()
    {
        return "[Width size:" + this.size +" width:"  + this.width + "]";
    },
    getSize:function()
    {
        return this.size;
    },
    setSize:function(val)
    {
        this.updateProperty("size",val);
    },
    getWidth:function()
    {
        return this.width;
    },
    setWidth:function(val)
    {
        this.updateProperty("width",val);
    },
    getData:function()
    {
        var data = this.__super();
        data.width = this.width;
        data.size = this.size;
        return data;
    }
})

pb.model.Width.SMALL = "small";
pb.model.Width.MEDIUM = "medium";
pb.model.Width.LARGE = "large";
pb.model.Width.FULL = "full";
pb.model.Width.SPECIFY = "specify";

pb.model.Height = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.size = data.size || "small";
        this.width = data.width || 0;
    },
    toString:function()
    {
        return "[Height size:" + this.size +" height:"  + this.height + "]";
    },
    getSize:function()
    {
        return this.size;
    },
    setSize:function(val)
    {
        this.updateProperty("size",val);
    },
    getHeight:function()
    {
        return this.height;
    },
    setHeight:function(val)
    {
        this.updateProperty("height",val);
    },
    getData:function()
    {
        var data = this.__super();
        data.height = this.height;
        data.size = this.size;
        return data;
    }
})
pb.model.Height.SMALL = "small";
pb.model.Height.MEDIUM = "medium";
pb.model.Height.LARGE = "large";
pb.model.Height.FULL = "full";
pb.model.Height.SPECIFY = "specify";

pb.model.Align = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.align = data.align || "left";
    },
    toString:function()
    {
        return "[Align value:" + this.align + "]";
    },
    getValue:function()
    {
        return this.align;
    },
    setValue:function(val)
    {
        this.updateProperty("align",val);
    },
    getData:function()
    {
        var data = this.__super();
        data.align = this.align;
        return data;
    }
})

pb.model.TextSize = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.multiline = data.multiline || false;
        this.rows = data.rows || 1;
    },
    getType:function()
    {
        //return pb.model.Element.TEXTHEIGHT;
    },
    toString:function()
    {
        return "[TextHeight id:" + this.getID() + "]";
    },
    setMultiline:function(val)
    {
        var bool = pb.model.Utils.toBoolean(val);
        this.updateProperty("multiline",pb.model.Utils.toBoolean(val));
    },
    getMultiline:function()
    {
        return this.multiline;
    },
    setRows:function(val)
    {
        this.updateProperty("rows",val);
    },
    getRows:function()
    {
        return this.rows;
    },
    getData:function()
    {
        return {
                    multiline:this.multiline,
                    rows:this.rows
                }
    }
});

pb.model.LayoutDirection = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.direction = data.direction || pb.model.LayoutDirectionType.HORIZONTAL;
    },
    toString:function()
    {
        return "[LayoutDirection value:" + this.direction + "]";
    },
    getDirection:function()
    {
        return this.direction;
    },
    setDirection:function(val)
    {
        this.updateProperty("direction",val);
    },
    getData:function()
    {
        var data = this.__super();
        data.direction = this.direction;
        return data;
    }
});
pb.model.LayoutDirectionType =
{
    HORIZONTAL:"horizontal",
    VERTICAL:"vertical"
};

pb.model.Date = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.default = data.default ||  "today";
        this.specifiedDate = data.specifiedDate || new Date(1969,7,24);
        this.operator = data.operator || "add";
        this.adjustmentFactor = data.adjustmentFactor || 0;
        this.adjustmentUnit = data.adjustmentUnit || "d";
        this.specifiedDate = data.specifiedDate || null;
    },
    getType:function()
    {
        return pb.model.Element.DATE;
    },
    toString:function()
    {
        return "[Date id:" + this.getID() + "]";
    },
    setDefault:function(val)
    {
        this.updateProperty("default",val);
    },
    getDefault:function()
    {
        return this.default;
    },
    setSpecifiedDate:function(val)
    {
        this.updateProperty("specifiedDate",val);
    },
    getSpecifiedDate:function()
    {
        return this.specifiedDate;
    },
    setAdjustmentFactor:function(val)
    {
        this.updateProperty("adjustmentFactor",val);
    },
    getAdjustmentFactor:function()
    {
        return this.adjustmentFactor;
    },
    setOperator:function(val)
    {
        this.updateProperty("operator",val);
    },
    getOperator:function()
    {
        return this.operator;
    },
    setAdjustmentUnit:function(val)
    {
        this.updateProperty("adjustmentUnit",val);
    },
    getAdjustmentUnit:function()
    {
        return this.adjustmentUnit;
    },
    getData:function()
    {
        var data = this.__super();
        data.default = this.default;
        data.specifiedDate = this.specifiedDate;
        data.adjustmentFactor = this.adjustmentFactor;
        data.adjustmentUnit = this.adjustmentUnit;
        data.operator = this.operator;
        return data;
    }
})

pb.model.TextLabel = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.align = new pb.model.Align(data.align);
        this.align.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textSize = new pb.model.TextSize(data.textSize);
        this.textSize.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.hyperlink = new pb.model.Hyperlink(data.hyperlink);
        this.hyperlink.setMappingContext(this.getMappingContext());
        this.hyperlink.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.numberFormat = new pb.model.NumberFormat(data.numberFormat); // used if we map to a number..
        this.numberFormat.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
    },
    getNumberFormat:function()
    {
        return this.numberFormat;
    },
    getHyperlink:function()
    {
        return this.hyperlink;
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
        this.hyperlink.setMappingContext(context);
    },
    getType:function()
    {
        return pb.model.Element.TEXTLABEL;
    },
    toString:function()
    {
        return "[TextLabel id:" + this.getID() + "]";
    },
    getTextSize:function()
    {
        return this.textSize;
    },
    getTextColor:function()
    {
      return this.textColor;
    },
    getBackgroundColor:function()
    {
      return this.backgroundColor;
    },
    getWidth:function()
    {
        return this.width;
    },
    getAlign:function()
    {
        return this.align;
    },
    getData:function()
    {
        var data = this.__super();
        data.align = this.align.getData();
        data.width = this.width.getData();
        data.textSize = this.textSize.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        data.displayValue = this.displayValue.getData();
        data.hyperlink = this.hyperlink.getData();
        if(this.isMappedToNumber()) data.numberFormat = this.numberFormat.getData();
        return data;
    },
    isMappedToNumber:function()
    {
        var entity = this.getDisplayValue().getMappedEntity() || this.getMappedEntity();
        return (entity && entity.objectType().isNumber());
    },
    canBeMappedToEntity:function(entity)
    {
        return (entity.objectType()
                && (!entity.objectType().isCompound()
                || entity.objectType().getType()==pb.model.fields.ObjectType.ENUM))? true : false;//entity.objectType().isString();
    },
    getDisplayString:function()
    {
        var entity = this.getDisplayValue().getMappedEntity() || this.getMappedEntity();
        var str = "";
        if(entity)
        {
            if(entity.isValueField())
            {
                if(entity.valueType() == pb.model.fields.ValueType.SMALLTEXT || entity.valueType() == pb.model.fields.ValueType.LARGETEXT)
                {
                    str = this.valueFieldFormatting(entity.value());
                }
            }
            else
            {
                str = this.mappedEntityFormatting(entity.name());
            }

            if(entity.objectType().isNumber())
            {
                str = this.getNumberFormat().format(str);
            }
        }
        else
        {
            str = "Text Label"
        }
        return str;
    }
});
/*
pb.model.ElementWithDefault = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.defaultValue = new pb.model.DefaultValue(data.defaultValue);
        this.defaultValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
    },
    getDefaultValue:function()
    {
        return this.defaultValue;
    },
    getData:function()
    {
        var data = this.__super();
        data.defaultValue = this.defaultValue.getData();
        return data;
    }
})
*/
pb.model.TextInput = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.align = new pb.model.Align(data.align);
        this.align.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textSize = new pb.model.TextSize(data.textSize);
        this.textSize.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
    },
    getType:function()
    {
        return pb.model.Element.TEXTINPUT;
    },
    getWidth:function()
    {
        return this.width;
    },
    getTextSize:function()
    {
       return this.textSize;
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getAlign:function()
    {
        return this.align;
    },
    toString:function()
    {
        return "[TextInput id:" + this.getID() + "]";
    },
    setText:function(val)
    {
        this.updateProperty("text",val);
    },
    getText:function()
    {
        return this.text;
    },
    getData:function()
    {
        var data = this.__super();
        data.size = this.size;
        data.align = this.align.getData();
        data.width = this.width.getData();
        data.textSize = this.getTextSize().getData();
        data.displayValue = this.displayValue.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        return data;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isString();
    },
    getDisplayString:function()
    {
        var entity = this.getDisplayValue().getMappedEntity() || this.getMappedEntity();
        if(entity)
        {
            return (entity.isValueField()
                    && (entity.valueType() == pb.model.fields.ValueType.SMALLTEXT
                    || entity.valueType() == pb.model.fields.ValueType.LARGETEXT)
                    )? this.valueFieldFormatting(entity.value()) : this.mappedEntityFormatting(entity.name());
        }
        else
        {
            return "Text Input"
        }
    }
});

pb.model.NumericInput = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {}
        this.width = new pb.model.Width(data.width);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.format = new pb.model.NumberFormat(data.format);
        this.format.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        //this.places = data.places || 0;
        //this.format = data.format || "number";
        this.align = new pb.model.Align(data.align || {value:"right"});
        this.align.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    getType:function()
    {
        return pb.model.Element.NUMERIC;
    },
    toString:function()
    {
        return "[NumericInput id:" + this.getID() + "]";
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getFormat:function()
    {
        return this.format;
    },
    /*setPlaces:function(val)
    {
        var from = this.places;
        this.places = Math.min(9,Math.max(0,val));
        this.onChanged("places",from,this.places);
    },
    getPlaces:function()
    {
        return this.places;
    },*/
    getWidth:function()
    {
        return this.width;
    },
    getAlign:function()
    {
        return this.align;
    },
    getData:function()
    {
        var data = this.__super();
        data.format = this.format.getData();
        data.width = this.width.getData();
        data.align = this.align.getData();
        data.textColor = this.textColor.getData();
        data.displayValue = this.displayValue.getData();
        data.backgroundColor = this.backgroundColor.getData();
        return data;
    },
    canBeMappedToEntity: function (entity)
    {
        if(this.__super(entity)) return entity.objectType().isNumber();
    },
    getValueOrDefault:function()
    {
        if(this.isMapped())
        {
            var entity = this.getMappedEntity();
            return (entity.isValueField()
                && (entity.valueType() == pb.model.fields.ValueType.SMALLTEXT
                || entity.valueType() == pb.model.fields.ValueType.LARGETEXT)
                )? this.valueFieldFormatting(entity.value()) : this.mappedEntityFormatting(entity.name());
        }
        else
        {
            return "999999";
        }
    },
    getDisplayString:function()
    {
        var str = this.getValueOrDefault();
        return this.getFormat().format(str);
    }
});

pb.model.OptionList = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.items = [];
        data = data || [];
        for(var i=0; i<data.length; i++)
        {
            var option = this.createItem(data[i]);
            option.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onRemoveItem);
            option.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onChangeItem);
            this.items.push(option);
        }
    },
    itemLimit:function()
    {
        return null;
    },
    getType:function()
    {
        return pb.model.Element.OPTIONLIST;
    },
    toString:function()
    {
        return "[OptionList id:" + this.getID() + "]";
    },
    isEmpty:function()
    {
        return this.items.length==0;
    },
    getItems:function()
    {
        return this.items;
    },
    createItem:function(data)
    {
        return new pb.model.OptionListItem(data);
    },
    canAddItems:function()
    {
        return (this.itemLimit()!=null)? this.items.length<this.itemLimit() : true;
    },
    addItem:function()
    {
        if(!this.canAddItems()) return;
        var option = this.createItem();
        option.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onRemoveItem);
        option.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onChangeItem);
        this.items.push(option);
        this.onChanged("options",this.items,this.items); // triggers standard CHANGE event..
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.ADD)); // specify ADD event as well...
        this.dispatchEvent(new pb.model.CollectionEvent(this,pb.model.CollectionEvent.ADD,option));

    },
    onRemoveItem:function(event)
    {
        for(var i=0; i<this.items.length; i++)
        {
            if(this.items[i]==event.target)
            {
                this.items.splice(i,1);
                this.onChanged("options",this.items,this.items); // triggers standard CHANGE event..
                this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE)); // specify REMOVE event as well...
                this.dispatchEvent(new pb.model.CollectionEvent(this,pb.model.CollectionEvent.REMOVE,event.target));
                break;
            }
        }
    },
    onChangeItem:function(event)
    {
        var newEvent = Object.assign({},event);
        newEvent.originalEvent = event;
        newEvent.currentTarget = this;
        newEvent.property = "options";
        this.dispatchEvent(newEvent);
    },
    getData:function()
    {
        var result = [];
        for(var i=0; i<this.items.length; i++)
        {
            result.push(this.items[i].getData());
        }
        return result;
    }
});

pb.model.OptionListItem = sp.core.events.EventDispatcher.extend
({
    __constructor:function(data)
    {
        this.__super();
        data = data || {};
        this.id = sp.guid();
        this.name = data.name;
        this.value = data.value;
    },
    toString:function()
    {
        return "[OptionListOption id:" + this.id +" name:" + this.name + " value:" + this.value + "]";
    },
    getID:function()
    {
        return this.id;
    },
    getName:function()
    {
        return this.name || "Label";
    },
    setName:function(val)
    {
        var old = this.name;
        this.name = val;
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,old,this.name));
    },
    getValue:function()
    {
        return this.value || "Enter a value";
    },
    setValue:function(val)
    {
        var old = this.value;
        this.value = val;
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,old,this.value));
    },
    getData:function()
    {
        return {name:this.name,
                value:this.value};
    }
});

pb.model.SliderOptionListItem = pb.model.OptionListItem.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.name = data.name;
        this.value = data.value;
    },
    toString:function()
    {
        return "[SliderOptionListItem id:" + this.id +" name:" + this.name + " value:" + this.value + "]";
    },
    getValue:function()
    {
        return this.value || 0;
    },
    setValue:function(val)
    {
        var old = this.value;
        this.value = (isNaN(Number(val))? 0 : Number(val));
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,old,this.value));
    },
    getData:function()
    {
        return {name:this.name,
                value:this.value};
    }
})

pb.model.PickList = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width);
        this.align = new pb.model.Align(data.align);
        this.align.addEventListener(this, pb.model.ModelEvent.CHANGE, this.forwardChildEvent);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.options = new pb.model.OptionList(data.options);
        this.options.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        if(!this.options.isEmpty) this.options.addOption();
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
    },
    getWidth:function()
    {
        return this.width;
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getOptions:function()
    {
        return this.options;
    },
    getType:function()
    {
        return pb.model.Element.PICKLIST;
    },
    toString:function()
    {
        return "[Picklist id:" + this.getID() + "]";
    },
    getData:function()
    {
        var data = this.__super();
        data.width = this.width.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        data.align = this.align.getData();
        return data;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isEnum();
    },
    getAlign: function () {
        return this.align;
    },
    getDisplayString:function()
    {

        var entity = this.getMappedEntity();
        if(entity)
        {
            return (entity.isValueField()
                && (entity.valueType() == pb.model.fields.ValueType.SMALLTEXT
                || entity.valueType() == pb.model.fields.ValueType.LARGETEXT)
                )? this.valueFieldFormatting(entity.value()) : this.mappedEntityFormatting(entity.name());
        }
        else
        {
            return ""
        }
    }
});

pb.model.Checkbox = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data =  data || {};
        //this.text = data.text || "Label";
        this.labelPosition = data.labelPosition || "left";
        //this.width = new pb.model.Width(data.width);
        //this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        //this.align = new pb.model.Align(data.align);
        //this.align.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
        this.labelValue = new pb.model.LabelValue(data.labelValue);
        this.labelValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
    },
    getLabelValue:function()
    {
        return this.labelValue;
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
    },
    getType:function()
    {
        return pb.model.Element.CHECKBOX;
    },
    toString:function()
    {
        return "[Checkbox id:" + this.getID() + "]";
    },
    getWidth:function()
    {
        //return this.width;
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getAlign:function()
    {
        //return this.align;
    },
    setLabelPosition:function(val)
    {
        //var old = this.labelPosition;
        //this.labelPosition = val;
        //this.onChanged("labelPosition",old,this.labelPosition);
    },
    getLabelPosition:function()
    {
        //return this.labelPosition;
    },
    getData:function()
    {
        var data = this.__super();
        data.text = this.text;
        //data.labelPosition = this.labelPosition;
        //data.width = this.width.getData();
        //data.align = this.align.getData();
        data.displayValue = this.displayValue.getData();
        //data.labelValue = this.labelValue.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        return data;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isBoolean();
    },
    getChecked:function()
    {
        if(this.isMapped())
        {
            var entity = this.getMappedEntity();
            if(entity.fieldType()==pb.model.fields.FieldType.VALUE)
            {
                return entity.value();
            }
            else
            {
                return this.mappedEntityFormatting(entity.name());
            }
        }
        else
        {
            return "999999";
        }
    }
});

pb.model.DatePicker = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        //this.width = new pb.model.Width(data.width);
        //this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.date = new pb.model.Date(data.date);
        this.date.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
    },
    getType:function()
    {
        return pb.model.Element.DATEPICKER;
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    toString:function()
    {
        return "[Datepicker id:" + this.getID() + "]";
    },
    getDate:function()
    {
        return this.date;
    },
    //getWidth:function()
    //{
    //    return this.width;
    //},
    getData:function()
    {
        var data = this.__super();
        data.date = this.date.getData();
        data.displayValue = this.displayValue.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        return data;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isDate();
    },
    getDisplayString:function()
    {
        if(this.isMapped())
        {
            return this.mappedEntityFormatting(this.getMappedEntity().name());
        }
    }
});

pb.model.Image = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.source = data.source;
        this.width = data.width;
        this.height = data.height;
        this.naturalWidth = data.naturalWidth;
        this.naturalHeight = data.naturalHeight;
        this.specifiedWidth = data.specifiedWidth || this.width;
        this.specifiedHeight = data.specifiedHeight || this.height;
        this.hyperlink = new pb.model.Hyperlink(data.hyperlink);
        this.hyperlink.setMappingContext(this.getMappingContext());
        this.hyperlink.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);

    },
    getHyperlink:function()
    {
        return this.hyperlink;
    },
    getType:function()
    {
        return pb.model.Element.IMAGE;
    },
    toString:function()
    {
        return "[Image id:" + this.getID() + "]";
    },
    getSource:function()
    {
        if(this.getMappedEntity() && this.getMappedEntity().fieldType()==pb.model.fields.FieldType.VALUE)
        {
            return this.getMappedEntity().value();
        }
    },
    updateNaturalWidthAndHeight:function()
    {
        // we don't actually need this code any more I think, because the backend will just set the w/h to empty strings
        // when width is set to 'match width' etc... and that's fine, the front end will just load the image as is..
        // leaving here for a bit in case we do need it...
        var image = new Image();
        var __this = this;
        image.onload = function()
        {
            __this.naturalWidth = this.width;
            __this.naturalHeight = this.height;
            if(__this.specifiedWidth==undefined) __this.specifiedWidth = this.naturalWidth;
            if(__this.specifiedHeight==undefined) __this.specifiedHeight = this.naturalHeight
        };
        //image.src = this.getMappedEntity().getValue();
    },

    setSource:function(val)
    {
        var old = this.source;
        this.source = val;
        var image = new Image();
        var __this = this;
        image.onload = function()
        {
            __this.naturalWidth = this.width;
            __this.naturalHeight = this.height;
            if(__this.specifiedWidth==undefined) __this.specifiedWidth = this.naturalWidth;
            if(__this.specifiedHeight==undefined) __this.specifiedHeight = this.naturalHeight
        };
        image.src = this.source;
        this.onChanged("source",old,this.source);
    },
    getNaturalWidth:function()
    {
        return this.naturalWidth;
    },
    getNaturalHeight:function()
    {
        return this.naturalHeight;
    },
    getWidth:function()
    {
        return this.width;
    },
    setWidth:function(val)
    {
        var old = this.width;
        this.width = val;
        this.onChanged("width",old,this.width);
    },
    getHeight:function()
    {
        return this.height;
    },
    setHeight:function(val)
    {
        var old = this.height;
        this.height = val;
        this.onChanged("height",old,this.height);
    },
    getSpecifiedWidth:function()
    {
        return this.specifiedWidth;
    },
    setSpecifiedWidth:function(val)
    {
        var old = this.specifiedWidth;
        this.specifiedWidth = val;
        this.onChanged("specifiedWidth",old,this.specifiedWidth);
    },
    getSpecifiedHeight:function()
    {
        return this.specifiedHeight;
    },
    setSpecifiedHeight:function(val)
    {
        var old = this.specifiedHeight;
        this.specifiedHeight = val;
        this.onChanged("specifiedHeight",old,this.specifiedHeight);
    },
    onMappingContextChanged:function(context)
    {
        this.hyperlink.setMappingContext(context);
    },
    getData:function()
    {
        var data = this.__super();
        data.source = this.source;
        data.naturalWidth = this.naturalWidth;
        data.width = this.width;
        data.specifiedWidth = this.specifiedWidth;
        data.naturalHeight = this.naturalHeight;
        data.height = this.height;
        data.specifiedHeight = this.specifiedHeight;
        data.hyperlink = this.hyperlink.getData();
        return data;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isString();
    },
    getCandidateMappingFields:function()
    {
        // can be overridden to change the potential fields for mapping...if in doubt, stick to the default
        var fields = [];
        if(this.getMappingContext())
        {
            fields = fields.concat(this.getMappingContext().fields())
        }
        fields = fields.concat(di.resolve("Fields").getAllValues());
        return fields;
    }

});

pb.model.RadioButtons = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.options = new pb.model.OptionList(data.options);
        this.options.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.layoutDirection = new pb.model.LayoutDirection(data.layoutDirection);
        this.layoutDirection.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        if(this.options.isEmpty())
        {
            this.options.addItem();
            this.options.addItem();
        }
    },
    getWidth:function()
    {
        return this.width;
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getType:function()
    {
        return pb.model.Element.RADIOBUTTONS;
    },
    toString:function()
    {
        return "[RadioButtons id:" + this.getID() + "]";
    },
    getOptions:function()
    {
        return this.options;
    },
    getLayoutDirection:function()
    {
        return this.layoutDirection;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isEnum();
    },
    getData:function()
    {
        var data = this.__super();
        data.width = this.width.getData();
        data.options = this.options.getData();
        data.layoutDirection = this.layoutDirection.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        return data;
    },
    getDisplayString:function()
    {

        var entity = this.getMappedEntity();
        if(entity)
        {
            return (entity.isValueField()
                && (entity.valueType() == pb.model.fields.ValueType.SMALLTEXT
                || entity.valueType() == pb.model.fields.ValueType.LARGETEXT)
                )? this.valueFieldFormatting(entity.value()) : this.mappedEntityFormatting(entity.name());
        }
        else
        {
            return ""
        }
    }
});

pb.model.Slider = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width);
        this.minimum = (data.minimum!=undefined)? data.minimum : 0;
        this.maximum = (data.maximum!=undefined)? data.maximum : 10;
        this.snap = data.snap || false;
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
    },
    getType:function()
    {
        return pb.model.Element.SLIDER;
    },
    toString:function()
    {
        return "[Slider id:" + this.getName() + "]";
    },
    getWidth:function()
    {
      return this.width;
    },
    createOption:function()
    {
      return new pb.model.SliderOptionListItem();
    },
    setSnap:function(val)
    {
        this.updateProperty("snap",val);
    },
    getSnap:function()
    {
        return this.snap;
    },
    setMinimum:function(val)
    {
       this.updateProperty("minimum",pb.model.Utils.toNumber(val));
    },
    getMinimum:function()
    {
        return this.minimum;
    },
    setMaximum:function(val)
    {
        this.updateProperty("maximum",pb.model.Utils.toNumber(val));
    },
    getMaximum:function()
    {
        return this.maximum;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isNumber();
    },
    getData:function()
    {
        var data = this.__super();
        data.displayValue = this.displayValue.getData();
        data.width = this.width.getData();
        data.minimum = this.minimum;
        data.maximum = this.maximum;
        data.snap = this.snap;
        data.backgroundColor = this.backgroundColor.getData();
        return data;
    }
});

pb.model.TextArea = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.text = "Enter text here..";
        this.width = new pb.model.Width(data.width);
    },
    getType:function()
    {
        return pb.model.Element.TEXTAREA;
    },
    toString:function()
    {
        return "[TextArea id:" + this.getID() + "]";
    },
    getWidth:function()
    {
        return this.width;
    },
    setText:function(val)
    {
        this.updateProperty("text",val);
    },
    getText:function()
    {
        return this.text;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isString();
    },
    getData:function()
    {
        var data = this.__super();
        data.text = this.getText();
        data.width = this.width.getData();
        return data;
    }
});

pb.model.List = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
    },
    getType:function()
    {
        return pb.model.Element.LIST;
    },
    toString:function()
    {
        return "[List id:" + this.getID() + "]";
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isCollection();
    }
});

pb.model.PainChain = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        //this.options = new pb.model.GridOptions(data.options); // TODO order is important here, we need to ensure the grid options are created first, so that the options exist when the grid columns are created...this is not robust and needs improving..
        //this.options.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        //this.gridColumnOptions = new pb.model.GridColumnOptions(data.gridColumnOptions,this);
        //this.gridColumnOptions.setMappingContext(this.getMappedEntity());
        //this.gridColumnOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.width = new pb.model.Width(data.width || {size:"full"});
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.height = new pb.model.Height(data.height || {size:"small"});
        this.height.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent)
        this.lookup = new pb.model.CollectionLookUp(data.lookupData);
    },
    getLookUp:function()
    {
        return this.lookup;
    },
    getWidth:function()
    {
        return this.width;
    },
    getHeight:function()
    {
        return this.height;
    },
    getType:function()
    {
        return pb.model.Element.GRID;
    },
    toString:function()
    {
        return "[Grid id:" + this.getID() + " width:" + this.width + " ]";
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isCollection() && entity.lookUpPath();
    },
    getGridColumnOptions:function()
    {
        return this.gridColumnOptions;
    },
    getOptions:function()
    {
        return this.options;
    },
    setMappedEntity:function(entity)
    {
        this.__super(entity);
        this.lookup.setMappedEntity((entity)? entity.contentType() : null);
        this.gridColumnOptions.setMappingContext(this.getMappedEntity());
    },
    setMappingContext:function(entity)
    {
        this.__super(entity);
        this.lookup.setMappingContext(entity);
    },
    getData:function()
    {
        var data = this.__super();
        data.gridColumnOptions = this.gridColumnOptions.getData();
        data.width = this.width.getData();
        data.height = this.height.getData();
        data.options = this.options.getData();
        data.lookupData = this.lookup.getData();
        return data;
    }
});

pb.model.Chart = pb.model.Element.extend
({
    // NB: Secondary axis removed in V1.0 but all relevant lines left commented out in case it gets added back in...
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.chartRangeList = new pb.model.ChartRangeList(data.chartRangeList);
        this.chartRangeList.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.width = new pb.model.Width(data.width);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.height = new pb.model.Height(data.height);
        this.height.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.primaryAxisOptions = new pb.model.ChartAxisOptions(data.primaryAxisOptions,pb.model.ChartAxisType.PRIMARY);
        this.primaryAxisOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        //this.secondaryAxisOptions = new pb.model.ChartAxisOptions(data.secondaryAxisOptions,pb.model.ChartAxisType.SECONDARY);
        //this.secondaryAxisOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.chartType = data.chartType || pb.model.ChartType.COLUMN;
        this.primaryAxisOptions.setMappingContext(this.getMappedEntity());
        //this.secondaryAxisOptions.setMappingContext(this.getMappedEntity());
    },
    getType:function()
    {
        return pb.model.Element.CHART;
    },
    toString:function()
    {
        return "[Chart id:" + this.getID() + "]";
    },
    getWidth:function()
    {
        return this.width;
    },
    getHeight:function()
    {
        return this.height;
    },
    setChartType:function(val)
    {
        this.updateProperty("chartType",val);
    },
    getChartType:function()
    {
        return this.chartType;
    },
    getSize:function()
    {
        return this.chartType;
    },
    getChartRangeList:function()
    {
        return this.chartRangeList;
    },
    getPrimaryAxisOptions:function()
    {
      return this.primaryAxisOptions;
    },
    getSecondaryAxisOptions:function()
    {
      //return this.secondaryAxisOptions;
    },
    setMappedEntity:function(entity)
    {
        this.__super(entity);
        this.primaryAxisOptions.setMappingContext(this.getMappedEntity());
        //this.secondaryAxisOptions.setMappingContext(this.getMappedEntity());
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isCollection();
    },
    getData:function()
    {
        var data = this.__super();
        data.chartRangeList = this.chartRangeList.getData();
        data.width = this.width.getData();
        data.height = this.height.getData();
        data.primaryAxisOptions = this.primaryAxisOptions.getData();
        //data.secondaryAxisOptions = this.secondaryAxisOptions.getData();
        data.chartType = this.chartType;
        return data;
    }
});

pb.model.ChartAxisOptions = pb.model.Element.extend
({
    __constructor:function(data,axisType)
    {
        this.__super(data);
        data = data || {};
        this.axisType = axisType;
        this.field = (data.fieldId)? di.resolve("Fields").deepSearchEntity(data.fieldId) : "";
        this.groupingField = (data.groupingFieldId)? di.resolve("Fields").deepSearchEntity(data.groupingFieldId) : "";
        this.numberOptions = new pb.model.ChartAxisNumberOptions(data.numberOptions);
        this.dateOptions = new pb.model.ChartAxisDateOptions(data.dateOptions);
        this.numberOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onOptionsChanged);
    },
    onOptionsChanged:function(event)
    {
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    toString:function()
    {
        return "[ChartAxisOptions " + this.getID() + " axis:" + this.axis + "]"
    },
    getAxisType:function()
    {
        return this.axisType;
    },
    setField:function(val)
    {
        this.updateProperty("field",val);
    },
    getField:function()
    {
        return this.field;
    },
    getFieldId:function()
    {
        return (this.field)? this.field.id() : "";
    },
    setFieldId:function(id)
    {
        this.setField(this.getMappingContext().getFieldById(id));
    },
    getNumberOptions:function()
    {
        return this.numberOptions;
    },
    getDateOptions:function()
    {
        return this.dateOptions;
    },
    setGroupingField:function(val)
    {
        this.updateProperty("groupingField",val);
    },
    getGroupingField:function()
    {
        return this.groupingField;
    },
    setGroupingFieldId:function(id)
    {
        this.setGroupingField(this.getMappingContext().getFieldById(id));
    },
    getGroupingFieldId:function()
    {
        return (this.groupingField)? this.groupingField.id() : "";
    },
    getData:function()
    {
        var data = this.__super();
        data.fieldId = (this.field)? this.field.id() : "";
        data.dateOptions = this.dateOptions.getData();
        data.numberOptions = this.numberOptions.getData();
        data.groupingFieldId = (this.groupingField)? this.groupingField.id() : "";
        return data;
    },
    getFieldOptions:function()
    {
        var options = this.getMappableFields();
        var result = [];
        for(var i=0; i<options.length; i++)
        {
            if(options[i].objectType().isNumber()) result.push(options[i]);
        }
        return result;
    },
    getGroupingOptions:function()
    {
        var options = this.getMappableFields();
        var result = [];
        for(var i=0; i<options.length; i++)
        {
            if(options[i].objectType().isObject() ||
               options[i].objectType().isEnum() ||
               options[i].objectType().isBoolean()) result.push(options[i]);
        }
        return result;
    }
});
pb.model.ChartAxisType =
{
    PRIMARY:1,
    SECONDARY:2
}

pb.model.ChartAxisNumberOptions = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super();
        data = data || {};
        this.startingScaleValue = data.startingScaleValue || 0;
        this.incrementType = data.incrementType || pb.model.ChartIncrementType.AUTO;
        this.increment = data.increment || 100;
        this.symbol = data.symbol || "none";
    },
    toString:function()
    {
        return "[ChartAxisNumberOptions]\n" + JSON.stringify(this.getData(),null,"  ");
    },
    setStartingScaleValue:function(val)
    {
        this.updateProperty("startingScaleValue",val || 0);
    },
    getStartingScaleValue:function()
    {
        return this.startingScaleValue;
    },
    setIncrementType:function(val)
    {
        this.updateProperty("incrementType",val);
    },
    getIncrementType:function()
    {
        return this.incrementType;
    },
    setIncrement:function(val)
    {
        var orig = val;
        if(isNaN(Number(val))) val = 100;
        if(Math.abs(val)<1) val = 1;
        this.updateProperty("increment",val);
    },
    getIncrement:function()
    {
        return this.increment;
    },
    setSymbol:function(val)
    {
        this.updateProperty("symbol",val);
    },
    getSymbol:function()
    {
        return this.symbol;
    },
    getData:function()
    {
        var data = this.__super();
        data.startingScaleValue = this.startingScaleValue;
        data.incrementType = this.incrementType;
        data.increment = this.increment;
        data.symbol = this.symbol;
        return data;
    }
});
pb.model.ChartIncrementType =
{
    AUTO:"auto",
    SPECIFY:"specify"
}

pb.model.ChartAxisDateOptions = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.scaleType = data.scaleType || "showAll";
        this.filterType = data.filterType || "current";
        this.currentUnitsType = data.currentUnitsType || "year";
        this.rollingUnitsType = data.rollingUnitsType ||  "year";
        this.rollingUnits = data.rollingUnits || "10";
    },
    getFilterType:function()
    {
        return this.filterType;
    },
    setFilterType:function(val)
    {
        this.updateProperty("filterType",val);
    },
    getScaleType:function()
    {
        return this.scaleType;
    },
    setScaleType:function(val)
    {
        this.updateProperty("scaleType",val);
    },
    getCurrentUnitsType:function()
    {
        return this.currentUnitsType;
    },
    setCurrentUnitsType:function(val)
    {
        this.updateProperty("currentUnitsType",val)
    },
    getRollingUnitsType:function()
    {
        return this.rollingUnitsType;
    },
    setRollingUnitsType:function(val)
    {
        this.updateProperty("rollingUnitsType",val);
    },
    getRollingUnits:function()
    {
        return this.rollingUnits;
    },
    setRollingUnits:function(val)
    {
        this.updateProperty("rollingUnits",val);
    },
    getData:function()
    {
        var data = this.__super();
        data.filterType = this.filterType;
        data.scaleType = this.scaleType;
        data.currentOption = this.currentOption;
        data.rollingUnitsType = this.rollingUnitsType;
        data.rollingUnits = this.rollingUnits;
        return data;
    }
})

pb.model.ChartRangeList = pb.model.OptionList.extend
({
    __constructor:function(data)
    {
        this.__super(data);
    },
    createItem:function()
    {
        var item = new pb.model.ChartRangeItem();
        item.setMappingContext(this.getMappingContext());
        return item;
    },
    setMappingContext:function(entity)
    {
        this.__super(entity);
        for(var i=0; i<this.items.length; i++)
        {
            this.items[i].setMappingContext(this.getMappingContext());
        }
    },
    getData:function()
    {
        var data = this.__super();
    }
});

pb.model.ChartRangeItem = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.name = data.name || "";
        this.color = 0;
        var factory = di.resolve("ElementModelFactory");
        this.field = factory.createElementWithType(pb.model.Element.NUMERIC);
    },
    toString:function()
    {
        return "[ChartRangeItem id:" + this.id + " name:" + this.name + " type:" + this.type + " width:"  + this.width + "]";
    },
    setName:function(val)
    {
        this.updateProperty("name",val);
    },
    getName:function()
    {
        return this.name;
    },
    setColor:function(val)
    {
        this.updateProperty("color",val);
    },
    getColor:function()
    {
        return this.width;
    },
    getMappableFields:function()
    {
        var fields = this.__super();
        var result = [];
        for(var i=0; i<fields.length; i++)
        {
            if(this.field.checkForMappingCompatibility(fields[i])) result.push(fields[i]);
        }
        return result;
    },
    getData:function()
    {
        var data = this.__super();
        data.color = this.color;
        data.name = this.name;
        return data;
    },
    getData:function()
    {
        var data = this.__super();
    }
})

pb.model.ChartType =
{
    COLUMN:"column",
    LINE:"line",
    BAR:"bar",
    PIE:"pie",
    STACKEDBAR:"stacked-bar",
    AREA:"area"
}

pb.model.ChartNumericSymbolType =
{
    NONE:"none",
    CURRENCY:"currency",
    PERCENTAGE:"percentage"
}

pb.model.ChartMockDataSeries = Class.extend
({
    __constructor:function(model)
    {
        this.model = model;
        if(!model) sp.out("WARNING: ChartMockDataSeries requires a parameter.");
    },
    getDefaultData:function()
    {
        var chartData = {
            chart: {
                type: this.model.getChartType()
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{
                name: "",
                data: []
            }]
        }
        return chartData;
    },
    getData:function()
    {


        var data = this.getDefaultData();

        var primaryField = this.model.getPrimaryAxisOptions().getField();
        var secondaryField = this.model.getSecondaryAxisOptions().getField();
        if(!primaryField) return data; // then the chart is not yet associated with anything so return nothing..
        var primaryFieldType = primaryField.fieldType();
        if(secondaryField)
        {
            var secondaryFieldType = secondaryField.fieldType();
        }
        else
        {
            if(primaryFieldType == pb.model.fields.ObjectType.NUMBER)
            {
                var grouping = this.model.getPrimaryAxisOptions().getGroupingField();
                if(groupingField)
                {
                    data.xAxis.categories = ["Group1","Group2","Group3","Group4"];
                }
                data.series = [{name:"",
                               data:this.mockNumberData()}];
            }
            else if(primaryFieldType == pb.model.fields.ObjectType.DATE)
            {
                data.series = {name:"",
                    data:this.mockDateData()};
            }

        }





        return data;

    },
    getRandomNumberForSymbolType:function(symbol)
    {
        if(symbol==pb.model.ChartNumericSymbolType.PERCENTAGE)
        {
            return Math.round(Math.random()*100);
        }
        else if(symbol==pb.model.ChartNumericSymbolType.CURRENCY)
        {
            return Math.round(Math.random()*100000);
        }
        return Math.round(Math.random()*1000);
    },
    mockNumberData:function()
    {
        var numberOptions = this.model.getPrimaryAxisOptions().getNumberOptions();
        var symbol = numberOptions.getSymbol();
        var groupField = this.model.getPrimaryAxisOptions().getGroupingField();
        var data = [];
        for(var i=0; i<100; i++)
        {
            data.push(this.getRandomNumberForSymbolType(symbol));
        }
        return data;
    },
    mockDateData:function()
    {
        var data = [new Date(),new Date()];
        return data;
    }

})

pb.model.Button = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.default = false;
    },
    getType:function()
    {
        return pb.model.Element.BUTTON;
    },
    toString:function()
    {
        return "[Button id:" + this.getID() + "]";
    }
});

pb.model.TaggedText = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.default = false;
    },
    getType:function()
    {
        return pb.model.Element.TAGGEDTEXT;
    },
    toString:function()
    {
        return "[TaggedText id:" + this.getID() + "]";
    }
});

pb.model.ColorPicker = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.default = false;
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
    },
    getData:function()
    {
        var data = this.__super();
        data.displayValue = this.displayValue.getData();
    },
    getType:function()
    {
        return pb.model.Element.COLORPICKER;
    },
    toString:function()
    {
        return "[ColorPicker id:" + this.getID() + "]";
    }
});

pb.model.LookUp = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.textColor = new pb.model.Color(data.textColor);
        this.textColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this, pb.model.ModelEvent.CHANGE, this.forwardChildEvent);
        this.displayFieldId = data.displayFieldId;
        this.updateDisplayValueMappingContext();
        this.isHyperlink = (data.isHyperlink!=undefined)? data.isHyperlink : true;
        this.dialogFieldIds = data.dialogFieldIds || this.getDefaultDialogFieldOptions();
    },
    getDefaultDialogFieldOptions:function()
    {
        var fields = this.getDialogFieldOptions();
        return (fields.length)? [fields[0].id()] : [];
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateDisplayValueMappingContext();
    },
    getWidth:function()
    {
        return this.width;
    },
    getDisplayFieldId:function()
    {
        return this.displayFieldId;
    },
    setDisplayFieldId:function(val)
    {
        this.updateProperty("displayFieldId",val);
    },
    getDialogFieldIds:function()
    {
        return this.dialogFieldIds;
    },
    setDialogFieldIds:function(arr)
    {
        this.updateProperty("dialogFieldIds",arr);
    },
    getTextColor:function()
    {
        return this.textColor;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getIsHyperlink:function()
    {
        return this.isHyperlink;
    },
    setIsHyperlink:function(val)
    {
        this.updateProperty("isHyperlink",val);
    },
    getType:function()
    {
        return pb.model.Element.LOOKUP;
    },
    toString:function()
    {
        return "[Lookup id:" + this.getID() + "]";
    },
    getLookUpPath:function()
    {
        // Truth is, I'm not sure which one  of these should be returned now. It was the associated field, but this stopped working today
        // so it might be that we just need to use the mappedEntity lookup path.. leaving both in for now in case there is a reason..
        var associatedField = this.getAssociatedField();
        if(associatedField && associatedField.lookUpPath())
        {
            return associatedField.lookUpPath();
        }
        else
        {
            return (this.isMapped())? this.mappedEntity.lookUpPath() : null;
        }
    },
    getData:function()
    {
        var data = this.__super();
        data.width = this.width.getData();
        data.textColor = this.textColor.getData();
        data.backgroundColor = this.backgroundColor.getData();
        data.displayFieldId = this.getDisplayFieldId();
        data.dialogFieldIds = this.getDialogFieldIds();
        data.isHyperlink = this.isHyperlink;
        data.lookUpPath = this.getLookUpPath();
        data.associatedFieldId = this.getAssociatedFieldId();
        return data;
    },
    allowForeignKeyMapping:function()
    {
        return true; // we want to be able to map lookups to foreign keys...
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.isCRMField() && entity.isForeignKey();
    },
    getDisplayString:function()
    {
        var entity = this.getDisplayValue().getMappedEntity() || this.getMappedEntity();
        if(entity)
        {
            return (entity.isValueField()
                && (entity.valueType() == pb.model.fields.ValueType.SMALLTEXT
                || entity.valueType() == pb.model.fields.ValueType.LARGETEXT)
                )? this.valueFieldFormatting(entity.value()) : this.mappedEntityFormatting(entity.name());
        }
        else
        {
            return "Lookup"
        }
    },
    getAssociatedField:function()
    {
        return (this.getMappedEntity())? this.getMappedEntity().relatedObject() : null;
    },
    getAssociatedFieldId:function()
    {
        var associatedField = this.getAssociatedField();
        return (associatedField)? associatedField.id() : null;
    },
    getAssociatedFields:function()
    {
        // LookUps are mapped to foreign key fields like OwnerId, TaskTypeId etc. To get the fields which can be
        // displayed in the search dialog or the lookup, we take the associated record (eg. a User or TaskType and
        // extract the appropriate fields...
        if(this.getMappedEntity())
        {
            var associatedField = this.getAssociatedField();
            if(associatedField)
            {
                return associatedField.fields();
            }
        }
        return [];
    },
    getDisplayFieldOptions:function(typeFilter)
    {
        var result = [];
        if(this.getMappedEntity())
        {
            result = this.getAssociatedFields();
            var derivedFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.DERIVED);
            for(var i=0; i<derivedFields.length; i++)
            {
                if (!derivedFields[i].isValid()) continue;
            
                var sourceField = derivedFields[i].sourceField();

                if(sourceField.isCRMField())
                {
                    if(sourceField.immediateAncestor()==this.getMappedEntity())
                    {
                        result.push(derivedFields[i]);
                    }
                }
            }
        }
        return result;
    },


    getDialogFieldOptions:function()
    {
        return this.getAssociatedFields();
    }
});

pb.model.Map = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.width = new pb.model.Width(data.width || pb.model.Width.FULL);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.height = new pb.model.Height(data.height || pb.model.Height.LARGE);
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.height.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.cardDetails = new pb.model.MapCard(data.cardDetails);
        this.dialog = new pb.model.MapDialog(data.dialog);
        this.dialog.addEventListener(this,pb.model.MapDialogEvent.COPY,this.onDialogCopy);
        this.lookup = new pb.model.CollectionLookUp(data.lookupData);
        this.connections = new pb.model.MapConnectionList(data.connections,this.cardDetails);

          // SCG say this is not required here...the data mapping option should apparently be at
        // page level. Leaving in for now, in case that decision is reversed. TW 1/8/2016
        this.mapDataMappingOptions = new pb.model.MapDataMappingOptions(data.mapDataMappingOptions);
        this.mapDataMappingOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);

        this.updateChildMapping(); // ensures that the mapping context in the map's child elements is always up to date even if the schema has changed..


    },
    getMapDataMappingField:function()
    {
        return this.mapDataMappingField;
    },
    getMapDataMappingOptions:function()
    {
        return this.mapDataMappingOptions;
    },
    getType:function()
    {
        return pb.model.Element.MAP;
    },
    toString:function()
    {
        return "[Map " + this.getID() +"]";
    },
    onDialogCopy:function()
    {
        var els = this.cardDetails.getData().elements;
        this.dialog.copyElements(els);
    },
    getConnections:function()
    {
        return this.connections;
    },
    getLookUp:function()
    {
        return this.lookup;
    },
    getCardDetails:function()
    {
        return this.cardDetails;
    },
    getDialog:function()
    {
        return this.dialog;
    },
    getWidth:function()
    {
        return this.width;
    },
    getHeight:function()
    {
        return this.height;
    },
    getData:function()
    {
        var data = this.__super();
        data.width = this.width.getData();
        data.height = this.height.getData();
        data.cardDetails = this.cardDetails.getData();
        data.dialog = this.dialog.getData();
        data.lookupData = this.lookup.getData();
        data.connections = this.connections.getData();
        data.mapDataMappingOptions = this.mapDataMappingOptions.getData();
        return data;
    },
    getLookUpMappingForEntity:function(entity)
    {
        // given an entity, decide which field to map the lookup to...
        if(entity) return entity.addChildObject() || entity;
    },
    updateChildMapping:function()
    {
        // set the mapping on any child elements...
        var context = this.getMappingContext();
        var entity = this.getMappedEntity();
        this.cardDetails.setMappingContext(entity);
        this.dialog.setMappingContext(entity);
        this.dialog.setMappedEntity(entity);
        //var lookupEntity = this.getLookUpMappingForEntity(entity);
        this.lookup.setMappedEntity(entity);
        this.lookup.setMappingContext(context);
    },
    setMappingContext:function(entity)
    {
        this.__super(entity);
        this.lookup.setMappingContext(entity);
    },
    setMappedEntity:function(entity)
    {
        this.__super(entity);
        this.updateChildMapping();
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.objectType().isCollection() && entity.lookUpPath();
    }
});

pb.model.CollectionLookUp = pb.model.LookUp.extend
({
    // used by the grid and map to specify options for importing items into the collection..
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.displayFieldId = data.displayFieldId;
        this.updateDisplayValueMappingContext();
        this.dialogFieldIds = data.dialogFieldIds || this.getDefaultDialogFieldOptions();
    },
    getType:function()
    {
        return pb.model.Element.COLLECTIONLOOKUP;
    },
    toString:function()
    {
        return "[CollectionLookUp id:" + this.getID() + "]";
    },
    getData:function()
    {
        var data = {};
        data.mappedEntityId = this.getMappedEntityId();
        data.mappingContextId = this.getMappingContextId();
        data.displayFieldId = this.getDisplayFieldId();
        data.dialogFieldIds = this.getDialogFieldIds();
        data.lookUpPath = this.getLookUpPath(); // only needed for the backend, doesn't need to be handled in the constructor..
        data.associatedFieldId = this.getAssociatedFieldId();
        return data;
    },
    canBeMappedToEntity:function(entity)
    {
        return entity.isCRMField(); // not expplicit because the user doesn't directly set the mapping on a CollectionLookUp  it's always set by the parent item's context (eg. Grid or Map)
    },
    getAddChildObject:function()
    {
        return (this.mappedEntity)? this.mappedEntity.addChildObject() : null;
    },
    getDisplayFieldOptions:function(typeFilter)
    {
        var result = [];
        var addChildObject = this.getAddChildObject();
        if(addChildObject)
        {
            result = result.concat(addChildObject.fields());
            var derivedFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.DERIVED);
            for(var i=0; i<derivedFields.length; i++)
            {
                if(!derivedFields[i].isValid()) continue; // belt
                var sourceField = derivedFields[i].sourceField();
                if(sourceField && sourceField.isCRMField()) // braces
                {
                    if(sourceField.immediateAncestor()==addChildObject)
                    {
                        result.push(derivedFields[i]);
                    }
                }
            }
        }
        return result;
    },
    getDialogFieldOptions:function()
    {
        var addChildObject = this.getAddChildObject();
        return (addChildObject)? addChildObject.fields() : [];
    },
    onFieldsChanged:function()
    {
        // triggered when any fields change... need to check any mapped entity is still valid..
        if(this.mappedEntity)
        {
            if(!this.mappedEntity.isValid() || !this.canBeMappedToEntity(this.mappedEntity))
            {
                this.setMappedEntity();
            }
        }
    },
    getLookUpPath:function()
    {
        return (this.isMapped())? this.mappedEntity.lookUpPath() : null;
    }
});

pb.model.MapCard = pb.model.Container.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data ||  {};
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.borderColor = new pb.model.Color(data.borderColor);
        this.borderColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getBorderColor:function()
    {
        return this.borderColor;
    },
    getType:function()
    {
        return pb.model.Element.MAPCARD;
    },
    getData:function()
    {
        var data = this.__super();
        data.backgroundColor = this.backgroundColor.getData();
        data.borderColor = this.borderColor.getData();
        return data;
    }
});

pb.model.MapDialog = pb.model.Container.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.borderColor = new pb.model.Color(data.borderColor);
        this.borderColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.showMethod = data.showMethod || pb.model.MapDialog.ShowMethod.DOUBLECLICK;
    },
    toString:function()
    {
        return "[MapDialog, mappedEntity:" + this.getMappedEntity() + " context:" + this.getMappingContext() + "]";
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    getBorderColor:function()
    {
        return this.borderColor;
    },
    getType:function()
    {
        return pb.model.Element.MAPDIALOG;
    },
    copyFromCard:function()
    {
        this.dispatchEvent(new pb.model.MapDialogEvent(this,pb.model.MapDialogEvent.COPY));
    },
    copyElements:function(els)
    {
        this.removeAllElements();
        this.createElements(els);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REBUILD));
    },
    getShowMethod:function()
    {
        return this.showMethod;
    },
    setShowMethod:function(val)
    {
        this.showMethod = val;
    },
    getData:function()
    {
        var data = this.__super();
        data.backgroundColor = this.backgroundColor.getData();
        data.borderColor = this.borderColor.getData();
        data.showMethod = this.showMethod;
        return data;
    }
});

pb.model.MapDataMappingOptions = pb.model.MappableObject.extend
({
    __constructor:function(data)
    {
        this.__super(data);
    },
    toString:function()
    {
        return "[MapDataMappingOptions, mappedEntity:" + this.mappedEntity + "]";
    },
    getData:function()
    {
        return this.__super();
    },
    canBeMappedToEntity:function(entity)
    {
        return (entity.objectType().getType()==pb.model.fields.ObjectType.STRING);
    },
    getCandidateMappingFields:function()
    {
        // can be overridden to change the potential fields for mapping...if in doubt, stick to the default
        var context = di.resolve("PageContext").getContext();
        var fields = context.fields();
        var result = [];
        for(var i=0; i<fields.length; i++)
        {
            if(this.canBeMappedToEntity(fields[i])) result.push(fields[i]);
        }
        return result;
    }
})

pb.model.MapDataMappingField = pb.model.MappableObject.extend
({
    __constructor:function(data,mapFunction)
    {
        //represents a default value to display in an element if the mapped value is not present...
        this.__super(data);
        this.mapFunction = mapFunction;
    },
    toString:function()
    {
        return "[MapDataMappingField, mappedEntity:" + this.mappedEntity + "]";
    },
    getValue:function()
    {
        return (this.mappedEntity)? this.mappedEntity.value() : 0;
    },
    getData:function()
    {
        var data = this.__super();
        return data;
    },
    getMappableFields:function()
    {
        var fields  = di.resolve("Fields").getMappableItems();
        var mappableFields = [];
        for(var i=0; i<fields.length; i++)
        {
            if(this.checkForMappingCompatibility(fields[i]) && fields[i].isValid()) mappableFields.push(fields[i]);
        }
        return mappableFields;
    },
    canBeMappedToEntity:function(entity)
    {
        return this.mapFunction(entity);
    },
    updateProperty:function(prop,val,caller)
    {
        var old = this[prop];
        var event = new pb.model.ModelEvent(this,pb.model.ModelEvent.WILLCHANGE,prop,old,val);
        this.dispatchEvent(event);
        if(event.isPrevented())
        {
            return false; // to indicate that property was updated...
        }
        this.mappedEntity = val;
        this.onChanged(prop,old,val,this.updateProperty.caller);
        return true;
    },
    setMappedEntity:function(val)
    {
        var currentMappedEntity = this.mappedEntity;
        var result = this.updateProperty("default",val);
        if(result)
        {
            // then no one invoked a preventDefault on the change...
            if(currentMappedEntity) currentMappedEntity.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            if(this.mappedEntity) this.mappedEntity.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            this.onMappedEntityChanged(this.mappedEntity); // callback which can be overridden..
        }
        return result;
    }

});

pb.model.MapDialog.ShowMethod =
{
    BUTTON:"button",
    DOUBLECLICK:"doubleclick",
    HOVER:"hover"
};

pb.model.MapDialogEvent = sp.core.events.Event.extend
({

});
pb.model.MapDialogEvent.COPY = "map_dialog_copy";


pb.model.MapConnectionList = pb.model.OptionList.extend
({
    __constructor:function(data,cardDetails)
    {
        this.cardDetails = cardDetails;
        this.__super(data);
        this.cardDetails.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onChangeCardDetails);
    },
    itemLimit:function()
    {
        return 2;
    },
    onChangeCardDetails:function()
    {

    },
    createItem:function(data)
    {
        return new pb.model.MapConnection(data,this.cardDetails);
    },
    getData:function()
    {
        var data = this.__super();
        return data;
    }
});

pb.model.MapConnection = pb.model.Element.extend
({
    __constructor:function(data,cardDetails)
    {
        this.__super(data);
        this.cardDetails = cardDetails;
        data = data || {};
        this.from = data.from || "all";
        this.to = data.to || "all";
        this.description = data.description || "";
        this.color = (data.color!=undefined)? data.color : 0x000000;
        this.thickness = data.thickness || 1;
        this.cardDetails.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onChangeCardDetails);
    },
    onChangeCardDetails:function(event)
    {
        this.forwardChildEvent(event);
    },
    getOptionList:function()
    {
        var items = this.cardDetails.getElements();
        var result = [];
        for(var i=0; i<items.length; i++)
        {
            result.push({id:items[i].getID(),
                         name:items[i].getName()});
        }
        return result;
    },
    toString:function()
    {
        return "[MapConnection id:" + this.id + " description:" + this.description + " thickness:" + this.thickness + " color:"  + this.color + " from:" + this.from + " to:" + this.to + "]";
    },
    setDescription:function(val)
    {
        this.updateProperty("description",val);
    },
    getDescription:function()
    {
        return this.description;
    },
    getColor:function()
    {
        return this.width;
    },
    setColor:function(val)
    {
        this.updateProperty("color",val);
    },
    getColor:function()
    {
        return this.color;
    },
    setThickness:function(val)
    {
        this.updateProperty("thickness",val);
    },
    getThickness:function()
    {
        return this.thickness;
    },
    setFrom:function(val)
    {
        this.updateProperty("from",val);
    },
    getFrom:function()
    {
        return this.from;
    },
    setTo:function(val)
    {
        this.updateProperty("to",val);
    },
    getTo:function()
    {
        return this.to;
    },
    getData:function()
    {
        var data = this.__super();
        data.color = this.color;
        data.description = this.description;
        data.thickness = this.thickness;
        data.from = this.from;
        data.to = this.to;
        return data;
    }
})

pb.model.Visibility = pb.model.MappableObject.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        if(!this.getMappedEntity()) this.mappedEntity = di.resolve("Fields").getItemById(pb.model.fields.DefaultFields.YES);
    },
    toString:function()
    {
        return "[Visibility, mappedEntity:" + this.mappedEntity + " visible:" + this.getValue() + "]";
    },
    getValue:function()
    {
        return (this.mappedEntity)? this.mappedEntity.value() : false;
    },
    getData:function()
    {
        var data = this.__super();
        return data;
    }
});

pb.model.Color = pb.model.MappableObject.extend
({
    __constructor:function(data)
    {
        this.__super(data);
    },
    toString:function()
    {
        return "[Color, mappedEntity:" + this.mappedEntity + "]";
    },
    getValue:function()
    {
        return (this.mappedEntity)? this.mappedEntity.value() : 0;
    },
    getData:function()
    {
        var data = this.__super();
        return data;
    },
    getColorValue:function()
    {
        // try to extract a real color value from the mapped entity if it's a fixed value..
        if(this.isMapped())
        {
            if(this.mappedEntity.fieldType() == pb.model.fields.FieldType.VALUE)
            {
                return this.mappedEntity.value();
            }
            else
            {
                return "#FAFAFA"; // return a grey color to show it's mapped but can't be calculated now..
            }
        }
    }
});

pb.model.NumberFormat = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.places = data.places || 0;
        this.type = data.type || pb.model.NumberFormatType.NUMBER;
    },
    toString:function()
    {
        return "[NumberFormat]";
    },
    getPlaces:function()
    {
        return this.places;
    },
    setPlaces:function(val)
    {
        this.updateProperty("places",val || 0);
    },
    getType:function()
    {
        return this.type;
    },
    setType:function(val)
    {
        this.updateProperty("type",val || pb.model.NumberFormatType.NUMBER);
    },
    getPlacesString:function(places)
    {
        str = "";
        for(var i=0; i<places; i++) str += "0";
        return str;
    },
    format:function(str)
    {
        var places = this.getPlaces();
        if(places>0) str += "."+this.getPlacesString(places);
        if(this.getType()==pb.model.NumberFormatType.CURRENCY) str = "$" + str;
        if(this.getType()==pb.model.NumberFormatType.PERCENTAGE) str = str + "%";
        return str;
    },
    getData:function()
    {
        var data = this.__super();
        data.places = this.places;
        data.type = this.type;
        return data;
    }
})
pb.model.NumberFormatType =
{
    PERCENTAGE:"percentage",
    NUMBER:"number",
    CURRENCY:"currency"
}

pb.model.DisplayValue = pb.model.MappableObject.extend
({
    __constructor:function(data,mapFunction)
    {
        //represents a default value to display in an element if the mapped value is not present...
        this.__super(data);
        this.mapFunction = mapFunction;
    },
    toString:function()
    {
        return "[DisplayValue, mappedEntity:" + this.mappedEntity + "]";
    },
    getValue:function()
    {
        return (this.mappedEntity)? this.mappedEntity.value() : 0;
    },
    getData:function()
    {
        var data = this.__super();
        return data;
    },
    getMappableFields:function()
    {
        var fields  = di.resolve("Fields").getMappableItems();
        var mappableFields = [];
        for(var i=0; i<fields.length; i++)
        {
            if(this.checkForMappingCompatibility(fields[i]) && fields[i].isValid()) mappableFields.push(fields[i]);
        }
        return mappableFields;
    },
    canBeMappedToEntity:function(entity)
    {
        return this.mapFunction(entity);
    },
    updateProperty:function(prop,val,caller)
    {
        var old = this[prop];
        var event = new pb.model.ModelEvent(this,pb.model.ModelEvent.WILLCHANGE,prop,old,val);
        this.dispatchEvent(event);
        if(event.isPrevented())
        {
            return false; // to indicate that property was updated...
        }
        this.mappedEntity = val;
        this.onChanged(prop,old,val,this.updateProperty.caller);
        return true;
    },
    setMappedEntity:function(val)
    {
        sp.out("Set mapped entity on DisplayValue to:" + val);
        var currentMappedEntity = this.mappedEntity;
        var result = this.updateProperty("default",val);
        if(result)
        {
            // then no one invoked a preventDefault on the change...
            if(currentMappedEntity) currentMappedEntity.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            if(this.mappedEntity) this.mappedEntity.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            this.onMappedEntityChanged(this.mappedEntity); // callback which can be overridden..
        }
        return result;
    }
});

pb.model.LabelValue = pb.model.MappableObject.extend
({
    __constructor:function(data)
    {
        //represents a default value to display in an element if the mapped value is not present...
        this.__super(data);
    },
    toString:function()
    {
        return "[LabelValue, mappedEntity:" + this.mappedEntity + "]";
    },
    getValue:function()
    {
        return (this.mappedEntity)? this.mappedEntity.value() : "";
    },
    getData:function()
    {
        var data = this.__super();
        return data;
    },
    getMappableFields:function()
    {
        var fields  = di.resolve("Fields").getMappableItems();
        var mappableFields = [];
        for(var i=0; i<fields.length; i++)
        {
            if(this.checkForMappingCompatibility(fields[i]) && fields[i].isValid()) mappableFields.push(fields[i]);
        }
        return mappableFields;
    },
    canBeMappedToEntity:function(entity)
    {
        return (entity.fieldType()!=pb.model.fields.FieldType.CRM) && (entity.valueType() == pb.model.fields.ValueType.SMALLTEXT);
    },
    updateProperty:function(prop,val,caller)
    {
        var old = this[prop];
        var event = new pb.model.ModelEvent(this,pb.model.ModelEvent.WILLCHANGE,prop,old,val);
        this.dispatchEvent(event);
        if(event.isPrevented())
        {
            return false; // to indicate that property was updated...
        }
        this.mappedEntity = val;
        this.onChanged(prop,old,val,this.updateProperty.caller);
        return true;
    },
    setMappedEntity:function(val)
    {
        var currentMappedEntity = this.mappedEntity;
        var result = this.updateProperty("label",val);
        if(result)
        {
            // then no one invoked a preventDefault on the change...
            if(currentMappedEntity) currentMappedEntity.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            if(this.mappedEntity) this.mappedEntity.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onMappedEntityChange);
            this.onMappedEntityChanged(this.mappedEntity); // callback which can be overridden..
        }
        return result;
    }

});

pb.model.Hyperlink = pb.model.MappableObject.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.type = data.type || pb.model.HyperlinkType.NONE;
        this.url = data.url || "";
    },
    toString:function()
    {
        return "[Hyperlink type:" + this.type + " url:" + this.url+ "]";
    },
    getType:function()
    {
        return this.type;
    },
    setType:function(val)
    {
        this.updateProperty("type",val);
    },
    getURL:function()
    {
        return this.url;
    },
    setURL:function(val)
    {
        this.updateProperty("url",val);
    },
    getData:function()
    {
        var data = this.__super();
        data.type = this.type;
        data.url = this.url;
        return data;
    }
});
pb.model.HyperlinkType =
{
    NONE: "0",
    URL : "1",
    OBJECT:"2"
}

pb.model.CollectionEditMethods =
{
    INLINE:"inline",
    DIALOG:"dialog"
};

/*-----------------------------------------------------------------------------------------------
 BINDING
 ------------------------------------------------------------------------------------------------*/
pb.model.FieldBinding = sp.core.events.EventDispatcher.extend
({
    __constructor:function(field,model,getter)
    {
        this.__super();
        this.field = $(field);
        this.model = model;
        this.getter = getter;
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.onChangeModel();
    },
    unbind:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
    },
    onChangeModel:function(event)
    {
        $(this.field).text(this.getter.call(this.model));
    }
})
pb.model.InputBinding = sp.core.events.EventDispatcher.extend
({
    __constructor:function(input,model,getter,setter,options)
    {
        this.__super();
        this.input = $(input);
        this.model = model;
        this.getter = getter;
        this.setter = setter;
        this.options = options || {};
        this.guid = sp.guid();
        if(this.options.placeholder) this.input.attr("placeholder",this.options.placeholder);
        this.updateValue();
        this.validateInput();
        this.listenToModel();
        this.listenToInput();

    },
    getType:function()
    {
        return this.input.prop("type");
    },
    validateInput:function()
    {
        if(this.getType()=="number")
        {
            var val = this.input.val();
            if(!this.options.allowNull || val!="")
            {
               val = (isNaN(Number(val)) && val!="")? 0 : Number(val);
               if(this.options.min) val = Math.min(val,this.options.min);
               if(this.options.max) val = Math.min(val,this.options.max);
            }
            this.input.val(val);
        }
    },
    getInputValue:function()
    {
        if(this.getType()=="checkbox" ||  this.getType()=="radio")
        {
            return this.input.is(":checked");
        }
        else
        {
            return this.input.val();
        }
    },
    setInputValue:function(val)
    {
        if(this.getType()=="checkbox" ||  this.getType()=="radio")
        {
            this.input.prop("checked",val);
        }
        else
        {
            if(this.options.prompt && (val==undefined || (val=="" && this.options.promptOnEmptyValue)))
            {
                this.input.val(this.options.prompt)
            }
            else
            {
                this.input.val(val);
            }
        }
    },
    listenToModel:function()
    {
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        //if(this.isTextInput()) this.model.addEventListener(this, pb.model.ModelEvent.INPUT,this.onChangeModel);
    },
    stopListeningToModel:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        //if(this.isTextInput()) this.model.removeEventListener(this, pb.model.ModelEvent.INPUT,this.onChangeModel);
    },
    listenToInput:function()
    {
        var __this = this;
        if(this.shouldUpdateContinuously() && !this.options.onlyBindChangeEvent)
        {
            this.input.on("input."+this.guid,function(){__this.onInputInput()});
        }
        this.input.on("change."+this.guid,function(){__this.onChangeInput()});
    },
    stopListeningToInput:function()
    {
        var __this = this;
        if(this.shouldUpdateContinuously() && !this.options.updateOnChange)
        {
            this.input.off("input."+this.guid);
        }
        else
        {
            this.input.off("change."+this.guid);
        }
    },
    updateValue:function()
    {
        if(this.getter) this.setInputValue(this.getter.call(this.model));
    },
    shouldUpdateContinuously:function()
    {
        var type = this.getType();
        return type=="text" || type=="number";
    },
    unbind:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.input.off("change."+this.guid);
    },
    onChangeInput:function()
    {
        this.stopListeningToModel();
        this.validateInput();
        if(this.setter) this.setter.call(this.model,this.getInputValue());
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
        this.listenToModel();
    },
    onInputInput:function()
    {
        this.stopListeningToModel();
        this.validateInput();
        if(this.setter) this.setter.call(this.model,this.getInputValue());
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.INPUT));
        this.listenToModel();
    },
    onChangeModel:function()
    {
        this.stopListeningToInput();
        this.updateValue();
        var __this = this;
        this.listenToInput();
    }
});
pb.model.RadioButtonBinding = sp.core.events.EventDispatcher.extend
({
    __constructor:function(radioElements,model,getter,setter)
    {
        this.__super();
        this.radioElements = radioElements;
        this.originalName = (this.radioElements.length)? $(this.radioElements[0]).attr("name") || "" : "";
        this.radioElements.attr("name",this.originalName+sp.guid());
        this.model = model;
        this.getter = getter;
        this.setter = setter;
        var __this = this;
        this.setValue(this.getter.call(this.model));
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.guid = sp.guid();
        this.radioElements.on("change."+this.guid,function(){__this.onChangeInput()});
    },
    unbind:function()
    {
        if(this.originalName)
        {
            this.radioElements.attr("name",this.originalName);
        }
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.radioElements.off("change."+this.guid);
    },
    getValue:function()
    {
        return this.radioElements.filter(":checked").val();
    },
    setValue:function(val)
    {
        this.radioElements.filter("[value="+val+"]").prop("checked",true);
    },
    onChangeInput:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.setter.call(this.model,this.getValue());
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
    },
    onChangeModel:function()
    {
        this.radioElements.off("change."+this.guid);
        this.setValue(this.getter.call(this.model));
        var __this = this;
        this.radioElements.on("change."+this.guid,function(){__this.onChangeInput()});
    }
});
pb.model.SelectBinding = sp.core.events.EventDispatcher.extend
({
    __constructor:function(select,model,getter,setter)
    {
        this.__super();
        this.select = select;
        this.model = model;
        this.getter = getter;
        this.setter = setter;
        var __this = this;
        this.guid = sp.guid();
        this.setValue(this.getter.call(this.model));
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.select.on("change."+this.guid,function(){__this.onChangeInput()});
    },
    toString:function()
    {
        return "[SelectBinding id:" + this.guid + " select:" + this.select[0].outerHTML +" model:" + this.model + "]";
    },
    unbind:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.select.off("change."+this.guid);
    },
    getValue:function()
    {
        return this.select.val();
    },
    setValue:function(val)
    {
        this.select.val(val);
    },
    onChangeInput:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.setter.call(this.model,this.getValue());
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
    },
    onChangeModel:function(event)
    {
        if(event.caller!=this.setter) return; // prevents the binding from being triggered if the property being changed is not the one being watched
        this.select.off("change."+this.guid);
        this.setValue(this.getter.call(this.model));
        var __this = this;
        this.select.on("change."+this.guid,function(){__this.onChangeInput()});
    }
})
pb.model.CheckListBinding = sp.core.events.EventDispatcher.extend
({
    // binds to an array of checkbox inputs, expects an array of items from getter
    __constructor:function(container,model,getter,setter)
    {
        this.__super();
        this.container = container;
        this.model = model;
        this.getter = getter;
        this.setter = setter;
        this.guid = sp.guid();
        this.elements = [];
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.setValues();
    },
    toString:function()
    {
        return "[CheckListBinding id:" + this.guid + " model:" + this.model + "]";
    },
    empty:function()
    {
        $(this.container).empty();
        this.unsetListeners();
        this.elements = [];
    },
    addItem:function(value,label)
    {
        var input = $("<input type='checkbox' value='" + value + "'/>");
        var div = $("<div/>");
        var element = $("<label/>");
        element.append(input);
        element.append(" "+label);
        div.append(element);
        this.listenToInput(input);
        this.elements.push(
                            {
                                element:element,
                                value:value,
                                input:input
                            }
                           );
        $(this.container).append(div);
        this.setValues();
    },
    listenToInput:function(input)
    {
        var __this = this;
        input.on("change."+this.guid, function(){ __this.onChangeInput(input)} );
    },
    unlistenToInput:function(input)
    {
        input.off("change."+this.guid);
    },
    getItemByValue:function(val)
    {
        for(var i=0; i<this.elements.length; i++)
        {
            if(this.elements[i].value == val) return this.elements[i];
        }
        return null;
    },
    removeItem:function(val)
    {
        var item = this.getItemByValue(val);
        if(item)
        {
            this.unlistenToInput(item.input);
            $(this.container).remove(item.element);
            var index = this.elements.indexOf(item);
            this.elements.splice(index,0);
        }
    },
    setItems:function(values)
    {

    },
    unsetListeners:function()
    {
        for(var i=0; i<this.elements.length; i++)
        {
            this.unlistenToInput(this.elements[i].input);
        }
    },
    setListeners:function()
    {
        for(var i=0; i<this.elements.length; i++)
        {
            this.listenToInput(this.elements[i].input);
        }
    },
    unbind:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.unsetListeners();
    },
    getValues:function()
    {
        var vals = [];
        for(var i=0; i<this.elements.length; i++)
        {
            var input = this.elements[i].input;
            if($(input).prop("checked")) vals.push(this.elements[i].value);
        }
        return vals;
    },
    setValues:function(val)
    {
        var vals = this.getter.call(this.model);
        for(var i=0; i<vals.length; i++)
        {
            var item = this.getItemByValue(vals[i]);
            if(item)
            {
                $(item.input).prop("checked","checked");
            }
        }
    },
    onChangeInput:function()
    {
        this.model.removeEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
        this.setter.call(this.model,this.getValues());
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE,this.onChangeModel);
    },
    onChangeModel:function(event)
    {
        if(event.caller!=this.setter) return; // prevents the binding from being triggered if the property being changed is not the one being watched
        this.unsetListeners();
        this.setValues(this.getter.call(this.model));
        this.setListeners()
    }
})

pb.model.Dialog = pb.model.Container.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data ||  {};
        this.title = data.title || "";
    },
    getType:function()
    {
        return pb.model.Element.DIALOG;
    },
    setTitle:function(val)
    {
        this.updateProperty("title",val);
    },
    getTitle:function()
    {
        return this.title || "";
    },
    getData:function()
    {
        var data = this.__super();
        data.title = this.getTitle();
        return data;
    },
    setMappedEntity:function(entity)
    {
        this.__super(entity);
        //this.autoPopulate();
    },
    getLabelContent:function(str)
    {
        // Given a string (str) find a value field with that content, or create a new one
        // this is used by the auto populate feature and allows us to avoid creating duplicate values
        // every time the mapping changes
        var fields = di.resolve("Fields");
        var value = fields.findFirstValueFieldWithValue(str);
        if(!value)
        {
            value = fields.addValue();
            value.valueType(pb.model.fields.ValueType.SMALLTEXT);
            value.value(str);
        }
        return value;
    },
    createLabelElement:function(str)
    {
        var label = new  pb.model.TextLabel();
        label.getDisplayValue().setMappedEntity(this.getLabelContent(str));
        label.getWidth().setWidth(pb.model.Width.MEDIUM); // seems strange its just because getWidth() returns a Width object
        return label;
    },
    createInputElementForType:function(type)
    {
        var element = pb.model.CreateElementForFieldType(type);
        if(element)
        {
            element.setMappingContext(this.getMappedEntity() || this.getMappingContext());
            element.setParent(this);
            if(element.getWidth && element.getWidth()) element.getWidth().setWidth(pb.model.Width.MEDIUM); // not every ui element allows width to be altered so we need to check;
        }
        return element;
    },
    autoPopulate:function()
    {
        this.elements = [];
        var entity = this.getMappedEntity();
        if(entity)
        {
            var fields = entity.fields();
            var label,element;
            for(var i=0; i<fields.length; i++)
            {
                if(this.canBeMappedToEntity(fields[i]))
                {
                    label = null;
                    element  = null;
                    element = this.createInputElementForType(fields[i].objectType().getType());
                    if(element.getType()==pb.model.Element.CHECKBOX)
                    {
                        // checkboxes have 'built-in' labels at the moment, so we don't need to create a separate one..
                        element.getLabelValue().setMappedEntity(this.getLabelContent(fields[i].name()))
                    }
                    else
                    {
                        label = this.createLabelElement(fields[i].name());
                    }
                    if(label) this.elements.push(label);
                    if(element) this.elements.push(element);
                }
            }
        }
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"elements"));
    },
    canBeMappedToEntity:function(entity)
    {
        if(entity.objectType())
        {
            return (entity.isRequired() && !entity.objectType().isCompound() && !entity.isKey() && !entity.isForeignKey());
        }
    }
});

pb.model.CreateElementForFieldType = function(type)
{
    // factory method to create the most appropriate ui input for a given field type
    // used by the dialog to populate mandatory fields
    switch(type)
    {
        case pb.model.fields.ObjectType.UNDEFINED:
        default:
            return null;
        case pb.model.fields.ObjectType.STRING:
            return new pb.model.TextInput();
        case pb.model.fields.ObjectType.BOOLEAN:
            return new pb.model.Checkbox();
        case pb.model.fields.ObjectType.NUMBER:
            return new pb.model.NumericInput();
        case pb.model.fields.ObjectType.DATE:
            return new pb.model.DatePicker();
        case pb.model.fields.ObjectType.COLLECTION:
        case pb.model.fields.ObjectType.LINKLIST:
            return new pb.model.Grid();
        case pb.model.fields.ObjectType.ENUM:
            return new pb.model.PickList();
        case pb.model.fields.ObjectType.CRMOBJECT:
        case pb.model.fields.ObjectType.OBJECT:
        case pb.model.fields.ObjectType.LINK:
            return new pb.model.LookUp();
    }
}

pb.model.Element.ELEMENT = 0;
pb.model.Element.PAGE = 18;
pb.model.Element.SECTION = 1;
pb.model.Element.TEXTLABEL = 2;
pb.model.Element.TEXTINPUT = 3;
pb.model.Element.NUMERIC = 4;
pb.model.Element.PICKLIST = 5;
pb.model.Element.CHECKBOX = 6;
pb.model.Element.DATEPICKER = 7;
pb.model.Element.IMAGE = 8;
pb.model.Element.RADIOBUTTONS = 9;
pb.model.Element.SLIDER = 10;
pb.model.Element.TEXTAREA = 11;
pb.model.Element.LIST = 12;
pb.model.Element.GRID = 13;
pb.model.Element.CHART = 14;
pb.model.Element.BUTTON = 15;
pb.model.Element.TAGGEDTEXT = 16;
pb.model.Element.COLORPICKER = 17;
pb.model.Element.CONTAINER = 20;
pb.model.Element.OPTIONLIST = 21;
pb.model.Element.MAP = 22;
pb.model.Element.LOOKUP = 23;
pb.model.Element.MAPCARD = 24;
pb.model.Element.MAPDIALOG = 25;
pb.model.Element.GRIDCOLUMN = 26;
pb.model.Element.COLLECTIONLOOKUP = 27;
pb.model.Element.HYPERLINK = 28;
pb.model.Element.GRIDCOLUMN = 29;
pb.model.Element.DIALOG = 30;
pb.model.Element.HYPERLINK = 31;
pb.model.Element.GRIDDIALOG = 32;
