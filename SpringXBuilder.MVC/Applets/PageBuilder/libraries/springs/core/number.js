sp.namespace("sp.core.numeric.NumericInput",
             "sp.core.numeric.NumberFormat",
             "sp.core.numeric.NumberFormatter");

sp.core.numeric.NumericInput = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(graphic, format, useButtons, numberFormatter, allowBlankValue) {
        this.data = "";
        $(graphic).attr("id", sp.guid());
        this.__super(graphic);
        this.format = format || new sp.core.numeric.NumberFormat();
        this.formatter = numberFormatter || new sp.core.numeric.NumberFormatter(this.format);
        this.useButtons = useButtons != null ? useButtons : false;
        this.allowBlankValue = allowBlankValue || false;
        this.init();
    },

    init: function() {
        var __this = this;
        if (this.useButtons == true) {
            this.drawButtons();
            this.addEventListener(this, sp.core.events.ButtonEvent.CLICK, this.buttonClicked);
        }
        $(document).on("keypress", "#" + $(this.getGraphic()).attr("id"), function(event) {
            return __this.onKeyPress(event);
        });
        $(document).on("keyup", "#" + $(this.getGraphic()).attr("id"), function(event) {
            return __this.onKeyUp(event);
        });
        $(document).on("change", "#" + $(this.getGraphic()).attr("id"), function(event) {
            __this.onChanged();
        });

        sp.out("NumericInput...");
        $(this.getGraphic()).val(this.data);

        $(this.getGraphic()).focus(function() { $(this).select(); });
        $(this.getGraphic()).mouseup(function(e){ e.preventDefault(); });
    },
    buttonClicked: function(event) {
        var dat = Number(this.formatter.getUnFormattedValue($(this.getGraphic()).val()));
        if (event.id == "PLUSBUTTON") {
            if (dat < this.format.maxValue) dat++;
            else dat = this.format.minValue;
        }
        else if (event.id == "MINUSBUTTON") {
            if (dat > this.format.minValue) dat--;
            else dat = this.format.maxValue;
        }
        this.setData(dat);
    },
    drawButtons: function() {
        var __this = this;
        var container = $(this.getGraphic()).parent();
        $(container).append(this.inputContainer);
        $(this.getGraphic()).addClass("numericInputButtonsField");
        this.buttonsContainer = this.createElement("div", {}, ["numericInputButtonsContainer"]);
        $(container).append(this.buttonsContainer);
        this.plusButton = this.createElement("div", {}, ["numericInputPlusButton"], { id: sp.guid() });
        $(this.buttonsContainer).append(this.plusButton);
        $(document).on("click", "#" + $(this.plusButton).attr("id"), function(event) {
            __this.dispatchEvent(new sp.core.events.ButtonEvent(this, sp.core.events.ButtonEvent.CLICK, "PLUSBUTTON"));
        });
        this.minusButton = this.createElement("div", {}, ["numericInputMinusButton"], { id: sp.guid() });
        $(this.buttonsContainer).append(this.minusButton);
        $(document).on("click", "#" + $(this.minusButton).attr("id"), function(event) {
            __this.dispatchEvent(new sp.core.events.ButtonEvent(this, sp.core.events.ButtonEvent.CLICK, "MINUSBUTTON"));
        });
    },
    onChanged: function() {
        var dat = this.data == null ? $(this.getGraphic()).val() : this.data;
        dat = this.formatter.getUnFormattedValue(dat);
        dat = this.checkNull(dat);
        $(this.getGraphic()).val(this.formatter.getFormattedValue(dat));
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
    },

    onKeyPress: function(evt) {
        var e = evt;
        var charCode = e.which || e.keyCode;
        var character = String.fromCharCode(charCode);
        var isFormattingChar = this.formatter.isFormattingCharacter(character);
        // charCode == 45 added, so we can include the '-' (dash) for the negative numbers
        if (!isNaN(character) || isFormattingChar || charCode == 8 || charCode == 46 || charCode == 45) {
            if (isFormattingChar && $(this.getGraphic()).val().indexOf(character) != -1)
                return false;
            else
            {
                var value = Number(this.formatter.getUnFormattedValue($(this.getGraphic()).val()) + character);
                if (value < this.formatter.format.getMinValue() || value > this.formatter.format.getMaxValue())
                {
                    return this.isTextSelected();
                }
                else
                {
                    return true;
                }
            }
        }
        else return false;
    },

    isTextSelected: function()
    {
        var input = this.getGraphic();
        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
    },

    onKeyUp: function(evt) {
        this.data = this.formatter.getUnFormattedValue($(this.getGraphic()).val());
    },

    getData: function() {
        return this.data;
    },

    setData: function(num) {
        num = this.formatter.stripIllegalChars(num);
        num = this.formatter.stripFormattingChars(num);
        this.data = this.checkNull(num);

        var dat = this.data == null ? $(this.getGraphic()).val() : this.data;
        dat = this.formatter.getUnFormattedValue(dat);
        dat = this.checkNull(dat);
        $(this.getGraphic()).val(this.formatter.getFormattedValue(dat));
    },

    getText: function() {
        return this.formatter.getFormattedValue($(this.getGraphic()).val());
    },

    setText: function(num) {
        this.data = this.checkNull(num);
        $(this.getGraphic()).val(this.data);
    },

    checkNull: function(num) {
        var isNull = false;
        var tNum = Number(num);
        if (isNaN(tNum)) {
            isNull = true;
        }
        else if (num == '') {
            isNull = true;
        }
        else if (num == null) {
            isNull = true;
        }
        if (isNull) {
            if (this.allowBlankValue)
                num = '';
            else
                num = 0;
        }
        return num;
    }
}
);

