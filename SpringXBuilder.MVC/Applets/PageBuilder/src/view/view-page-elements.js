/*---------------------------------------------------------------------------
-----------------------------------------------------------------------------
NB: The addition of the inner content node to the Graphic base class has been necessary
    but really needs a major refactor of the view code to ensure everything is efficient
    and tidy. There are conflicts with earlier content variables, which have had to be
    renamed 'inner' (meaning their classes still stay 'content' which is confusing) and
    the methods addView and addElement are not really very clear. addView is used by the controller
    classes to tell the view to add and remove dropped items, and addElement should now only be
    for the class to handle its own construction - but it would be better to refactor with
    much clearer function names
-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/

sp.namespace("pb.view.ElementFactory",
             "pb.view.Element",
             "pb.view.Page",
             "pb.view.Section",
             "pb.view.TextLabel",
             "pb.view.Checkbox");

pb.view.ElementFactory = Class.extend
({
    __constructor:function()
    {

    },
    createViewForModel:function(model)
    {
        //TODO at some point this should be changed to prevent creating default elements amd throw an error..
        var type = (model)? model.getType() : 0;
        var Element = pb.model.Element;
        switch(type)
        {
            case Element.SECTION:
                return new pb.view.Section(model);
            case Element.TEXTLABEL:
                return new pb.view.TextLabel(model);
            case Element.TEXTINPUT:
                return new pb.view.TextInput(model);
            case Element.NUMERIC:
                return new pb.view.Numeric(model);
            case Element.PICKLIST:
                return new pb.view.Picklist(model);
            case Element.LOOKUP:
                return new pb.view.LookUp(model);
            case Element.CHECKBOX:
                return new pb.view.Checkbox(model);
            case Element.DATEPICKER:
                return new pb.view.DatePicker(model);
            case Element.IMAGE:
                return new pb.view.Image(model);
            case Element.RADIOBUTTONS:
                return new pb.view.RadioButtons(model);
            case Element.SLIDER:
                return new pb.view.Slider(model);
            case Element.TEXTAREA:
                return new pb.view.TextArea(model);
            case Element.LIST:
                return new pb.view.List(model);
            case Element.GRID:
                return new pb.view.Grid(model);
            case Element.CHART:
                return new pb.view.Chart(model);
            case Element.MAP:
                return new pb.view.Map(model);
            case Element.BUTTON:
                return new pb.view.Button(model);
            case Element.TAGGEDTEXT:
                return new pb.view.TaggedText(model);
            case Element.COLORPICKER:
                return new pb.view.ColorPicker(model);
            default:
                return new pb.view.Element(model);

        }
    }
});
di
    .register("ElementViewFactory")         // register with DI framework
    .as(pb.view.ElementFactory)
    .asSingleton();

pb.view.ViewFocusManager = sp.core.events.EventDispatcher.extend
({
    __constructor:function()
    {
        this.__super();
    },
    setSelectedElement:function(element)
    {
        if(this.selectedElement && this.selectedElement!=element)
        {
            this.selectedElement.onBlur();
        }
        this.selectedElement = element;
        this.selectedElement.onSelect();
    }
})
di
    .register("ViewFocusManager")           // register with DI framework
    .as(pb.view.ViewFocusManager)
    .asSingleton();


pb.view.Graphic = sp.core.graphics.Graphic.extend
(
    {
        __constructor: function(graphic)
        {
            this.__super(graphic);
            this.__content = this.createHTML();
            $(this.__graphic).append(this.__content);
        },
        getHeight:function()
        {
            return $(this.__content).height();
        },
        createHTML:function()
        {
            return $("<div class='pb-content'></div>");
        },
        content:function()
        {
            return this.__content;
        },
        addElement: function()
        {
            if(arguments.length<1) return;
            for(var i=0; i<arguments.length; i++)
            {
                this.content().append(this.isGraphic(arguments[i])? arguments[i].getGraphic() : arguments[i]);
            }
            return arguments[0];
        },
        getChildren:function()
        {
            return this.content().children();
        },
        insertElementAtIndex:function(element,index)
        {
            if(index==0)
            {
                this.content().prepend(element);
            }
            else if(index>=this.numChildren())
            {
                this.content().append(element);
            }
            else
            {
                $(element).insertAfter(this.getChildren().eq(index-1));
            }
        },
        clear:function()
        {
            this.content().empty();
            return this;
        },
        getNextHighestIndex:function(obj)
        {
            var highestIndex = 0;
            var currentIndex = 0;
            var elArray;
            elArray = (obj)? obj.getElementsByTagName('*') : this.content().getElementsByTagName('*');
            for(var i=0; i < elArray.length; i++)
            {
                if (elArray[i].style) currentIndex = parseFloat($(elArray[i]).css("z-index")) || 1;
                if(!isNaN(currentIndex) && currentIndex > highestIndex) highestIndex = currentIndex;
            }
            return(highestIndex+1);
        },
        html:function(val)
        {
            this.content().html(val);
            return this;
        },
        setVisibility:function(bool)
        {
            if(bool)
            {
                this.show();
            }
            else
            {
                this.hide();
            }
        },
        css:function(prop,val,asNumber)
        {
            if(val)return this.css(prop);
            {
                this._jqGraphic().css(prop,val);
            }
            return this._jqGraphic().css(prop);
        }
    }
);

pb.view.Element = pb.view.Graphic.extend
({
    __constructor:function(model)
    {
        this.__super(this.getInitialGraphic());
        this.model = model;
        this.addClass("pb-page-element");
        var __this = this;
        this._jqGraphic().on("click",function(event,ui){__this.onClick(event,ui)});
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.model.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onModelRemoved);
        //this.debugInfo = $("<div class='debug-info-small'>"+this.model.getID()+"("+this.model.getIndex()+")</div>");
        //this._jqGraphic().append(this.debugInfo);
    },
    getInitialGraphic:function()
    {
        return null;
    },
    setDebugInfo:function()
    {
        if(this.debugInfo) this.debugInfo.text(this.model.getID() +" (" + this.model.getIndex()+ ")");
    },
    toString:function()
    {
        return "[Element graphic:" + this.__graphic +"]";
    },
    clone:function()
    {
        return this._jqGraphic().clone();
    },
    onClick:function(event,ui)
    {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.triggerSelect();
    },
    onModelChanged:function(event)
    {
        // override to handle any changes to the model...
        if(event && event.property=="index") this.setDebugInfo();
    },
    onModelRemoved:function(event)
    {
        this.remove();
    },
    triggerSelect:function()
    {
       var viewFocusManager = di.resolve("ViewFocusManager");
       viewFocusManager.setSelectedElement(this);
    },
    onSelect:function()
    {
        this.addClass("pb-selected");
        this.dispatchEvent(new sp.core.events.SelectionEvent(this,sp.core.events.SelectionEvent.SELECT));
    },
    onBlur:function()
    {
        this.removeClass("pb-selected");
    }
});

pb.view.Container = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.addClass("pb-container");
        this.elements = [];
        //if(this.debugInfo) this.debugInfo.remove(); // if debug info is switched on remove it...
    },
    getDroppableAreaElement:function()
    {
        // return the element to use as the droppable area... for most elements this is just the graphic itself
        return this.content();
    },
    createPlaceholder:function(event,model)
    {
        var factory = di.resolve("ElementViewFactory");
        var view = factory.createViewForModel(model);
        var el = view.getGraphic();
        $(el).fadeTo(0,0.5);
        $(el).css("clear","both");
        return el;
    },
    removeAllElements:function()
    {
        $(this.getDroppableAreaElement()).empty();
        this.elements = [];
    },
    removeElement:function(el)
    {
        var els = this.getElements();
        for(var i=-0; i<els.length; i++)
        {
            if(els[i]==el)
            {
                els.splice(i,0);
                return;
            }
        }
    },
    getElements:function()
    {
        return this.elements;
    },
    addChildViewAtIndex:function(view,index)
    {
        $(this.getDroppableAreaElement()).append(view.getGraphic());
        if(index==0)
        {
            this.elements.unshift(view);
            $(this.getDroppableAreaElement()).prepend(view.getGraphic());
        }
        else if(index>=$(this.getDroppableAreaElement()).children().length)
        {
            this.elements.push(view);
            $(this.getDroppableAreaElement()).append(view.getGraphic());
        }
        else
        {
            this.elements.splice(index,view);
            $(view.getGraphic()).insertAfter($(this.getDroppableAreaElement()).children().eq(index-1));
        }
    },
    addChildView:function(view)
    {
        $(this.getDroppableAreaElement()).append(view.getGraphic());
        this.elements.push(view);
    },
    getChildren:function()
    {
        return $(this.getDroppableAreaElement()).children();
    }

});

pb.view.Page = pb.view.Container.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.addClass("pb-page");
    },
    init:function()
    {

    },
    onContentChanged:function()
    {
        // we need something in here to ensure the height of the content is always a little higher than the content, so
        // we can drag items into the bottom..
    }
});

pb.view.Section = pb.view.Container.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.addClass("pb-section");
        this.init();
    },
    init:function()
    {
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.borderColorController = new pb.view.ElementBorderColorController(this._jqGraphic(),this.model.getBorderColor());
        setTimeout($.proxy(this.setLayoutDirection,this),10);
    },
    toString:function()
    {
        return "[Section]";
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="layoutDirection")
        {
            this.setLayoutDirection();
        }
    },
    insertElementAtIndex:function(element,index)
    {
        //TODO DEPRECATE? Possibly superseded by add methods on the superclass (Container)
        //override this to force elements to inherit direction attributes..
        this.__super(element,index);
        this.setLayoutDirection();
    },
    addElement:function(element)
    {
        //TODO DEPRECATE? Possibly superseded by add methods on the superclass (Container)
        this.__super(element);
        this.setLayoutDirection();
    },
    addChildViewAtIndex:function(view,index)
    {
        this.__super(view,index);
        this.setLayoutDirection();
    },
    addChildView:function(view)
    {
        this.__super(view);
        this.setLayoutDirection();
    },
    setLayoutDirection: function ()
    {
        var direction = this.model.getLayoutDirection();
        $(this.getChildren()).removeClass("pb-horizontal pb-vertical");
        if(direction.getDirection()==pb.model.LayoutDirectionType.VERTICAL)
        {
            $(this.getChildren()).css("clear","both");
            $(this.getChildren()).css("float","left");
            $(this.getChildren()).addClass("pb-vertical");
        }
        else
        {
            $(this.getChildren()).css("clear","");
            $(this.getChildren()).css("float","");
            $(this.getChildren()).addClass("pb-horizontal");
        }
    }
})
/*
Not sure this is going to work because of things like width / height...
pb.view.Hyperlink = pb.view.Container.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.addClass("pb-hyperlink");
        this.init();
    },
    toString:function()
    {
        return "[Hyperlink]";
    }
})
*/
pb.view.TextLabel = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-single-row");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        this.label = this.createElement("div",null,["pb-inner"]);
        $(this.label).addClass(this.model.getAlign().getValue());
        $(this.label).text(this.model.getDisplayString());
        this.addElement(this.label);
        this.setTextState();
    },
    setTextState:function()
    {
        var multiline = this.model.getTextSize().getMultiline();
        var rows = this.model.getTextSize().getRows();
        var height = (multiline)? Math.max(30,rows * 24) + "px" : "";
        $(this.label).css("height",height);
        this._jqGraphic().toggleClass("pb-single-row",!multiline);
    },
    setText:function()
    {
        $(this.label).text(this.model.getDisplayString());
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="text" || event.property=="mappedEntity" || event.property=="default")
        {
            this.setText();
        }
        else if(event.property=="align")
        {
            $(this.label).removeClass(event.from);
            $(this.label).addClass(event.to);
        }
        else if(event.property=="multiline")
        {
            this.setTextState();
        }
        else if(event.property=="rows")
        {
            this.setTextState();
        }
        else if(event.property=="places" || event.property=="type") // these are triggered by the model's NumberFormat child eent, which is forwarded by the TextLabel model itself
        {
            this.setText();
        }

    }
})

