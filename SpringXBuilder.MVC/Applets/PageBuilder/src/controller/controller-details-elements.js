/* ------------------------------------------------------------------------------------------------------
    This namespace handles the showing and hiding of a details view for the selected page element.
   ------------------------------------------------------------------------------------------------------*/
sp.namespace("pb.details.DetailsViewController");
sp.namespace("pb.details.DetailsView");

pb.details.ElementFactory = Class.extend
({
      __constructor:function()
      {

      },
      createController:function(model)
      {
          var Element = pb.model.Element; // define namespace in local variable to save some typing...
          switch (model.type)
          {
              case Element.PAGE:
                  return new pb.details.PageController(model);
              case Element.SECTION:
                  return new pb.details.SectionController(model);
              case Element.TEXTLABEL:
                  return new pb.details.TextLabelController(model);
              case Element.TEXTINPUT:
                return new pb.details.TextInputController(model);
              case Element.NUMERIC:
                return new pb.details.NumericInputController(model);
              case Element.CHECKBOX:
                  return new pb.details.CheckboxController(model);
              case Element.PICKLIST:
                  return new pb.details.PickListController(model);
              case Element.DATEPICKER:
                return new pb.details.DatePickerController(model);
              case Element.IMAGE:
                  return new pb.details.ImageController(model);
              case Element.RADIOBUTTONS:
                  return new pb.details.RadioButtonsController(model);
              case Element.SLIDER:
                  return new pb.details.SliderController(model);
              case Element.TEXTAREA:
                  return new pb.details.TextAreaController(model);
              case Element.LOOKUP:
                  return new pb.details.LookUpController(model);
              case Element.GRID:
                  return new pb.details.GridController(model);
              case Element.CHART:
                  return new pb.details.ChartController(model);
              case Element.MAP:
                  return new pb.details.MapController(model);
              case Element.MAPCARD:
                  return new pb.details.MapCardController(model);
              case Element.MAPDIALOG:
                  return new pb.details.MapDialogController(model);
              case Element.COLLECTIONLOOKUP:
                  return new pb.details.CollectionLookUpController(model);
              case Element.HYPERLINK:
                  return new pb.details.HyperlinkController(model);
              case Element.GRIDCOLUMN:
                  return new pb.details.GridColumn(model);
              case Element.DIALOG:
                  return new pb.details.GridColumn(model);
              case Element.GRIDDIALOG:
                  return new pb.details.GridDialog(model);
              default:
                  return new pb.details.ElementController(model);
          }
      }
});
di.register("DetailsControllerFactory")         // register with DI framework
    .as(pb.details.ElementFactory)
    .asSingleton();

pb.details.DetailsViewController = sp.core.events.EventDispatcher.extend
({

        __constructor:function()
        {
            this.__super();
            this.view = di.resolve("DetailsView");
            this.currentController;
        },
        presentDetails:function(element)
        {
            if(this.currentController)
            {
                this.currentController.removeFromView();
            }
            var factory = di.resolve("DetailsControllerFactory");
            this.currentController = factory.createController(element);
            this.view.present(this.currentController.getView());
        },
        removeCurrentDetails:function()
        {
            if(this.currentController)
            {
                this.currentController.removeFromView();
            }
            this.currentController = null;
        }
});
di.register("DetailsViewController")         // register with DI framework
  .as(pb.details.DetailsViewController)
  .asSingleton();

pb.details.DetailsView = sp.core.graphics.Graphic.extend
({
    __constructor:function()
    {
        this.__super();
    },
    present:function(view)
    {
        this.clear();
        this.addElement(view.getGraphic());
    }
});
di.register("DetailsView")                      // register with DI framework
    .as(pb.details.DetailsView)
    .asSingleton();

pb.details.ElementController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(model,view)
    {
        this.__super();
        this.model = model;
        this.childControllers = [];
        this.guid = sp.guid();
        this.itemsToAdd = []; // if we receive a request to append an element before the view is loadded, they are stored here for apending after load
        this.view =  new pb.graphics.TemplateLoader(this.getTemplateUrl());
        if(this.view) this.view.addEventListener(this,pb.graphics.TemplateLoaderEvent.LOAD,this.onTemplateLoaded);
        if(this.view) this.view.addEventListener(this,pb.graphics.TemplateLoaderEvent.LOAD,this.addItems);
        if(this.model) this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        if(this.model) this.model.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onModelRemoved);
        this.enabled = true;
    },
    toString:function()
    {
        return "[Element " + this.guid + "]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/element.html";
    },
    getView:function()
    {
        return this.view;
    },
    addItems:function(event)
    {
        for(var i=0; i<this.itemsToAdd.length; i++)
        {
            var container = this.itemsToAdd[i].container;
            var controller = this.itemsToAdd[i].controller;
            if(container)
            {
                $(container).append(controller.getView().getGraphic());
            }
            else
            {
                this.view.addElement(controller.getView().getGraphic());
            }
        }
    },
    addChildAtIndex:function(controller,container,index)
    {
        if(this.view.isLoaded())
        {
            container = container || this.view;
            var target = $(container).children().eq(index);
            if (target!=undefined)
            {
                target.before(controller.getView().getGraphic());
            }
            else
            {
                container.append(controller.getView().getGraphic());
            }
        }
        else
        {
            this.itemsToAdd.splice({controller:controller,container:container},index);
        }
        this.childControllers.push(controller);
        return controller;
    },
    addChild:function(controller,container,index)
    {
        if(this.view.isLoaded())
        {
            if(container)
            {
                $(container).append(controller.getView().getGraphic());
            }
            else
            {
                this.view.addElement(controller.getView().getGraphic());
            }
        }
        else
        {
            this.itemsToAdd.push({controller:controller,container:container});
        }
        this.childControllers.push(controller);
        return controller;
    },
    removeChild:function(controller)
    {
        $(controller.getView().getGraphic()).detach();
        _.remove(this.childControllers,controller);
        controller.onRemoveFromView();
    },
    getElement:function(selector,asJQObject)
    {
        var graphic = this.view.getGraphic();
        var result = $(graphic).find(selector);
        return (asJQObject)? result : result[0];
    },
    getRadioElementByName:function(name,asJQObject)
    {
       return this.getElement("input[name="+name+"]",asJQObject);
    },
    onTemplateLoaded:function(event)
    {
        // debugging option... displays mapping context in details panel
        /*var label = $("<div></div>");
        var binding = new pb.model.FieldBinding(label,this.model,this.model.getMappingContext);
        this.view.addElement(label);
        var debug = $("<div>Parent:</div>");
        var label = $("<span></span>");
        debug.append(label);
        var binding = new pb.model.FieldBinding(label,this.model,this.model.getParent);
        this.view.addElement(debug);*/
        this.detailsController = new pb.details.DetailsController(this.model);
        this.mappingController = new pb.details.MappingController(this.model);
        this.visibilityController =  new pb.details.VisibilityController(this.model.getVisibility());
        this.removeController = new pb.details.RemoveItemController(this.model);
        this.addChild(this.removeController);
        this.addChild(this.detailsController);
        this.addChild(this.mappingController);
        this.addChild(this.visibilityController);
    },
    removeFromView:function()
    {
        //Do not override..
        for(var i=0; i<this.childControllers.length; i++)
        {
            this.childControllers[i].removeFromView();
        };
        this.onRemoveFromView();
    },
    onRemoveFromView:function()
    {
        // overwrite with any clean up for when details  view is dismissed, such as unbinding bindings, or removing event listeners..
        if(this.model) this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    },
    onModelChanged:function(event)
    {

    },
    setVisible:function(val)
    {
        if(val)
        {
            this.view.show();
        }
        else
        {
            this.view.hide();
        }
    },
    remove:function()
    {
        this.view.remove();
    },
    isInGridColumn:function()
    {
        return this.model.getParentType()==pb.model.Element.GRIDCOLUMN;
    },
    onModelRemoved:function()
    {
        // triggered when the model is removed...
        di.resolve("DetailsViewController").removeCurrentDetails(); // hides the details from the right hand bar..
        this.view.remove();
    }
});

