sp.namespace("spx.model.layout.Element",
             "spx.model.layout.ElementFactory",
             "spx.model.layout.Page",
             "spx.model.layout.Container",
             "spx.model.layout.Component");

spx.model.layout.Element = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(data)
        {
            this.__super();
            this.data = data || sp.utils.XMLUtils.createEmptyXMLNode();

            var custom = spx.model.CustomFields.getField(this.getID()); // allows customisation of nodes via the <custom> tag..not usually used
            if(custom) this.data = sp.utils.XMLUtils.mergeXMLReplacingMultipleNodes(custom, this.data);
        },

        getData:function()
        {
            if(!this.data) this.data = sp.utils.XMLUtils.createEmptyXMLNode();
            return this.data;
        },

        getID:function()
        {
            if(!this.getAttribute("id")) this.getData().setAttribute("id",sp.guid());
            return this.getAttribute("id");
        },

        hasAttribute:function(attr)
        {
            return $(this.getData()).attr(attr) !== undefined;
            //return this.getData().hasAttribute(attr);
        },

        getAttribute:function(attr)
        {
            return (attr =="id")?  this.getData().getAttribute(attr) : spx.evaluate(this.getData().getAttribute(attr));
        },

        getRawAttribute:function(attr)
        {
            return this.data.getAttribute(attr);
        },

        getValue:function()
        {
            var txt = $(this.getData()).text();
            var evald = spx.evaluate($(this.getData()).text());
            return evald;
        },

        getNode:function(nodeName)
        {
            return spx.model.Strings.getInstance().getLocalOr($(this.getData()).find(nodeName)[0]);
        },

        getController:function()
        {
            return this.getAttribute("controller");
        },

        getType:function()
        {
            return "";
        },

        isAtomic:function()
        {
            return true;
        },

        getXML:function()
        {
            return this.getData();
        },

        getEnabled:function()
        {
            return (this.hasAttribute("enabled"))? sp.core.data.DataUtils.toBoolean(this.getAttribute("enabled")) : true;
        },

        getView:function()
        {
            // returns any view specified in the XML...allows us to specify custom views/models/controllers
            return this.getAttribute("view");
        }
    }
)

/*  Base classes */
spx.model.layout.AtomicElement = spx.model.layout.Element.extend
(
{
    __constructor:function(data)
    {
        this.__super(data);
        spx.model.Strings.getInstance().addEventListener(this,sp.core.data.DataEvent.CHANGE, this.onStringsChange);
        this.elements = [];
        this.styles = this.splitStyles();
        this.init();
    },

    isCustomised:function()
    {
        if(spx.model.CustomFields.getField(this.getID())) return true;
    },

    init:function()
    {

    },

    onStringsChange:function()
    {
        this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
    },

    getFormat: function()
    {
        var attr = this.getAttribute("format");
        if(attr) return spx.model.resources.Resources.getResource(attr);
        var node = $(this.getData()).find("format>*")[0];
        if(node)
        {
            return spx.model.resources.Resources.getResource(node);
        }
    },

    getType:function()
    {
        return "";
    },

    isAtomic:function()
    {
        return true;
    },

    getElements:function()
    {
        return this.elements;
    },

    getElement:function(id)
    {
        for(var i=0; i<this.elements.length; i++)
        {
            if(this.elements[i].getID()==id) return this.elements[i];
        }
    },

    getClass:function()
    {
        return this.getAttribute("class");
    },

    getToolTip:function()
    {
        return this.getAttribute("tooltip");
    },

    getStyle:function()
    {
        return this.getAttribute("style");
    },

    splitStyles:function()
    {
        var style = this.getStyle() || "";
        var styles = style.split(";");
        var result = {};
        for(var i=0; i<styles.length; i++)
        {
            var parts = styles[i].split(":");
            if(parts.length<2) continue;
            result[parts[0]] = parts[1];
        }
        return result;
    },

    getStyleProperty:function(prop)
    {
        return this.styles[prop] || "";
    },

    getColor: function()
    {
        return this.getAttribute('color');
    },

    getBackground: function(context)
    {
        var bg = this.getAttribute('background');
        if (bg != null && bg.indexOf("#") != 0) {
            bg = spx.model.resources.Resources.getResourceByID(bg, context);
        }
        return bg;
    },

    getBorder: function()
    {
        return this.getAttribute('border');
    },

    getVisible:function()
    {
        return (this.getRawAttribute("visible"))? sp.core.data.DataUtils.toBoolean(this.getAttribute("visible")) : true;
    },

    getWidth:function()
    {
        return this.getAttribute("width");
    },

    getBinding:function()
    {
        return this.getAttribute("binding");
    },

    getDataSource:function()
    {
        return this.getBinding() || this.getID();
    },

    getAction:function()
    {
        return this.getAttribute("action");
    },

    getStates:function()
    {
        return (this.getAttribute("state"))? this.getAttribute("state").split(" ") : [];
    },

    getInitialState:function()
    {
        return this.getAttribute("initialState") || "default";
    },

    toString:function()
    {
        return "[Layout type:" + this.getType() + " ID:" + this.getID() + " binding:" + this.getBinding() + "]";
    }
}
);

