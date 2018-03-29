sp.namespace("sp.ui.key");

sp.ui.key.Key = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(options)
    {
        this.__super();
        this.options = options || new sp.ui.key.KeyOptions();
        this.table = this.addElement(this.createElement("table"));
        $(this.table).addClass(this.options.keyClass);
        this.rows = [];
    },

    addRow: function(id, label, value)
    {
        var tr = this.createElement("tr", {}, [this.options.rowClass]);
        tr = this.options.renderer.render(tr, id, label, value, this.options.widths[this.rows.length], this.options);
        $(tr).data("id", id);
        $(this.table).append(tr)
        this.rows.push(tr);
    },

    editRow: function(id, label, value)
    {
        for (var i = 0; i < this.rows.length; i++)
        {
            if ($(this.rows[i]).data("id") == id)
            {
                $(this.rows[i]).empty();
                this.rows[i] = this.options.renderer.render(this.rows[i], id, label, value, this.options.widths[this.rows.length], this.options);
            }
        }
    }

}
);

sp.ui.key.KeyRenderer = Class.extend
(
{
    render: function(row, id, label, value, width, options)
    {
        var l = document.createElement("td");
        var v = document.createElement("td");
        $(l).addClass(options.labelClass);
        $(v).addClass(options.valueClass);
        $(l).html(label);
        $(v).html(value);
        $(row).append(l);
        $(row).append(v);
        return row;
    }
}
);

sp.ui.key.KeyOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults: function()
    {
        this.renderer = new sp.ui.key.KeyRenderer();
        this.widths = ["50%", "50%"];
        this.keyClass = "key";
        this.rowClass = "row";
        this.labelClass = "label";
        this.valueClass = "value";
     }
}
);