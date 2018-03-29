sp.namespace("spx.model.format");



spx.model.format.Format = Class.extend
(
    {
        __constructor: function (xml)
        {
            this.xml = xml;
            this.init();
        },

        init:function()
        {
            // overwrite
        },

        format:function()
        {
            //overwrite
            return "";
        }
    }
);

spx.model.format.Date = spx.model.format.Format.extend
(
     {
        init:function()
        {
            this.dateFormat = spx.evaluate($(this.xml).find("[id='format']").text()) || spx.model.format.Date.DEFAULT;
        },

        format:function(val)
        {
            var date = new spx.core.Date(val);
            return date.toFormattedString(this.dateFormat);
        },

        getFormat:function()
        {
            return this.dateFormat;
        },

         toString:function()
         {
            var str = "[Date, format:" + this.format  +"]";
            return str;
         }
    }
);
spx.model.format.Date.DEFAULT = $.datepicker.ATOM;

spx.model.format.Number = spx.model.format.Format.extend
(
    {
        init:function()
        {
            this.places = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","places") || "2";
            this.decimals = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","decimals") || ".";
            this.thousands = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","thousands") || ",";
            this.signed = sp.core.data.DataUtils.toBoolean(sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","signed"));
            this.symbol = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","symbol") || "";
            this.position = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","position") || "before";
            this.percentageSymbol = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","percentageSymbol");
            this.maxValue = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","maxValue") || Math.pow(2, 53);
            this.minValue = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","minValue") || -Math.pow(2, 53);
            var f = new sp.core.numeric.NumberFormat({  decimalPlaces:this.places,
                                                        decimalSeperator:this.decimals,
                                                        thousandSeperator:this.thousands,
                                                        signed:this.signed,
                                                        percentageSymbol:this.percentageSymbol,
                                                        currencySymbol:this.symbol,
                                                        symbolPosition:this.position,
                                                        maxValue:this.maxValue,
                                                        minValue:this.minValue});
            this.formatter = new sp.core.numeric.NumberFormatter(f);
        },

        format:function(val)
        {
            var str = this.formatter.getFormattedValue(val);
            if(this.signed && Number(val)>0) str = "+" + str;
            return str;
        },

        toString:function()
        {
            var str ="[Number format";
            str += "\n\tplaces:" + this.places;
            str += "\n\tdecimals:" + this.decimals;
            str += "\n\tthousands:" + this.thousands;
            str += "\n\tsigned:" + this.signed;
            str += "\n\tsymbol:" + this.symbol;
            str += "\n\tposition:" + this.position;
            return str;
        }
    }
);

spx.model.format.Text = spx.model.format.Format.extend
(
    {
        init:function()
        {
            this.maxchars = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","maxchars") || -1;
            this.allow = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","allow") || "";
            this.maxlength = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","maxlength") || -1;
            this.pattern = sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","pattern");
            this.type =  sp.utils.XMLUtils.getContentOfNodeByAttribute(this.xml,"id","type") || "text";
        },

        format:function(val)
        {
            val = val || "";
            var max = (this.maxlength!=-1)? this.maxlength : this.maxchars;
            if(max!=-1) val = val.substr(0,max);
            if(this.allow)
            {
                var result = "";
                for(var i=0; i<val.length; i++)
                {
                    var char = val.substr(i, 1);
                    if(this.allow.indexOf(char)!=-1) result += char;
                }
                val = result;
            }
            return val;
        }
    }
)

spx.model.format.FormatTypes =
{
    NUMBER:"number",
    DATE:"date",
    TEXT:"text"
};

spx.model.format.FormatFactory =
{
    create:function(node)
    {
        switch(node.getAttribute("type"))
        {
            case spx.model.format.FormatTypes.NUMBER:
                return new spx.model.format.Number(node);
            case spx.model.format.FormatTypes.TEXT:
                return new spx.model.format.Text(node);
            case spx.model.format.FormatTypes.DATE:
                return new spx.model.format.Date(node);
        }
    }
}