spx.model.layout.CompoundElement = spx.model.layout.AtomicElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        isAtomic:function()
        {
            return false;
        },

        init:function()
        {
            this.elements = [];
            var dat = this.getData();
            if(dat.hasChildNodes())
            {
                for (var i = 0; i < dat.childNodes.length; i++)
                {
                    var node = dat.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        var element = spx.model.layout.ElementFactory.create(node);
                        if (element && element.getAttribute("type")!=null && element.getType()!==element.getAttribute("type"))
                        {
                            //if element type gets changed in the "custom" section of the xml we need to recreate it with the new type
                            //happens for <field ... /> only (for example original element is type "numeric" but in custom section it gets redefined as type "text")
                            var customizedElementData = element.data;
                            element = spx.model.layout.ElementFactory.create(customizedElementData);
                        }
                        if(element) this.elements.push(element);
                    }
                }
            }
        },

        getElements:function()
        {
            return this.elements;
        },

        getElement:function(id)
        {
           for(var i=0; i<this.elements.length; i++)
           {
               if(this.elements[i].getID()==id) return this.elements[i];
           }
        },

        getElementByBinding:function(val)
        {
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].getBinding()==val) return this.elements[i];
            }
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].getID()==val) return this.elements[i];
            }
        }
    }
)

/* Compound Elements */
spx.model.layout.Application = spx.model.layout.CompoundElement.extend
(
    {

        getType:function()
        {
            return spx.model.layout.ElementTypes.APPLICATION;
        }

    }
)

spx.model.layout.PageSet = spx.model.layout.CompoundElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.PAGESET;
        }
    }
)

spx.model.layout.Page = spx.model.layout.CompoundElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.PAGE;
        },

        getTitle:function()
        {
            return this.getAttribute("title");
        }
    }
);

spx.model.layout.Container = spx.model.layout.CompoundElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.CONTAINER;
        }
    }
);

spx.model.layout.Table = spx.model.layout.CompoundElement.extend
(
    {

        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.TABLE;
        },

        getShowSummary:function()
        {
            return this.getAttribute("showSummary")=="true" || this.getAttribute("showSummary")=="True";
        },

        getOptions:function()
        {
            var options = new sp.ui.table.TableOptions();
            if(this.getAttribute("overflow")) options.overflow = this.getAttribute("overflow");
            if(this.getAttribute("overflow-x")) options.overflowx = this.getAttribute("overflow-x");
            if(this.getAttribute("overflow-y")) options.overflowy = this.getAttribute("overflow-y");
            if(this.getAttribute("selectRowOnClick")) options.selectRowOnClick = this.getAttribute("selectRowOnClick");
            if(this.getAttribute("headerRenderer")) options.headerRenderer = this.getAttribute("headerRenderer");
            if(this.getAttribute("sorter")) options.sorter = this.getAttribute("sorter");
            if(this.getAttribute("inlineDelete")) options.inlineDelete = this.getAttribute("inlineDelete");
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].getType()==spx.model.layout.ElementTypes.TABLECOLUMN)
                {
                    options.addColumn(this.elements[i].getID(),this.elements[i].getWidth(),this.elements[i].getTitle());
                }
            }
            return options;
        },
        getCreateButton: function () {
            return this.getAttribute("create_button");
        },
        getAddButton:function()
        {
            return this.getAttribute("add_button");
        },

        getRemoveButton:function()
        {
            return this.getAttribute("remove_button");
        },

        getDialog:function()
        {
            return this.getAttribute("dialog");
        },

        getAddRecordType:function()
        {
            //represents the type of record to add
            // if the add type is  different to the create type (see below)
            // then we know that we are creating a link object where we first
            // need to create a record, and then add a link object..
            return this.getAttribute("add") || "";
        },

        getCreateRecordType:function()
        {
            // see comment on getAddRecordType...
            return this.getAttribute("create");
        },

        getSearchOptions:function()
        {
            var lookup = this.getElement("lookup");
            return new spx.model.layout.SearchOptions(  this.getLookUpPath(),
                lookup.getDialogFields(),
                lookup.getDialogFieldNames());
        },

        getLookUp:function()
        {
            return this.getElement("lookup");
        },

        getLookUpPath:function()
        {
            var lookup = this.getElement("lookup");
            return lookup.getLookUpPath() || "";
        },

        getAssociatedFieldId:function()
        {
            return this.getAttribute("AssociatedFieldId") || "";
        }

    }
);