pb.view.TextInput = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-single-row");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        this.input = this.createElement("div",null,["pb-rounded-border","pb-inner","pb-text","pb-input"],null,null,this.model.getText());
        $(this.input).addClass(this.model.getAlign().getValue());
        this.setTextState();
        this.setDisplayString()
        this.addElement(this.input);
    },
    toString:function()
    {
        return "[TextInput id:" + this.model.getID() + "]";
    },
    setTextState:function()
    {
        var multiline = this.model.getTextSize().getMultiline();
        var rows = this.model.getTextSize().getRows();
        var height = (multiline)? Math.max(30,rows * 24) + "px" : "";
        $(this.input).css("height",height);
        this._jqGraphic().toggleClass("pb-single-row",!multiline);
    },
    setDisplayString:function()
    {
        $(this.input).text(this.model.getDisplayString());
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="text" || event.property=="mappedEntity" || event.property=="default")
        {
            this.setDisplayString();
        }
        else if(event.property=="align")
        {
            $(this.input).removeClass(event.from);
            $(this.input).addClass(event.to);
        }
        else if(event.property=="multiline")
        {
            this.setTextState();
        }
        else if(event.property=="rows")
        {
            this.setTextState();
        }
    }
});

pb.view.Numeric = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-single-row");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        this.input = this.createElement("div",null,["pb-rounded-border","pb-inner","pb-number","pb-input"],null,null,this.getDefaultDisplayString());
        $(this.input).addClass(this.model.getAlign().getValue());
        $(this.input).text(this.getDefaultDisplayString());
        this.addElement(this.input);
    },
    getDefaultDisplayString:function()
    {
        var str = this.model.getDisplayString();
        return str;
    },
    setText:function()
    {
        $(this.input).text(this.getDefaultDisplayString());
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="type")
        {
            this.setText();
        }
        else if(event.property=="places")
        {
            this.setText();
        }
        else if(event.property=="align")
        {
            $(this.input).removeClass(event.from);
            $(this.input).addClass(event.to);
        }
        else if(event.property=="mappedEntity" || event.property=="default")
        {
            this.setText();
        }
    }
});