pb.details.PageController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        // this.__super(event); // prevents the creation of standard fields
        // because for a page we don't want Name or Visibility  fields (see PB-213 and PB-279
        this.mappingController = new pb.details.MappingController(this.model); // add back in mapping field
        this.addChild(this.mappingController);
        // not now needed - see comment on MapController...might be needed later so leaving this in...
        //this.mappingController.addChild(new pb.details.DataMappingOptionController(this.model.getDataMappingOption()))

        this.content = new pb.graphics.TemplateLoader("templates/details/page.html");
        this.content.addEventListener(this,pb.graphics.TemplateLoaderEvent.LOAD,this.onContentLoaded);
        this.view.addElement(this.content.getGraphic());
    },
    onContentLoaded:function()
    {
        var __this= this;
        this.getElement("#saveButton",true).on("mousedown",function(){__this.onSavePressed();});
    },
    onSavePressed:function()
    {
        this.getElement("#saveButton",true).prop("disabled",true);
        di.resolve("Model").save();
        di.resolve("Model").addEventListener(this,pb.model.SaveEvent.COMPLETE,this.onSaveComplete);
    },
    onSaveComplete:function(event)
    {
        this.getElement("#saveButton",true).prop("disabled",false);
        if(event.success)
        {
            this.showMessage("Page saved successfully.");
        }
        else
        {
            this.showMessage("Could not save page.","pb-warning");
            alert("There was a problem saving your page. Please try again.\nError:"+event.error);
        }


    },
    showMessage:function(str,cls)
    {
        clearTimeout(this.msgTimeout);
        this.getElement("#message",true).removeClass();
        this.getElement("#message",true).show();
        this.getElement("#message",true).html(str);
        this.getElement("#message",true).addClass(cls);
        var __this = this;
        this.msgTimeout = setTimeout(function(){__this.onClearMessage();},2000);
    },
    onClearMessage:function()
    {
        this.getElement("#message",true).removeClass();
        this.getElement("#message",true).toggle(1000);
    },
    onModelChanged:function(event)
    {
        if(event.prop=="mappedEntity")
        {

        }
    }
});

pb.details.SectionController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        //var label1 = $("<div></div>");
        //var binding1 = new pb.model.FieldBinding(label1,this.model,this.model.getElements);
        //this.view.addElement(label1);
        this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.LayoutController(this.model.getLayoutDirection()));
        this.addChild(new pb.details.ColorController(this.model.getBackgroundColor(),"Background Color"));
        this.addChild(new pb.details.ColorController(this.model.getBorderColor(),"Border Color"));
    },
    onRemoveFromView:function()
    {
        this.__super();

    }
});

pb.details.TextLabelController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        this.addChild(new pb.details.HyperlinkController(this.model.getHyperlink()));
        if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.numberFormatController = this.addChild(new pb.details.NumberFormatController(this.model.getNumberFormat()));
        this.addChild(new pb.details.AlignController(this.model.getAlign()));
        this.addChild(new pb.details.TextSizeController(this.model.getTextSize()));
        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
        this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()))
        this.numberFormatController.setVisible(false);
        this.setState();
    },
    setState:function()
    {
        var currentMappingType = this.getCurrentMappingType();
        if(currentMappingType)
        {
            this.numberFormatController.setVisible(currentMappingType.isNumber())
        }
    },
    getCurrentMappingType:function()
    {
        var mappedEntity = this.model.getMappedEntity();
        if(mappedEntity) return mappedEntity.objectType();
    },
    onModelChanged:function(event)
    {
        if(event.property=="mappedEntity")
        {
            this.setState();
        }
    }

});

pb.details.TextInputController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.AlignController(this.model.getAlign()));
        this.addChild(new pb.details.TextSizeController(this.model.getTextSize()));
        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
        this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()))
    }
});

pb.details.NumericInputController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.NumberFormatController(this.model.getFormat()));
        this.addChild(new pb.details.AlignController(this.model.getAlign()));
        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
        this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()))
    }
});

