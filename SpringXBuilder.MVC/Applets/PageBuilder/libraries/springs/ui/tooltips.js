sp.namespace("sp.ui.tooltips.ToolTip",
             "sp.ui.tooltips.ToolTipOptions",
             "sp.ui.tooltips.ToolTipRenderer",
             "sp.ui.tooltips.ToolTipPlacement");


sp.ui.tooltips.ToolTip = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(target, options)
    {
        this.__super();
        this.__graphic = null; // prevents default instance being created so we can test for existence of graphic on a show
        this.target = target;
        this.options = options || new sp.ui.tooltips.ToolTipOptions();
        this.init();
        this.enabled = true;
    },

    init: function()
    {
        var __this = this;
        $(this.target).mousemove(function(event) { __this.onMouseOver(event) });
    },

    onMouseOver: function(event)
    {
        if (this.enabled) this.show(event);
    },

    show: function(event)
    {
        if (sp.ui.tooltips.ToolTip.current) sp.ui.tooltips.ToolTip.current.hide();
        sp.ui.tooltips.ToolTip.current = this;
        $(this.getGraphic()).show();
        $(this.getGraphic()).css("zIndex", 102000);
        this.options.renderer.render(this.content, this.options, this.target, event);
        var position = this.getPosition(event);
        this.setX(position.x);
        this.setY(position.y);
        $(this.getContainer()).append(this.__graphic);
        this.dispatchEvent(new sp.core.events.Event(this, sp.core.events.Event.SHOW));
    },

    getPosition: function(mouseEvent)
    {
        if (this.options.placement == sp.ui.tooltips.ToolTipPlacement.MOUSE)
        {
            return { x: mouseEvent.pageX + this.options.offsetX,
                     y: mouseEvent.pageY + this.options.offsetY};
        }
        else
        {
            return{x: $(this.target).offset().left + this.options.offsetX,y: $(this.target).offset().top + $(this.target).outerHeight() + this.options.offsetY};
        }
    },

    setOnMouseOut: function()
    {
        var __this = this;
        if (this.options.placement == sp.ui.tooltips.ToolTipPlacement.MOUSE)
        {
            $(this.getGraphic()).mouseout(function(event) { __this.onMouseOut(event) });
        }
        else
        {
            $(this.target).mouseout(function(event) { __this.onMouseOut(event) });
        }
    },

    onMouseOut: function(event)
    {
        var e = event.toElement || event.relatedTarget;
        if(!e)
        {
            this.hide();
            return;
        }
        if (e.parentNode == this.content || e == this.content || e.parentNode == this.getGraphic() || e == this.getGraphic()) return;
        this.hide();
    },

    hide: function()
    {
        $(this.getGraphic()).hide();
        this.dispatchEvent(new sp.core.events.Event(this, sp.core.events.Event.HIDE));
    },

    getGraphic: function()
    {
        if (!this.__graphic)
        {
            this.__graphic = this.createElement("div", { position: "absolute" }, sp.core.data.DataUtils.toArray(this.options.tooltipClass));
            this.content = this.addElement(this.createElement("div", {}, sp.core.data.DataUtils.toArray(this.options.contentClass)));
            this.setOnMouseOut();
            var __this = this;
            $("body").mousedown(function() { __this.onMouseDown() });
            $("body").mouseup(function() { __this.onMouseUp() });
        }
        return this.__graphic;
    },

    onMouseDown: function()
    {
        this.enabled = false;
        this.hide();
    },

    onMouseUp: function()
    {
        this.enabled = true;
    },

    getContainer: function()
    {
        return this.options.container || "body";
    },

    getOptions: function()
    {
        return this.options;
    },

    setOptions: function(valueMap)
    {
        for (var prop in valueMap)
        {
            this.options[prop] = valueMap[prop];
        }
    }
}
);
sp.ui.tooltips.ToolTip.current = null;

sp.ui.tooltips.ToolTipOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.tooltipClass = "tooltip";
        this.contentClass = "content";
        this.container = null;
        this.html = "TOOLTIP";
        this.renderer = new sp.ui.tooltips.ToolTipRenderer();
        this.placement = sp.ui.tooltips.ToolTipPlacement.TARGET;
        this.offsetX = 5;
        this.offsetY = 5;
    }
}
);

sp.ui.tooltips.ToolTipRenderer = Class.extend
(
{
    render: function(content, options, target, originalEvent)
    {
        $(content).html($('<div/>').html(options.html).text()); // unescape html
    }
}
);

sp.ui.tooltips.ToolTipPlacement =
{
    MOUSE:"mouse",
    TARGET:"target"
};