pb.view.Checkbox = pb.view.Element.extend
({
    __constructor: function(model) {
        this.__super(model);
        this.init();
    },
    init: function() {
        this.addClass("pb-single-row pb-checkbox");
        //var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        this.inner = $("<div class='pb-inner pb-checkbox'></div>");
        this.checkbox = $("<input type='checkbox' disabled='true'/>");
        //  this.label = $("<span class='pb-checkbox-label'>Label..</span>");
        this.inner.append(this.checkbox);
        //  this.inner.append(this.label);
        this.addElement(this.inner);
        //$(this.checkbox).attr("checked",this.model.che());
        //this.setStyle();
        //  this.setLabel();
        this.setChecked();
    },
    setChecked: function() {
        if (this.model.getDisplayValue()) {
            var asBoolean = sp.core.data.DataUtils
                .toBoolean(this.model.getDisplayValue().getValue(), ["true", "1", "TRUE", "YES", "yes"]);
            $(this.checkbox).prop("checked", asBoolean);
        }
    },
    //setLabel:function()
    //{
    //    var str = (this.model.getLabelValue())? this.model.getLabelValue().getValue() || "Label.." : "Label..";
    //     $(this.label).text(str);
    //},
    setStyle: function() {
        $(this.checkbox).detach();
        $(this.label).detach();
        if (this.model.getLabelPosition() != this.model.getAlign().getValue()) {
            this.inner.append(this.checkbox);
            this.inner.append(this.label);
        } else {
            this.inner.append(this.label);
            this.inner.append(this.checkbox);
        }
        $(this.label).css("float", this.model.getAlign().getValue());
        $(this.checkbox).css("float", this.model.getAlign().getValue());
    },
    onModelChanged: function(event) {
        this.__super(event);
        if (event.property == "label") {
            //this.setLabel();
        } else if (event.property == "mappedEntity" || event.property == "default") {
            this.setChecked();
        } else if (event.property == "labelPosition") {
            this.setStyle();
        } else if (event.property == "align") {
            this.setStyle();
        }
    }
});

