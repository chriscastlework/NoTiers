sp.namespace("spx.view.View");

spx.view.View = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(model)
    {
        this.__super();
        this.model = model;
        this.init();
    },
    
    init:function()
    {
        $(document.body).append(this.getGraphic());
        this.model.addEventListener(this,sp.core.data.DataEvent.LOADED, this.onDataLoaded);
    },

    onDataLoaded:function()
    {
        this.elements = [];
        var appElements = this.model.getApplicationModel().getElements();
        for(var i=0; i<appElements.length; i++)
        {
            sp.out("--View creating element:" + appElements[i]);
            var element = spx.view.ElementFactory.create(appElements[i]);
            sp.out("element:" + element);
            this.elements.push(element);
            this.addElement(element);

        }
    },

    getElement:function(id)
    {
        for(var i=0; i<this.elements.length; i++)
        {
            if(this.elements[i].getID()==id) return this.elements[i];
        }
    }

}
);

spx.view.Element = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(data)
    {
        this.__super();
        this.data = data;
        this.state = "";
        this.init();
        this.setState(this.data.getInitialState());
    },

    getType:function()
    {
        return "";
    },
    
    init:function()
    {
        this.__enabled = true;
        this.addClass(this.data.getClass());
        $(this.getGraphic()).attr("id",this.data.getID());
        $(this.getGraphic()).attr("title",spx.model.Strings.getInstance().getLocalOr(this.data.getToolTip()));
        if(this.data.getStyle()) $(this.getGraphic()).attr("style",this.data.getStyle());
        this.elements = [];
        this.build();
        this.draw();
        var __this = this;
        $(this.getGraphic()).click(function (e) { __this.onClick(e) });

        this.setupColors(); // If you comment this out then text/number fields will not be colored

      
    },

    setupColors: function(context)
    {
        var color = this.data.getColor(context);
        var background = this.data.getBackground(context);
        var border = this.data.getBorder(context);

        var $gfx = $(this.getGraphic(context));
        if (color) $gfx.css('color', this.getColor(color, context));
        if (background) $gfx.css('background-color', this.getColor(background, context));
        if (border)
        {
            $gfx.css('border-color', this.getColor(border, context));
            $gfx.css('border-style', 'solid');
            $gfx.css('border-width', '1px');

        }

    },

    getColor: function(color, context)
    {

        // var isColor = function(c){ return /^#?[0-9A-Fa-f]{3,6}?/.test(c); }; this was not correct
        var isColor = function (c) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c); };
        if (color)
        {
            if (isColor(color))
            {
                if (color[0] != '#')
                {
                    return '#' + color;
                }
                return color;
            }
            else
            {
                if (Object.prototype.toString.call(color) === "[object Object]") { // ADDED TO STOP EVALUATION OF "{[object Object]}"
                    color = color.raw;
                }
                var resourceColor = spx.evaluate('{' + color + '}', context); // this code expecst that color is a sting but color is a ... Object {raw: "({CustomField2968} == {0xq6}) ? {9} : null", evaluated: null}
                return isColor(resourceColor) ? resourceColor : '#FFFFFF';
            }
        }
        return '#FFFFFF';
    },

    getFormat:function()
    {
        return this.data.getFormat();
    },

    formatValue:function(val)
    {
        return (this.getFormat())? this.getFormat().format(val) : val;
    },

    onClick:function(e)
    {
        this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.CLICK, null, e));
    },

    build:function() {
        this.clear();
        var elementData = this.data.getElements();
        sp.out(this + "elementData:" + elementData);
        for(var i=0; i<elementData.length; i++)
        {
            var el = spx.view.ElementFactory.create(elementData[i]);
            sp.out("el:" + el);
            this.elements.push(el);
            this.addElement(el.getGraphic());
        }
    },

    draw:function()
    {

    },

    getElement:function(id)
    {
        for(var i=0; i<this.elements.length; i++)
        {
            if(this.elements[i].getID()==id) return this.elements[i];
        }
    },

    getID:function()
    {
        return this.data.getID();
    },

    getData:function()
    {

    },

    setData:function(val) {
        this.setupColors(val);
    },

    setState:function(state)
    {
        this.state = state || "default";
        for(var i=0; i<this.elements.length; i++)
        {
            this.elements[i].showState(this.state);
        }
    },

    cycleState:function(states)
    {
        if(!states || states.length==0) return;
        states = states.split(" ");
        var currentIndex=sp.utils.ArrayUtils.indexOf(states, this.state);
        if(currentIndex!=-1)
        {
            var newIndex = (currentIndex==states.length)? 0 : currentIndex+1;
            this.setState(states[newIndex]);
        }
    },

    showState:function(state)
    {
        if(this.hasState(state))
        {
            this.show();
        }
        else
        {
            this.hide();
        }
    },

    hasState:function(state)
    {
        var states = this.data.getStates();
        var vis = (states.length==0);
        for(var i=0; i<states.length; i++) if(states[i]==state || states[i]=="all") vis = true;
        return vis;
    },

    setEnabled:function(val)
    {
        this.__enabled = val;
    },

    getEnabled:function()
    {
        return this.__enabled;
    },

    setVisible:function(val)
    {
        this.__visible = val;
        if(this.__visible)
        {
            $(this.getGraphic()).show();
        }
        else
        {
            $(this.getGraphic()).hide();
        }
    },

    getVisible:function()
    {
        return this.__visible;
    },

    toString:function()
    {
        return "[View " + this.getType() + " " + this.getID() + "]";
    }
}
);

spx.view.PageSet = spx.view.Element.extend
(
    {
        getType:function()
        {
           return spx.model.layout.ElementTypes.PAGESET;
        },

        build:function()
        {
            var tabs = new sp.ui.tabset.TabSet();
            tabs.build();
            var elements = this.data.getElements();
            for(var i=0; i<elements.length; i++)
            {
                var view = spx.view.ElementFactory.create(elements[i]);
                this.elements.push(view);
                var tab = tabs.addTab(sp.guid(),elements[i].getTitle(),view.getGraphic());
                spx.model.Strings.getInstance().assignStringToElement(tab,elements[i].getTitle());
            }
            this.tabs = tabs;
            this.addElement(tabs.getGraphic());
        }
    }
);

spx.view.Page = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.PAGE;
        }
    }
);

spx.view.Container = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.CONTAINER;
        }
    }
);

spx.view.Component = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.COMPONENT;
        }
    }
);

spx.view.Label = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.LABEL;
        }

    }
);

spx.view.TextField = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTFIELD;
        },

        build:function()
        {
           var __this = this;
           this.format = this.data.getFormat();
           var options = {};
           if(this.format)
           {
               if(this.format.type) options.type = this.format.type;
               if(this.format.maxlength) options.maxlength = this.format.maxlength;
               if(this.format.pattern) options.pattern = this.format.pattern;
           }
           this.input = this.addElement(this.createElement("input",{},[],options));
           // We need to assign the alignment style to the child input
           var alignStyle = this.data.getStyleProperty("text-align");
           if(alignStyle) $(this.input).css("text-align",alignStyle);
           $(this.input).change(function(){__this.onChange()});
           if(this.format && (this.format.maxlength || this.format.allow)) $(this.input).keyup(function(){__this.onChange()});
        },

        onKeyUp:function()
        {
            if(this.format && (this.format.maxlength || this.format.allow)) $(this.input).val(this.format.format($(this.input).val()));
        },

        onChange:function()
        {
            if(this.format && (this.format.maxlength || this.format.allow)) $(this.input).val(this.format.format($(this.input).val()));
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getData:function()
        {
            return $(this.input).val();
        },

        setData:function(val)
        {
            $(this.input).val((this.getFormat())? this.getFormat().format(val) : val);
        },

        setEnabled:function(val)
        {
            this.__super(val);
            this.input.removeAttribute("disabled");
            if(!this.__enabled) this.input.setAttribute("disabled","disabled");
        }
    }
);

spx.view.TextArea = spx.view.TextField.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTAREA;
        },

        build:function()
        {
            var __this = this;
            this.input = this.addElement(this.createElement("textarea",{},[]));
            $(this.input).change(function(){__this.onChange()})
        },

        onChange:function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getData:function()
        {
            return $(this.input).val();
        },

        setData:function(val)
        {
            $(this.input).val((this.getFormat())? this.getFormat().format(val) : val);
        },

        setEnabled:function(val)
        {
            this.__super(val);
            this.input.removeAttribute("disabled");
            if(!this.__enabled) this.input.setAttribute("disabled","disabled");
        }
    }
);