spx.model.layout.TableColumn = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.TABLECOLUMN;
        },

        getTitle:function()
        {
            return this.getAttribute("title");
        },

        getWidth:function()
        {
            var w = this.getAttribute("width");
            return (w)? w + "%" : "";
        },

        getBackgroundColor:function()
        {
            var col = this.getAttribute("background");
            return col;
        },

        getProperty:function()
        {
            if(this.field && this.field.getID) return this.field.getID();
            return "";
        },

        getField:function()
        {
            return this.elements[0];
        }
    }
);

spx.model.layout.Repeater = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
           this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.REPEATER;
        }
    }
);


/*Org Chart*/




/* Atomic Elements */
spx.model.layout.Label = spx.model.layout.AtomicElement.extend
(
    {

        init:function()
        {
            this.numberFormat = this.createNumberFormat();
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.LABEL;
        },

        hasNumberFormatting:function()
        {
            return this.getSymbol() || this.getDecimalPlaces();
        },

        createNumberFormat:function()
        {
            if(this.getSymbol())
            {
                var format = new sp.core.numeric.NumberFormat();
                format.decimalPlaces = this.getDecimalPlaces();
                format.percentageSymbol = (this.getSymbol()=="%")? this.getSymbol() : "";
                format.currencySymbol = (this.getSymbol()=="$")? this.getSymbol() : "";
                format.position = (format.percentageSymbol)? "before" : "after";
                return new sp.core.numeric.NumberFormatter(format);
            }
        },

        getNumberFormat:function()
        {
            return this.numberFormat;
        },

        getSymbolPosition:function()
        {
            return this.getAttribute("symbolPosition") || "before";
        },

        getSymbol:function()
        {
            return this.getAttribute("symbol") || "";
        },

        getDecimalPlaces: function()
        {
            return this.getAttribute("decimalPlaces") || 0;
        }
    }
);

spx.model.layout.DataSource = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DATASOURCE;
        },

        getBinding:function()
        {
            return this.getAttribute("binding");
        },

        isAtomic:function()
        {
            return true;
        }
    }
)

spx.model.layout.TextField = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTFIELD;
        },

        getMaxChars:function()
        {
            return this.getAttribute("maxChars");
        }
    }
);

spx.model.layout.TextArea = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTAREA;
        }
    }
);

spx.model.layout.NumericField = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.NUMERICFIELD;
        },

        getSymbol: function()
        {
            return this.getAttribute("symbol");
        },

        getOptions:function()
        {
            var options = new sp.core.numeric.NumberFormat();
            if(this.getSymbol()) options.symbol = this.getSymbol();
            if(this.getDecimalSeparator())  options.decimalSeperator = this.getDecimalSeparator();
            if(this.getThousandSeparator()) options.thousandSeperator = this.getThousandSeparator();
            if(this.getDecimalPlaces()) options.decimalPlaces =
                                        options.places = this.getDecimalPlaces(); // added places because used by NumericField
            if(this.getSymbolPosition())
            {
                options.position = this.getSymbolPosition();
            }
            else
            {
                options.position = (options.percentageSymbol)? "before" : "after";
            }
            //options.maxValue = Math.min();
            //options.minValue = Math.max();
            return options;
        },

        getSymbolPosition:function()
        {
            return this.getAttribute("symbolPosition") || "before";
        },

        getDecimalSeparator: function()
        {
            return this.getAttribute("decimalSymbol");
        },

        getThousandSeparator: function()
        {
            return this.getAttribute("thousandSymbol");
        },

        getDecimalPlaces: function()
        {
            return this.getAttribute("decimalPlaces");
        },

        getMaxValue: function()
        {
            return this.getAttribute("max");
        },

        getMinValue: function()
        {
            return this.getAttribute("min");
        },

        getFormat:function()
        {
            return this.getOptions();
        }


    }
);