pb.details.CheckboxController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        //if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        //this.addChild(new pb.details.TextController(this.model));
        //this.addChild(new pb.details.LabelPositionController(this.model));
        //this.addChild(new pb.details.LeftRightController(this.model.getAlign()));
        //if(!this.isInGridColumn())
        //{
        //    this.addChild(new pb.details.TextFieldColorController(this.model));
        //}
        //else
        //{
        //    this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        //}
        this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()));
     //   this.mappingController.addChild(new pb.details.LabelMappingController(this.model.getLabelValue()))
    }
});

pb.details.PickListController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        if (!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));

        this.addChild(new pb.details.AlignController(this.model.getAlign()));

        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
    }
});

pb.details.RadioButtonsController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.LayoutController(this.model.getLayoutDirection()));
        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
    }
})

pb.details.DatePickerController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        //not sure it makes  any sense to allow user to specify date selector size?
        // var widthController = new pb.details.WidthController(this.model.getWidth());
        //this.view.addElement(widthController.getView().getGraphic());
        this.addChild(new pb.details.DateSelectionController(this.model.getDate()));
        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
        this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()));
    }
})

pb.details.ImageController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        this.mappingController.getView().addEventListener(this,pb.graphics.TemplateLoaderEvent.LOAD,this.onMappingControllerLoaded);
        this.addChild(new pb.details.HyperlinkController(this.model.getHyperlink()));
        //this.addChild(new pb.details.ImageSelectorController(this.model));
        this.addChild(new pb.details.ImageSizeController(this.model));
    },
    onMappingControllerLoaded:function()
    {
        this.mappingController.getElement(".pb-title",true).text("Select where to find the url for this image..")
    }
});

pb.details.SliderController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        var template = new pb.graphics.TemplateLoader("templates/details/elements/slider-settings.html");
        template.addEventListener(this,pb.graphics.TemplateLoaderEvent.LOAD,this.onSettingsLoaded);
        this.view.addElement(template.getGraphic());
        this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()))
    },
    onSettingsLoaded:function()
    {
        this.snapBinding = new pb.model.InputBinding(this.getElement("#snap",true),this.model,this.model.getSnap,this.model.setSnap);
        this.minBinding = new pb.model.InputBinding(this.getElement("#min",true),this.model,this.model.getMinimum,this.model.setMinimum);
        this.maxBinding = new pb.model.InputBinding(this.getElement("#max",true),this.model,this.model.getMaximum,this.model.setMaximum);
    },
    onModelChanged:function(event)
    {

    },
    onRemoveFromView:function()
    {
        this.__super();
        this.snapBinding.unbind();
        this.minBinding.unbind();
        this.maxBinding.unbind();
    }
});

pb.details.TextAreaController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.TextController(this.model));
        this.addChild(new pb.details.TextFieldColorController(this.model));
    },
    onModelChanged:function(event)
    {

    }
});

pb.details.GridController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/grid.html";
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        this.addChild(new pb.details.WidthController(this.model.getWidth()));
        this.addChild(new pb.details.HeightController(this.model.getHeight()));
        this.addChild(new pb.details.GridOptionsController(this.model.getOptions()));
        //this.addChild(new pb.details.GridColumnOptionsController(this.model.getGridColumnOptions(),pb.details.GridColumnOption));
        var __this = this;
        this.getElement("#addColumn",true).on("click",function(){__this.addColumn()});
    },
    addColumn:function()
    {
        this.model.getGridColumnOptions().addItem();
    }
})

pb.details.LookUpController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    onTemplateLoaded:function(event)
    {
        this.__super(event);
        if(!this.isInGridColumn()) this.addChild(new pb.details.WidthController(this.model.getWidth()));
        if(!this.isInGridColumn())
        {
            this.addChild(new pb.details.TextFieldColorController(this.model));
        }
        else
        {
            this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text Color"));
        }
        this.mappingController.addChild(new pb.details.LookUpOptionsController(this.model));
        this.mappingController.addChild(new pb.details.GenericTrueFalseController(this.model,this.model.getIsHyperlink,this.model.setIsHyperlink,"Lookup should open selected item when clicked"));
        this.mappingController.addChild(new pb.details.LookUpSearchDialogOptionsController(this.model));
    }
});

pb.details.LookUpOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    toString:function()
    {
        return "[LookUpOptionsController]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/lookup_options.html";
    },
    onTemplateLoaded:function(event)
    {
        this.setFieldOptions();
        this.displayFieldBinding = new pb.model.SelectBinding(this.getElement("#displayField",true),this.model,this.model.getDisplayFieldId,this.model.setDisplayFieldId);
        //this.mappingController.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()));
    },
    setFieldOptions:function()
    {
        var select = this.getElement("#displayField",true);
        select.empty();
        var fields = this.model.getDisplayFieldOptions();
        for(var i=0; i<fields.length; i++)
        {
            if(fields[i].objectType().getType()==pb.model.fields.ObjectType.STRING) select.append($('<option>', { value : fields[i].id() }).text(fields[i].name()));
        }
    },
    onModelChanged:function(event)
    {
        if (event.property == "mappedEntity" || event.property == "mappingContext")
        {
            this.setFieldOptions();
        }
       
    }
})

pb.details.LookUpSearchDialogOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    toString:function()
    {
        return "[LookUpSearchDialogOptionsController]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/lookup_searchoptions.html";
    },
    onTemplateLoaded:function(event)
    {
        var options = this.getElement("#options",true);
        this.checkListBinding = new pb.model.CheckListBinding(options,this.model,this.model.getDialogFieldIds,this.model.setDialogFieldIds);
        this.setFieldOptions();
    },
    setFieldOptions:function()
    {
        this.checkListBinding.empty();
        var fields = this.model.getDialogFieldOptions();
        for(var i=0; i<fields.length; i++)
        {
            this.checkListBinding.addItem(fields[i].id(),fields[i].name());
        }
    },
    onModelChanged:function(event)
    {
        if(event.property=="mappedEntity")
        {
            this.setFieldOptions();
        }
    },
    onRemoveFromView:function()
    {
        this.checkListBinding.unbind();
    }
})