pb.view.Picklist = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-small pb-single-row");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        widthController.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onWidthChanged);
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        var pl = $("<div class='pb-picklist pb-inner no-select'>" +
                   "<div>" +
                   "<div id='inner'></div>" +
                   "<div>" +
                   "<span class='glyphicon glyphicon-chevron-down'></span>"  +
                   "</div>"  +
                   "</div>" +
                   "</div>");
        this.inner = pl.find("#inner");
        this.addElement(pl);
        this.onWidthChanged();
        $(this.inner).text(this.model.getDisplayString());
    },
    buildOptions:function()
    {
        this.select.empty();
        var options = this.model.getOptions().getItems();
        for(var i=0; i<options.length; i++)
        {
            this.select.append($("<option value='"+options[i].getValue()+"'>"+options[i].getName()+"</option>"));
        }
    },
    onWidthChanged:function(event)
    {
        //$(this.select).css("width",this._jqGraphic().width()+"px");
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property="mappedEntity")
        {
            $(this.inner).text(this.model.getDisplayString());
        }
    }
});

pb.view.DatePicker = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.addClass("pb-small");
        this.init();
    },
    init:function()
    {
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        this.inner = $("<div class='pb-date-picker pb-inner'><span id='date'></span><span class='glyphicon glyphicon-calendar'></span></div>");
        this.date = this.inner.find("#date");
        this.date.text("24/7/1969");
        this.addElement(this.inner);
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        this.date.text(this.model.getDisplayString());
    }
});

pb.view.Image = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-image");
        this.image = this.createElement("img",{},["pb-no-select"]);
        $(this.image).css("width","100%");
        $(this.image).on('dragstart', function (e) {e.preventDefault();});
        this.addElement(this.image);
        this._jqGraphic().css("min-width","40px");
        this.refreshImage();
    },
    refreshImage:function()
    {
        // First set the source of the image...
        $(this.image).prop("src",this.model.getSource());
        // now get the width & height options - fill, maintain aspect, match original or specify
        var width = this.model.getWidth();
        var height = this.model.getHeight();
        // if user has selected 'fill' then add the relevant class to the outer container...
        this._jqGraphic().toggleClass("pb-full",width=="fill");
        // now set the width and height of the inner image depending on the option selected...
        var widthProp = (width=="specify")? this.model.getSpecifiedWidth()+"px": (width=="fill")? "100%" : (width=="aspect")? "" : this.model.getNaturalWidth()+"px";
        var heightProp = (height=="specify")? this.model.getSpecifiedHeight()+"px": (height=="fill")? "100%" : (height=="aspect")? "" : this.model.getNaturalHeight()+"px";
        this._jqGraphic().css("width",widthProp);
        this._jqGraphic().css("height",heightProp);
        if(!this.model.getSource())
        {
            $(this.image).hide();
        }
        else
        {
            $(this.image).show();
        }
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        this.refreshImage();
    }
});

