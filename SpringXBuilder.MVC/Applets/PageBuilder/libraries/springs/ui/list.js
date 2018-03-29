sp.namespace("sp.ui.list.List",
             "sp.ui.list.ListItemRenderer",
             "sp.ui.list.ListOptions",
             "sp.ui.list.ListEvent");



sp.ui.list.List = sp.core.graphics.Graphic.extend
(
{

    __constructor: function(options)
    {
        this.__super();
        this.options = options || new sp.ui.list.ListOptions();
        this.init();
    },

    init: function()
    {
        $(this.getGraphic()).addClass(this.options.listClass);
        if (this.options.sortable)
        {
            var __this = this;
            var __dragStatus = 1;
            this.options.sortable.receive = function() { __dragStatus = 1; };
            this.options.sortable.over = function() { __dragStatus = 1; };
            this.options.sortable.out = function() { __dragStatus = 0; };
            this.options.sortable.beforeStop = function(event, ui)
            {
                if (__dragStatus == 0)
                {
                    __this.onDroppedOutside(event, ui);
                }
                else
                {
                    __this.onSort();
                }
            };
            $(this.getGraphic()).sortable(this.options.sortable);
        }
        this.__dataProvider = [];
        this.__listData = [];
    },

    onDragElement: function(event, ui)
    {

    },

    getCells: function()
    {
        var cells = [];
        var children = $(this.getGraphic()).children();
        for (var i = 0; i < children.length; i++)
        {
            if (this.isListItem(children[i]))
            {
                cells.push(children[i]);
            }
        }
        return cells;
    },

    onSort: function()
    {
        this.__listData = [];
        var children = $(this.getGraphic()).children();
        for (var i = 0; i < children.length; i++) if (this.isListItem(children[i])) this.__listData.push($(children[i]).prop("__data"));
        this.dispatchEvent(new sp.ui.list.ListEvent(sp.ui.list.ListEvent.SORT));
    },

    isListItem: function(item)
    {
        // ugly test, but jquery adds a hidden element to the sortable div so we need to exclude any rogue elements which are not list items
        return $(item).prop("__isListItem");
    },

    onDroppedOutside: function(event, ui)
    {
        if (this.options.dragToDelete)
        {
            var index = 0;
            var cells = this.getCells();
            for (var i = 0; i < cells.length; i++)
            {
                if (cells[i] == ui.item[0])
                {
                    $(cells[i]).remove();
                    this.__listData = this.getData();
                    this.dispatchEvent(new sp.ui.list.ListEvent(this, sp.ui.list.ListEvent.DROPOUT));
                    return;
                }
            }
        }
    },

    setDataProvider: function(array)
    {
        this.__dataProvider = (array) ? (array.splice) ? array : [array] : [];
        this.__listData = [];
        for (var i = 0; i < this.__dataProvider.length; i++) // because of sorting, we will not touch the original array, and only use a local copy
        {
            this.__listData.push(this.__dataProvider[i]);
        }
        this.draw();
    },

    getData: function()
    {
        var arr = [];
        var cells = this.getCells();
        for (var i = 0; i < cells.length; i++) arr.push((this.options.renderer.getItemData != undefined) ? this.options.renderer.getItemData(cells[i], this.__listData[i], i, this.options.labelProperty) : {});
        return arr;
    },

    indexOfElement: function(element)
    {
        var cells = this.getCells();
        for (var i = 0; i < cells.length; i++)
        {
            if (cells[i] == element) return i;
        }
        return -1;
    },

    draw: function()
    {
        $(this.getGraphic()).empty();
        var __this = this;
        for (var i = 0; i < this.__listData.length; i++)
        {
            var el = document.createElement("div");
            $(el).addClass(this.options.listItemClass);
            el = this.options.renderer.render(el, this.__listData, i, this.options.labelProperty, this);
            $(el).prop("__data", this.__listData[i]);
            $(el).prop("__isListItem", true);
            $(this.getGraphic()).append(el);
            $(el).dblclick(function(event) { __this.onDoubleClick(event, this) });
            $(el).click(function(event) { __this.onClick(event, this) });
            $(el).mouseover(function(event) { __this.onMouseOver(event, this) });
            if (this.options.toolTipOptions)
            {
                $(el).prop("__toolTip", new ToolTip(el, this.options.toolTipOptions));
            }
            //$(el).draggable();
        }
    },

    onClick:function(event,element)
    {
        this.dispatchEvent(new sp.ui.list.ListEvent(this, sp.ui.list.ListEvent.CLICK, this.indexOfElement(element), $(element).prop("__data"), element, event));

    },

    onDoubleClick: function(event, element)
    {
       this.dispatchEvent(new sp.ui.list.ListEvent(this, sp.ui.list.ListEvent.DOUBLECLICK, this.indexOfElement(element), $(element).prop("__data"), element, event));
    },

    onMouseOver: function(event, element)
    {
        this.dispatchEvent(new sp.ui.list.ListEvent(this, sp.ui.list.ListEvent.MOUSEOVER, this.indexOfElement(element), $(element).prop("__data"), element, event));
    }

}
);

sp.ui.list.ListItemRenderer = Class.extend
(
{
	render:function(cell,data,index,labelProperty)
	{
		$(cell).html(data[labelProperty] || "&nbsp");
		return cell;
	},
	
	drawToolTip:function(tooltip,data,index,labelProperty)
	{
	    $(cell).html(data[labelProperty] || "&nbsp");
	    return cell;
	},
	
	getItemData:function(cell,data,index,labelProperty)
	{
		return data;
	}
	
	
}
);

sp.ui.list.ListOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.listClass = "list";
        this.listItemClass = "listItem";
        this.labelProperty = "label";
        this.showToolTips = null;
        this.toolTipRenderer = null;
        this.renderer = new sp.ui.list.ListItemRenderer();
        this.sortable = { scroll: true, delay:50 };
        this.dragToDelete = false;
    }
}
);

sp.ui.list.ListEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, index, data, originalTarget, originalEvent)
    {
        this.__super(target, type);
        this.index = index;
        this.data = data;
        this.originalTarget = originalTarget;
        this.originalEvent = originalEvent;
    }
}
);
sp.ui.list.ListEvent.DROPOUT = "dropout";
sp.ui.list.ListEvent.SORT = "sort";
sp.ui.list.ListEvent.MOUSEOVER = "list_mouseover";
sp.ui.list.ListEvent.MOUSEOUT = "list_mouseout";
sp.ui.list.ListEvent.DOUBLECLICK = "list_doubleclick";
sp.ui.list.ListEvent.CLICK = "list_click";