spx.view.DateField = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DATEFIELD;
        },

        build:function()
        {
            this.format = this.getFormat() || new spx.model.format.Date();
            this.dateGraphic = this.addElement(this.createElement("input",{},[]));
            var __this = this;
            $(this.dateGraphic).datepicker({ dateFormat: this.format.getFormat(), onSelect: function (dateText, inst)
            {
                __this.onDateChanged(dateText, inst)
            } });

            var locale = sp.core.locale.getLocale();
            var localization = locale.getDatepickerLocalization();
            if (localization)
            {
                $(this.dateGraphic).datepicker( $.datepicker.regional[ "en" ] = localization);
                $(this.dateGraphic).datepicker( $.datepicker.setDefaults($.datepicker.regional['en']));
            }
        },

        onDateChanged:function(dateText,inst)
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getData:function()
        {
            return ($(this.dateGraphic).val())? sp.core.date.Date.dateToString($(this.dateGraphic).datepicker("getDate")) : "";
        },

        setData:function(val)
        {
            var date = new sp.core.date.Date();
            if(val) date.setDate(val);
            $(this.dateGraphic).datepicker("setDate",date.getDate());
        },

        clear:function()
        {
            $(this.dateGraphic).val("");
        },

        setEnabled:function(val)
        {
            this.__super(val);
            $(this.dateGraphic).datepicker((this.__enabled)? "enable" : "disable");
        }
    }
);

spx.view.NumericField = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.NUMERICFIELD;
        },

        build:function()
        {
            var __this = this;
            this.format = this.data.getFormat();

            var options = {};
            if(this.format)
            {
                if(this.format.symbol=="%")
                {
                    options.percentageSymbol = this.format.symbol;
                }
                else
                {
                    if(this.format.symbol) options.currencySymbol = this.format.symbol;

                }
                if(this.format.decimals) options.decimalSeperator = this.format.decimals;
                if(this.format.thousands) options.thousandSeperator = this.format.thousands;
                if(this.format.places) options.decimalPlaces = this.format.places;
                if(this.format.signed) options.signed = this.format.signed;
                if(this.format.position) options.symbolPosition = this.format.position;
                options.maxValue = this.format.maxValue ? this.format.maxValue : Math.pow(2, 53);
                options.minValue = this.format.minValue ? this.format.minValue : -Math.pow(2, 53);
            }

            var input = this.addElement(this.createElement("input",{},[]));
            this.input = new sp.core.numeric.NumericInput(input, new sp.core.numeric.NumberFormat(options), false);

            $(this.input.getGraphic()).change(function(){__this.onChange()})
        },

        onChange:function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getDisplayString:function(val)
        {
            var places = this.data.getDecimalPlaces();
            var symbol = this.data.getSymbol();



        },

        setData:function(val)
        {
            this.input.setData(val);
        },

        getData:function()
        {
            return this.input.getData() || 0;
        },

        setEnabled:function(val)
        {
            this.__super(val);
            $(this.input.getGraphic()).removeAttr("disabled");
            if(!this.__enabled) $(this.input.getGraphic()).attr("disabled","disabled");
        }
    }
);

spx.view.Combo = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.COMBO;
        }
    }
);

spx.view.Checkbox = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.CHECKBOX;
        },

        build:function()
        {
            this.input = this.addElement(this.createElement("input",{},[],{type:"checkbox"}));
            var __this = this;
            $(this.input).change(function () { __this.onChange() });
          
        },

        onChange:function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getData:function()
        {
            return $(this.input).attr("checked")? true: false;
        },

        setData:function(val)
        {
            if(sp.core.data.DataUtils.toBoolean(val))
            {
                $(this.input).attr("checked","checked");
            }
            else
            {
                $(this.input).removeAttr("checked");
            }
        },

        setEnabled:function(val)
        {
            this.__super(val);
            this.input.removeAttribute("disabled");
            if(!this.__enabled) this.input.setAttribute("disabled","disabled");
        }
    }
);

spx.view.Slider = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.SLIDER;
        },

        build:function()
        {
            this.$slider = $(this.addElement(this.create()).getGraphic());
            this.$slider.slider(this.getOptions());
        },

        onStop: function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getData:function()
        {
            return this.$slider.slider('value');
        },

        setData:function(val)
        {
            this.$slider.slider('value', val);
            this.onSlide();
        },

        onSlide: function()
        {
            this.$slider.attr('title', this.getData());
        },

        getOptions: function()
        {
            return {
                min: Number(this.data.getAttribute('min')) || 0,
                max: Number(this.data.getAttribute('max')) || 100,
                stop: $.proxy(this.onStop, this),
                slide: $.proxy(this.onSlide, this)
            }
        }
    }
);

spx.view.Table = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TABLE;
        },

        build:function()
        {
           this.table = this.getGraphic();//this.addElement(this.createElement("div",{},this.data.getClass()));

        },

        create:function(element)
        {
            var field = spx.view.ElementFactory.create(element);
            if(field) $(field.getGraphic()).css("width","100% !important");
            return field;
        },

        getTable:function()
        {
            return this.table;
        },

        setData:function(val)
        {

        },

        getData: function(cell, columnIndex, data, prop)
        {

        }
    }
);

spx.view.Image = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTAREA;
        },

        build:function()
        {
            if (this.data.getWidth() == '100%') $(this.getGraphic()).width('100%');
            if (this.data.getHeight() == '100%') $(this.getGraphic()).height('100%');
            this.input = this.createElement("img",{width:this.data.getWidth(), height:this.data.getHeight()},[],{src:this.data.getSource()});
            this.addElement(this.input);
        },

        wrapWithHyperlink:function(url)
        {
            var wrapper = $("<a href='"+url+"' target='_blank'></a>");
            wrapper.append(this.input);
            this.addElement(wrapper);
        },

        setSrc: function(src)
        {
            $(this.input).attr('src', src);
        }
    }
);

spx.view.RadioGroup = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RADIOGROUP;
        },

        build:function()
        {
            this.input = new sp.ui.RadioGroup(this.data.getID(),this.data.getRadioGroupOptions());
            this.input.setDataProvider(this.data.getRadioGroupData());
            this.input.addEventListener(this,sp.core.events.SelectionEvent.SELECT, this.onChange);
            this.addElement(this.input.getGraphic());
        },

        onChange:function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CHANGE));
        },

        getData:function()
        {
            return this.input.getSelectedValue();
        },

        setData:function(val)
        {
            this.input.setSelectedValue(val);
        }
    }
);

spx.view.RichText = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RICHTEXT;
        },

        build:function()
        {

        }
    }
);

spx.view.Button = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.BUTTON;
        },

        build:function()
        {
            if(this.data.getValue()) $(this.getGraphic()).html(this.data.getValue());
        }
    }
);

spx.view.Dialog = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DIALOG;
        },

        build:function()
        {
            this.__super();
        }
    }
);

spx.view.RecordView = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RECORDVIEW;
        }
    }
);

spx.view.RepeaterView = spx.view.Element.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.REPEATER;
        },

        build:function()
        {

        },

        create:function(elementData)
        {
            var el = spx.view.ElementFactory.create(elementData);
            this.elements.push(el);
            this.addElement(el.getGraphic());
            return el;
        }
    }
);


spx.view.Lookup = spx.view.Element.extend
(
    {
        init: function()
        {
            this.__super();
            this.addClass('lookup');
            this.valueHolder = this.addElement(this.create());
            this.searchButton = this.addElement(this.create('div', {classes: ['lookup_search', 'glyphicon', 'glyphicon-search']}));
        },

        getSearchButton:function()
        {
            return this.searchButton;
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.LOOKUP;
        },

        setText:function(val)
        {
            this.valueHolder.html(val);
        }
    }
);

spx.view.SearchDialog = sp.ui.dialogs.Dialog.extend
(
    {

        __constructor: function()
        {
            this.__super();
            this.filters = [];
            this.addClass('lookup_dialog');
            this.searchArea = this.addElement(this.create('div', {classes: ['search_area']}));
            this.searchInput = this.searchArea.addElement(new sp.ui.inputs.MultiInput());
            this.searchButton = this.searchArea.addElement(this.create('div', { classes: ['button'], text: 'Search' }));
            this.resultTableContainer = this.addElement(this.create('div', { classes: ['result_table','pb-grid'] }));
        },

        getTableGraphic:function()
        {
            return this.resultTableContainer;
        },

        getSearchButton:function()
        {
            return this.searchButton;
        },

        getSearchArea:function()
        {
            return this.searchArea;
        },

        getSearchTerm:function()
        {
            return this.searchInput.getValue();
        },

        getSettings: function()
        {
            return {
                title: 'Search',
                width: 400,
                height: 300
            };
        },

        onBeforeOK:function()
        {
            var event = new sp.ui.dialogs.DialogEvent(this,sp.ui.dialogs.DialogEvent.BEFORECLOSE,sp.ui.dialogs.Dialog.OK);
            this.dispatchEvent(event);
            return event.stop;
        },

        onAdd:function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.CLICK, null, e));
        },

        getButtonOptions: function()
        {
            var locale = sp.core.locale.getLocale();
            var okLabel     = locale.getString('WS_3_1', 'OK');
            var cancelLabel = locale.getString('WS_3_2', 'Cancel');
            var addLabel = "Add New";
            var result = {};
            var __this = this;
            result[okLabel] = function() { __this.onOK(); };
            result[cancelLabel] = function() { __this.onCancel(); };
            //result[addLabel] = function() {__this.onAdd();};
            return result;
        }
    }
);

