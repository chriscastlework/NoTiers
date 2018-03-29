sp.namespace(   "pb.model.Grid",
                "pb.model.GridOptions",
                "pb.model.GridColumnOptions",
                "pb.model.GridColumn",
                "pb.model.GridColumnUnit",
                "pb.model.GridColumnSummaryOptions");

pb.model.Grid = pb.model.Element.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this.options = new pb.model.GridOptions(data.options); // TODO order is important here, we need to ensure the grid options are created first, so that the options exist when the grid columns are created...this is not robust and needs improving..
        this.options.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.gridColumnOptions = new pb.model.GridColumnOptions(data.gridColumnOptions,this);
        this.gridColumnOptions.setMappingContext(this.getMappedEntity());
        this.gridColumnOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.width = new pb.model.Width(data.width || {size:"full"});
        this.width.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.height = new pb.model.Height(data.height || {size:"small"});
        this.height.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent)
        this.lookup = new pb.model.CollectionLookUp(data.lookupData);
        this.dialog = new pb.model.GridDialog(data.dialogData);
        this.updateChildMapping();
    },
    getLookUp:function()
    {
        return this.lookup;
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
        //return entity.objectType().isCollection() && entity.lookUpPath();
        return (entity.objectType().getType() & (pb.model.fields.ObjectType.COLLECTION | pb.model.fields.ObjectType.LINKLIST)) && entity.lookUpPath();
    },
    getGridColumnOptions:function()
    {
        return this.gridColumnOptions;
    },
    getOptions:function()
    {
        return this.options;
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
        this.dialog.setMappingContext(entity);
        this.dialog.setMappedEntity(entity);
        this.gridColumnOptions.setMappingContext(entity);
        //var entity = this.getLookUpMappingForEntity(entity);
        this.lookup.setMappedEntity(entity);
        this.lookup.setMappingContext(context);
    },
    setMappedEntity:function(entity)
    {
        this.__super(entity);
        this.updateChildMapping();
    },
    setMappingContext:function(entity)
    {
        this.__super(entity);
        this.updateChildMapping();
    },
    getData:function()
    {
        var data = this.__super();
        data.gridColumnOptions = this.gridColumnOptions.getData();
        data.width = this.width.getData();
        data.height = this.height.getData();
        data.options = this.options.getData();
        data.lookupData = this.lookup.getData();
        data.dialogData = this.dialog.getData();
        return data;
    },
    getMappedEntityContentType:function()
    {
        if( this.getMappedEntity()
            && this.getMappedEntity().objectType()
            && this.getMappedEntity().contentType()) return this.getMappedEntity().contentType();
    },
    requireLookUp:function()
    {
        // now obsolete..but keeping code in case spec changes again 30/9/2016
        // tells the view whether or not it should show a look up
        // this will be based on whether the user has selected to be able to add items
        // whether items CAN be added, and what the relationship of item is - eg. an Association or a straight Child relationship
        var mappedEntity = this.getMappedEntity();
        return (mappedEntity)? mappedEntity.objectType().isLinkList() : false;
    },
    requireDialog:function()
    {
        // now obsolete..but keeping code in case spec changes again 30/9/2016
        var mappedEntity = this.getMappedEntity();
        return (mappedEntity)? mappedEntity.objectType().isCollection() : false;
    }
});

