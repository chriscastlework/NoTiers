sp.namespace("pb.details.MapController");

pb.details.MapController = pb.details.ElementController.extend
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
        this.addChild(new pb.details.MapConnectionsController(this.model.getConnections()));
        this.mappingController.addChild(new pb.details.MapDataMappingController(this.model.getMapDataMappingOptions()))
    },
    setState:function()
    {

    },
    onModelChanged:function(event)
    {
        if(event.property=="")
        {

        }
    }
})

pb.details.MapLookUpController = pb.details.LookUpController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        var str = "Select the options to apply to the lookup which will be used to add items to this map."; //TODO  replace with ref data
        this.view.addElement($("<div class='pb-help pb-inline'>"+str+"</div>"))
        this.addChild(new pb.details.LookUpOptionsController(this.model));
        this.addChild(new pb.details.LookUpSearchDialogOptionsController(this.model));
    }
});

pb.details.MapConnectionsController = pb.details.OptionListController.extend
({
    __constructor:function(model,axisOptions)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/map/map-options.html";
    },
    renderOption:function(item,data)
    {
        return new pb.details.MapConnection(data).getView().getGraphic();
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
    },
    onModelChanged:function(event)
    {
        if(event.property=="")
        {

        }
    },
    onRemoveFromView:function()
    {

    }
});

pb.details.MapConnection = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    toString:function()
    {
        return "[MapConnection id:" + this.id + "]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/map/map-connection-item.html"
    },
    onTemplateLoaded:function()
    {
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.fromSelect = this.getElement("#fromField",true);
        this.toSelect = this.getElement("#toField",true);
        this.buildFieldOptions();

        var __this = this;
        this.getElement("#remove", true).on("click", function () { __this.onClickRemove() });



        this.descriptionBinding = new pb.model.InputBinding($(this.getElement("#description"),true),this.model,this.model.getDescription,this.model.setDescription);
        this.fromBinding = new pb.model.SelectBinding(this.fromSelect,this.model,this.model.getFrom,this.model.setFrom);
        this.fromBinding = new pb.model.SelectBinding(this.toSelect,this.model,this.model.getTo,this.model.setTo);
        this.thicknessBinding = new pb.model.InputBinding($(this.getElement("#thickness"),true),this.model,this.model.getThickness,this.model.setThickness);
        this.colorBinding = new pb.model.InputBinding($(this.getElement("#color"),true),this.model,this.model.getColor,this.model.setColor);

        if(!this.model.getDescription())
        {
            $(this.getElement("#description"),true).html("Enter a description for this connection..");
        }

    },
    buildFieldOptions:function()
    {
        var options = this.model.getOptionList();
        this.fromSelect.empty();
        this.toSelect.empty();
        this.fromSelect.append($("<option value='all'>Whole Card</option>"));
        this.toSelect.append($("<option value='all'>Whole Card</option>"));
        // Removed for version 1.0 because field level connections will not be available in the viewer.
        // Will need to add this back in for version 1.1 or later..
        /*for(var i=0; i<options.length; i++)
        {
            this.fromSelect.append($("<option value='"+options[i].id+"'>"+options[i].name+"</option>"));
            this.toSelect.append($("<option value='"+options[i].id+"'>"+options[i].name+"</option>"));
        }*/
    },
    onClickRemove:function()
    {
        this.model.remove();
    },
    onModelChanged:function(event)
    {
        //this.buildFieldOptions();
        if(event.property)
        {

        }
    }
})

pb.details.MapCardController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    toString:function()
    {
        return "[MapCard id:" + this.id + "]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/map/map-card.html"
    },
    onTemplateLoaded:function()
    {
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.addChild(new pb.details.ColorController(this.model.getBackgroundColor(),"Background Color"));
        this.addChild(new pb.details.ColorController(this.model.getBorderColor(),"Border Color"));
    },
    onModelChanged:function(event)
    {
        //if(event.property=="")
        //{

        //}
    }
});

pb.details.MapDialogController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    toString:function()
    {
        return "[MapCard id:" + this.id + "]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/map/map-dialog.html"
    },
    onTemplateLoaded:function()
    {
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.getElement("#copy",true).on("click", $.proxy(this.onCopyPressed,this));
        this.showBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("show",true),this.model,this.model.getShowMethod,this.model.setShowMethod);
    },
    onCopyPressed:function()
    {
        this.model.copyFromCard();
    },
    onModelChanged:function(event)
    {
        //if(event.property=="")
        //{

        //}
    }
});

pb.details.MapDataMappingController = pb.details.MappingController.extend
({
    toString:function()
    {
        return "[MapDataMappingController:" + this.guid +"]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/mapdatamapping.html";
    },
    getWarning:function(isMappable)
    {
        return (isMappable)?
            "There are no suitable values which can be set as the default for this element":
            "This element cannot have  a default associated with it";
    }
});

pb.details.MapDialogEvent = sp.core.events.Event.extend
({

});
pb.details.MapDialogEvent.COPY = "map_dialog_copy";

