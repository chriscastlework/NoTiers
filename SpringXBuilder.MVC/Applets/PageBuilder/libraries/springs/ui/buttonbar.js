sp.namespace("sp.ui.buttonbar.ButtonBar",
             "sp.ui.buttonbar.ButtonBarOptions");



sp.ui.buttonbar.ButtonBar = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(graphic, options)
    {
        this.__super(graphic);
        this.options = options || new sp.ui.buttonbar.ButtonBarOptions();
        this.init();
    },

    init: function()
    {
        this.table = this.addElement(this.createElement("table", {}, [this.options.tableClass], { "cellspacing": "0" }));
        this.row = this.createElement("tr");
        $(this.row).addClass(this.options.rowClass);
        $(this.table).append(this.row);
    },

    addButton: function(id, label, cssClass, title)
    {
        var button = this.createElement("td", {}, [this.options.buttonClass], null, {title: title}, label);
        $(button).data("id", id);
        if (cssClass) $(button).addClass(cssClass);
        var __this = this;
        $(button).mousedown(function() { $(this).addClass("selected")});
        $(button).mouseup(function() { $(this).removeClass("selected") });
        $(button).click(function(event) { __this.onClickButton(this, event) });
        $(this.row).append(button);
        var w = this.options.width || (100 / this.row.childNodes.length)+"%";
        for (var i = 0; i < this.row.childNodes.length; i++)
        {
            $(this.row.childNodes[i]).css("width", w);
        }
    },

    removeButton: function(id)
    {
        for (var i = 0; i < this.row.childNodes.length; i++)
        {
            var button = this.row.childNodes[i];
            if ($(button).data('id') == id)
            {
                button.parentNode.removeChild(button);
            }
        }
    },

    onClickButton: function(button, event)
    {
        var id = $(button).data("id");
        var e = new sp.core.events.ButtonEvent(this, sp.core.events.MouseEvent.CLICK, $(button).data("id"));
        e.originalEvent = event;
        this.dispatchEvent(e);
    },

    disable: function(id)
    {

    },

    enable: function(id)
    {

    },

    isEnabled: function(id)
    {

    }

}
);

sp.ui.buttonbar.ButtonBarOptions = sp.core.data.ValueObject.extend
(
{   
    setDefaults:function()
    {
        this.buttonClass = "button";
        this.rowClass = "button_row";
        this.tableClass = "buttonBar";
        this.width = 'auto';
     }
}   
);
