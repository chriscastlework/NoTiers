pb.details.ChartController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function()
    {
        this.__super();
        this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.HeightController(this.model.getHeight()));
        this.addChild(new pb.details.ChartDetailsController(this.model));
        this.addChild(new pb.details.ChartAxisController(this.model.getPrimaryAxisOptions()));
        //this.secondaryAxisController = this.addChild(new pb.details.ChartAxisController(this.model.getSecondaryAxisOptions()));
        //this.addChild(new pb.details.ChartRangeItemsController(this.model.getChartRangeList()));
        this.setViewState();
    },
    setViewState:function()
    {
         //this.secondaryAxisController.setVisible(this.model.getChartType()!=pb.model.ChartType.PIE);
    },
    onModelChanged:function(event)
    {
        if(event.property=="chartType")
        {
            this.setViewState();
        }
    }
})

pb.details.ChartDetailsController = pb.details.ElementController.extend
({
    getTemplateUrl:function()
    {
        return "templates/details/elements/chart/chart-details.html";
    },
    onTemplateLoaded:function()
    {
        this.binding = new pb.model.RadioButtonBinding(this.getRadioElementByName("chartType",true),this.model,this.model.getChartType,this.model.setChartType);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
})

pb.details.ChartAxisController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.scaleController;
    },
    toString:function()
    {
       return "[ChartAxisController axis:" + this.model.getAxis() +"]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/chart/chart-axis.html";
    },
    onTemplateLoaded:function()
    {
        // lines below commented out because secondary axis removed in version 1.0 but might be added back in
        // in later version...
        //var str = (this.model.getAxisType()==pb.model.ChartAxisType.PRIMARY)? "primary" : "secondary";
        //this.getElement("#title",true).text("Set up the " + str + " axis");
        this.fieldSelect = this.getElement("#field",true);
        this.setMappingOptions();
        this.fieldBinding = new pb.model.SelectBinding(this.fieldSelect,this.model,this.model.getFieldId,this.model.setFieldId);
        if(this.model.getAxisType()===pb.model.ChartAxisType.PRIMARY)
        {
            this.addChild(new pb.details.ChartPrimaryGroupingOptionsController(this.model));
        }
        this.setViewState();
    },
    setMappingOptions:function()
    {
        this.fieldSelect.empty();
        var fields = this.model.getFieldOptions();
        for(var i=0; i<fields.length; i++)
        {
            var option = $("<option value='"+fields[i].id()+"'>"+fields[i].name()+"</option>");
            this.fieldSelect.append(option);
        }
    },
    getOptionsController:function(fieldType)
    {
        if(fieldType==pb.model.fields.ObjectType.DATE)
        {
            return new pb.details.ChartAxisDateOptionsController(this.model.getDateOptions());
        }
        else if(fieldType==pb.model.fields.ObjectType.NUMBER)
        {
            return new pb.details.ChartAxisNumberOptionsController(this.model.getNumberOptions());
        }
    },
    setViewState:function()
    {
        if(this.scaleController) this.removeChild(this.scaleController);
        if(!this.model.getField() || !this.model.getField().objectType()) return;
        this.scaleController = this.getOptionsController(this.model.getField().objectType().getType());
        if(this.scaleController) this.addChild(this.scaleController);
    },
    onModelChanged:function(event)
    {
        if(event.property=="mappingContext")
        {
            this.setMappingOptions();
        }
        else if(event.property=="field")
        {
            this.setViewState();
        }
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.fieldBinding.unbind();
    }
});

pb.details.ChartPrimaryGroupingOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model,axisOptions)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/chart/chart-grouping.html";
    },
    onTemplateLoaded:function()
    {
        this.fieldSelect = this.getElement("#field1",true);
        this.fieldBinding = new pb.model.SelectBinding(this.fieldSelect,this.model,this.model.getGroupingFieldId,this.model.setGroupingFieldId);
        this.setMappingOptions();
        this.setState();
    },
    setMappingOptions:function()
    {
        this.fieldSelect.empty();
        var fields = this.model.getGroupingOptions();
        for(var i=0; i<fields.length; i++)
        {
            var option = $("<option value='"+fields[i].id()+"'>"+fields[i].name()+"</option>");
            this.fieldSelect.append(option);
        }
    },
    setState:function()
    {
    },
    onModelChanged:function(event)
    {
        if(event.property=="mappingContext")
        {
            this.setMappingOptions();
        }
    },
    onRemoveFromView:function()
    {
        this.fieldBinding.unbind();
    }
});

pb.details.ChartAxisNumberOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model,axisOptions)
    {
        this.__super(model);
        this.axisOptions  = axisOptions;
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/chart/chart-axis-options-number.html";
    },
    onTemplateLoaded:function()
    {
        this.startingScaleValueBinding = new pb.model.InputBinding(this.getElement("#startingScaleValue",true),this.model,this.model.getStartingScaleValue,this.model.setStartingScaleValue);
        this.incrementTypeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("incrementType",true),this.model,this.model.getIncrementType,this.model.setIncrementType);
        this.incrementBinding = new pb.model.InputBinding(this.getElement("#incrementValue",true),this.model,this.model.getIncrement,this.model.setIncrement);
        this.symbolBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("numberSymbol",true),this.model,this.model.getSymbol,this.model.setSymbol);
        this.setViewState();
    },
    setViewState:function()
    {
        this.getElement("#incrementValue",true).toggle(this.model.getIncrementType()==pb.model.ChartIncrementType.SPECIFY);
    },
    onModelChanged:function(event)
    {
        if(event.property=="incrementType")
        {
            this.setViewState();
        }
    },
    onRemoveFromView:function()
    {
        this.startingScaleValueBinding.unbind();
        this.incrementTypeBinding.unbind();
        this.incrementBinding.unbind();
        this.symbolBinding.unbind();
    }
});

pb.details.ChartAxisDateOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model,axisOptions)
    {
        this.__super(model);
        this.axisOptions  = axisOptions;
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/chart/chart-axis-options-date.html";
    },
    onTemplateLoaded:function()
    {
        this.scaleTypeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("scaleType",true),this.model,this.model.getScaleType,this.model.setScaleType);
        this.filterTypeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("filterType",true),this.model,this.model.getFilterType,this.model.setFilterType);
        this.currentUnitsTypeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("currentUnitsType",true),this.model,this.model.getCurrentUnitsType,this.model.setCurrentUnitsType);
        this.rollingUnitsTypeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("rollingUnitsType",true),this.model,this.model.getRollingUnitsType,this.model.setRollingUnitsType);
        this.rollingUnitsBinding = new pb.model.InputBinding(this.getElement("#rollingUnits",true),this.model,this.model.getRollingUnits,this.model.setRollingUnits);
        this.setViewState();
    },
    setViewState:function()
    {
        this.getElement("#filterOptions",true).toggle(this.model.getScaleType()=="filter");
    },
    onModelChanged:function(event)
    {
        if(event.property=="scaleType")
        {
            this.setViewState();
        }
    },
    onRemoveFromView:function()
    {
        this.scaleTypeBinding.unbind();
        this.filterTypeBinding.unbind();
        this.currentUnitsTypeBinding.unbind();
        this.rollingUnitsTypeBinding.unbind();
        this.rollingUnitsBinding.unbind();
    }

});