spx.view.Chart = spx.view.Element.extend
(
{
    drawChart: function(options)
    {
        $(this.getGraphic()).highcharts(options);
    },

    setData: function(data)
    {
        var $chart = $(this.getGraphic()).highcharts();
        if ($chart) $chart.series[0].setData(data);
    }
}
);

spx.view.BarChart = spx.view.Chart.extend
(
{
}
);

spx.view.LineChart = spx.view.Chart.extend
(
{

}
);

spx.view.AreaChart = spx.view.Chart.extend
(
{
}
);

spx.view.PieChart = spx.view.Chart.extend
(
{
}
);

spx.view.Unsupported = spx.view.Element.extend
(
{
    init: function()
    {
        this.__super();
        this.addClass('unsupported');
    },

    getType: function()
    {
        return spx.model.layout.ElementTypes.UNSUPPORTED;
    }
}
);

spx.view.OrgChart = spx.view.Element.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHART;
        },

        build: function()
        {

        },

        setData: function()
        {

        },

        init: function()
        {
            this.__super();
            this.addClass('org_chart');
            this.addClass("sp_relational_chart");

            this.options = new sp.ui.relationalchart.RelationalChartOptions({
                canvasWidth: 2000,
                canvasHeight: 1200
            });

            this.snapToGrid = this.options.snapToGrid || false;
            this.canvasWidth = this.options.canvasWidth || $(window).width();
            this.canvasHeight = this.options.canvasHeight || $(window).height();
            this.zoomLevel = this.options.zoomLevel || 1;
            this.idProp = this.options.idProp || "ID";


            this.buildButtonBar();
            this.buildToolbox();


            this.selected = [];

            this.outer = this.addElement(sp.core.graphics.create('div', { classes: ['chart_outer'] }));
            this.content = this.outer.addElement(sp.core.graphics.create('div', { classes: ['chart_container'] }));
            this.customLayer = this.content.addElement(this.createElement("div"));
            this.selectionDragLayer = this.content.addElement(this.createElement("div",{width:this.canvasWidth,height:this.canvasHeight,background:"white",opacity:"0",filter:"alpha(opacity=0)","z-index":1},["selection_area"]));
            this.contentLayer = this.content.addElement(this.createElement("div",{"z-index":2},["content"]));
            this.gridLayer = this.content.addElement(this.createElement("div",{position:"absolute", width:this.canvasWidth, height:this.canvasHeight,"z-index":0},["canvas_grid"]));
            this.selectionDrawLayer = this.content.addElement(this.createElement("div",{width:this.canvasWidth,height:this.canvasHeight,background:"none"},["selection_draw"]));
            //$(this.contentLayer).disableSelection();
            this.dragSelect = new sp.ui.dragselect.DragSelect(this.selectionDrawLayer,this.selectionDragLayer);
            this.dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionStart);
            this.dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionComplete);
            this.layers = [{content:this.content}];
            //this.dataProvider = new sp.core.data.IndexedDataList();
            this.viewport = this.getGraphic();
            this.dragLine = this.createElement("canvas",{position:"absolute"},["drag_line"],{width:this.canvasWidth*this.zoomLevel,height:this.canvasHeight*this.zoomLevel});
            $(this.getLayer("drag_container")).append(this.dragLine);
            //initialize grid
            this.drawGridLines();
            this.hideGrid();
            if (this.options.drawGrid) this.showGrid();

            this.dragMode = false; // toggles on and off to switch between dragging the whole chart or selecting with a lasso

            this.setDragState();
            this.toggleSnapToGrid(this.snapToGrid);

        },

        buildButtonBar:function()
        {
            var create = sp.core.graphics.create;
            var buttonBar = this.addElement($("<div class='button_container'></div>"));
            this.addButton = $("<div class='button' title='Add'>Add</div>");
            this.removeButton = $("<div class='button' title='Remove'>Remove</div>");
            buttonBar.append(this.addButton);
            buttonBar.append(this.removeButton);
            this.addButton.click($.proxy(this.onAddClick, this));
            this.removeButton.click($.proxy(this.onRemoveClick, this));
        },

        buildToolbox: function()
        {
            var tb = this.options.toolbox;
            var create = sp.core.graphics.create;
            if (tb)
            {
                var toolbox = this.addElement(create('div', { classes: ['toolbox'] }));
                //if (tb.select) toolbox.addElement(create('div', { classes: ['select', 'active'], attributes: { title: 'Select' } })).click($.proxy(this.onSelectClick, this));
                if (tb.drag) toolbox.addElement(create('div', { classes: ['drag'], attributes: { title: 'Switch to drag the whole chart around. Press again to return to selection mode.' } })).click($.proxy(this.onDragClick, this));
                //if (tb.snapToGrid) toolbox.addElement(create('div', { classes: ['snap'], attributes: { title: 'Show Grid' } })).click($.proxy(this.onSnapToGridClick, this));
                if (tb.zoomIn) toolbox.addElement(create('div', { classes: ['zoom_in'], attributes: { title: 'Zoom in' } })).click($.proxy(this.onZoomInClick, this));
                if (tb.zoomOut) toolbox.addElement(create('div', { classes: ['zoom_out'], attributes: { title: 'Zoom out' } })).click($.proxy(this.onZoomOutClick, this));
                if (tb.link) toolbox.addElement(create('div', { classes: ['link'], attributes: { title: 'Include all child items when dragging an item around' } }).click($.proxy(this.onLinkClick, this)));
            }
        },

        onAddClick: function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.ADD));
        },

        onRemoveClick: function()
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.REMOVE));
        },

        toggleAddRemoveButtons: function(buttonsVisible)
        {
            if (buttonsVisible)
            {
                this.addButton.show();
                this.removeButton.show();
            }
            else
            {
                this.addButton.hide();
                this.removeButton.hide();
            }
        },

        /*onSelectClick: function()
         {
         var $content = $(this.content.getGraphic());
         $content.draggable({disabled : true });
         $content.css('cursor','arrow');
         this.enableDragSelect();

         $('.toolbox .drag').removeClass('active');
         $('.toolbox .select').addClass('active');
         },
         */
        onDragClick: function()
        {
            this.dragMode = !this.dragMode;
            this.setDragState();
        },

        setDragState:function()
        {
            var content = $(this.content.getGraphic());
            if(this.dragMode)
            {
                content.draggable({disabled : false });
                content.css('cursor','move');
                $('.toolbox .drag').addClass('active');
                this.disableDragSelect();
            }
            else
            {
                content.draggable({disabled : true });
                content.css('cursor','');
                $('.toolbox .drag').removeClass('active');
                this.enableDragSelect();
            }
        },

        onSnapToGridClick: function(e)
        {
            this.toggleSnapToGrid(!this.snapToGrid);
            $(e.target).toggleClass('active', this.snapToGrid);
        },

        onZoomInClick: function()
        {
            this.increaseZoomLevel();
        },

        onZoomOutClick: function()
        {
            this.decreaseZoomLevel();
        },

        onLinkClick: function(e)
        {
            this.toggleLinkSubordinatesLock(!this.linkSubordinates);
            $(e.target).toggleClass('active', this.linkSubordinates);
        },

        create:function(elementData)
        {
            var el = spx.view.ElementFactory.create(elementData);
            this.elements.push(el);
            this.addElement(el.getGraphic());
            return el;
        },

        setViewport: function (viewport)
        {
            this.viewport = viewport;
        },

        getVisibleAreaCenterPosition: function()
        {
            var $chart = $(this.getGraphic());
            var boxWidth = this.options.boxWidth || 0;
            var boxHeight = this.options.minBoxHeight || 0;
            var centerPointLeft = (-1*$chart.position().left + $chart.parent('div').width()/2 - boxWidth*this.zoomLevel/2) / this.zoomLevel;
            var centerPointTop = (-1*$chart.position().top + $chart.parent('div').height()/2 - boxHeight*this.zoomLevel/2) / this.zoomLevel;
            if (!centerPointLeft || centerPointLeft<0) centerPointLeft = 0;
            if (centerPointLeft > this.canvasWidth) centerPointLeft = this.canvasWidth - boxWidth;
            if (!centerPointTop || centerPointTop<0) centerPointTop = 0;
            if (centerPointTop > this.canvasHeight) centerPointTop = this.canvasHeight - boxHeight;

            return {top: centerPointTop, left: centerPointLeft}
        },

        enableDragSelect: function()
        {
            this.dragSelect.enable();
        },

        disableDragSelect: function()
        {
            this.dragSelect.disable();
        },

        onDragSelectionStart:function(event)
        {
            this.unselectAll();
        },

        onDragSelectionComplete:function(event)
        {
            var bounds = event.target.getSelectedArea();
            this.unselectAll();
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].intersectsBounds(bounds))
                {
                    this.selected.push(this.elements[i]);
                    this.elements[i].setSelected(true);
                }
            }
            this.dispatchEvent(new sp.ui.relationalchart.OrgChartEvents(this, sp.ui.relationalchart.OrgChartEvents.SELECTIONCHANGE));
        },

        getLayer:function(id,z)
        {
            if(!this.layers[id])
            {
                var layer = $(this.customLayer).append(this.createElement("div"));
                $(layer).attr("id",id);
                $(layer).css("z-index",z);
                $(layer).css("position","absolute");
                $(layer).css("left","0px");
                $(layer).css("top","0px");
                this.layers[id] = layer;
            }
            return this.layers[id];
        },

        setDataProvider:function(dp)
        {
            //this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.ADD,this.onAdd);
            //this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.REMOVE,this.onRemove);
            //this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.EDIT,this.onEdit);
            //this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.SET,this.onDataSet);
            //this.dataProvider = dp;
            //this.dataProvider.addEventListener(this,sp.core.data.DataEvent.ADD,this.onAdd);
            //this.dataProvider.addEventListener(this,sp.core.data.DataEvent.REMOVE,this.onRemove);
            //this.dataProvider.addEventListener(this,sp.core.data.DataEvent.EDIT,this.onEdit);
            //this.dataProvider.addEventListener(this,sp.core.data.DataEvent.SET,this.onDataSet);
            //this.refresh();
        },

        clearAll:function(visualOnly)
        {
            for(var i=0; i<this.elements.length; i++)
            {
                this.elements[i].kill(visualOnly);
            }
            $(this.contentLayer).empty();
            this.elements = [];
        },

        refresh:function()
        {
            for(var i=0; i<this.elements.length; i++)
            {
                this.elements[i].refresh();
            }
        },

        bringToFront:function(box)
        {
            $(box.getGraphic()).css("z-index",this.getNextHighestIndex(this.contentLayer));
        },

        addBox:function(box)
        {
            box.addEventListener(this,sp.core.events.MouseEvent.MOUSEDOWN, this.selectElement);
            box.addEventListener(this,sp.core.events.DragEvent.START,this.onStartDrag);
            box.addEventListener(this,sp.core.events.MouseEvent.DOUBLECLICK,this.onDoubleClick);
            if(sp.isOnTablet())
            {
                box.addEventListener(this,sp.core.events.MouseEvent.MOUSEUP, this.selectElement);
            }
            $(this.contentLayer).append(box.getGraphic());
            this.elements.push(box);
            this.bringToFront(box);
        },

        onDoubleClick:function(event)
        {
            this.dispatchEvent(event);
        },

        onCellMouseDown:function(event)
        {
            clearTimeout(this.mouseDownTimeout);
            this.mouseDownTimeout = null;
        },

        selectElement:function(event)
        {
            var __this = this;
            if(this.mouseDownTimeout){
                this.dispatchEvent(new sp.core.events.MouseEvent(event.target,sp.core.events.MouseEvent.DOUBLECLICK));
            }
            if(sp.isOnTablet())
            {
                this.mouseDownTimeout = setTimeout(function(){ __this.onCellMouseDown(event); }, 1000);
            }
            if(this.isSelected(event.target)) return;
            var originalEvent = event.originalEvent;
            if(originalEvent.ctrlKey)
            {
                this.selected.push(event.target);
                event.target.setSelected(true);
            }
            else
            {
                this.unselectAll();
                this.selected = [event.target];
            }
            event.target.setSelected(true);
            this.bringToFront(event.target);
            this.dispatchEvent(new sp.ui.relationalchart.OrgChartEvents(this, sp.ui.relationalchart.OrgChartEvents.SELECTIONCHANGE));
        },

        onGroupDrag:function(event)
        {
            for(var i=0; i<this.selected.length; i++)
            {
                this.selected[i].onDrag(event);
            }
            if(this.draggedSubordinates && this.draggedSubordinates.length)
            {
                for(var i=0; i<this.draggedSubordinates.length; i++)
                {
                    this.draggedSubordinates[i].onDrag(event);
                }
            }
        },

        onGroupDragStop:function(event)
        {
            for(var i=0; i<this.selected.length; i++)
            {
                this.selected[i].onStopDrag(event);
            }
            if(this.draggedSubordinates && this.draggedSubordinates.length)
            {
                for(var i=0; i<this.draggedSubordinates.length; i++)
                {
                    this.draggedSubordinates[i].onStopDrag(event);
                }
            }

        },

        onStartDrag:function(event,box)
        {
            var members = this.getSelectedBoxes();
            this.draggedSubordinates = [];

            if (this.linkSubordinates)
            {
                for (var i=0; i<this.selected.length; i++)
                {
                    this.draggedSubordinates = $.merge(this.draggedSubordinates,this.selected[i].getAllSubordinates());
                }
                this.draggedSubordinates = $.unique(this.draggedSubordinates);
                for(var i=0; i<this.draggedSubordinates.length; i++) members.push(this.draggedSubordinates[i].getGraphic());
            }



            var group = new sp.core.graphics.DragGroup(members);
            group.start(event.originalEvent.pageX,event.originalEvent.pageY);
            group.addEventListener(this,sp.core.events.DragEvent.DRAG, this.onGroupDrag);
            group.addEventListener(this,sp.core.events.DragEvent.STOP, this.onGroupDragStop);
            for(var i=0; i<this.selected.length; i++)
            {
                this.selected[i].onStartDrag(event);
            }
            for(var i=0; i<this.draggedSubordinates.length; i++)
            {
                this.draggedSubordinates[i].onStartDrag(event);
            }
        },

        hasMultipleSelection:function()
        {
            return this.selected.length>1;
        },

        getSelectedBoxes:function()
        {
            var boxes = [];
            for(var i=0; i<this.selected.length; i++)
            {
                boxes.push(this.selected[i].getGraphic());
            }
            return boxes;
        },

        unselectAll:function()
        {
            for(var i=0; i<this.selected.length; i++)
            {
                this.selected[i].setSelected(false);
            }
            this.selected = [];
        },

        removeBox:function(box)
        {
            sp.utils.ArrayUtils.removeElement(this.elements, box);
            if(this.selected)
            {
                sp.utils.ArrayUtils.removeElement(this.selected, box);
                this.dispatchEvent(new sp.ui.relationalchart.OrgChartEvents(this, sp.ui.relationalchart.OrgChartEvents.SELECTIONCHANGE));
            }
            $(box.getGraphic()).remove();
            box.kill();
        },

        onClickSelectionDragLayer:function()
        {
            this.unselectAll();
        },

        onAdd:function(event)
        {
            this.addBox(event.data[this.idProp]);
        },

        onRemove:function(event)
        {
            var box = this.getElementById(event.data[this.idProp]);
            if(box) this.removeBox(box);
        },

        onEdit:function(event)
        {
            //var box = this.getElementById(event.data[this.idProp]);
            //if(box) box.render();
        },

        onDataSet:function(event)
        {
            //this.refresh();
        },

        isSelected:function(element)
        {
            for(var i=0; i<this.selected.length; i++) if(this.selected[i]==element) return true;
        },

        getElementById:function(id)
        {
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return this.elements[i];
        },

        getSelected:function()
        {
            var ids = [];
            for(var i=0; i<this.selected.length; i++) ids.push(this.selected[i].getID());
            return ids;
        },

        toggleLinkSubordinatesLock: function(lock)
        {
            this.linkSubordinates = lock;
        },

        drawGridLines: function()
        {
            $(this.gridLayer).empty();
            var cWidth = $(this.gridLayer).width();
            var cHeight = $(this.gridLayer).height();
            var gridColor = this.options.gridColor;
            var gridSize = this.options.gridSize * this.zoomLevel;
            for (var i=0; i<=cWidth; i=i+gridSize)
            {
                var vertGridLine = this.createElement('div', {position: "absolute", left: (i*100/this.canvasWidth)+"%", top: 0, width: "1px", height: this.canvasHeight, background: gridColor}, ["vertical_grid_line"]);
                $(this.gridLayer).append(vertGridLine);
            }
            for (var i=0; i<=cHeight; i=i+gridSize)
            {
                var horizGridLine = this.createElement('div', {position: "absolute", top: (i*100/this.canvasHeight)+"%", left: 0, height: "1px", width: this.canvasWidth, background: gridColor}, ["horizontal_grid_line"]);
                $(this.gridLayer).append(horizGridLine);
            }
        },

        clearGridLines: function()
        {
            $(this.gridLayer).empty();
        },

        showGrid: function()
        {
            $(this.gridLayer).css('visibility','visible');
        },

        hideGrid: function()
        {
            $(this.gridLayer).css('visibility','hidden');
        },

        resizeGrid: function()
        {
            if (!this.zoomLevel) return;
            var __this = this;
            $(this.gridLayer).
                css('width', this.canvasWidth*this.zoomLevel).
                css('height', this.canvasHeight*this.zoomLevel);
            $(this.gridLayer).find(".vertical_grid_line").css('height', this.canvasHeight*this.zoomLevel+"px");
            $(this.gridLayer).find(".horizontal_grid_line").css('width', this.canvasWidth*this.zoomLevel+"px");
        },

        toggleSnapToGrid: function(snap)
        {
            this.snapToGrid = snap;
            for(var i=0; i<this.elements.length; i++)
            {
                this.elements[i].snapToGrid = this.snapToGrid;
                this.elements[i].gridSize = this.options.gridSize;
            }
            if (snap) this.showGrid();
            else this.hideGrid();
        },

        increaseZoomLevel: function ()
        {
            return this.setZoomLevel((Math.round((this.zoomLevel)*10)/10)+0.1);
        },

        decreaseZoomLevel: function ()
        {
            return this.setZoomLevel((Math.round((this.zoomLevel)*10)/10)-0.1);
        },

        setZoomLevelToFitContent: function ()
        {
            var $viewport = $(this.viewport);
            var edgeCoord = this.getMostBoxesCoords();
            if (!edgeCoord) return;
            var targetRectH = edgeCoord.maxY - edgeCoord.minY;
            var targetRectW = edgeCoord.maxX - edgeCoord.minX;
            var viewportH = $viewport.height() - 40;
            var viewportW = $viewport.width() - 40;
            var zoomLevelH = viewportH/targetRectH;
            var zoomLevelW = viewportW/targetRectW;
            var targetZoomLevel = Math.min(zoomLevelW, zoomLevelH);
            if (targetZoomLevel > 2) targetZoomLevel = 2;
            if (targetZoomLevel < 0.1) targetZoomLevel = 0.1;
            this.setZoomLevel(targetZoomLevel);

            return {x: edgeCoord.minX*targetZoomLevel - 20, y: edgeCoord.minY*targetZoomLevel - 20};
        },

        setZoomLevel: function (zoomLevel)
        {
            if (zoomLevel<0.1 || zoomLevel>1.5) return false;
            var prevZoomLevel = this.zoomLevel;
            this.zoomLevel = zoomLevel;
            //No idea of what the lines below are for - they just make everything screw up...
            /*$(this.getGraphic()).find('canvas').
             attr('width', this.canvasWidth* 0.99).
             attr('height', this.canvasHeight* 0.99);
             $(this.selectionDragLayer).
             css('width', this.canvasWidth* 0.99).
             css('height', this.canvasHeight* 0.99);
             $(this.selectionDrawLayer).
             css('width', this.canvasWidth* 0.99).
             css('height', this.canvasHeight* 0.99);*/
            this.resizeGrid();
            var __this = this;
            for(var i=0; i<this.elements.length; i++)
            {
                (function(index){
                    setTimeout(function(){
                        __this.elements[index].zoomLevel = zoomLevel;
                        __this.elements[index].refreshPosition();
                    },0);
                })(i);
            }

            this.dispatchEvent(new sp.ui.relationalchart.OrgChartEvents(this, sp.ui.relationalchart.OrgChartEvents.CHARTZOOM));

            var zoomDelta = (zoomLevel-prevZoomLevel);
            return zoomDelta;
        },

        getMostBoxesCoords: function()
        {
            var elements = this.elements;
            if (elements.length === 0) return;
            var minX = this.canvasWidth,
                maxX = 0,
                minY = this.canvasHeight,
                maxY = 0;
            for (var i = 0, elem = elements[i]; i < elements.length; i++, elem = elements[i])
            {
                if (!elem) continue;
                var elLeft = parseFloat($(elem.getGraphic()).css('left'));
                var elTop = parseFloat($(elem.getGraphic()).css('top'));
                var elRightScaled = elLeft / this.zoomLevel + parseFloat($(elem.getContent()).css('width'));
                var elBottomScaled = elTop / this.zoomLevel + parseFloat($(elem.getContent()).css('height'));
                var elMinX = elLeft / this.zoomLevel,
                    elMaxX = elRightScaled,
                    elMinY = elTop / this.zoomLevel,
                    elMaxY = elBottomScaled;
                minX = elMinX<minX? elMinX : minX;
                maxX = elMaxX>maxX? elMaxX : maxX;
                minY = elMinY<minY? elMinY : minY;
                maxY = elMaxY>maxY? elMaxY : maxY;
            }
            return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
        }
    }
);

