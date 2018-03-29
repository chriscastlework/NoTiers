sp.namespace("sp.ui.RadioGroup",
             "sp.ui.RadioGroupOptions");


sp.ui.RadioGroup = sp.core.graphics.Graphic.extend
(
    {
        __constructor:function(groupID,options)
        {
            this.__super();
            this.groupID = groupID || sp.guid();
            this.options = options || new sp.ui.RadioGroupOptions();
            this.init();
        },

        init:function()
        {

        },

        onChange:function(event)
        {
            this.dispatchEvent(new sp.core.events.SelectionEvent(this,sp.core.events.SelectionEvent.SELECT, this.getSelectedValue(), event));
        },

        setDataProvider:function(data)
        {
            this.dataProvider = (data.getHTML)? data : new sp.core.data.RadioGroupData(data, new sp.core.data.RadioGroupDataOptions({idProp:this.options.idProp, labelProp:this.options.labelProp}));
            this.dataProvider.addEventListener(this,sp.core.data.DataEvent.CHANGE, this.draw)
            this.draw();
        },

        draw:function()
        {
            this.clear();
            $(this.getGraphic()).html(this.dataProvider.getHTML(this.groupID,this.options) || "");
            var __this = this;
            $(this.getGraphic()).change(function(){__this.onChange()});
        },

        getSelectedValue:function()
        {
            return $("input[name="+this.groupID+"]:checked").val();
        },

        setSelectedValue:function(val)
        {
           // $(this.getGraphic()).val(val);
        },

        getSelectedLabel:function()
        {
            return this.dataProvider.valueToLabel(this.getSelectedValue());
        },

        setSelectedLabel:function(val)
        {
            this.setSelectedValue(this.dataProvider.labelToValue(val));
        },

        getSelectedIndex:function()
        {
            return this.dataProvider.valueToIndex(this.getSelectedValue());
        },

        setSelectedIndex:function(val)
        {
            this.setSelectedValue(this.dataProvider.getValue(val));
        }
    }
);

sp.ui.RadioGroupOptions = sp.core.data.ValueObject.extend
    (
        {
            setDefaults:function()
            {
                this.idProp = "ID";
                this.labelProp = "Label";
                this.direction = "horizontal";
            },
            toString:function()
            {
                sp.out("RadioGroupOptions, idProp:" + this.idProp + " labelProp:" + this.labelProp + " direction:" + this.direction);
            }
        }
    )