pb.view.RadioButtons = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        widthController.addEventListener(this,sp.core.events.Event.CHANGE,this.onChangeWidth);
        this.addClass("pb-radiobuttons");
        this.content().addClass("pb-inner");
        setTimeout($.proxy(this.buildOptions,this),10);
    },
    onChangeWidth:function()
    {
        this.buildOptions();
    },
    buildOptions:function()
    {
        this.clear();
        var str = this.model.getDisplayString() || "Option";
        var width = this._jqGraphic().width();
        var numOptions = (this.model.getLayoutDirection().getDirection()==pb.model.LayoutDirectionType.VERTICAL)? 3 : width/150;
        for(var i=0; i<numOptions; i++)
        {
            var val = (i==0)? str : "Option";
            this.addElement($("<div class='pb-radio'><input type='radio' name='"+val+" value='"+i+"'/><span>"+val+"</span></div>"));
        }
        this.setLayoutDirection();
    },
    /*buildOptions:function()
    {
        this.clear();
        var options = this.model.getOptions().getItems();
        for(var i=0; i<options.length; i++)
        {
            this.addElement($("<div class='pb-radio'><input type='radio' name='"+this.model.getName()+"' value='"+options[i].getValue()+"'/><span>"+options[i].getName()+"</span></div>"));
        }
        this.setLayoutDirection();
    },*/
    setLayoutDirection:function()
    {
        var direction = this.model.getLayoutDirection().getDirection();
        $(this.getChildren()).removeClass("pb-vertical pb-horizontal");
        this.removeClass("pb-horizontal pb-vertical")
        if(direction==pb.model.LayoutDirectionType.VERTICAL)
        {
            this.addClass("pb-vertical");
            $(this.getChildren()).css("clear","both");
            $(this.getChildren()).css("float","");
            $(this.getChildren()).addClass("pb-vertical");
        }
        else
        {
            this.addClass("pb-horizontal");
            $(this.getChildren()).css("clear","");
            $(this.getChildren()).css("float","left");
            $(this.getChildren()).addClass("pb-horizontal");
        }
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="options" || event.property=="mappedEntity")
        {
            this.buildOptions();
        }
        else if(event.property=="direction")
        {
            this.setLayoutDirection();
        }
    }
});

pb.view.Slider = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-small pb-slider pb-single-row");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.buildContent();
        // allow user to slide the slider without dragging the element..
        $(this.slider).on("mousedown",function(event,ui){event.stopImmediatePropagation(); event.stopPropagation();});
        this.drawSlider();
    },
    buildContent:function()
    {
        // confusing names because content() added to base class and conflicted with these internal names
        this.outer = $("<div id='content' class='pb-inner'></div>");
        this.inner = $("<div id='inner'></div>");
        this.slider = this.createSlider();
        this.min = $("<div id='min'></div>");
        this.max = $("<div id='max'></div>");
        var minBinding = new pb.model.FieldBinding(this.min,this.model,this.model.getMinimum);
        var maxBinding = new pb.model.FieldBinding(this.max,this.model,this.model.getMaximum);
        this.inner.append(this.min);
        this.inner.append(this.slider);
        this.inner.append(this.max);
        this.outer.append(this.inner);
        this.addElement(this.outer);
    },
    createSlider:function()
    {
        var __this = this;
        return $("<div id='slider'></div>").slider({
                                                        orientation: "horizontal",
                                                        range: "min",
                                                        min: 0,
                                                        max: 100,
                                                        value: 50,
                                                        slide: function(event,ui)
                                                        {
                                                            __this.onSliderChanged();
                                                        }
                                                    });
    },
    drawSlider:function()
    {
        var min = this.model.getMinimum();
        this.slider.slider({min:this.model.getMinimum(),
            max:this.model.getMaximum()});

    },
    onModelChanged:function(event)
    {
        this.__super(event);
        this.drawSlider();
    },
    onSliderChanged:function()
    {
        // placeholder callback - see createSlider();
    }
});

pb.view.TextArea = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-medium pb-textarea");
        var input = $("<div class='pb-rounded-border pb-inner pb-text pb-input'></div>");
        this.addElement(input);
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        var binding = new pb.model.FieldBinding(input,this.model,this.model.getText,this.model.setText);
    }
});

pb.view.List = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-large pb-list");
        // var input = this.createElement("input",null,null,{type:"text",value:"Enter your value.."});
       // this.addElement(input);
    }
});

