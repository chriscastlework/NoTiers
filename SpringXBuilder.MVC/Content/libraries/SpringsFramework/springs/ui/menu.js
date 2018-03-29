sp.namespace("sp.ui.menu.Menu",
             "sp.ui.menu.MenuOptions",
             "sp.ui.menu.MenuItemRenderer",
             "sp.ui.menu.MenuEvent",
             "sp.ui.menu.ButtonMenu",
             "sp.ui.menu.ButtonMenuManager",
             "sp.ui.menu.ButtonMenuOptions",
             "sp.ui.menu.ButtonPopupMenu"
            );


sp.ui.menu.Menu = sp.ui.list.List.extend
(
{
    __constructor: function(options)
    {
        this.options = options || new sp.ui.menu.MenuOptions();
        if (!this.options.renderer) this.options.renderer = new sp.ui.menu.MenuItemRenderer();
        if (!this.options.labelProperty) this.options.labelProperty = 'label';
        if (!this.options.listClass) this.options.listClass = 'ui-menu';
        if (!this.options.listItemClass) this.options.listItemClass = 'ui-menu-item';
        if (!this.options.sortable) this.options.sortable = false;
        this.__super(options);
    },

    draw: function()
    {
        $(this.getGraphic()).empty();
        var __this = this;
        for (var i = 0; i < this.__listData.length; i++)
        {
            var el = document.createElement("div");
            $(el).addClass(this.options.listItemClass);
            el = this.options.renderer.render(el, this.__listData, i, this.options.labelProperty);
            $(el).prop("__data", this.__listData[i]);
            $(el).prop("__isListItem", true);
            $(this.getGraphic()).append(el);
            $(el).click(function(event) { __this.onClick(event, this) });
            $(el).mouseover(function(event) { __this.onMouseOver(event, this) });
            $(el).mouseout(function(event) { __this.onMouseOut(event, this) });
            if (this.options.toolTipOptions)
            {
                $(el).prop("__toolTip", new ToolTip(el, this.options.toolTipOptions));
            }
        }
    },

    render: function(cell,data,index,labelProperty)
    {
        $(cell).html("<a>" + data[index][labelProperty] + "</a>" || "&nbsp");
        return cell;
    },

    onClick: function(event, element)
    {
        this.dispatchEvent(new sp.ui.menu.MenuEvent(this, sp.ui.menu.MenuEvent.ITEMSELECT, this.indexOfElement(element), $(element).prop("__data"), element, event));
    },

    onMouseOver: function(event, element)
    {
        $(element).addClass('ui-state-hover');
        //this.dispatchEvent(new sp.ui.menu.MenuEvent(this, sp.ui.menu.MenuEvent.MOUSEOVER, this.indexOfElement(element), $(element).prop("__data"), element, event));
    },

    onMouseOut: function(event, element)
    {
        $(element).removeClass('ui-state-hover');
        //this.dispatchEvent(new sp.ui.menu.MenuEvent(this, sp.ui.menu.MenuEvent.MOUSEOUT, this.indexOfElement(element), $(element).prop("__data"), element, event));
    }

}
);

sp.ui.menu.MenuOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults:function()
    {
        this.labelProperty = 'label';
        this.listClass = 'ui-menu';
        this.listItemClass = 'ui-menu-item';
        this.renderer = new sp.ui.menu.MenuItemRenderer();
        this.sortable = false;
    }
}
);

sp.ui.menu.MenuItemRenderer = Class.extend
(
{
    render: function(cell,data,index,labelProperty)
    {
        $(cell).html("<a>" + data[index][labelProperty] + "</a>" || "&nbsp");
        return cell;
    }
}
);

sp.ui.menu.MenuEvent = sp.core.events.Event.extend
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
sp.ui.menu.MenuEvent.MOUSEOVER = "menu_mouseover";
sp.ui.menu.MenuEvent.MOUSEOUT = "menu_mouseout";
sp.ui.menu.MenuEvent.ITEMSELECT = "menu_itemselect";


