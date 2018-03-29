sp.namespace("sp.ui.inputs.MultiInput",
             "sp.ui.inputs.MultiInputOptions",
             "sp.ui.inputs.MultiInputTypes");


sp.ui.inputs.MultiInput = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(options)
    {
        this.__super();
        this.options = options || new sp.ui.inputs.MultiInputOptions();
        this.init();
    },

    init: function()
    {
        var __this = this;

        switch (this.options.type)
        {
            case sp.ui.inputs.MultiInputTypes.TEXT:
            default:
                this.__graphic = this.addElement(this.createElement("input", this.options.inputStyle, [this.options.inputClass], { type: "text" }));
                $(this.getGraphic()).change(function() { __this.onChange() });
                if (this.options.useTextCounter) this.textCounter = new sp.ui.TextCounter(this.getGraphic(), this.options);
                break;
            case sp.ui.inputs.MultiInputTypes.TEXTAREA:
                this.__graphic = this.addElement(this.createElement("textArea", this.options.inputStyle, [this.options.inputClass]));
                $(this.getGraphic()).change(function() { __this.onChange() });
                if (this.options.useTextCounter) this.textCounter = new sp.ui.TextCounter(this.getGraphic(), this.options);
                if (this.options.autogrow)
                {
                    $(this.getGraphic()).css("padding-top", "0"); //to avoid showing vertical scrollbar
                    $(this.getGraphic()).css("padding-bottom", "0"); //to avoid showing vertical scrollbar
                    $(this.getGraphic()).keydown($.proxy(this.onKeyDown, this));
                    $(this.getGraphic()).change($.proxy(this.onKeyDown, this));
                    $(this.getGraphic()).bind('paste', $.proxy(this.onKeyDown, this));
                    $(this.getGraphic()).bind('cut', $.proxy(this.onKeyDown, this));
                }
                break;
            case sp.ui.inputs.MultiInputTypes.NUMERIC:
                this.__graphic = this.addElement(this.createElement("input", this.options.inputStyle, [this.options.inputClass], { type: "text" }));
                this.controller = new sp.core.numeric.NumericInput(this.getGraphic(), this.options.numberFormat, this.options.useButtons, this.options.numberFormatter, this.options.allowBlankValue);
                $(this.getGraphic()).change(function() { __this.onChange() });
                break;
            case sp.ui.inputs.MultiInputTypes.CURRENCY:
                this.__graphic = this.addElement(this.createElement("input", this.options.inputStyle, [this.options.inputClass], { type: "text" }));
                this.controller = new sp.core.numeric.NumericInput(this.getGraphic(), new sp.core.numeric.NumberFormat({
                    currencySymbol: this.options.currencySymbol,
                    decimalPlaces: this.options.decimalPlaces,
                    thousandSeperator: this.options.thousandsSeparator,
                    decimalSeperator: this.options.decimalSeparator,
                    symbolPosition : this.options.symbolPosition
                }));
                this.controller.addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onChange);
                break;
            case sp.ui.inputs.MultiInputTypes.PERCENT:
                this.__graphic = this.addElement(this.createElement("input", this.options.inputStyle, [this.options.inputClass], { type: "text" }));
                this.controller = new sp.core.numeric.NumericInput(this.getGraphic(), new sp.core.numeric.NumberFormat({ percentageSymbol: this.options.percentageSymbol }));
                this.controller.addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onChange);
                break;
            case sp.ui.inputs.MultiInputTypes.DATE:
                this.__graphic = this.addElement(this.createElement("input", this.options.inputStyle, [this.options.inputClass], { type: "text" }));
                this.controller = new sp.core.date.DateField(this.getGraphic(), this.options.dateFormat, this.options);
                this.controller.addEventListener(this,sp.core.data.DataEvent.CHANGE,this.onChange);
                break;
            case sp.ui.inputs.MultiInputTypes.SELECTION:
                this.__graphic = this.addElement(this.createElement("select", this.options.inputStyle, [this.options.inputClass]));
                $(this.__graphic).append(this.options.selection.getHTML());
                $(this.getGraphic()).change(function() { __this.onChange() });
                break;
            case sp.ui.inputs.MultiInputTypes.CHECKBOX:
                this.__graphic = this.addElement(this.createElement("input", this.options.inputStyle, [this.options.inputClass], { type: "checkbox" }));
                $(this.getGraphic()).change(function() { __this.onChange() });
        }
    },

    onChange: function()
    {
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
    },

    getValue: function()
    {
        var placeholder = $(this.getGraphic()).attr('_placeholder');
        if (placeholder && placeholder === $(this.getGraphic()).val()) return '';

        switch (this.options.type)
        {
            case sp.ui.inputs.MultiInputTypes.TEXT:
            default:
                return $(this.getGraphic()).val();
            case sp.ui.inputs.MultiInputTypes.TEXTAREA:
                return $(this.getGraphic()).val();
            case sp.ui.inputs.MultiInputTypes.NUMERIC:
            case sp.ui.inputs.MultiInputTypes.CURRENCY:
            case sp.ui.inputs.MultiInputTypes.PERCENT:
                return this.controller.getData();
            case sp.ui.inputs.MultiInputTypes.DATE:
                return this.controller.getDateString();
            case sp.ui.inputs.MultiInputTypes.SELECTION:
                return $(this.getGraphic()).val();
            case sp.ui.inputs.MultiInputTypes.CHECKBOX:
                return ($(this.getGraphic()).attr("checked")) ? true : false;
        }
    },

    setValue: function(val)
    {
        switch (this.options.type)
        {
            case sp.ui.inputs.MultiInputTypes.TEXT:
            default:
                $(this.getGraphic()).val(sp.utils.XMLUtils.unescapeFromHTML(val));
                break;
            case sp.ui.inputs.MultiInputTypes.TEXTAREA:
                $(this.getGraphic()).val(sp.utils.XMLUtils.unescapeFromHTML(val));
                if (this.options.autogrow) this.onKeyDown();
                break;
            case sp.ui.inputs.MultiInputTypes.NUMERIC:
            case sp.ui.inputs.MultiInputTypes.CURRENCY:
            case sp.ui.inputs.MultiInputTypes.PERCENT:
                this.controller.setData(val);
                break;
            case sp.ui.inputs.MultiInputTypes.DATE:
                this.controller.setDate(val);
                break;
            case sp.ui.inputs.MultiInputTypes.SELECTION:
                $(this.getGraphic()).get(0).selectedIndex = 0;
                $(this.getGraphic()).val(val);
                break;
            case sp.ui.inputs.MultiInputTypes.CHECKBOX:
                if (sp.core.data.DataUtils.toBoolean(val))
                {
                    $(this.getGraphic()).attr("checked", "checked");
                }
                else
                {
                    $(this.getGraphic()).removeAttr("checked");
                }
                break;
        }
        if (this.hasPlaceholder) this.onPlaceholderBlur();
    },

    onKeyDown: function()
    {
        var $el = $(this.getGraphic());
        var minHeight = this.options.autogrowTextAreaMinHeight;
        setTimeout(function(){
            $el.height(0);
            var scrollHeight = $el[0].scrollHeight;
            var newHeight = scrollHeight >= minHeight ? scrollHeight : minHeight;
            $el.height(newHeight);
        }, 0);
    }
}
);