spx.model.layout.DateField = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DATEFIELD;
        }
    }
);

spx.model.layout.Combo = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.COMBO;
        },

        getDataProvider:function()
        {

        },

        hasClearLabel:function()
        {
            return this.hasAttribute("clearlabel");
        },

        getClearLabel:function()
        {
            return this.getAttribute("clearlabel");
        },

        getSelectionData:function()
        {
            var attr = this.getAttribute("dataProvider");
            if(attr) return spx.model.resources.Resources.getResource(attr);
            var node = $(this.getData()).find("dataProvider>*")[0];
            if(node) return spx.model.resources.Resources.getResource(node);
        }
    }
);

spx.model.layout.Checkbox = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.CHECKBOX;
        }
    }
);

spx.model.layout.Slider = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.SLIDER;
        }
    }
);

spx.model.layout.Image = spx.model.layout.AtomicElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.IMAGE;
        },

        getSource:function()
        {
            var binding = this.data.getAttribute("binding");
            var resource = spx.model.resources.Resources.getResourceByID(binding);
            return resource;//this.data.getAttribute("src");
        },

        getWidth:function()
        {
            return this.data.getAttribute("width");
        },

        getHeight:function()
        {
            return this.data.getAttribute("height");
        },

        getURL:function()
        {
            return this.data.getAttribute("href");
        }
    }
);

spx.model.layout.RadioGroup = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RADIOGROUP;
        },

        getRadioGroupData:function()
        {
            var attr = this.getAttribute("dataProvider");
            if(attr) return spx.model.resources.Resources.getResource(attr);
            var node = $(this.getData()).find("dataProvider>*")[0];
            if(node) return spx.model.resources.Resources.getResource(node);
        },

        getRadioGroupOptions:function()
        {
            var options = new sp.ui.RadioGroupOptions();
            options.direction = this.getLayoutDirection() || "horizontal";
            return options;
        },

        getLayoutDirection:function()
        {
            return this.getAttribute("direction");
        }
    }
);

spx.model.layout.RichText = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RICHTEXT;
        }
    }
);

spx.model.layout.Button = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.BUTTON;
        },

        getLabel:function()
        {
            return this.getAttribute("label")
        },

        getImage:function()
        {
            return this.getAttribute("image");
        },

        getWidth:function()
        {
            return this.getAttribute("width");
        },

        getHeight:function()
        {
            return this.getAttribute("height");
        },

        getClick:function()
        {
            return this.getAttribute("click");
        }
    }
);

spx.model.layout.Dialog = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DIALOG;
        },

        getLabel:function()
        {
            return this.getAttribute("label")
        },

        getImage:function()
        {
            return this.getAttribute("image");
        },

        getWidth:function()
        {
            return this.getAttribute("width");
        },

        getHeight:function()
        {
            return this.getAttribute("height");
        },

        getClick:function()
        {
            return this.getAttribute("click");
        }
    }
),

spx.model.layout.RecordView = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RECORDVIEW;
        }
    }
);

spx.model.layout.Filter = spx.model.layout.AtomicElement.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.FILTER;
        }
    }
);

spx.model.layout.SearchOptions = Class.extend
({
    __constructor:function(url,fields,fieldNames)
    {
        this.url = url || "";
        this.fields = fields || [];
        this.fieldNames = fieldNames || fields;
    },
    getFields:function()
    {
        return this.fields;
    },
    getFieldNames:function()
    {
        return this.fieldNames;
    },
    getUrl:function()
    {
        return this.url;
    }
})