sp.ui.menu.ButtonMenu = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(menuManagerInstance, options)
    {
        this.__super($('<a></a>'));
        this.options = options || new sp.ui.menu.ButtonMenuOptions();
        this.menuVisible = false;
        this.menuManager = menuManagerInstance;
        this.init();
    },

    init: function()
    {
        var __this = this;
        this.menu = new sp.ui.menu.Menu(__this.options);
        $(__this.menu.getGraphic()).css(
            {
                "position": "absolute"
            });
        $(document.body).append(__this.menu.getGraphic());

        this.draw();
    },

    getMenu: function ()
    {
        return this.menu;
    },

    setMenuDataProvider: function (array)
    {
        this.menu.setDataProvider(array);
        this.menu.hide();
    },

    draw: function()
    {
        var __this = this;
        var graphic = $(this.getGraphic());
        graphic.empty();
        graphic.text(this.options.buttonLabel);
        graphic.button();
        graphic.click(function (event) { event.stopPropagation();  __this.onButtonClick() });
        $(document).click(function (event) {__this.hideMenu();})
    },

    hideMenu: function()
    {
        $(this.menu.getGraphic()).slideUp();
        this.menuVisible = false;
    },

    showMenu: function()
    {
        this.menuManager.addMenu(this);
        $(this.menu.getGraphic()).slideDown();
        this.menuVisible = true;
    },

    onButtonClick: function ()
    {
        var menu = this.menu;
        var graphic = $(this.getGraphic());
        var buttonPosition = graphic.position();
        $(menu.getGraphic()).css(
            {
                "left": buttonPosition.left + 'px',
                "top": buttonPosition.top + parseInt(graphic.height()) + 'px',
                "zIndex": 100
            });

        if (this.menuVisible)
        {
            this.hideMenu();
        } else
        {
            this.showMenu();
        }
    }
}
);

sp.ui.menu.ButtonMenuManager = Class.extend
(
{
    __constructor: function()
    {
        this.visibleMenus = [];
        this.init();
    },

    init: function()
    {
        var __this = this;
        $(document).click(function(event) {__this.closeMenus();});
    },

    closeMenus: function()
    {
        for (var i=0; i<this.visibleMenus.length; i++)
        {
            this.visibleMenus[i].hideMenu();
        };
        this.visibleMenus = [];
    },

    addMenu: function (menu)
    {
        this.closeMenus();
        this.visibleMenus.push(menu);
    }
}
);

sp.ui.menu.ButtonMenuOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults:function()
    {
        this.buttonLabel = "Button";
        this.listClass = 'ui-menu';
        this.listItemClass = 'ui-menu-item';
    }
}
);

sp.ui.menu.ButtonPopupMenu = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(graphic, options)
    {
        this.__super(graphic);
        this.options = options || new sp.ui.menu.ButtonMenuOptions();
        this.offsetLeft = this.options.offsetLeft || 0;
        this.offsetTop = this.options.offsetTop || 0;
        this.menuVisible = false;
        this.init();
    },

    init: function()
    {
        var __this = this;
        this.menu = new sp.ui.menu.Menu(__this.options);
        $(__this.menu.getGraphic()).css(
            {
                "position": "absolute"
            });
        $(document.body).append(__this.menu.getGraphic());
        this.menu.addEventListener(this, sp.ui.menu.MenuEvent.ITEMSELECT, this.onMenuItemSelect);
        this.draw();
    },

    getMenu: function ()
    {
        return this.menu;
    },

    onMenuItemSelect: function(event)
    {
        this.dispatchEvent(new sp.ui.menu.MenuEvent(this, sp.ui.menu.MenuEvent.ITEMSELECT, event.index, event.data, event.originalTarget, event.originalEvent));
    },

    setMenuDataProvider: function (array)
    {
        this.menu.setDataProvider(array);
        this.menu.hide();
    },

    draw: function()
    {
        var __this = this;
        var graphic = $(this.getGraphic());
        graphic.click(function (event) { event.stopPropagation();  __this.onButtonClick() });
        $(document).click(function (event) {__this.hideMenu();})
    },

    hideMenu: function()
    {
        $(this.menu.getGraphic()).slideUp();
        this.menuVisible = false;
    },

    showMenu: function()
    {
        $(this.menu.getGraphic()).slideDown();
        this.menuVisible = true;
    },

    onButtonClick: function ()
    {
        var menu = this.menu;
        var graphic = $(this.getGraphic());
        var buttonPosition = graphic.offset();
        $(menu.getGraphic()).css(
            {
                "left": buttonPosition.left + this.offsetLeft + 'px',
                "top": buttonPosition.top + parseInt(graphic.height()) + this.offsetTop + 'px',
                "zIndex": 100
            });

        if (this.menuVisible)
        {
            this.hideMenu();
        } else
        {
            this.showMenu();
        }
    }
}
);