pb.view.Chart = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-large pb-grid");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        var heightController = new pb.view.ElementHeightController(this._jqGraphic(),this.model.getHeight());
        var __this = this;
        setTimeout(function(){__this.createChart()},10);
    },
    getRandomValue:function(min,max)
    {
        if(max<min) var temp=min, min=max, max=temp; // ensure min is always lower than max
        var range = max-min;
        return Math.round(Math.random()*range)+min;
    },
    getRandomDate:function(start,end)
    {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },
    getRandomString:function()
    {
        var chars = "abcdefghijklmnopqrstuvwxyz";
        var str = "";
        for(var i=4; i<10; i++)
        {
            str += chars.substr(Math.floor(Math.random()*chars.length),1);
        }
        return str;
    },
    getMockValueForField:function(field)
    {
        var type = field.fieldType();
        switch(type)
        {
            case pb.model.fields.ObjectType.NUMBER:
                return this.getRandomValue(0,100);
            case pb.model.fields.ObjectType.DATE:
                return this.getRandomDate(new Date(2012,1,1),new Date());
            case pb.model.fields.ObjectType.BOOLEAN:
               return (Math.random()>0.5);
            case pb.model.fields.ObjectType.STRING:
            case pb.model.fields.ObjectType.ENUM:
               return this.getRandomString();
            case pb.model.fields.ObjectType.OBJECT:
            case pb.model.fields.ObjectType.COLLECTION:
            default:
                return this.getRandomValue(0,100);
        }
    },
    mockDataSeries:function(count)
    {
        if(!this.model.getMappedEntity()) return [];
        var fields = this.model.getMappedEntity().fields();
        var result = [];
        for(var i=0; i<count; i++)
        {
            var obj = {};
            for(var n=0; n<fields.length; n++)
            {
                var field = fields[n];
                obj[field.id()] = this.getMockValueForField(field);
            }
            result.push(obj);
        }
        return result;
    },
    /*
    mockDataSeries:function(model)
    {
        sp.out("mockDataSeries, model:" + model);
       return new pb.model.ChartMockDataSeries(model).getData();

    },
    */
    createXSeries:function()
    {
        var field = this.model.getPrimaryAxisOptions().getField();

        if(!field) return [];
        var result = [];
        for(var i=0; i<100; i++)
        {
            result.push(this.getMockValueForField(field));
        }
        return {
                    name:field.name(),
                    data:result
               };
        /*return {name:field.name(),
                data:this.mockDataSeries(this.model.getPrimaryAxisOptions())};*/
    },
    createYSeries:function()
    {

    },
    /*
    createChart:function()
    {
        var chartData = this.mockDataSeries(this.model);
        this._jqGraphic().highcharts(chartData);
    },
    */
    formatAxisValue:function(val)
    {
        var mappedEntity = this.model.getMappedEntity();
        var axisField = this.model.getPrimaryAxisOptions().getField();
        if(mappedEntity)
        {
            if(axisField.objectType().isNumber())
            {
                var symbol = this.model.getPrimaryAxisOptions().getNumberOptions().getSymbol();
                if(symbol != pb.model.ChartAxisNumberOptions.NONE)
                {
                    if(symbol == pb.model.ChartNumericSymbolType.CURRENCY)
                    {
                        return "[$]" + val;
                    }
                    else if(symbol == pb.model.ChartNumericSymbolType.PERCENTAGE)
                    {
                        return val + "%";
                    }
                }
            }
        }
        return val;
    },
    createChart:function()
    {
        var __this = this;
        var chart = {type:this.model.getChartType()};
        var chartData = {
            credits:{enabled:false},
            chart: chart,
            title: {
                text: ""
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels:
                {
                    formatter:function()
                    {
                        return __this.formatAxisValue(this.value);
                    }
                }
            },
            series: [this.createXSeries()]
        };
        this._jqGraphic().highcharts(chartData);
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="mappedEntity")
        {
            //this.mockData = this.mockDataSeries(100);
            //sp.out("mockData:" + JSON.stringify(this.mockData, null," "));
        }
        var __this = this;
        // the resize of the html element doesn't happen immediately so
        // we have to hack a timeout function to ensure that the chart is redrawn only
        // after the new width and height have been registered...
        setTimeout(function(){__this.createChart()},0);
    }
});

pb.view.Button = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-small button");
        var input = this.createElement("span",null,"button",null,null,"Click Me");
        this.addElement(input);
    }
});

pb.view.TaggedText = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-medium");

        //var input = this.createElement("input",null,null,{type:"text",value:"Enter your value.."});
        //this.addElement(input);
    }
});

pb.view.ColorPicker = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-small");

        //var input = this.createElement("input",null,null,{type:"text",value:"Enter your value.."});
        //this.addElement(input);
    }
});

pb.view.ElementWidthController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(element,model)
    {
        this.__super();
        this.element = element;
        this.model = model;
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        //this.setWidth();
        setTimeout($.proxy(this.setWidth,this),0);
    },
    setWidth:function()
    {
        $(this.element).removeClass("pb-width-full pb-width-medium pb-width-large pb-width-small");
        $(this.element).css("width","");
        if(this.model.getSize()=="specify")
        {
            $(this.element).css("width",this.model.getWidth()+"%");
        }
        else
        {
            $(this.element).addClass("pb-width-"+this.model.getSize());
        }
        this.dispatchEvent(new sp.core.events.Event(this,sp.core.events.Event.CHANGE));
    },
    onModelChanged:function(event)
    {
        this.setWidth();
        event.currentTarget = this;
        this.dispatchEvent(event);
    }
});