spx.model.layout.Lookup = spx.model.layout.AtomicElement.extend
(
{
    getSearchOptions:function()
    {
        return new spx.model.layout.SearchOptions(this.getLookUpPath(),this.getDialogFields(),this.getDialogFieldNames());
    },
    getDialogFields:function()
    {
        var fields = this.getAttribute("dialogFields") || "";
        return fields.split(";");
    },
    getDialogFieldNames:function()
    {
        var fields = this.getAttribute("dialogFieldLabels") || "";
        return fields.split(";");
    },
    getLookUpPath:function()
    {
        return this.getAttribute("lookupPath") || "";
    },
    getAssociatedFieldId:function()
    {
        return this.getAttribute("AssociatedFieldId") || "";
    },
    getType:function()
    {
        return spx.model.layout.ElementTypes.LOOKUP;
    },
    toString:function()
    {
        return "[LookUp]";
    },
    getRelatedField:function()
    {
        return this.getAttribute("relatedField");
    }
}
);

spx.model.layout.Chart = spx.model.layout.CompoundElement.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.CHART;
    }
}
);

spx.model.layout.BarChart = spx.model.layout.Chart.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.BARCHART;
    }
}
);

spx.model.layout.LineChart = spx.model.layout.Chart.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.LINECHART;
    }
}
);

spx.model.layout.AreaChart = spx.model.layout.Chart.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.AREACHART;
    }
}
);

spx.model.layout.PieChart = spx.model.layout.Chart.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.PIECHART;
    }
}
);

spx.model.layout.Unsupported = spx.model.layout.AtomicElement.extend
(
{
    getType:function()
    {
        return spx.model.layout.ElementTypes.UNSUPPORTED;
    }
}
);

spx.model.layout.OrgChart = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHART;
        },

        getSearchOptions:function()
        {
            var lookup = this.getElement("lookup");
            return new spx.model.layout.SearchOptions(  this.getLookUpPath(),
                lookup.getDialogFields(),
                lookup.getDialogFieldNames());
        },

        getLookUpPath:function()
        {
            var lookup = this.getElement("lookup");
            return lookup.getLookUpPath() || "";
        },

        getAssociatedFieldId:function()
        {
            return this.getAttribute("associatedFieldId") || "";
        },

        getRelatedField:function()
        {
            return this.getAttribute("relatedField");
        }
    }
);

spx.model.layout.OrgChartBox = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTBOX;
        }
    }
);

spx.model.layout.OrgChartDialog = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTDIALOG;
        }
    }
);