pb.details.CollectionLookUpController = pb.details.LookUpController.extend
({
    // For use by map and grid elements. Shows only the display field and search options.
    __constructor:function(model)
    {
        this.__super(model);
    },
    toString:function()
    {
        return "[CollectionLookUpController]";
    },
    onTemplateLoaded:function(event)
    {
        var str = "Select the options to apply to the lookup which will be used to add items to this element."; //TODO  replace with ref data
        this.view.addElement($("<div class='pb-help pb-inline'>"+str+"</div>"))
        //this.view.addElement($("<div>Mapped Entity:"+this.model.getMappedEntity()+"</div>"))
        this.addChild(new pb.details.LookUpOptionsController(this.model));
        this.addChild(new pb.details.LookUpSearchDialogOptionsController(this.model));
    }
});









// COMPOSABLE ELEMENTS...
pb.details.DetailsController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.id = sp.guid();
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/details-view.html";
    },
    onTemplateLoaded:function(event)
    {
       // this.view.addElement($("<DIV>"+this.model.getMappingContext()+"</DIV>"));
        this.binding = new pb.model.InputBinding(this.getElement("#name"),this.model,this.model.getName,this.model.setName);

    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
});

pb.details.DeleteController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.id = sp.guid();
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/delete.html";
    },
    onRemove:function()
    {
        this.model.delete();
    },
    onTemplateLoaded:function(event)
    {
        var __this = this;
        this.getElementByName("#remove",true).on("click"+this.id,function(){__this.onRemove()});
    },
    onRemoveFromView:function()
    {
        this.getElementByName("#remove",true).off("click"+this.id);
        this.__super();
    }
});

pb.details.LayoutController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/layout-direction.html";
    },
    onTemplateLoaded:function(event)
    {
        this.layoutBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("layoutDirection",true),this.model,this.model.getDirection,this.model.setDirection);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.layoutBinding.unbind();
    }
});

pb.details.WidthController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/size-width.html";
    },
    onTemplateLoaded:function(event)
    {
        this.setViewState();
        this.sizeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("size",true),this.model,this.model.getSize,this.model.setSize);
        this.widthBinding = new pb.model.InputBinding(this.getElement("#width",true),this.model,this.model.getWidth,this.model.setWidth,{min:0,max:100});
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    },
    setViewState:function()
    {
        this.getElement("#width",true).toggleClass("pb-hidden",this.model.getSize()!="specify");
    },
    onModelChanged:function(event)
    {
        if(event.property=="size") this.setViewState();
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.sizeBinding.unbind();
        this.widthBinding.unbind();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    }
});

pb.details.HeightController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/size-height.html";
    },
    onTemplateLoaded:function(event)
    {
        this.setViewState();
        this.sizeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("size",true),this.model,this.model.getSize,this.model.setSize);
        this.heightBinding = new pb.model.InputBinding(this.getElement("#height",true),this.model,this.model.getHeight,this.model.setHeight,{min:0});
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    },
    setViewState:function()
    {
        this.getElement("#height",true).toggleClass("pb-hidden",this.model.getSize()!="specify");
    },
    onModelChanged:function(event)
    {
        if(event.property=="size") this.setViewState();
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.sizeBinding.unbind();
        this.heightBinding.unbind();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    }
});

pb.details.TextController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/text-input.html";
    },
    onTemplateLoaded:function(event)
    {
        this.textBinding = new pb.model.InputBinding(this.getElement("#default",true),this.model,this.model.getText,this.model.setText);
        this.setState();
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.textBinding.unbind();
    },
    setState:function()
    {
        this.getElement("#default",true).prop("disabled",this.model.isMapped());
    },
    onModelChanged:function(event)
    {
        if(event.property=="mappedEntity") this.setState();
    }
});

pb.details.AlignController = pb.details.ElementController.extend
({
    __constructor:function(model,options)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/align.html";
    },
    onTemplateLoaded:function(event)
    {
       this.binding = new pb.model.RadioButtonBinding(this.getRadioElementByName("align",true),this.model,this.model.getValue,this.model.setValue);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
});

pb.details.LeftRightController = pb.details.ElementController.extend
({
    __constructor:function(model,options)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/leftright.html";
    },
    onTemplateLoaded:function(event)
    {
        this.binding = new pb.model.RadioButtonBinding(this.getRadioElementByName("align",true),this.model,this.model.getValue,this.model.setValue);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
});

pb.details.NumberFormatController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/number-format.html";
    },
    onTemplateLoaded:function(event)
    {
       this.formatBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("format",true),this.model,this.model.getType,this.model.setType);
       this.placesBinding = new pb.model.InputBinding(this.getElement("#places",true),this.model,this.model.getPlaces,this.model.setPlaces);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.formatBinding.unbind();
        this.placesBinding.unbind();
    }
});

pb.details.LabelPositionController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/label-position.html";
    },
    onTemplateLoaded:function(event)
    {
        this.binding = new pb.model.RadioButtonBinding(this.getRadioElementByName("position",true),this.model,this.model.getLabelPosition,this.model.setLabelPosition);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
});

pb.details.DateSelectionController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/date-selector.html"
    },
    onTemplateLoaded:function(event)
    {
        // set state..
        this.getElement("#specified_date",true).datepicker();
        this.checkFieldVisibility();
        // set bindings
        this.defaultBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("default",true),this.model,this.model.getDefault,this.model.setDefault);
        this.operatorBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("operator",true),this.model,this.model.getOperator,this.model.setOperator);
        this.unitBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("unit",true),this.model,this.model.getAdjustmentUnit,this.model.setAdjustmentUnit);
        this.factorBinding = new pb.model.InputBinding(this.getElement("#factor",true),this.model,this.model.getAdjustmentFactor,this.model.setAdjustmentFactor);
        this.dateBinding = new pb.model.InputBinding(this.getElement("#specified_date",true),this.model,this.model.getSpecifiedDate,this.model.setSpecifiedDate);
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    },
    onModelChanged:function(event)
    {
        this.checkFieldVisibility();
    },
    checkFieldVisibility:function()
    {
        this.getElement("#specified_date",true).toggleClass("pb-hidden",this.model.getDefault()!="specified");
        this.getElement("#source_field",true).toggleClass("pb-hidden",this.model.getDefault()!="from");
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.defaultBinding.unbind();
        this.operatorBinding.unbind();
        this.unitBinding.unbind();
        this.factorBinding.unbind();
        this.dateBinding.unbind();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    }
})

