sp.namespace("sp.ui.Selection",
             "sp.ui.SelectionWithPlaceholder",
             "sp.ui.SelectionOptions");


sp.ui.Selection = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(options, isWithPlaceholder)
    {
        if (isWithPlaceholder) this.__super()
        else this.__super(this.createElement("select"));
        this.options = options || new sp.ui.SelectionOptions();
        if (!this.options.idProp) this.options.idProp = "ID";
        if (!this.options.labelProp) this.options.labelProp = "Label";
        this.init();
    },

    init:function()
    {
        this.__enabled = true;
        var __this = this;
        $(this.getGraphic()).change(function(event){__this.onChange(event)});
    },

    onChange:function(event)
    {
        this.__isOpen = false;
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));  //for compatibility with sp.ui.inputs.MultiInputTypes.SELECTION
        this.dispatchEvent(new sp.core.events.SelectionEvent(this,sp.core.events.SelectionEvent.SELECT, this.getSelectedValue(), event));
    },

    setDataProvider:function(data)
    {
      if(!data) return;
      var val = this.getSelectedValue();
      this.dataProvider = (data.getHTML)? data : new sp.core.data.SelectionData(data, new sp.core.data.SelectionDataOptions({idProp:this.options.idProp, labelProp:this.options.labelProp, clearableSelection:this.options.clearableSelection}));
      this.dataProvider.addEventListener(this,sp.core.data.DataEvent.CHANGE, this.draw);
      this.draw();
      this.setSelectedValue(val);
    },

    getDataProvider:function()
    {
        return this.dataProvider;
    },

    setHTML:function(html)
    {
        $(this.getGraphic()).html(html);
    },

    getHTML:function()
    {
        return $(this.getGraphic()).html();
    },

    draw:function()
    {
        this.clear();
        $(this.getGraphic()).html(this.dataProvider.getHTML() || "");
    },

    getSelectedValue:function()
    {
        var selectedVal = $(this.getGraphic()).val();
        if (this.options.showInactiveValue && this.inactiveItem)
        {
            sp.utils.ArrayUtils.removeElement(this.dataProvider.data, this.inactiveItem);
            this.draw();
            this.setSelectedValue(selectedVal);
            this.options.showInactiveValue = false;
        }
        return selectedVal;
    },

    getValue: function()  //for compatibility with sp.ui.inputs.MultiInputTypes.SELECTION
    {
        return this.getSelectedValue();
    },

    setSelectedValue:function(val)
    {
        if (this.options.showInactiveValue && (!this.dataProvider.valueToIndex(val)))
        {
            if (val==null || val==undefined || val == "") return;
            this.inactiveItem = {};
            this.inactiveItem[this.options.idProp] = val;
            this.inactiveItem[this.options.labelProp] = val;
            this.dataProvider.append(this.inactiveItem);
        }
        $(this.getGraphic()).val(val);
    },

    setValue: function(val) //for compatibility with sp.ui.inputs.MultiInputTypes.SELECTION
    {
        this.setSelectedValue(val);
    },

    getSelectedLabel:function()
    {
        return this.dataProvider.valueToLabel(this.getSelectedValue());
    },

    clearSelection:function()
    {
        this.getGraphic().removeAttribute("selected");
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
    },

    setEnabled:function(val)
    {
        this.__enabled = val;
        this.getGraphic().removeAttribute("disabled");
        if(!this.__enabled) this.getGraphic().setAttribute("disabled","disabled");
    },

    getEnabled:function()
    {
        return this.__enabled;
    }
}
);

sp.ui.SelectionOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults:function()
    {
        this.idProp = "ID";
        this.labelProp = "Label";
        this.clearableSelection = false;
        this.showInactiveValue = false; //choose whether to show an xml field value which is no longer present in the selection data
    }
}
);