spx.model.layout.ElementFactory =
{
    create:function(elementData)
    {
         switch(elementData.nodeName)
        {
            case spx.model.layout.ElementTypes.APPLICATION:
                return new spx.model.layout.Application(elementData);
            case spx.model.layout.ElementTypes.CONTAINER:
                return new spx.model.layout.Container(elementData);
            case spx.model.layout.ElementTypes.PAGESET:
                return new spx.model.layout.PageSet(elementData);
            case spx.model.layout.ElementTypes.PAGE:
                return new spx.model.layout.Page(elementData);
            case spx.model.layout.ElementTypes.FIELD:
                switch(elementData.getAttribute("type"))
                {
                    case spx.model.layout.ElementTypes.DATEFIELD:
                        return new spx.model.layout.DateField(elementData);
                    case spx.model.layout.ElementTypes.TEXTAREA:
                        return new spx.model.layout.TextArea(elementData);
                    case spx.model.layout.ElementTypes.NUMERICFIELD:
                        return new spx.model.layout.NumericField(elementData);
                    case spx.model.layout.ElementTypes.COMBO:
                        return new spx.model.layout.Combo(elementData);
                    case spx.model.layout.ElementTypes.CHECKBOX:
                        return new spx.model.layout.Checkbox(elementData);
                    case spx.model.layout.ElementTypes.SLIDER:
                        return new spx.model.layout.Slider(elementData);
                    case spx.model.layout.ElementTypes.RADIOGROUP:
                        return new spx.model.layout.RadioGroup(elementData);
                    case spx.model.layout.ElementTypes.RICHTEXT:
                        return new spx.model.layout.RichText(elementData);
                    case spx.model.layout.ElementTypes.RECORDVIEW:
                        return new spx.model.layout.RecordView(elementData);
                    case spx.model.layout.ElementTypes.TEXTFIELD:
                    default:
                        return new spx.model.layout.TextField(elementData);
                }
                break;
            case spx.model.layout.ElementTypes.LABEL:
                return new spx.model.layout.Label(elementData);
            case spx.model.layout.ElementTypes.TABLE:
                return new spx.model.layout.Table(elementData);
           case spx.model.layout.ElementTypes.TABLECOLUMN:
               return new spx.model.layout.TableColumn(elementData);
            case spx.model.layout.ElementTypes.IMAGE:
                return new spx.model.layout.Image(elementData);
            case spx.model.layout.ElementTypes.BUTTON:
                return new spx.model.layout.Button(elementData);
            case spx.model.layout.ElementTypes.DIALOG:
                return new spx.model.layout.Dialog(elementData);
            case spx.model.layout.ElementTypes.FILTER:
                return new spx.model.layout.Filter(elementData);
            case spx.model.layout.ElementTypes.REPEATER:
               return new spx.model.layout.Repeater(elementData);
            case spx.model.layout.ElementTypes.SLIDER:
               return new spx.model.layout.Slider(elementData);
           case spx.model.layout.ElementTypes.ORGCHART:
               return new spx.model.layout.OrgChart(elementData);
           case spx.model.layout.ElementTypes.ORGCHARTBOX:
               return new spx.model.layout.OrgChartBox(elementData);
           case spx.model.layout.ElementTypes.ORGCHARTDIALOG:
               return new spx.model.layout.OrgChartDialog(elementData);
           case spx.model.layout.ElementTypes.LOOKUP:
               return new spx.model.layout.Lookup(elementData);
           case spx.model.layout.ElementTypes.CHART:
               switch(elementData.getAttribute('type'))
               {
                   case spx.model.layout.ElementTypes.BARCHART:
                       return new spx.model.layout.BarChart(elementData);
                   case spx.model.layout.ElementTypes.LINECHART:
                       return new spx.model.layout.LineChart(elementData);
                   case spx.model.layout.ElementTypes.AREACHART:
                       return new spx.model.layout.AreaChart(elementData);
                   case spx.model.layout.ElementTypes.PIECHART:
                       return new spx.model.layout.PieChart(elementData);
               }
               break;
           case spx.model.layout.ElementTypes.UNSUPPORTED:
               return new spx.model.layout.Unsupported(elementData);
        }
        try
        {
            var obj = eval("new " + elementData.nodeName  + "(elementData)");
            if(obj) return obj;
        }
        catch(e)
        {
            // uncomment the line below if you are having trouble identifying bugs in the model being created because of the try catch
            //sp.out("Error trying to evaluate resource" + JSON.stringify(elementData) + " e:" + e.message);
        }
    }
};


spx.model.layout.ElementTypes =
{
    APPLICATION:"template",
    PAGESET:"pageset",
    PAGE:"page",
    CONTAINER:"container",
    FIELD:"field",
    COMPONENT:"component",
    LABEL:"label",
    DATEFIELD:"date",
    TEXTFIELD:"text",
    TEXTAREA:"textarea",
    NUMERICFIELD:"numeric",
    COMBO:"combo",
    CHECKBOX:"checkbox",
    SLIDER:"slider",
    TABLE:"table",
    TABLECOLUMN:"tablecolumn",
    IMAGE:"image",
    RADIOGROUP:"radiogroup",
    RICHTEXT:"richtext",
    BUTTON:"button",
    DIALOG:"dialog",
    RECORDVIEW:"recordView",
    FILTER:"filter",
    REPEATER:"repeater",
    LIST:"list",
    OBJECT:"object",
    ORGCHART: "orgchart",
    ORGCHARTBOX: "orgchartbox",
    ORGCHARTDIALOG: "orgchartdialog",
    LOOKUP: "lookup",
    CHART: "chart",
    BARCHART: "column",
    LINECHART: "line",
    AREACHART: "area",
    PIECHART: "pie",
    UNSUPPORTED: "unsupported",

    isCompound:function(type)
    {
        switch(type)
        {
            case spx.model.layout.ElementTypes.DATEFIELD:
            case spx.model.layout.ElementTypes.LABEL:
            case spx.model.layout.ElementTypes.TEXTFIELD:
            case spx.model.layout.ElementTypes.TEXTAREA:
            case spx.model.layout.ElementTypes.RICHTEXT:
            case spx.model.layout.ElementTypes.NUMERICFIELD:
            case spx.model.layout.ElementTypes.COMBO:
            case spx.model.layout.ElementTypes.CHECKBOX:
            case spx.model.layout.ElementTypes.SLIDER:
            case spx.model.layout.ElementTypes.RADIOGROUP:
        }
    }
};