pb.details.CheckboxDefaultController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/checkbox-default.html";
    },
    onTemplateLoaded:function(event)
    {
        this.binding = new pb.model.InputBinding(this.getElement("#default",true),this.model,this.model.getDefault,this.model.setDefault);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
});

pb.details.ImageSelectorController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/image-selector.html";
    },
    onTemplateLoaded:function(event)
    {
        var __this = this;
        this.getElement("#file-input",true).css("visibility","hidden");
        this.getElement("#file-button",true).click(function(){__this.onClickFileButton();});
        this.fileBinding = new pb.model.InputBinding(this.getElement("#file-input",true),this.model,null,this.model.setSource);// we can't set the value of a file input, so we need to ensure the getter is null, or the binding will try to set the value when the model changes...
        this.srcBinding = new pb.model.InputBinding(this.getElement("#source",true),this.model,this.model.getSource,this.model.setSource);
    },
    onClickFileButton:function()
    {
        this.getElement("#file-input",true).click();
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.fileBinding.unbind();
        this.srcBinding.unbind();
    }
});

pb.details.ImageSizeController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/image-size.html";
    },
    onTemplateLoaded:function(event)
    {
        this.widthBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("width",true),this.model,this.model.getWidth,this.model.setWidth);
        this.heightBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("height",true),this.model,this.model.getHeight,this.model.setHeight);
        this.specifiedWidthBinding = new pb.model.InputBinding(this.getElement("#specified-width"),this.model,this.model.getSpecifiedWidth,this.model.setSpecifiedWidth);
        this.specifiedHeightBinding = new pb.model.InputBinding(this.getElement("#specified-height"),this.model,this.model.getSpecifiedHeight,this.model.setSpecifiedHeight);
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.showHideSizeFields();
    },
    showHideSizeFields:function()
    {
        this.getElement("#specified-width",true).toggle(this.model.getWidth()=="specify");
        this.getElement("#specified-height",true).toggle(this.model.getHeight()=="specify");
    },
    onClickFileButton:function()
    {
        this.getElement("#file-input",true).click();
    },
    onModelChanged:function(event)
    {
        this.showHideSizeFields();
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.widthBinding.unbind();
        this.heightBinding.unbind();
        this.specifiedWidthBinding.unbind();
        this.specifiedHeightBinding.unbind();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    }
});

pb.details.TextSizeController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/multiline.html";
    },
    onTemplateLoaded:function(event)
    {
        this.multilineBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("multiline",true),this.model,this.model.getMultiline,this.model.setMultiline);
        this.rowsBinding = new pb.model.InputBinding(this.getElement("#rows",true),this.model,this.model.getRows,this.model.setRows);
        this.checkFieldVisibility();
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    },
    checkFieldVisibility:function()
    {
        this.getElement("#rows",true).toggleClass("pb-hidden",!this.model.getMultiline());
    },
    onModelChanged:function(event)
    {
        if(event.property=="multiline")
        {
            this.checkFieldVisibility();
        }
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.multilineBinding.unbind();
        this.rowsBinding.unbind();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    }
});

pb.details.OptionListController = pb.details.ElementController.extend
({
    __constructor:function(model,itemClass)
    {
        this.__super(model);
        this.itemClass = itemClass || pb.details.OptionItem;
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/option-list.html";
    },
    onTemplateLoaded:function(event)
    {
        var __this = this;
        this.getElement("#button-add",true).click(function(){__this.onAdd()});
        this.getElement("#button-remove",true).click(function(){__this.onRemove()});
        this.repeater = new sp.core.graphics.Repeater(this.getElement("#options",true),this.renderOption,this);
        this.repeater.setDataProvider(this.model.getItems());
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.model.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onOptionRemoved);
    },
    renderOption:function(item,data)
    {
        return new this.itemClass(data).getGraphic();
    },
    onAdd:function(event)
    {
        this.model.addItem();
        this.repeater.setDataProvider(this.model.getItems());
        this.setState();
    },
    onOptionRemoved:function(event)
    {
        this.repeater.setDataProvider(this.model.getItems());
        this.setState();
    },
    setState:function()
    {
        this.getElement("#button-add",true).prop("disabled",!this.model.canAddItems());
    },
    onModelChanged:function(event)
    {

    },
    onRemoveFromView:function()
    {
        this.__super();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.model.removeEventListener(this,pb.model.ModelEvent.REMOVE,this.onOptionRemoved);
    }
});

pb.details.OptionItem = pb.graphics.TemplateLoader.extend
({
    __constructor:function(model)
    {
        this.__super(this.getTemplateUrl());
        this.model = model;
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/option-list-item.html"
    },
    onLoad:function()
    {
        this.__super();
        this.nameInput = $(this.getElement("input-name"));
        this.valueInput = $(this.getElement("input-value"));
        this.nameInput.val(this.model.getName());
        this.valueInput.val(this.model.getValue());
        var __this = this;
        $(this.getElement("trash")).click(function(){__this.onClickRemove()});
        this.nameInput.change(function(){__this.onChangeName()});
        this.valueInput.change(function(){__this.onChangeValue()});
    },
    onClickRemove:function()
    {
        this.model.remove();
    },
    onChangeName:function()
    {
        this.model.setName(this.nameInput.val());
    },
    onChangeValue:function()
    {
        this.model.setValue(this.valueInput.val());
    }
});

pb.details.GridColumnOptionsController = pb.details.OptionListController.extend
({
    __constructor:function(model,itemclass)
    {
        this.__super(model,itemclass);
    },
    renderOption:function(item,data)
    {
        return new pb.details.GridColumn(data).getView().getGraphic();
    }
})