pb.model.GridDialog = pb.model.Container.extend
({
    __constructor: function (data) {
        this.__super(data);
        data = data || {};
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this, pb.model.ModelEvent.CHANGE, this.forwardChildEvent);
        this.borderColor = new pb.model.Color(data.borderColor);
        this.borderColor.addEventListener(this, pb.model.ModelEvent.CHANGE, this.forwardChildEvent);
        this.showMethod = data.showMethod || pb.model.MapDialog.ShowMethod.DOUBLECLICK;
    },
    toString: function () {
        return "[GridDialog, mappedEntity:" + this.getMappedEntity() + " context:" + this.getMappingContext() + "]";
    },

    getBackgroundColor: function () {
        return this.backgroundColor;
    },
    getBorderColor: function () {
        return this.borderColor;
    },
    getType: function () {
        return pb.model.Element.GRIDDIALOG;
    },
    copyFromCard: function () {
        this.dispatchEvent(new pb.model.MapDialogEvent(this, pb.model.MapDialogEvent.COPY));
    },
    copyElements: function (els) {
        this.removeAllElements();
        this.createElements(els);
        this.dispatchEvent(new pb.model.ModelEvent(this, pb.model.ModelEvent.REBUILD));
    },
    getShowMethod: function () {
        return this.showMethod;
    },
    setShowMethod: function (val) {
        this.showMethod = val;
    },
    getData: function () {
        var data = this.__super();
        data.backgroundColor = this.backgroundColor.getData();
        data.borderColor = this.borderColor.getData();
        data.showMethod = this.showMethod;
        return data;
    },
    createLabelElement: function (str) {
        var label = new pb.model.TextLabel();
        label.getDisplayValue().setMappedEntity(this.getLabelContent(str));
        label.getWidth().setWidth(pb.model.Width.MEDIUM); // seems strange its just because getWidth() returns a Width object
        return label;
    },
    getLabelContent: function (str) {
        // Given a string (str) find a value field with that content, or create a new one
        // this is used by the auto populate feature and allows us to avoid creating duplicate values
        // every time the mapping changes
        var fields = di.resolve("Fields");
        var value = fields.findFirstValueFieldWithValue(str);
        if (!value) {
            value = fields.addValue();
            value.valueType(pb.model.fields.ValueType.SMALLTEXT);
            value.value(str);
        }
        return value;
    },
    autoPopulate: function () {
        this.elements = [];
        var entity = this.getMappedEntity();
        if (entity) {
            var fields = entity.fields();
            var label, element;
            for (var i = 0; i < fields.length; i++) {
                if (this.canBeMappedToEntity(fields[i])) {
                    label = null;
                    element = null;
                    element = this.createInputElementForType(fields[i].objectType().getType());
                    if (element != null) {
                        if (element.getType() == pb.model.Element.CHECKBOX) {
                            element.getLabelValue().setMappedEntity(this.getLabelContent(fields[i].name()));
                        }
                        else {
                            label = this.createLabelElement(fields[i].name());
                        }
                        if (label) this.elements.push(label);
                        if (element) this.elements.push(element);
                    }
                }
            }
        }
        this.dispatchEvent(new pb.model.ModelEvent(this, pb.model.ModelEvent.CHANGE, "elements"));
    },
    createInputElementForType: function (type) {
        var element = pb.model.CreateElementForFieldType(type);
        if (element) {
            element.setMappingContext(this.getMappedEntity() || this.getMappingContext());
            element.setParent(this);
            if (element.getWidth && element.getWidth()) element.getWidth().setWidth(pb.model.Width.MEDIUM); // not every ui element allows width to be altered so we need to check;
        }
        return element;
    },
});

pb.model.GridOptions = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super();
        data = data || {};
        this.allowEdit = (data.allowEdit!=undefined)? data.allowEdit :  true;
        this.editMethod = data.editMethod || pb.model.CollectionEditMethods.INLINE;
        this.showSummary = data.showSummary || false;
    },
    setAllowEdit:function(val)
    {
        this.updateProperty("allowEdit",val);
    },
    getAllowEdit:function()
    {
        return this.allowEdit;
    },
    setEditMethod:function(val)
    {
        this.updateProperty("editMethod",val);
    },
    getEditMethod:function()
    {
        return this.editMethod;
    },
    setShowSummary:function(val)
    {
        this.updateProperty("showSummary",val);
    },
    getShowSummary:function()
    {
        return this.showSummary;
    },
    getData:function()
    {
        return {
            allowEdit:this.allowEdit,
            editMethod:this.editMethod,
            showSummary:this.showSummary
        }
    }
})

pb.model.GridColumnOptions = pb.model.OptionList.extend
({
    __constructor:function(data,grid)
    {
        this.grid = grid; // the grid this belongs to...
        this.__super(data);

    },
    toString:function()
    {
        return "[GridColumnOptions]"
    },
    createItem:function(data)
    {
        var item = new pb.model.GridColumn(data,this.grid);
        item.addEventListener(this, pb.model.ModelEvent.REMOVE, this.onRemoveItem);
        // we only need to set the mapping context on items which don't have one. otherwise
        // for saved items. we will be triggering a context change which will wipe it's current
        // mapped entity..
        if(!item.getMappingContext()) item.setMappingContext(this.getMappingContext());
        return item;
    },
    setMappingContext:function(entity)
    {
        this.__super(entity);
        for(var i=0; i<this.items.length; i++)
        {
            this.items[i].setMappingContext(this.getMappingContext());
        }
    }
});