//Couldn't make "usePlaceholder" a SelectionOption because it was breaking some of the already done applets
sp.ui.SelectionWithPlaceholder = sp.ui.Selection.extend
(
{
    __constructor:function(options)
    {
        this.__super(options, true);
    },

    init:function()
    {
        this.__enabled = true;
    },

    setHTML:function(html)
    {
        $(this.select).html(html);
    },

    getHTML:function()
    {
        return $(this.select).html();
    },

    draw:function()
    {
        var __this = this;
        this.clear();
        this.select = null;
        this.placeholder = null;

        this.select = this.createElement("select", {}, []);
        $(this.select).html(this.dataProvider.getHTML() || "");
        $(this.getGraphic()).append(this.select);
        $(this.select).change(function(event){__this.onChange(event)});

        this.placeholder = sp.core.graphics.create('input', {classes:['combo_value_holder']});
        $(this.getGraphic()).append(this.placeholder.getGraphic());
        $(this.placeholder.getGraphic()).focus($.proxy(this.onPlaceholderFocus, this));

        $(this.select).hide();
        $(this.select).blur($.proxy(this.onSelectionBlur, this));
        if (!sp.isOnTablet())
        {
            $(this.getGraphic()).click($.proxy(this.onViewClick, this));
            this.clicks = 0;
        }
    },

    getSelectedValue:function()
    {
        var selectedVal =  $(this.select).val();
        if (this.options.showInactiveValue && this.inactiveItem)
        {
            sp.utils.ArrayUtils.removeElement(this.dataProvider.data, this.inactiveItem);
            this.draw();
            this.setSelectedValue(selectedVal);
            this.options.showInactiveValue = false;
        }
        if (this.placeholder)
        {
            $(this.placeholder.getGraphic()).val(this.dataProvider.valueToLabel(selectedVal)).show();
            $(this.select).hide()
        }
        return selectedVal;
    },

    setSelectedValue:function(val)
    {
        if (this.options.showInactiveValue && (!this.dataProvider.valueToIndex(val)))
        {
            if (val==null || val==undefined || val == "") return;
            this.inactiveItem = {};
            this.inactiveItem[this.options.idProp] = val;
            this.inactiveItem[this.options.labelProp] = val;
            this.dataProvider.append(this.inactiveItem);
        }
        $(this.select).val(val);
        $(this.placeholder.getGraphic()).val(this.dataProvider.valueToLabel(val)).show();
        $(this.select).hide()
    },

    clearSelection:function()
    {
        this.select.removeAttribute("selected");
    },

    setEnabled:function(val)
    {
        this.__enabled = val;
        this.select.removeAttribute("disabled");
        this.placeholder.getGraphic().removeAttribute("disabled");
        if(!this.__enabled)
        {
            this.select.setAttribute("disabled","disabled");
            this.placeholder.getGraphic().setAttribute("disabled","disabled");
        }
    },

    fireDoubleClick: function()
    {
        this.clicks = 0;
        this.dispatchEvent(new sp.core.events.MouseEvent(this, sp.core.events.MouseEvent.DOUBLECLICK));
    },

    onClickTimeout: function()
    {
        this.clicks = 0;
    },

    onViewClick: function()
    {
        this.clicks++;
        if (this.clicks == 2) this.fireDoubleClick();
        if (this.clickTimeout) clearTimeout(this.clickTimeout);
        this.clickTimeout = setTimeout($.proxy(this.onClickTimeout, this), 500);
    },

    onPlaceholderFocus: function()
    {
        $(this.placeholder.getGraphic()).hide();
        $(this.select).show();
        $(this.select).focus();

        var ua = navigator.userAgent.toString().toLowerCase();
        if (!(ua.indexOf('firefox') != -1))
        {
            //IE 8-9/chrome/safari handle events differently than ff so we have to manually dispatch click in combobox inside table cell to select the table row
            $(this.select).click();
        }
    },

    onSelectionBlur: function()
    {
        if($(this.select).is(':visible')) this.onChange();
    }
}
);