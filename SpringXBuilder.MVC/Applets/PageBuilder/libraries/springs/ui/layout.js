sp.namespace("sp.ui.layout.Layout",
             "sp.ui.layout.BorderedLayout",
             "sp.ui.layout.LabelledElement",
             "sp.ui.layout.VBox",
             "sp.ui.layout.HBox");


sp.ui.layout.Layout = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(graphic,options)
    {
        this.__super(graphic);
        $(this.getGraphic()).addClass("sp_ui_layout");
        this.options = options || {};
        this.elements = [];
        this.states = [];
        this.state = "";
        this.setup();
    },

    setup:function()
    {
        this.__content = this.getGraphic();
    },

    addItem: function(element,state)
    {
        this.applyCSS(element);
        this.elements.push({element:element, state:state});
        $(this.__content).append(this.isGraphic(element)? element.getGraphic() : element);
        return element;
    },

    addLabelledItem:function(element,label,state)
    {
        var labelledElement = new sp.ui.layout.LabelledElement(element,label);
        return this.addItem(labelledElement, state);
    },

    applyCSS:function(element)
    {
      //overwrite for layout options if necessary..
    },

    clearItems:function()
    {

    },

    setState:function(state)
    {
        this.state = state || "";
        this.draw();
    },

    getState:function()
    {
        return this.state || "";
    },

    getStates:function()
    {
        this.states = [];
        for(var i=0; i<this.elements.length; i++)
        {
            var obj = this.elements[i];
            if(obj.state) this.states.push(obj.state);
        }
    },

    getItemAt: function(index)
    {
        try
        {
            return this.elements[index].element;
        }
        catch(e)
        {

        }
    },

    clear:function()
    {
        $(this.__content).empty();
    },

    draw:function()
    {
        this.clear();
        for(var i=0; i<this.elements.length; i++)
        {
            var obj = this.elements[i];
            if(!obj.state || (obj.state && this.state == obj.state)) $(this.__content).append(obj.element);
        }
    }

}
);

sp.ui.layout.BorderedLayout = sp.ui.layout.Layout.extend
(
    {
        __constructor:function(graphic,options)
        {
            this.__super(graphic,options);
        },

        setup:function()
        {
            $(this.__graphic).addClass("bordered_layout");
            this.label = this.addElement(this.createElement("div",{},["label"],{},{},this.getTitle()));
            this.border = this.addElement(this.createElement("div",{},["border"]));
            this.__content = this.createElement("div",{},["content"]);
            $(this.border).append(this.__content);
        },

        getTitle:function()
        {
            return "Section";
        },

        setTitle:function(str)
        {
            $(this.label).html(str);
        }
    }
);

sp.ui.layout.LabelledElement = sp.core.graphics.Graphic.extend
(
    {
        __constructor:function(element,label)
        {
            this.__super();
            $(this.__graphic).addClass("sp_ui_labelled_element");
            if(label.substr!=undefined)
            {
                this.label = this.addElement(this.createElement("div",{},["sp_label"],{},{},label));
            }
            else
            {
                $(label).addClass("sp_label");
                this.label = this.addElement(label);
            }

            this.element = this.addElement(element);
            $(this.element).addClass("sp_element");
        },

        getElement:function()
        {
            return this.element;
        },

        getLabel:function()
        {
            return this.label;
        },

        getText:function()
        {
            return $(this.label).html();
        },

        setText:function(label)
        {
            $(this.label).html(label);
        }
    }
);


sp.ui.layout.VBox = sp.ui.layout.Layout.extend
(
    {
        __constructor:function(graphic)
        {
            this.__super(graphic);
            $(this.getGraphic()).addClass("sp_ui_layout_vbox");
        },

        applyCSS:function(element)
        {
            $(element).css("float","left");
            $(element).css("clear","left");
        }
    }
);

sp.ui.layout.HBox = sp.ui.layout.Layout.extend
(
    {
        __constructor:function(graphic)
        {
            this.__super(graphic);
            $(this.getGraphic()).addClass("sp_ui_layout_hbox");
        }
    }
);

