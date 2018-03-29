sp.namespace("sp.ui.sidebar.Sidebar",
             "sp.ui.sidebar.SidebarOptions");


sp.ui.sidebar.Sidebar = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(sidebarContainer, options)
    {
        if (!sidebarContainer)
        {
            sidebarContainer = document.createElement("div");
            $($("body")[0]).append(sidebarContainer);
        }
        this.sidebarContainer = sidebarContainer;

        var sidebarContent = document.createElement("div");
        $(sidebarContent).addClass("springs-sidebar-content");
        $(sidebarContainer).append(sidebarContent);
        this.__super(sidebarContent);

        this.options = options || new sp.ui.sidebar.SidebarOptions();
        this.__init();
    },

    __init: function()
    {
        var __this = this;
        this.sidebarIsOpened = false;

        $(this.sidebarContainer).addClass("springs-sidebar");

        if (this.options.sidebarPosition == "right")
        {
            $(this.sidebarContainer).css({position: 'absolute', top: '0', right: '0', width: '0', 'min-height':'100%'});
        }
        else
        {
            $(this.sidebarContainer).css({position: 'absolute', top: '0', left: '0', width: '0', 'min-height':'100%'});
        }

        if (this.options.sidebarHeight)
        {
            $(this.sidebarContainer).css({'min-height': this.options.sidebarHeight, height: this.options.sidebarHeight, 'max-height': this.options.sidebarHeight});
        }

        if (this.options.sidebarOpenButton)
        {
            $(this.options.sidebarOpenButton).click(function(){
                __this.open();
            });
        }

        if (this.options.sidebarCloseButton)
        {
            $(this.options.sidebarCloseButton).click(function(){
                __this.close();
            });
        }
    },

    addCssClass: function(cssClass)
    {
        $(this.sidebarContainer).addClass(cssClass);
    },

    open: function()
    {
        var __this = this;
        this.sidebarIsOpened = true;
        $(this.sidebarContainer).animate({ width: this.options.sidebarWidth || 250 }, {
            duration: this.options.easeDuration || 400,
            easing: 'linear',
            complete: function(){__this.onOpen();}
        });
    },

    close: function()
    {
        var __this = this;
        this.sidebarIsOpened = false;
        $(this.sidebarContainer).animate({ width: 0 }, {
            duration: this.options.easeDuration || 400,
            easing: 'linear',
            complete: function(){__this.onClose();}
        });
    },

    onOpen: function()
    {
        // overwrite if necessary
    },

    onClose: function()
    {
        // overwrite if necessary
    },

    setSidebarWidth: function(newWidth)
    {
        if (!newWidth) return;
        this.options.sidebarWidth = newWidth;
        if (this.sidebarIsOpened)
        {
            $(this.sidebarContainer).animate({ width: this.options.sidebarWidth || 250 }, {
                duration: this.options.easeDuration || 400,
                easing: 'linear'
            });
        }
    },

    isOpened: function()
    {
        return this.sidebarIsOpened;
    },

    populate: function()
    {
        // overwrite to populate fields with data..
    }
}
);

sp.ui.sidebar.SidebarOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults:function()
    {
        this.sidebarPosition = "left";
        this.sidebarWidth = 250;
        this.easeDuration = 400;
        this.sidebarHeight = "";
        this.sidebarOpenButton = "";
        this.sidebarCloseButton = "";
    }
}
);