pb.view.ElementHeightController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(element,model)
    {
        this.__super();
        this.element = element;
        this.model = model;
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        setTimeout($.proxy(this.setHeight,this),10);
    },
    setHeight:function()
    {
        $(this.element).removeClass("pb-height-sm pb-height-medium pb-height-large");
        $(this.element).css("height","");
        if(this.model.getSize()=="specify")
        {
            var parentHeight = this.element.parent().height();
            if(this.model.getHeight())
            {
                var h = parentHeight*this.model.getHeight()/100;
                $(this.element).css("height",h);
            }
        }
        else
        {
            $(this.element).addClass("pb-height-"+this.model.getSize());
        }
    },
    onModelChanged:function(event)
    {
        this.setHeight();
        event.currentTarget = this;
        this.dispatchEvent(event);
    }
});

pb.view.ElementBackgroundColorController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(element,model)
    {
        this.__super();
        this.element = element;
        this.model = model;
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        setTimeout($.proxy(this.setColor,this),0);
    },
    setColor:function()
    {
        var colorValue = this.model.getColorValue();
        if(colorValue!=undefined)
        {
            $(this.element).css("background-color",colorValue);
        }
        else
        {
            $(this.element).css("background-color","");
        }
    },
    onModelChanged:function(event)
    {
        this.setColor();
        event.currentTarget = this;
        this.dispatchEvent(event);
    }
});

pb.view.ElementTextColorController = pb.view.ElementBackgroundColorController.extend
({
    setColor:function()
    {
        var colorValue = this.model.getColorValue();
        if(colorValue!=undefined)
        {
            $(this.element).css("color",colorValue);
        }
        else
        {
            $(this.element).css("color","");
        }
    }
});

pb.view.ElementBorderColorController = pb.view.ElementBackgroundColorController.extend
({
    setColor:function()
    {
        var colorValue = this.model.getColorValue();
        if(colorValue!=undefined)
        {
            $(this.element).css("border","1px solid " + colorValue);
        }
        else
        {
            $(this.element).css("border","");
        }
    }
});

pb.view.LookUp = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-small pb-lookup pb-single-row");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        widthController.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onWidthChanged);
        this.backgroundColorController = new pb.view.ElementBackgroundColorController(this._jqGraphic(),this.model.getBackgroundColor());
        this.textColorController = new pb.view.ElementTextColorController(this._jqGraphic(),this.model.getTextColor());
        this.buildView();
        this.onWidthChanged();
        this.setDisplayString();
    },
    buildView:function()
    {
        var inner = $("<div class='pb-inner'></div>");
        this.link = $("<a>Select</a>");
        var content = $("<span></span>");
        var icon = $("<span class='glyphicon glyphicon-search pb-float-right'></span>");
        this.addElement(inner);
        inner.append(this.link);
        inner.append(icon);
    },
    onWidthChanged:function(event)
    {
        //$(this.select).css("width",this._jqGraphic().width()+"px");
    },
    setDisplayString:function()
    {
        $(this.link).text(this.model.getDisplayString());
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="text" || event.property=="mappedEntity")
        {
            this.setDisplayString();
        }
    }
});

pb.view.Map = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.addClass("pb-map pb-padding-10");
        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        var heightController = new pb.view.ElementHeightController(this._jqGraphic(),this.model.getHeight());
        this.lookupSection = $("<div class='pb-map-lookup-section'/>");
        this.cardsSection = $("<div class='pb-map-cards-section'/>");
        this.addElement(this.lookupSection);
        this.addElement(this.cardsSection);
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        var __this = this;
        //setTimeout(function(){__this.setCardsSectionHeight()},1000);
    },
    appendLookUp:function(obj)
    {
        this.lookUp = obj;
        this.lookupSection.append(this.lookUp.getGraphic());
    },
    appendCardDetails:function(obj)
    {
        this.cardDetails = obj;
        this.cardsSection.append(this.cardDetails.getGraphic());
    },
    appendDialogDetails:function(obj)
    {
        this.dialogDetails = obj;
        this.cardsSection.append(this.dialogDetails.getGraphic());
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        setTimeout($.proxy(function(){this.setCardsSectionHeight()},this),10);
    },
    toNumber:function(num)
    {
        num = Number(num);
        return (num!=num)? 0 : num;
    },
    setCardsSectionHeight:function()
    {
        var height = this.toNumber(this._jqGraphic().height());
        var width = this.toNumber(this._jqGraphic().width());
        var lookupHeight = this.toNumber(this.lookupSection.height());
        var top = this.toNumber(this.cardsSection.position().top);
        var margin = this.toNumber(this.cardsSection.css("margin-top"));
        var h = height-top;
        this.cardsSection.css("height",h+4); // magic number...sorry. I think we need to set this to half the padding on the parent but no idea why.. TW 2016
        this.cardDetails.setHeight(h);
        this.dialogDetails.setHeight(h);
    }
});