sp.core.numeric.NumberFormat = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap) {
        this.__super(valueMap);
    },

    setDefaults: function() {
        this.currencySymbol = "";
        this.percentageSymbol = "";
        this.decimalSeperator = ".";
        this.thousandSeperator = ",";
        this.decimalPlaces = 0;
        this.symbolPosition = "before";
        this.maxValue = Math.pow(2, 53);
        this.minValue = -Math.pow(2, 53);
    },

    getSymbolPosition:function()
    {
        return this.symbolPosition;
    },

    getCurrencySymbol: function() {
        return this.currencySymbol;
    },

    getPercentageSymbol: function() {
        return this.percentageSymbol;
    },

    getDecimalSeperator: function() {
        return this.decimalSeperator;
    },

    getThousandSeperator: function() {
        return this.thousandSeperator;
    },

    getDecimalPlaces: function() {
        return this.decimalPlaces;
    },
    
    getMaxValue: function() {
        return this.maxValue;
    },
    getMinValue: function() {
        return this.minValue;
    }
}
);

sp.core.numeric.NumberFormatter = Class.extend
(
{
    __constructor: function(format) {
        this.format = format || new sp.core.numeric.NumberFormat();
    },

    getFormattedValue: function(num) {
        num = (num > this.format.getMaxValue()) ? this.format.getMaxValue() : num;
        num = (num < this.format.getMinValue()) ? this.format.getMinValue() : num;
        if (this.format.currencySymbol) {
            return this.getFormattedCurrency(num);
        }
        else if (this.format.percentageSymbol) {
            return this.getFormattedPercentage(num);
        }
        else {
            return this.getFormattedNumber(num);
        }
    },

    getUnFormattedValue: function(num) {
        num = this.stripIllegalChars(num);
        num = this.stripFormattingChars(num);
        return num;
    },

    getFormattedNumber: function(num) {

        num = this.stripFormattingChars(num);
        if(isNaN(Number(num))) num = 0;
        var decPl = this.format.decimalPlaces != null ? this.format.decimalPlaces : 0;
        num = Number(num).toFixed(decPl);
        num = num.toString();
        num = num.replace(".",this.format.decimalSeperator);

        return (this.format.thousandSeperator) ? this.addCommas(num) : num;
    },

    getFormattedCurrency: function(num) {
        /*
        num = this.getFormattedNumber(num);
        num = (this.format.getSymbolPosition()=="after")?  num + this.format.currencySymbol : this.format.currencySymbol + num;
        console.log(num)
        return num;
         */
        var negativeSign = '';
        if(parseInt(num) < 0){ negativeSign = '-' };
        num = Math.abs(parseInt(num));
        num = this.getFormattedNumber(num);
        num = (this.format.getSymbolPosition()=="after")?  negativeSign + num + this.format.currencySymbol : negativeSign + this.format.currencySymbol + num;
        return num;

    },

    getFormattedPercentage: function(num) {
        num = this.getFormattedNumber(num);
        num = num + this.format.percentageSymbol;
        return num;
    },

    getRawValue: function(num) {
        return this.stripFormattingChars(num);
    },

    stripFormattingChars: function(num) {
        num = num || "";
        num = num.toString();
        num = num.replace(this.format.currencySymbol, "");
        num = num.replace(this.format.thousandSeperator, "");
        num = num.replace(this.format.decimalSeperator, ".");
        num = num.replace(this.format.percentageSymbol, "");
        return num;
    },

    stripIllegalChars: function(num) {
        var tNum = "";
        num = num || "";
        var numStr = num.toString();
        if (Number(num))
        {
            numStr = Number(num).toPrecision().toString(); //this fixes also bug with parsing when exponential notation is passed but only for large numbers 1.0e+11
            return numStr;
        }
        if (num.match(/^[-+]?[1-9]\.[0-9]+[eE][-+]?[1-9][0-9]*$/)) //this fixes bug with parsing when exponential notation is passed for small numbers like 1e-11
        {
            numStr = (+num).toFixed(this.getPrecision(num)).toString();
            return numStr;
        }
        for (var i = 0; i < numStr.length; i++) {
            var ch = numStr[i];
            if (!isNaN(Number(ch)) || this.isFormattingCharacter(ch)) tNum += ch;
        }
        return tNum;
    },

    getPrecision: function(scinum)
    {
        var arr = sp.core.utils.data.DataUtils.toArray(scinum.split('e'));
        var exponent = Math.abs(arr[1]);
        var precision = new Number(exponent);
        arr = arr[0].split('.');
        precision += arr[1].length;

        return precision;
    },

    addCommas: function(num) {
        var x = num.split(this.format.decimalSeperator);
        var x1 = x[0];
        var x2 = x.length > 1 ? x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + this.format.thousandSeperator + '$2');
        x2 = x2 != '' ? this.format.decimalSeperator + x2 : x2;
        num = x1 + x2;
        return num;
    },

    isFormattingCharacter: function(character) {
        return (character == this.format.decimalSeperator || character == this.format.currencySymbol || character == this.format.percentageSymbol)
    }
}
);
