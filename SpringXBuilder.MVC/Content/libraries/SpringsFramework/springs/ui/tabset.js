sp.namespace("sp.ui.tabset.TabSet",
             "sp.ui.tabset.TabSetOptions",
             "sp.ui.tabset.TabSetEvent");

sp.ui.tabset.TabSet = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(options, graphic)
    {
        this.__super(graphic);
        this.options = options || new sp.ui.tabset.TabSetOptions();
        this.init();
    },

    init: function()
    {
        this.tabs = [];
        this.pages = [];
        this.ul = document.createElement("ul");
        $(this.getGraphic()).append(this.ul);
        var guid = sp.guid();
        for (var i = 0; i < this.options.labels.length; i++)
        {
            var id = (this.options.ids)? this.options.ids[i] : guid + "_" + i;
            var title = (this.options.titles)? this.options.titles[i] : '';
            var li = document.createElement("li");
            this.tabs.push(li);
            $(li).html("<a href='#" + id + "' title='" + title + "'>" + this.options.labels[i] + "</a>");
            $(this.ul).append(li);
            var tab = document.createElement("div");
            $(tab).prop("id", id);
            this.pages.push(tab);
            $(this.getGraphic()).append(tab);
        }
    },

    addTab: function(id, label, content)
    {
        id = id || sp.guid();
        if (id[0] != '#') id = '#'+id; // jquery requires # in front of id
        this._newTabContent = content;
        $(this.getGraphic()).tabs('add', id, label);
        var str = id;
        var a = $(this.getGraphic()).find("a[href='"+id +"'] span")[0];
        return a; // return the actual text label..
    },

    removeTab: function(id)
    {
        $(this.getGraphic()).tabs('remove', id);
        for (var i = 0, page = this.pages[i]; i < this.pages.length; i++, page = this.pages[i])
        {
            if (!page) continue;
            // removing the content from this.page
            if ((id === page.id) || (id === '#' + page.id))
            {
                this.pages.splice(i, 1);
                break;
            }
        }
    },

    removeAllTabs: function()
    {
        var tab_count = $(this.getGraphic()).tabs('length');
        for (var i=0; i<tab_count; i++){
            $(this.getGraphic()).tabs( "remove" , 0 );
        }
        this.tabs = [];
        this.pages = [];
    },

    getTab: function(index)
    {
        return this.tabs[index];
    },

    getSelectedTabId: function()
    {
        return $(this.getGraphic()).tabs('option', 'selected');
    },

    selectTab: function(index)
    {
        $(this.getGraphic()).tabs('select', index);
    },

    getPage: function(index)
    {
        return this.pages[index];
    },

    build: function()
    {
        var __this = this;
        $(this.getGraphic()).tabs({ add: $.proxy( this.onTabAdd, this ) });
        $(this.getGraphic()).off('tabsshow');
        $(this.getGraphic()).bind("tabsshow", function(event, ui) { __this.onTabShow(event, ui) });
    },

    onTabAdd: function (event, ui)
    {
        $(ui.panel).append(this._newTabContent);
        this._newTabContent = null;
        this.tabs.push(ui.tab);
        this.pages.push(ui.panel);
    },

    onTabShow: function(event, ui)
    {
        this.dispatchEvent(new sp.ui.tabset.TabSetEvent(this, sp.ui.tabset.TabSetEvent.TABSSHOW, ui.index, ui.tab.hash));
    }
}
);


sp.ui.tabset.TabSetOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.labels = [];
    }
}
);


sp.ui.tabset.TabSetEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target, type, selectedTabId, selectedTabHash)
    {
        this.__super(target,type);
        this.selectedTabId = selectedTabId;
        this.selectedTabHash = selectedTabHash;
    }
}
);
sp.ui.tabset.TabSetEvent.TABSSHOW = "tabsshow";