pb.view.CollectionLookUp = pb.view.LookUp.extend
({
    __constructor:function(model)
    {
        this.__super(model);
    },
    init:function()
    {
        this.addClass("pb-width-full pb-lookup pb-single-row");
        this.buildView();
        this.setDisplayString();
    },
    buildView:function()
    {
        var inner = $("<div class='pb-inner'></div>");
        this.link = $("<a>Select</a>");
        var content = $("<span></span>");
        var icon = $("<span class='glyphicon glyphicon-search pb-float-right'></span>");
        this.addElement(inner);
        inner.append(this.link);
        inner.append(icon);
    },
    setDisplayString:function()
    {
        this.link.html(this.model.getDisplayString());
    },
    onModelChanged:function(event)
    {
        if(event.property=="text" || event.property=="mappedEntity")
        {
            this.setDisplayString();
        }
    }
});

pb.view.MapCard = pb.view.Container.extend
({
    __constructor:function(model,title)
    {
        this.__super(model);
        this.title = title;
        this.init();
    },
    init:function()
    {
        this.titleElement = $("<div class='pb-mapcard-title'>"+this.title+"</div>");
        this.droppableArea = $("<div class='pb-mapcard-container'></div>");
        this.addElement(this.titleElement);
        this.addElement(this.droppableArea);
        this.addClass("pb-map-card");
    },
    getDroppableAreaElement:function()
    {
        return this.droppableArea[0];
    },
    removeAllElements:function()
    {
        this.droppableArea.empty();
        //this.addElement($("<div class='pb-mapcard-title'>"+this.title+"</div>"));
    },
    toNumber:function(num)
    {
        num = Number(num);
        return (num!=num)? 0 : num;
    },
    setHeight:function(h)
    {
        h = this.toNumber(h);
        var y = this.toNumber(this.titleElement.height());
        var margin = this.toNumber(this.droppableArea.css("margin-top"));
        this.droppableArea.css("height",h-y-margin);
    },
    setWidth:function(w)
    {
        this._jqGraphic().css("width",w);
    }

});


pb.view.GridAddNewDialog = pb.view.Container.extend
({
    __constructor: function (model) {
        this.__super(model);
        this.init();
    },
    init: function () {
        this.titleElement = $("<div class='pb-dialog-title'/>");
        this.droppableArea = $("<div class='pb-dialog-container'/>");
        this.addNewDialogElement = $("<div> Add New Dialog </div>");
        this.addElement(this.titleElement);
        this.addElement(this.addNewDialogElement);
        this.addElement(this.droppableArea);
        this.addClass("pb-dialog");
    },
    getDroppableAreaElement: function () {
        return this.droppableArea[0];
    },
    removeAllElements: function () {
        this.droppableArea.empty();
        //this.addElement($("<div class='pb-mapcard-title'>"+this.title+"</div>"));
    },
    toNumber: function (num) {
        num = Number(num);
        return (num != num) ? 0 : num;
    },
    setHeight: function (h) {
        h = this.toNumber(h);
        var y = this.toNumber(this.titleElement.height());
        var margin = this.toNumber(this.droppableArea.css("margin-top"));
        this.droppableArea.css("height", h - y - margin);
    },
    setWidth: function (w) {
        this._jqGraphic().css("width", w);
    }

});

pb.view.Dialog = pb.view.Container.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.init();
    },
    init:function()
    {
        this.titleElement = $("<div class='pb-dialog-title'/>");
        this.droppableArea = $("<div class='pb-dialog-container'/>");
        this.addElement(this.titleElement);
        this.addElement(this.droppableArea);
        this.addClass("pb-dialog");
    },
    getDroppableAreaElement:function()
    {
        return this.droppableArea[0];
    },
    removeAllElements:function()
    {
        this.droppableArea.empty();
        //this.addElement($("<div class='pb-mapcard-title'>"+this.title+"</div>"));
    },
    toNumber:function(num)
    {
        num = Number(num);
        return (num!=num)? 0 : num;
    },
    setHeight:function(h)
    {
        h = this.toNumber(h);
        var y = this.toNumber(this.titleElement.height());
        var margin = this.toNumber(this.droppableArea.css("margin-top"));
        this.droppableArea.css("height",h-y-margin);
    },
    setWidth:function(w)
    {
        this._jqGraphic().css("width",w);
    }

});