spx.view.OrgChartBox = spx.view.Element.extend
(
    {
        __constructor:function(data, parent, model)
        {
            this.parent = parent;
            this.model = model;
            this.lines = []; // this will be the array of lines, manager, influence etc..
            this.__super(data);
        },

        init:function()
        {
            this.__super();
            this.addClass('org_chart_box');

            //TODO: these options should be configurable in the xml
            this.options = new sp.ui.relationalchart.OrganisationChartElementOptions(
                {
                    managerFieldName: this.data.getAttribute('managerFieldName') || 'Manager',
                    influenceesFieldName: this.data.getAttribute('influenceesFieldName') || 'Influencees',
                    influenceLineFill: "rgba(202,202,202,0.5)",
                    influenceLineStroke: "rgba(155,155,155,0.8)",
                    influenceesLineDrawFunction: sp.core.graphics.CanvasTools.drawMultipleTriangles,
                    xProp: this.data.getAttribute('xProp') || 'X',
                    yProp: this.data.getAttribute('yProp') || 'Y',
                    draggerOffset: -3,
                    draggerOffsetMiddle: 2,
                    width: 200,
                    minHeight: 80,
                    influenceCanvasPadding: 10
                }
            );

            this.snapToGrid = parent.snapToGrid || false;
            this.gridSize = parent.gridSize || 80;
            this.canvasWidth = parent.canvasWidth || $(window).width();
            this.canvasHeight = parent.canvasHeight || $(window).height();
            this.zoomLevel = parent.zoomLevel || 1;
            this.idProp =  parent.idProp || "ID";

            this.width = this.options.width || null;
            this.minHeight = this.options.minHeight || null;
            this.fontSize = this.options.fontSize || null;
            this.managerFieldName = this.options.managerFieldName || 'Relationships.ManagerID';
            this.influenceesFieldName = this.options.influenceesFieldName || 'Relationships.InfluenceeIDs';

            //this.disableSelection();
            $(this.getGraphic()).css("position","absolute");

            var __this = this;
            $(this.getGraphic()).mousedown(function(event){__this.onMouseDown(event);});
            $(this.getGraphic()).draggable({cursor: 'pointer', scroll: false, start:function(e,ui){__this.__onStartDrag(e,ui);}});
            $(this.getContent()).dblclick(function(e,ui){__this.onDoubleClick(e, ui)});

            //org chart box
            this.subordinates = [];
            this.influencees = [];
            this.dragMode = "";
            this.dropTarget = null; // used to work out if the influence dragger is dropped into empty space. Set to true if a box accepts it..and then check for null value on drop
            this.mdragger = this.addElement(this.createElement("div",{position:'absolute'},["dragger","manager"],{id:"mdragger"}));
            this.idragger = this.addElement(this.createElement("div",{position:'absolute'},["dragger","influencee"],{id:"idragger"}));
            $(this.mdragger).data("parentElement",this);
            $(this.idragger).data("parentElement",this);
            this.managerLine = this.createElement("canvas",{position:"absolute"},["line","manager"],{width:0,height:0});
            this.influenceLine = this.createElement("canvas",{position:"absolute", top: 0, left: 0},["line","influence"],{width:0,height:0});
            $(this.parent.getLayer("manager")).append(this.managerLine);
            $(this.parent.getLayer("influencees")).append(this.influenceLine);
            $(this.mdragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(){__this.onStartSelector_Manager();}, drag:function(){__this.onDragSelector_Manager();}, stop:function(){__this.onStopSelector_Manager();}});
            $(this.idragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(e,u){__this.onStartSelector_Influence(e,u);}, drag:function(e,u){__this.onDragSelector_Influence(e,u);}, stop:function(e,u){__this.onStopSelector_Influence(e,u);}});
            $(this.getContent()).droppable({drop:function(event,ui){__this.onDropped(event, ui)}});
        },

        refreshDraggerPositions: function()
        {
            var $content = $(this.getContent());
            var draggersArray = [this.mdragger, this.idragger];
            $(draggersArray).
                height(this.options.draggerWidth*this.zoomLevel).
                width(this.options.draggerWidth*this.zoomLevel).
                css('top', -1*this.options.draggerWidth*this.zoomLevel + this.options.draggerOffset*this.zoomLevel);

            $(this.mdragger).css('left', $content.outerWidth()/2 - $(this.mdragger).width() + this.options.draggerXOffset - this.options.draggerOffsetMiddle/2);
            $(this.idragger).css('left', $content.outerWidth()/2 + this.options.draggerXOffset + this.options.draggerOffsetMiddle/2);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTBOX;
        },

        getID:function()
        {
            return this.model.getID();
        },

        dispatchUIChange: function(data)
        {
            this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.CHANGE, data));
        },

        onDoubleClick:function(event)
        {
            this.dispatchEvent(new sp.core.events.MouseEvent(this,sp.core.events.MouseEvent.DOUBLECLICK,event));
        },

        setData: function()
        {

        },

        refreshPosition:function()
        {

            if(!this.model.getElementValue)
            // this function was triggering an error which stopped execution of the program.
            // it happens when there is no record set associated with the map. the map seems to create a box with
            // a field as the model instead of a record. at some point we need to fix this properly, by understanding
            // why this rogue box is being created with a field as its model, but for now, the quickest
            // option is just to fail gracefully - especially since this is a bug which is unlikely to be very noticeable
            // because how many people will actually create a map and not associate it with anything? - TW 14.9.2016
            {
                return;
            }

            var x = Number(this.model.getElementValue(this.options.xProp)) || 0;
            var y = Number(this.model.getElementValue(this.options.yProp)) || 0;

            $(this.getGraphic()).css("left", x * this.zoomLevel);
            $(this.getGraphic()).css("top", y * this.zoomLevel);
            this.refreshDimensions();
            this.refreshAllLines();
        },

        updatePosition:function()
        {
            var xPos = $(this.getGraphic()).position().left;
            var yPos = $(this.getGraphic()).position().top;
            //prevent dragging outside the viewport
            if (xPos < 0) xPos = 0;
            if (yPos < 0) yPos = 0;
            var boxHeight = $(this.content).height();
            var boxWidth = $(this.content).width();
            if (xPos > this.canvasWidth*this.zoomLevel-boxWidth) xPos = this.canvasWidth*this.zoomLevel - boxWidth;
            if (yPos > this.canvasHeight*this.zoomLevel-boxHeight) yPos = this.canvasHeight*this.zoomLevel - boxHeight;
            //expand canvases if needed

            var data = {};
            var o = this.options;

            if (!this.snapToGrid)
            {
                data[o.xProp] = xPos / this.zoomLevel;
                data[o.yProp] = yPos / this.zoomLevel;
            }
            else
            {
                var newPoint = this.getNearestSnapPoint(xPos/this.zoomLevel,yPos/this.zoomLevel,this.gridSize);
                data[o.xProp] = newPoint.x;
                data[o.yProp] = newPoint.y;
                this.refreshPosition();

            }
            this.dispatchUIChange(data);
        },

        getNearestSnapPoint: function(x,y,gridSize)
        {
            var nearestX = Math.round(x/gridSize)*gridSize;
            var nearestY = Math.round(y/gridSize)*gridSize;

            return {x:nearestX , y:nearestY};
        },

        getContent:function()
        {
            return this.getGraphic();
        },

        getBounds:function()
        {
            var $content = $(this.getContent());
            var pos = $content.offset();
            return new sp.core.geom.Rectangle(pos.left, pos.top, $content.width(), $content.height());
        },

        intersectsBounds:function(bounds)
        {
            var rect = this.getBounds();
            return bounds.contains(rect);
        },

        setSelected:function(val)
        {
            this.__selected = val;
            if(this.__selected)
            {
                $(this.getGraphic()).addClass("selected");
            }
            else
            {
                $(this.getGraphic()).removeClass("selected");
            }
        },

        onMouseDown:function(event)
        {
            if (event.currentTarget.tagName.toLowerCase() != 'select')
            {
                this.dispatchEvent(new sp.core.events.MouseEvent(this,sp.core.events.MouseEvent.MOUSEDOWN,event));
            }
        },

        __onStartDrag:function(event,ui)
        {
            // do not override. to handle a startDrag event, use onStartDrag
            this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.START,event.originalEvent));
        },

        refreshDimensions: function ()
        {
            var $content = $(this.getContent());

            if (this.width) $content.css('width', this.width * this.zoomLevel);
            if (this.minHeight) $content.css('minHeight', this.minHeight * this.zoomLevel);
            if (this.fontSize) $content.css('fontSize', this.fontSize * this.zoomLevel + 'pt');
            this.refreshDraggerPositions();
        },

        onModelChange:function()
        {
            this.refreshPosition();
            this.refreshAllLines();
        },

        refresh: function()
        {
            this.refreshPosition();
            this.refreshDimensions();
            this.refreshAllLines();
        },

        onChartElementsCreated:function()
        {
            this.refreshAllLines();
        },

        getInfluenceeIDs:function()
        {
            return sp.core.data.DataUtils.toArray(this.model.getElementValue(this.influenceesFieldName));
        },

        getInfluencees:function()
        {
            var ids = this.getInfluenceeIDs();
            var elements = [];
            for(var i=0; i<ids.length; i++)
            {
                var element = this.parent.getElementById(ids[i]);
                if (element) elements.push(element);
            }
            return elements;
        },

        removeInfluencee:function(box)
        {
            var ids = this.getInfluenceeIDs();
            sp.utils.ArrayUtils.removeElement(ids, box.getID());
            var item = {};
            item[this.idProp] = this.getID();
            item[this.influenceesFieldName] = ids;
            this.dispatchUIChange(item);
            this.clearInfluenceeLines();
            this.updateInfluenceLines();
        },

        getManagerID:function()
        {
            return this.model.getElementValue(this.managerFieldName);
        },

        getManager:function()
        {
            return this.parent.getElementById(this.getManagerID());
        },

        getInfluencerIDs:function()
        {
            var data = this.model.parent.getElements();
            var ids = [];
            for(var i=0; i < data.length; i++)
            {
                var influencees =  sp.core.data.DataUtils.toArray(data[i].getElementValue(this.influenceesFieldName));
                for(var n=0; n<influencees.length; n++)
                {
                    if(influencees[n]==this.getID()) ids.push(data[i].getID());
                }
            }
            return ids;
        },

        getInfluencers:function()
        {
            var ids = this.getInfluencerIDs();
            var elements = [];
            for(var i=0; i<ids.length; i++)
            {
                elements.push(this.parent.getElementById(ids[i]));
            }
            return elements;
        },

        getSubordinateIDs:function(id)
        {
            id = id || this.getID();
            var data = this.model.parent.getElements();
            var ids = [];
            for(var i=0; i<data.length; i++)
            {
                if(data[i].getElementValue(this.managerFieldName) == id) ids.push(data[i].getID());
            }
            return ids;
        },

        getSubordinates:function()
        {
            var ids = this.getSubordinateIDs();
            var elements = [];
            for(var i=0; i<ids.length; i++) elements.push(this.parent.getElementById(ids[i]));
            return elements;
        },

        getAllSubordinateIDs:function(parentId, storedIds) //gets subordinates and subordinates of subordinates
        {
            if (!storedIds) storedIds=[];
            var subs = this.getSubordinateIDs(parentId);
            for (var i=0; i<subs.length; i++)
            {
                if ($.inArray(subs[i], storedIds) < 0)
                {
                    storedIds.push(subs[i]);
                    this.getAllSubordinateIDs(subs[i], storedIds);
                }
            }
            return storedIds;
        },

        getAllSubordinates: function() //gets subordinates and subordinates of subordinates
        {
            var ids = this.getAllSubordinateIDs(this.getID());
            var elements = [];
            for(var i=0; i<ids.length; i++) elements.push(this.parent.getElementById(ids[i]));
            return elements;
        },

        onDropped:function(event, ui)
        {
            var parent = $(ui.draggable).data("parentElement");
            if (parent == this) return; // don't accept drops from self
            try
            {
                parent.acceptDrop(this);
            }
            catch(e)
            {
                sp.out("[OrganisationChartElement] cant accept drop:" + e.message);
            }
        },

        onStartSelector_Influence:function()
        {
            this.dragMode = sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.INFLUENCEE;
            $(this.parent.dragLine).css('zIndex', "9999");
            this.initialZIndex = $(this.getGraphic()).css('zIndex');
            $(this.getGraphic()).css('zIndex', "10000");
        },

        onStopSelector_Influence:function()
        {
            $(this.parent.dragLine).css('zIndex', "");
            $(this.getGraphic()).css('zIndex', this.initialZIndex);
            $(this.idragger).removeClass().addClass("dragger influencee");
            this.clearLine(this.parent.dragLine);
            this.dragMode = "";
            if(!this.dropTarget)
            {
                this.clearInfluencees();
            }
            this.dropTarget = null;
        },

        onDragSelector_Influence:function(event, ui)
        {
            var context = this.parent.dragLine.getContext("2d");
            if(context)
            {
                var $dragger = $(ui.helper);
                context.clearRect(0,0,this.parent.dragLine.width,this.parent.dragLine.height);
                context.beginPath();
                var dpos = $dragger.offset();
                dpos.left += $dragger.width()/2;
                dpos.top += $dragger.height()/2;
                var bpos = $(this.getContent()).offset();
                var xo = ($(this.getContent()).width())/2;
                var o = $(this.parent.dragLine).offset();
                var origin = {x:bpos.left+xo-o.left,y:bpos.top-o.top};
                var dest = {x:dpos.left-o.left,y:dpos.top-o.top};
                context.moveTo(origin.x, origin.y);
                context.lineTo(dest.x, dest.y);
                context.strokeStyle = "rgb(0,0,0)";
                context.stroke();

                var deltaY = origin.y - dest.y,
                    deltaX = origin.x - dest.x,
                    angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                if (angleInDegrees < 0) angleInDegrees = 180 + (180 + angleInDegrees);
                angleInDegrees = Math.floor(angleInDegrees/30)*30;
                if (!$dragger.hasClass("rotate-"+angleInDegrees)) $dragger.removeClass().addClass("dragger influencee rotate-"+angleInDegrees);
            }
        },

        onStartSelector_Manager:function()
        {
            this.dragMode = sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.MANAGER;
            var item = {};
            //item[this.idProp] = this.getID();
            item[this.managerFieldName] = '';

           // this.dispatchUIChange(item);

            //this.model.updateItem(item);
            this.clearManagerLine();
            $(this.parent.dragLine).css('zIndex', "9999");
            this.initialZIndex = $(this.getGraphic()).css('zIndex');
            $(this.getGraphic()).css('zIndex', "10000");
        },

        onStopSelector_Manager:function()
        {
            $(this.parent.dragLine).css('zIndex', "");
            $(this.getGraphic()).css('zIndex', this.initialZIndex);
            $(this.mdragger).removeClass().addClass("dragger manager");
            this.clearLine(this.parent.dragLine);
            this.updateManagerLine();
            this.dragMode = "";
            this.dropTarget = null;
            this.dispatchEvent(new sp.ui.relationalchart.OrganisationChartElementEvent(this,sp.ui.relationalchart.OrganisationChartElementEvent.ManagerUpdate,{boxID:this.getID()}));
        },

        onDragSelector_Manager:function()
        {
            var context = this.parent.dragLine.getContext("2d");
            if(context)
            {
                context.clearRect(0,0,this.parent.dragLine.width,this.parent.dragLine.height);
                context.beginPath();
                var dpos = new sp.core.geom.Point.fromTarget(this.mdragger);
                dpos.left += $(this.mdragger).width()/2;
                dpos.top += $(this.mdragger).height()/2;
                var to = dpos.toLocal(this.parent.dragLine);
                var bpos = new sp.core.geom.Point.fromTarget(this.getContent());
                bpos.left += ($(this.getContent()).width())/2;
                var from = bpos.toLocal(this.parent.dragLine);
                context.moveTo(from.left, from.top);
                context.lineTo(to.left, to.top);
                context.strokeStyle = "rgb(0,0,0)";
                context.stroke();

                var deltaY = from.top - to.top,
                    deltaX = from.left - to.left,
                    angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                if (angleInDegrees < 0) angleInDegrees = 180 + (180 + angleInDegrees);
                angleInDegrees = Math.floor(angleInDegrees/30)*30;
                $(this.mdragger).attr('class', 'dragger manager rotate-' + angleInDegrees);
            }
        },

        getDragMode:function()
        {
            return this.dragMode;
        },

        clearLine:function(line)
        {
            var context = line.getContext("2d");
            if(context) context.clearRect(0,0,line.width,line.height);
        },

        removeManager:function()
        {
            this.manager = null;
            this.clearManagerLine();

            var item = {};
            item[this.managerFieldName] = '';
            this.dispatchUIChange(item);
        },

        updateInfluenceLines:function()
        {
            var influencees = this.getInfluencees();
            if(!influencees.length || !this.influenceLine)
            {
                this.clearInfluenceeLines();
                return;
            }

            var context = this.influenceLine.getContext("2d");
            if(context)
            {
                context.clearRect(0,0,this.influenceLine.width,this.influenceLine.height);

                var bpos = this.getInfluenceLineOutPoint();

                var _top = bpos.top,
                    _bottom =  bpos.top,
                    _left = bpos.left,
                    _right = bpos.left;

                for(var i=0; i<influencees.length; i++)
                {
                    if(!influencees[i]) continue;
                    var pos = influencees[i].getInfluenceLineInPoint(bpos);
                    _top = pos.position=="lr" ? Math.min(_top, pos.top-100) : Math.min(_top, pos.top);
                    _bottom = pos.position=="lr" ? Math.max(_bottom, pos.top+100) : Math.max(_bottom, pos.top);
                    _left = pos.position=="tb" ? Math.min(_left, pos.left-100) : Math.min(_left, pos.left);
                    _right = pos.position=="tb" ? Math.max(_right, pos.left+100) : Math.max(_right, pos.left);
                }

                var _width = _right - _left;
                var _height = _bottom - _top;

                var p = this.options.influenceCanvasPadding;
                $(this.influenceLine).css({ width: _width + 2 * p, height: _height + 2 * p, top: _top - p, left: _left - p }).prop('width', _width + 2 * p).prop('height', _height + 2 * p);

                var getLeft = function(l) { return Math.max(1, Math.min(l - _left, _width)); };
                var getTop = function(t) { return Math.max(1, Math.min(t - _top, _height)); };

                for(var i=0; i<influencees.length; i++)
                {
                    if(!influencees[i]) continue;
                    var ipos = influencees[i].getInfluenceLineInPoint(bpos);
                    var styleObj = {fillStyle:this.options.influenceLineFill, strokeStyle:this.options.influenceLineStroke};
                    this.options.influenceesLineDrawFunction(this.influenceLine,{x:getLeft(bpos.left)+p,y:getTop(bpos.top)+p},{x:getLeft(ipos.left)+p,y:getTop(ipos.top)+p},styleObj);
                }
            }
        },

        getInfluenceLineInPoint:function(from)
        {
            var pos = this.getPosition();
            pos.top += $(this.getContent()).height()/2;
            pos.left += (from.left<pos.left)? 0 : (from.top>pos.top)? $(this.getContent()).width()-10 : 0;
            return pos;
        },

        getInfluenceLineOutPoint:function()
        {
            var pos = this.getPosition();
            pos.top += $(this.getContent()).height()/2;
            pos.left += $(this.getContent()).width()/2;
            return pos;
        },

        getPosition:function()
        {
            var x = parseInt($(this.getGraphic()).css("left"));
            var y = parseInt($(this.getGraphic()).css("top"));
            return new sp.core.geom.Point(x, y);
        },

        getLineInPoint:function(from)
        {
            var pos = this.getPosition();
            pos.top += (from.top<pos.top)? 10 : (from.top>pos.top)? $(this.getContent()).height()-10 : $(this.getContent()).height()/2;
            pos.left += $(this.getContent()).width()/2;
            return pos;
        },

        getLineOutPoint:function(to)
        {
            var pos = this.getPosition();
            pos.top += (to.top<pos.top)? 10 : (to.top>pos.top)? $(this.getContent()).height()-10 : $(this.getContent()).height()/2;
            pos.left += $(this.getContent()).width()/2;
            return pos;
        },

        onStartDrag:function()
        {
            if(this.options.hideLinesOnDrag) this.clearLinesOnDragStart();
        },

        onDrag:function()
        {
            if(!this.options.hideLinesOnDrag) this.refreshAllLines();
        },

        onStopDrag:function(event)
        {
            this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.STOP,event.originalEvent));
            this.updatePosition();
            this.refreshDimensions();
            this.refreshAllLines();
        },

        clearLinesOnDragStart:function()
        {
            this.clearManagerLine();
            this.clearInfluenceeLines();
            var subordinates = this.getSubordinates();
            for(var i=0; i<subordinates.length; i++) subordinates[i].clearManagerLine();
            var influencers = this.getInfluencers();
            for(var i=0; i<influencers.length; i++) influencers[i].clearInfluenceeLines();
        },

        clearManagerLine:function()
        {
            if (!this.managerLine) return;
            var context = this.managerLine.getContext("2d");
            if(context) context.clearRect(0,0,this.managerLine.width,this.managerLine.height);
            $(this.managerLine).css({width:0,height:0,top:0,left:0}).prop('width', 0).prop('height', 0);
        },

        clearInfluenceeLines:function()
        {
            if (!this.influenceLine) return;
            var context = this.influenceLine.getContext("2d");
            if(context) context.clearRect(0,0,this.influenceLine.width,this.influenceLine.height);
            $(this.influenceLine).css({width:0,height:0,top:0,left:0}).prop('width', 0).prop('height', 0);
        },

        updateManagerLine:function()
        {
            var manager = this.getManager();
            if(!this.managerLine) return;
            if(!manager)
            {
                this.clearManagerLine();
                return;
            }
            var context = this.managerLine.getContext("2d");
            if(context)
            {
                context.clearRect(0,0,this.managerLine.width,this.managerLine.height);
                var bpos = this.getLineOutPoint(manager.getPosition());
                var mpos = manager.getLineInPoint(bpos);

                var _width = Math.abs(bpos.left - mpos.left);
                var _height = Math.abs(bpos.top - mpos.top);
                var _top = Math.min(bpos.top, mpos.top);
                var _left = Math.min(bpos.left, mpos.left);

                if (mpos.top > bpos.top) _height += 30;

                $(this.managerLine).css({ width: _width + 2, height: _height + 2, top: _top - 1, left: _left - 1 }).prop('width', _width + 2).prop('height', _height + 2);

                var getLeft = function(l) { return Math.max(1, Math.min(l - _left, _width)); };
                var getTop = function(t) { return Math.max(1, Math.min(t - _top, _height)); };



                // well let me be the one to break the tradition of writing masses of uncommented code full of
                // cryptic functions, meaningless variables and magic numbers...and put in a spoiler (aka comment)
                // we need to make the line between manager and subordinate 'break' half way between the two.
                // unfortunately i have no idea what half this code does, but I can  see this line
                // var y1 = getTop(mpos.top + 30);
                // is setting the point the line breaks at to be randomly 30 pixels above the top of the manager..
                // so i'm going to guess that this is the place we need to change. now, we need to change the magic number 30
                // to be half the difference between top and bottom. but the manager could be below the subordinate, so I am not sure
                // what will happen if we do that. so let's try something and see if it works...
                var halfDistance = (bpos.top-mpos.top)/2;
                if(isNaN(halfDistance)) halfDistance = 30; // if anything is not a valid number, let's just revert to the original mystic code...

                context.beginPath();
                context.moveTo(getLeft(bpos.left), getTop(bpos.top));
                var x1 = getLeft(bpos.left);

                //var y1 = getTop(mpos.top + 30); //see comment above.. changing this original line to the one below..
                var y1 = getTop(mpos.top + halfDistance);
                var x2 = getLeft(mpos.left);
                var y2 = y1;
                context.lineTo(x1,y1);
                context.lineTo(x2,y2);
                context.lineTo(getLeft(mpos.left), getTop(mpos.top));
                context.strokeStyle = "rgb(0,0,0)";
                context.stroke();
            }
        },

        refreshAllLines:function()
        {
            this.updateManagerLine();
            var subordinates = this.getSubordinates();
            for(var i=0; i<subordinates.length; i++) if(subordinates[i]) subordinates[i].updateManagerLine(this);
            this.updateInfluenceLines();
            var influencers = this.getInfluencers();
            for(var i=0; i<influencers.length; i++) if(influencers[i]) influencers[i].updateInfluenceLines();
        },

        acceptDrop:function(targetElement)
        {
            var mode = this.getDragMode();
            if(mode==sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.MANAGER)
            {
                if(targetElement)
                {
                    var item = {};
                    item[this.managerFieldName] = targetElement.getID();
                    this.dispatchUIChange(item);
                    this.dropTarget = true;
                }else
                {
                    // TODO we don't need to remove the manager..because it was removed as soon as we started dragging since we can have only one?
                }
            }else if(mode==sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.INFLUENCEE)
            {
                if(targetElement)
                {
                    var influenceeIDs = this.getInfluenceeIDs();
                    if($.inArray(targetElement.getID(),influenceeIDs)==-1) influenceeIDs.push(targetElement.getID());

                    var item = {};
                    item[this.influenceesFieldName] = influenceeIDs;
                    this.dispatchUIChange(item);
                    this.dropTarget = true;
                }
            }
        },

        clearInfluencees:function()
        {
            var item = {};
            item[this.influenceesFieldName] = [];
            this.dispatchUIChange(item);
            this.clearInfluenceeLines();
        },

        kill:function(visualOnly)
        {
            $(this.influenceLine).remove();
            $(this.managerLine).remove();
            if (!visualOnly)
            {
                var influencers = this.getInfluencers();
                for(var i=0; i<influencers.length; i++)
                {
                    influencers[i].removeInfluencee(this);
                }

                var subordinates = this.getSubordinates();
                for(var i=0; i<subordinates.length; i++)
                {
                    subordinates[i].removeManager();
                }
            }
        }
    }
);