pb.details.GridColumn = pb.details.ElementController.extend
({
    __constructor: function(model)
    {
        this.__super(model);
    },
    getTemplateUrl: function()
    {
        return "templates/details/elements/grid-column-item.html"
    },
    onTemplateLoaded: function(event)
    {
        var __this = this;
        this.addChildAtIndex(new pb.details.RemoveItemController(this.model),this.view.getGraphic(),0);
        this.nameBinding = new pb.model.InputBinding($(this.getElement("#name")), this.model, this.model.getName, this.model.setName,{placeholder:"Enter a name"});
        this.widthBinding = new pb.model.InputBinding($(this.getElement("#width")), this.model, this.model.getWidth, this.model.setWidth,{min:0,max:100,allowNull:true});
        //this.widthUnitBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("widthUnit",true), this.model, this.model.getWidthUnit, this.model.setWidthUnit);
        //this.getElement("#remove", true).on("click", function() { __this.onClickRemove() });
        var content = this.getElement("#content", true);
        this.addChild(new pb.details.ColorController(this.model.getBackgroundColor(), "Cell Color"), content);
        this.addChild(new pb.details.VisibilityController(this.model.getVisibility()), content);
        this.summaryOptionsController = this.addChild(new pb.details.GridColumnSummaryOptions(this.model.getSummaryOptions()), content);
        this.setSummaryState();
    },
    setMappingOptions:function()
    {
        var fields = this.model.getMappableFields();
        this.mappingSelect.empty();
        for(var i=0; i<fields.length; i++)
        {
            this.mappingSelect.append($('<option>', { value : fields[i].id() }).text(fields[i].name()));
        }
    },
    onClickRemove: function ()
    {
        this.model.remove();
    },
    setSummaryState:function()
    {
        this.summaryOptionsController.setVisible(this.model.getShowSummary());
    },
    onModelChanged:function(event)
    {
        if(event.property=="showSummary")
        {
            this.setSummaryState();
        }
    }
})


pb.details.GridDialog = pb.details.ElementController.extend
({
    __constructor: function (model) {
        this.__super(model);
    },
    getTemplateUrl: function () {
        return "templates/details/elements/grid/grid-dialog.html";
    },
    onTemplateLoaded: function (event) {
        this.model.addEventListener(this, pb.model.ModelEvent.CHANGE, this.onModelChanged);
        this.getElement("#populate", true).on("click", $.proxy(this.onPopulatePressed, this));
    },
    onPopulatePressed: function () {
        this.model.autoPopulate();
    }
})


/*
pb.details.GridColumnOption = pb.details.ElementController.extend
({
    __constructor: function(model)
    {
        this.__super(model);
    },
    getTemplateUrl: function()
    {
        return "templates/details/elements/grid-column-item.html"
    },
    onTemplateLoaded: function(event)
    {
        var __this = this;
        this.fieldSelect = $(this.getElement("#fieldType"));
        this.setTypeOptions();
        this.nameBinding = new pb.model.InputBinding($(this.getElement("#name")), this.model, this.model.getName, this.model.setName);
        this.typeBinding = new pb.model.SelectBinding($(this.getElement("#fieldType")), this.model, this.model.getFieldType, this.model.setFieldType);
        this.widthBinding = new pb.model.InputBinding($(this.getElement("#width")), this.model, this.model.getWidth, this.model.setWidth);
        this.getElement("#remove", true).on("click", function() { __this.onClickRemove() });
        this.getElement("#open", true).on("click", function() { __this.toggleOpen() });
        var content = this.getElement("#content", true);
        this.mappingController = this.addChild(new pb.details.MappingController(this.model.getField()), content);
        this.defaultMappingController = this.addChild(new pb.details.DefaultMappingController(this.model.getDisplayValue()), content);
        this.addChild(new pb.details.HyperlinkController(this.model.getHyperlink()),content);
        this.addChild(new pb.details.ColorController(this.model.getTextColor(), "Text Color"), content);
        this.addChild(new pb.details.ColorController(this.model.getBackgroundColor(), "Cell Color"), content);
        this.addChild(new pb.details.VisibilityController(this.model.getVisibility()), content);
        this.summaryOptionsController = this.addChild(new pb.details.GridColumnSummaryOptions(this.model.getSummaryOptions()), content);
        this.setSummaryState();
        this.setOpen();
    },
    setOpen:function()
    {
        var str = (this.model.getIsOpen()) ? "Show less.." : "Show more..";
        this.getElement("#open", true).text(str);
        if (this.model.getIsOpen()) {
            this.getElement("#content", true).show();
        }
        else {
            this.getElement("#content", true).hide();
        }
    },
    toggleOpen: function ()
    {
        this.model.setIsOpen(!this.model.getIsOpen()); // toggle
        this.setOpen();
    },
    setTypeOptions:function()
    {
        var options = [
                            {
                                key:pb.model.Element.TEXTLABEL,
                                label:"Label"
                            },
                            {
                                key:pb.model.Element.TEXTINPUT,
                                label:"Text Input"
                            },
                            {
                                key:pb.model.Element.NUMERIC,
                                label:"Numeric Input"
                            },
                            {
                                key:pb.model.Element.CHECKBOX,
                                label:"Checkbox"
                            },
                            {
                                key:pb.model.Element.PICKLIST,
                                label:"Picklist"
                            },
                            {
                                key:pb.model.Element.DATEPICKER,
                                label:"Date Picker"
                            },
                            {
                                key:pb.model.Element.LOOKUP,
                                label:"Lookup"
                            }
                        ];
        this.fieldSelect.empty();
        for(var i=0; i<options.length; i++)
        {
            this.fieldSelect.append($('<option>', { value : options[i].key }).text(options[i].label));
        }
    },
    setMappingOptions:function()
    {
        var fields = this.model.getMappableFields();
        this.mappingSelect.empty();
        for(var i=0; i<fields.length; i++)
        {
            this.mappingSelect.append($('<option>', { value : fields[i].id() }).text(fields[i].name()));
        }
    },
    onClickRemove: function ()
    {
        this.model.remove();
    },
    setSummaryState:function()
    {
        this.summaryOptionsController.setVisible(this.model.getShowSummary());
    },
    onModelChanged:function(event)
    {

        if(event.property=="field" || event.property=="mappingContext")
        {
           // this.removeChild(this.mappingController);
            //this.removeChild(this.defaultMappingController);
            //var content = this.getElement("#content",true);
            //this.mappingController = this.addChildAtIndex(new pb.details.MappingController(this.model.getField()),content,3);
            //this.defaultMappingController = this.addChildAtIndex(new pb.details.DefaultMappingController(this.model.getDisplayValue()), content, 3);
            this.mappingController.setModel(this.model.getField());
            this.mappingController.setModel(this.model.getDisplayValue());
        }
        else if(event.property=="showSummary")
        {
            this.setSummaryState();
        }
    }
})
*/