pb.model.GridColumn = pb.model.Container.extend
({
    __constructor:function(data,grid)
    {
        this.__super(data);
        data = data || {};
        this.grid = grid;
        this.name = data.name || "";
        var factory = di.resolve("ElementModelFactory");
        this.field = (data.field)? factory.createElementWithModel(data.field) : factory.createElementWithType(this.type);
        var __this = this;
        this.displayValue = new pb.model.DisplayValue(data.displayValue,function(entity){return __this.canBeMappedToEntity(entity)});
        this.displayValue.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.updateDisplayValueMappingContext();
        this.width = data.width;
        this.setWidthUnit(data.widthUnit);
        this.backgroundColor = new pb.model.Color(data.backgroundColor);
        this.backgroundColor.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.visibility = new pb.model.Visibility(data.visibility);
        this.summaryOptions = new pb.model.GridColumnSummaryOptions(data.summaryOptions);
        this.summaryOptions.addEventListener(this,pb.model.ModelEvent.CHANGE,this.forwardChildEvent);
        this.grid.getOptions().addEventListener(this, pb.model.ModelEvent.CHANGE, this.onGridOptionsChanged);
        this.selected = false;
    },
    toString:function()
    {
        return "[GridColumn id:" + this.id + " name:" + this.name + " type:" + this.type + " width:"  + this.width + "]";
    },
    getSelected:function()
    {
        return this.selected;
    },
    getType:function()
    {
        return pb.model.Element.GRIDCOLUMN;
    },
    getSummaryOptions:function()
    {
        return this.summaryOptions;
    },
    getShowSummary:function()
    {
        return this.grid.getOptions().getShowSummary();
    },
    getDisplayValue:function()
    {
        return this.displayValue;
    },
    onGridOptionsChanged:function(event)
    {
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    updateFieldMappingContext:function()
    {
        this.field.setMappingContext(this.getMappingContext());
    },
    updateDisplayValueMappingContext:function()
    {
        this.displayValue.setMappingContext(this.getMappingContext());
    },
    onMappingContextChanged:function(context)
    {
        this.updateFieldMappingContext();
        this.updateDisplayValueMappingContext();
    },
    getVisibility:function()
    {
        return this.visibility;
    },
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },
    setName:function(val)
    {
        this.updateProperty("name",val);
    },
    getName:function()
    {
        return this.name;
    },
    getWidth:function()
    {
        return this.width;
    },
    getWidthStr:function()
    {
        return (this.getWidth())? this.getWidth()+"%" : "";
    },
    setWidth:function(val)
    {
        val = (isNaN(val))? 0 : Math.min(100,Math.max(0,val));
        this.updateProperty("width",val);
    },
    getWidthUnit:function()
    {
        return this.widthUnit;
    },
    setWidthUnit:function(val)
    {
        this.updateProperty("widthUnit",val || pb.model.GridColumnWidthUnit.PERCENT);
    },
    getField:function()
    {
        return this.field;
    },
    getData:function()
    {
        var data = this.__super();
        data.type = this.type;
        data.name = this.name;
        data.width = this.width;
        data.widthUnit = this.unitWidth;
        data.field = this.field.getData();
        data.displayValue = this.displayValue.getData();
        data.backgroundColor = this.backgroundColor.getData();
        data.visibility = this.visibility.getData();
        data.summaryOptions = this.summaryOptions.getData();
        return data;
    },
    remove:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this, pb.model.ModelEvent.REMOVE));
    }
});

pb.model.GridColumnWidthUnit =
{
    PERCENT:"percentage",
    PIXELS:"pixels"
}

pb.model.GridColumnSummaryOptions = pb.model.Model.extend
({
    __constructor:function(data)
    {
        this.__super();
        data = data || {};
        this.summaryType = data.summaryType; 
    },
    toString:function()
    {
        return "[GridSummaryOptions]";
    },
    getSummaryType:function()
    {
        return this.summaryType;
    },
    setSummaryType:function(val)
    {
        this.updateProperty("summaryType",val);
    },
    getData:function()
    {
        return {summaryType:this.getSummaryType()};
    }
});
pb.model.GridColumnSummaryOptions.SUM = "sum";
pb.model.GridColumnSummaryOptions.COUNT = "count";
pb.model.GridColumnSummaryOptions.MEAN = "mean";
pb.model.GridColumnSummaryOptions.MEDIAN = "median";
pb.model.GridColumnSummaryOptions.MODE = "mode";
pb.model.GridColumnSummaryOptions.RANGE = "range";
pb.model.GridColumnSummaryOptions.LOWEST = "minimum";
pb.model.GridColumnSummaryOptions.HIGHEST = "highest";