spx.view.OrgChartDialog = spx.view.Element.extend
(
    {
        init: function()
        {
            this.__super();
            this.addClass('org_chart_dialog');

            this.closeButton = this.addElement(this.create('div', { classes: ['btn_close', 'glyphicon glyphicon-remove'] }));
            this.closeButton.click($.proxy(this.onCloseButtonClick, this));
        },

        onCloseButtonClick: function()
        {
            $(this.getGraphic()).find('input').blur(); //quick fix
            this.dispatchEvent(new sp.core.events.UIEvent(this, sp.core.events.UIEvent.CLOSE));
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTDIALOG;
        },

        kill:function()
        {
            $(this.getGraphic()).unbind();
        }
    }
);

spx.view.ElementFactory =
{
    create:function(element)
    {
        if(!element) return;
        if(element.getType())
        {
            switch(element.getType())
            {
                case spx.model.layout.ElementTypes.CONTAINER:
                    return new spx.view.Container(element);
                case spx.model.layout.ElementTypes.PAGESET:
                    return new spx.view.PageSet(element);
                case spx.model.layout.ElementTypes.PAGE:
                    return new spx.view.Page(element);
                case spx.model.layout.ElementTypes.LABEL:
                    return new spx.view.Label(element);
                case spx.model.layout.ElementTypes.TEXTFIELD:
                    return new spx.view.TextField(element);
                case spx.model.layout.ElementTypes.TEXTAREA:
                    return new spx.view.TextArea(element);
                case spx.model.layout.ElementTypes.DATEFIELD:
                    return new spx.view.DateField(element);
                case spx.model.layout.ElementTypes.NUMERICFIELD:
                    return new spx.view.NumericField(element);
                case spx.model.layout.ElementTypes.COMBO:
                    return new spx.view.Combo(element);
                case spx.model.layout.ElementTypes.CHECKBOX:
                    return new spx.view.Checkbox(element);
                case spx.model.layout.ElementTypes.SLIDER:
                    return new spx.view.Slider(element);
                case spx.model.layout.ElementTypes.TABLE:
                    return new spx.view.Table(element);
                case spx.model.layout.ElementTypes.IMAGE:
                    return new spx.view.Image(element);
                case spx.model.layout.ElementTypes.RADIOGROUP:
                    return new spx.view.RadioGroup(element);
                case spx.model.layout.ElementTypes.RICHTEXT:
                    return new spx.view.RichText(element);
                case spx.model.layout.ElementTypes.BUTTON:
                    return new spx.view.Button(element);
                case spx.model.layout.ElementTypes.DIALOG:
                    return new spx.view.Dialog(element);
                case spx.model.layout.ElementTypes.RECORDVIEW:
                    return new spx.view.RecordView(element);
                case spx.model.layout.ElementTypes.REPEATER:
                    return new spx.view.RepeaterView(element);
                case spx.model.layout.ElementTypes.LOOKUP:
                    return new spx.view.Lookup(element);
                case spx.model.layout.ElementTypes.CHART:
                    return new spx.view.Chart(element);
                case spx.model.layout.ElementTypes.BARCHART:
                    return new spx.view.BarChart(element);
                case spx.model.layout.ElementTypes.LINECHART:
                    return new spx.view.LineChart(element);
                case spx.model.layout.ElementTypes.AREACHART:
                    return new spx.view.AreaChart(element);
                case spx.model.layout.ElementTypes.PIECHART:
                    return new spx.view.PieChart(element);
                case spx.model.layout.ElementTypes.UNSUPPORTED:
                    return new spx.view.Unsupported(element);
                case spx.model.layout.ElementTypes.ORGCHART:
                    return new spx.view.OrgChart(element);
                case spx.model.layout.ElementTypes.ORGCHARTBOX:
                    return new spx.view.OrgChartBox(element);
                case spx.model.layout.ElementTypes.ORGCHARTDIALOG:
                    return new spx.view.OrgChartDialog(element);
            }
        }

        try
        {
            var str = "new " + element.getView() + "(element)";
            var obj = eval(str);
            if(obj) return obj;
        }
        catch(e)
        {
            // uncomment the line below if you are having trouble identifying bugs in the view being created because of the try catch
            //sp.out("Error trying to evaluate resource" + xml.nodeName + " e:" + e.message);
        }
    }
};