pb.details.GridColumnSummaryOptions = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/grid-column-sum-options.html"
    },
    onTemplateLoaded:function(event)
    {
        this.select = this.getElement("#sumType",true);
        this.setOptions();
        this.typeBinding = new pb.model.SelectBinding(this.select,this.model,this.model.getSummaryType,this.model.setSummaryType);
    },
    setOptions:function()
    {
        this.select.empty();

        var fields = [
                        {label:"SUM",value:pb.model.GridColumnSummaryOptions.SUM},
                        {label:"COUNT",value:pb.model.GridColumnSummaryOptions.COUNT},
                        {label:"MEAN",value:pb.model.GridColumnSummaryOptions.MEAN},
                        {label:"MEDIAN",value:pb.model.GridColumnSummaryOptions.MEDIAN},
                        {label:"MODE",value:pb.model.GridColumnSummaryOptions.MODE},
                        {label:"RANGE",value:pb.model.GridColumnSummaryOptions.RANGE},
                        {label:"LOWEST",value:pb.model.GridColumnSummaryOptions.LOWEST},
                        {label:"HIGHEST",value:pb.model.GridColumnSummaryOptions.HIGHEST}
        ];

        this.select.append($('<option>', { value: null }).text("HIDE"));

        for(var i=0; i<fields.length; i++)
        {
            this.select.append($('<option>', { value : fields[i].value }).text(fields[i].label));
        }
        this.select.val(null);
    },
    setState:function()
    {

    },
    onModelChanged:function(event)
    {
        if(event.property=="")
        {
            // TODO stop having empty blocks??
        }
    }
})

pb.details.CollectionOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/collection-options.html"
    },
    onTemplateLoaded:function(event)
    {
        this.allowEditBinding = new pb.model.InputBinding(this.getElement("#allowEdit",true),this.model,this.model.getAllowEdit,this.model.setAllowEdit);
        this.editMethodBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("editMethod",true),this.model,this.model.getEditMethod,this.model.setEditMethod);
        this.setState();
    },
    setState:function()
    {
        if(this.model) this.getElement("#editOptions",true).toggle(this.model.getAllowAdd());
    },
    onModelChanged:function(event)
    {
        if(event.property=="allowEdit")
        {
            this.setState();
        }
    }
});

pb.details.GridOptionsController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/grid-options.html"
    },
    onTemplateLoaded:function(event)
    {
        this.allowEditBinding = new pb.model.InputBinding(this.getElement("#allowEdit",true),this.model,this.model.getAllowEdit,this.model.setAllowEdit);
        this.editMethodBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("editMethod",true),this.model,this.model.getEditMethod,this.model.setEditMethod);
        this.showSummaryBinding = new pb.model.InputBinding(this.getElement("#showSummary",true),this.model,this.model.getShowSummary,this.model.setShowSummary);
        this.setState();
    },
    setState:function()
    {
       this.getElement("#editOptions",true).toggle(this.model.getAllowEdit());
    },
    onModelChanged:function(event)
    {
        if(event.property=="allowEdit") this.setState();
    }
})

pb.details.VisibilityController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/visibility.html"
    },
    onTemplateLoaded:function(event)
    {
        this.select = this.getElement("#visibility",true);
        this.setOptions();
        this.visibilityBinding = new pb.model.SelectBinding(this.select,this.model,this.model.getMappedEntityId,this.model.setMappedEntityId);
        di.resolve("Fields").addEventListener(this,pb.model.ModelEvent.CHANGE,this.onFieldsChanged);
    },
    onFieldsChanged:function(event)
    {
        this.setOptions();
    },
    setOptions:function()
    {
        this.select.empty();
        var fields  = di.resolve("Fields").getItemsByObjectType(pb.model.fields.ObjectType.BOOLEAN);
        this.select.append($('<option>', { value : null }).text(" "));
        if(fields.length)
        {
            for(var i=0; i<fields.length; i++)
            {
                if(!fields[i].isValid()) continue;
                var name = fields[i].name();
                var id = fields[i].id();
                this.select.append($('<option>', { value : id }).text(name));
            }
            this.getElement("#warning",true).hide();
        }
        else
        {
            var warningEl = this.getElement("#warning",true).show();
            this.select.hide();
            var str = "There are no yes/no fields to set the visibility to";
            warningEl.text(str);
        }
    },
    setState:function()
    {

    },
    onModelChanged:function(event)
    {
        if(event.property=="visibility")
        {
            this.setState();
        }
    }
});

pb.details.TextFieldColorController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/titled_controller.html";
    },
    onTemplateLoaded:function(event)
    {
        this.getElement("#title",true).text("Color Formatting");
        this.addChild(new pb.details.ColorController(this.model.getTextColor(),"Text"));
        this.addChild(new pb.details.ColorController(this.model.getBackgroundColor(),"Background"));
    },
    onModelChanged:function(event)
    {

    }
});

pb.details.ColorController = pb.details.ElementController.extend
({
    __constructor:function(model,label)
    {
        this.__super(model);
        this.label = label || "";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/color.html"
    },
    onTemplateLoaded:function(event)
    {
        this.getElement("#label",true).text(this.label)
        this.select = this.getElement("#color",true);
        this.setOptions();
        this.binding = new pb.model.SelectBinding(this.select,this.model,this.model.getMappedEntityId,this.model.setMappedEntityId);
        var fields = di.resolve("Fields");
        fields.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onFieldsChanged);
    },
    onFieldsChanged:function(event)
    {
        this.setOptions();
    },
    setOptions:function()
    {
        this.select.empty();
        var fields  = di.resolve("Fields").getItemsByValueType(pb.model.fields.ValueType.COLOR);
        this.select.append($('<option>', { value : null }).text(" "));
        if(fields.length)
        {
            for(var i=0; i<fields.length; i++)
            {
                if(!fields[i].isValid()) continue;
                var name = fields[i].name();
                var id = fields[i].id();
                this.select.append($('<option>', { value : id }).text(name));
            }
        }
    },
    setState:function()
    {

    },
    onModelChanged:function(event)
    {

    }
})