sp.ui.inputs.MultiInputOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults:function()
    {
        this.inputStyle = {};
        this.inputClass = "";
        this.type = "text";
        this.decimalPlaces = 0;
        this.dateFormat = null;
        this.currencySymbol = "$";
        this.currencyPosition = "before";
        this.thousandsSeparator = ",";
        this.decimalSeparator = ".";
        this.selection = null; // when required, an instance of [ws.core.data.SelectionData] or [sp.core.data.SelectionData]
        this.useTextCounter = false;
        this.textLimit = 255;
        this.warnAt = 50;
        this.autogrow = false; //for textarea type only
        this.autogrowTextAreaMinHeight = 20; //for textarea type only
        this.numberFormatter = "";  //for numeric only
        this.numberFormat = "";     //for numeric only
        this.useButtons = false;    //for numeric only
        this.allowBlankValue = false;
        this.changeMonth = false;
        this.changeYear = false;
        this.numberOfMonths = 1;
    }
}
);

sp.ui.inputs.MultiInputTypes =
{
    NUMERIC:"numeric",
    CURRENCY:"currency",
    PERCENT:"percent",
    TEXT:"text",
    TEXTAREA:"textarea",
    SELECTION:"selection",
    DATE:"date",
    CHECKBOX:"checkbox"
};

