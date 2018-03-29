sp.namespace("spx.utils.Deleter");


spx.utils.Deleter = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function()
        {
            this.__super();
            this.init();
        },

        init:function()
        {
            this.elements = [];
        },

        add:function(element,id)
        {
            $(element).addClass("deletable");
            $(tr).addClass("deletable");
            var deleteButton = this.createElement("div",{},["delete"]);
            $(deleteButton).data("rowData", this.data[i]);
            $(deleteButton).click(function(){__this.onDeleteRow()});
            $(tr).append(deleteButton);
        }

    }
);
spx.utils.Deleter.getInstance = function()
{
    if(!this.INSTANCE) this.INSTANCE = new spx.utils.Deleter();
    return this.INSTANCE;
}

spx.utils.isNumber = function(val)
{
    return (isNaN(Number(val)))? false : true;
}
spx.utils.toNumber = function(val)
{
    return (spx.Utils.isNumber(val))? Number(val) : 0;
}