pb.details.MappingController = pb.details.ElementController.extend
({
    __constructor:function(model,options)
    {
        this.__super(model);
        var fields = di.resolve("Fields");
        fields.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onFieldsChanged);
    },
    toString:function()
    {
        return "[Binding Controller:" + this.guid +"]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/mapping.html";
    },
    onTemplateLoaded:function(event)
    {
        this.select = this.getElement("#mappedEntitySelect",true);
        this.setOptions();
        this.mapBinding = new pb.model.SelectBinding(this.select,this.model,this.model.getMappedEntityId,this.model.setMappedEntityId);
        di.resolve("Fields").addEventListener(pb.model.ModelEvent.CHANGE,this.onFieldsChanged);
    },
    setModel:function(model)
    {
        this.model = model;
        this.setOptions();
        this.mapBinding.unbind();
        this.mapBinding = new pb.model.SelectBinding(this.select,this.model,this.model.getMappedEntityId,this.model.setMappedEntityId);
    },
    showContent:function()
    {
        //this.crmContent.toggle(this.selected))
    },
    getWarning:function(isMappable)
    {
        return (isMappable)?
            "This page element cannot be mapped to any of the CRM fields in its current context":
            "This page element cannot be mapped to a CRM field";
    },
    onFieldsChanged:function()
    {
        // triggered when any fields have changed...so we need to rebuild options..
        this.setOptions();
    },
    setOptions:function()
    {
        //var context = this.model.getMappingContext();
        this.select.empty();
        var fields  = this.model.getMappableFields();
        if(fields.length)
        {
            this.getElement("#warning",true).hide();
            this.select.show();
            this.select.append($('<option>', { value : null }).text(" "));
            for(var i=0; i<fields.length; i++)
            {
                var name = fields[i].name();
                var id = fields[i].id();
                this.select.append($('<option>', { value : id }).text(name));
            }
            this.getElement("#warning",true).hide();
        }
        else
        {
            var warningEl = this.getElement("#warning",true).show();
            this.select.hide();
            warningEl.text(this.getWarning(this.model.isMappable()));
        }
    },
    removeFromView:function()
    {
        this.__super();
        if(this.mapBinding) this.mapBinding.unbind();
    },
    onModelChanged:function(event)
    {
        if(this.select && this.select.val()!=this.model.getMappedEntityId())
        {
            // then the mapping change was cancelled...
            // this whole logic is necessary for allowing the user to be warned
            // about  the impact of changing the mapping on the page, and cancelling it
            // but it is very inelegant. Hopefully can find a better way at some point...
            this.select.val(this.model.getMappedEntityId());
        }
        if(event.target==this.model && event.property=="mappingContext") // check target in case model is forwarding events...
        {
            this.setOptions();
        }
    }
});

pb.details.DefaultMappingController = pb.details.MappingController.extend
({
    toString:function()
    {
        return "[DefaultMappingController:" + this.guid +"]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/default.html";
    },
    getWarning:function(isMappable)
    {
        return (isMappable)?
            "There are no suitable values which can be set as the default for this element":
            "This element cannot have  a default associated with it";
    }
});

pb.details.LabelMappingController = pb.details.MappingController.extend
({
    toString:function()
    {
        return "[LabelMappingController:" + this.guid +"]";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/label.html";
    },
    getWarning:function(isMappable)
    {
        return (isMappable)?
            "There are no suitable values which can be set as the default for this element":
            "This element cannot have  a default associated with it";
    }
});

pb.details.GenericTrueFalseController = pb.details.ElementController.extend
({
    __constructor:function(model,getter,setter,label)
    {
        this.__super(model);
        this.getter = getter;
        this.setter = setter;
        this.label = label || "";
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/truefalse.html";
    },
    onTemplateLoaded:function(event)
    {
        this.getElement("#label",true).html(" " + this.label);
        this.binding = new pb.model.InputBinding(this.getElement("#checkbox",true),this.model,this.getter,this.setter);
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.binding.unbind();
    }
});

pb.details.DataMappingOptionController = pb.details.MappingController.extend
({
    toString:function()
    {
        return "[DataMappingOptionController:" + this.guid +"]";
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

pb.details.HyperlinkController = pb.details.ElementController.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    getTemplateUrl:function()
    {
        return "templates/details/elements/hyperlink.html";
    },
    onTemplateLoaded:function(event)
    {
        this.typeBinding = new pb.model.RadioButtonBinding(this.getRadioElementByName("option",true),this.model,this.model.getType,this.model.setType);
        this.urlBinding = new pb.model.InputBinding(this.getElement("#url",true),this.model,this.model.getURL,this.model.setURL);
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.setObjectName();
        this.setState();
    },
    setObjectName:function()
    {
       if(this.model.getMappingContext()) this.getElement("#objName",true).text("'" + this.model.getMappingContext().name()  + "'");
    },
    setState:function()
    {
        this.getElement("#urlSection",true).toggle(this.model.getType()!=pb.model.HyperlinkType.URL);
    },
    onModelChanged:function(event)
    {
        if(event.property=="mappingContext")
        {
            this.setObjectName();
        }
        else if(event.property=="type")
        {
            this.setState();
        }
    },
    onRemoveFromView:function()
    {
        this.__super();
        this.typeBinding.unbind();
        this.model.removeEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    }
});

pb.details.RemoveItemController = pb.details.ElementController.extend
({
    __constructor: function(model)
    {
        this.__super(model);
    },
    getTemplateUrl: function()
    {
        return "templates/details/elements/remove.html"
    },
    onTemplateLoaded: function(event)
    {
        var __this = this;
        this.getElement("#remove", true).on("click", function() { __this.onClickRemove() });
    },
    onClickRemove: function ()
    {
        var result = confirm("Are you sure you want to remove this element?");
        if(result)
        {
            this.model.remove();
        }
    }
})


