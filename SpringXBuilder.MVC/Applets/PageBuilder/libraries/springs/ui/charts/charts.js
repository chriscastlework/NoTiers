sp.namespace("sp.ui.charts.BaseChart",
             "sp.ui.charts.BaseChartOptions",
             "sp.ui.charts.LineChart",
             "sp.ui.charts.LineChartOptions",
             "sp.ui.charts.PieChart",
             "sp.ui.charts.PieChartOptions",
             "sp.ui.charts.GaugeChart",
             "sp.ui.charts.GaugeChartOptions",
             "sp.ui.charts.BubbleChart",
             "sp.ui.charts.BubbleChartOptions",
             "sp.ui.charts.BarChart",
             "sp.ui.charts.BarChartOptions",
             "sp.ui.charts.WaterfallChart",
             "sp.ui.charts.WaterfallChartOptions");


sp.ui.charts.BaseChart = sp.core.events.EventDispatcher.extend
(
{
    chartProvider: 'jqPlot',
    chartObject: null,
    chartOptions: {},
    dataProvider: [],

    __constructor: function(type, container, options)
    {
        this.__super();
        this.log = sp.core.log.LogManager.getLog('sp.ui.charts');
        this.log.setLevel(sp.core.log.Level.ERROR);

        this.type = type;
        this.container = container;
        this.options = options || new sp.ui.charts.BaseChartOptions();
        this.init();

        this.log.trace('New "'+ type +'" chart created.');
    },

    setDataProvider: function(dataProvider)
    {
        this.dataProvider = dataProvider;
    },

    getDataProvider: function()
    {
        return (this.options.multiSeries) ? this.dataProvider : [this.dataProvider];
    },

    setOptions: function(options)
    {
        this.options = options;
    },

    getOptions: function()
    {
        return this.options;
    },

    init: function()
    {
        $.jqplot.config.enablePlugins = false;
    },

    draw: function()
    {
        if (!this.getDataProvider()[0] || this.getDataProvider()[0].length < 1) return;

        $(this.container).css('width', this.options.width);
        $(this.container).css('height', this.options.height);

        this.chartOptions = this.options.getJqPlotOptions();

        if (this.options.dragable) $.jqplot.config.enablePlugins = true;

        this.chartObject = $.jqplot($(this.container).attr('id'), this.getDataProvider(), this.chartOptions);
        this.log.trace('The "'+ this.type + '" chart has been drawn into "' + $(this.container).attr('id') + '" container with the following options: ' + sp.stringify(this.options, {skipObjects: true}));

        if (this.options.dragable) $.jqplot.config.enablePlugins = false;
    },

    redraw: function()
    {
        if (!this.getDataProvider()[0] || this.getDataProvider()[0].length < 1) return;

        $(this.container).css('width', this.options.width);
        $(this.container).css('height', this.options.height);

        this.chartOptions = this.options.getJqPlotOptions();

        if (this.options.dragable) $.jqplot.config.enablePlugins = true;

        $.jqplot($(this.container).attr('id'), this.getDataProvider(), this.chartOptions).replot();
        this.log.trace('The "'+ this.type + '" chart has been redrawn into "' + $(this.container).attr('id') + '" container with the following options: ' + sp.stringify(this.options, {skipObjects: true}));

        if (this.options.dragable) $.jqplot.config.enablePlugins = false;
    }
}
);

sp.ui.charts.BaseChartOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.width = 300;
        this.height = 200;

        this.title = 'New Chart';
        this.titleFontFamily = null;
        this.titleFontSize = null;
        this.titleColor = null;
        this.titleAlign = null;

        this.showLegend = null;
        this.legendLocation = null;
        this.legendPlacement = null;

        // ToDo: Parametrize these !!!
        this.seriesLayout = [];
        this.multiSeries = false;

        this.xAxisMin = null;
        this.xAxisMax = null;
        this.xAxisTicksNumber = null;
        this.xAxisTickInterval = null;

        this.xTicks = [];
        this.xTicksRenderer = 'category';
        this.xAxisTickAngle = null;
        this.xAxisShowTickMark = null;
        this.xAxisShowGridLine = null;
        this.xAxisFontSize = null;
        this.xAxisLabelRenderer = null;
        this.xAxisLabelOptions = null;

        this.yAxisMin = null;
        this.yAxisMax = null;
        this.yAxisTicksNumber = null;
        this.yAxisTickInterval = null;
        this.xAxisLabel = null;

        this.yTicks = [];
        this.yTicksRenderer = 'category';
        this.yAxisTickAngle = null;
        this.yAxisShowTickMark = null;
        this.yAxisShowGridLine = null;
        this.yAxisLabel = null;
        this.yAxisLabelRenderer = null;
        this.yAxisLabelOptions = null;

        this.drawGridlines = true;
        this.gridBackground = 'rgba(0, 0, 0, 0)'; // 'transparent' does not work in IE < 9

        this.showPointMarkers = true;
        this.showPointLabels = null;

        this.animate = null;
        this.animateOnRedraw = null;

        // ToDo: Parametrize these !!!
        this.canvasOverlay = null;

        // ToDo: Parametrize these !!!
        this.x2Axis = null;
        this.y2Axis = null;

        this.selectable = false;
    },

    getJqPlotOptions: function()
    {
        var options =
        {
            title: {},
            seriesDefaults: {
               rendererOptions: {}
            },
            series: [],
            axes: {
                xaxis: {},
                x2axis: {},
                yaxis: {},
                y2axis: {}
            },
            legend: {},
            grid: {},
            canvasOverlay: {}
        };

        if (this.title)
        {
            options.title.show = true;
            options.title.text = this.title;
            if (this.titleFontFamily) options.title.fontFamily = this.titleFontFamily;
            if (this.titleFontSize) options.title.fontSize = this.titleFontSize;
            if (this.titleColor) options.title.textColor = this.titleColor;
            if (this.titleAlign) options.title.textAlign = this.titleAlign;
        }

        if (this.showLegend)
        {
            options.legend.show = true;
            if (this.legendLocation !== null) options.legend.location = this.legendLocation;
            if (this.legendPlacement !== null) options.legend.placement = this.legendPlacement;
        }

        if (this.seriesLayout.length > 0)
        {
            options.series = this.seriesLayout;
        }

        if (this.xAxisMin !== null) options.axes.xaxis.min = this.xAxisMin;
        if (this.xAxisMax !== null) options.axes.xaxis.max = this.xAxisMax;
        if (this.xAxisTicksNumber !== null) options.axes.xaxis.numberTicks = this.xAxisTicksNumber;
        if (this.xAxisTickInterval !== null) options.axes.xaxis.tickInterval = this.xAxisTickInterval;
        if (this.xAxisLabel != null) options.axes.xaxis.label = this.xAxisLabel;
        if (this.xAxisLabelRenderer != null) options.axes.xaxis.labelRenderer = this.xAxisLabelRenderer;
        if (this.xAxisLabelOptions != null) options.axes.xaxis.labelOptions = this.xAxisLabelOptions;

        if (this.xTicks.length > 0)
        {
            if (this.xTicksRenderer == 'category')
            {
                options.axes.xaxis.renderer = $.jqplot.CategoryAxisRenderer;
            }
            else
            {
                options.axes.xaxis.renderer = $.jqplot.LinearAxisRenderer;
            }

            options.axes.xaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.xaxis.ticks = this.xTicks;
            options.axes.xaxis.tickRenderer = $.jqplot.CanvasAxisTickRenderer;
            options.axes.xaxis.tickOptions = {};

            if (this.xAxisTickAngle !== null) options.axes.xaxis.tickOptions.angle = this.xAxisTickAngle;
            if (this.xAxisShowTickMark !== null) options.axes.xaxis.tickOptions.showMark = this.xAxisShowTickMark;
            if (this.xAxisShowGridLine !== null) options.axes.xaxis.tickOptions.showGridline = this.xAxisShowGridLine;
            if (this.xAxisFontSize !== null) options.axes.xaxis.tickOptions.fontSize = this.xAxisFontSize;
        }
        else
        {
            if (this.xAxisShowTickMark !== null) options.axes.xaxis.showTicks = this.xAxisShowTickMark;
        }

        if (this.yAxisMin !== null) options.axes.yaxis.min = this.yAxisMin;
        if (this.yAxisMax !== null) options.axes.yaxis.max = this.yAxisMax;
        if (this.yAxisTicksNumber !== null) options.axes.yaxis.numberTicks = this.yAxisTicksNumber;
        if (this.yAxisTickInterval !== null) options.axes.yaxis.tickInterval = this.yAxisTickInterval;
        if (this.yAxisLabel != null) options.axes.yaxis.label = this.yAxisLabel;
        if (this.yAxisLabelRenderer != null) options.axes.yaxis.labelRenderer = this.yAxisLabelRenderer;
        if (this.yAxisLabelOptions != null) options.axes.yaxis.labelOptions = this.yAxisLabelOptions;

        if (this.yTicks.length > 0)
        {
            if (this.yTicksRenderer == 'category')
            {
                options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
            }
            else
            {
                options.axes.yaxis.renderer = $.jqplot.LinearAxisRenderer;
            }
            options.axes.yaxis.ticks = this.yTicks;
            options.axes.yaxis.tickRenderer = $.jqplot.CanvasAxisTickRenderer;
            options.axes.yaxis.tickOptions = {};

            if (this.yAxisTickAngle !== null) options.axes.yaxis.tickOptions.angle = this.yAxisTickAngle;
            if (this.yAxisShowTickMark !== null) options.axes.yaxis.tickOptions.showMark = this.yAxisShowTickMark;
            if (this.yAxisShowGridLine !== null) options.axes.yaxis.tickOptions.showGridline = this.yAxisShowGridLine;
        }
        else
        {
            if (this.yAxisShowTickMark !== null) options.axes.yaxis.showTicks = this.yAxisShowTickMark;
        }

        if (this.drawGridlines !== null) options.grid.drawGridlines = this.drawGridlines;
        if (this.gridBackground !== null) options.grid.background = this.gridBackground;

        if (this.showPointMarkers !== null) options.seriesDefaults.showMarker = this.showPointMarkers;
        if (this.showPointLabels !== null) options.seriesDefaults.pointLabels = { show: this.showPointLabels };

        if (this.animate !== null) options.animate = this.animate;
        if (this.animateOnRedraw !== null) options.animateReplot = this.animateOnRedraw;

        if (this.canvasOverlay !== null) options.canvasOverlay = this.canvasOverlay;

        if (this.x2Axis !== null) options.axes.x2axis = this.x2Axis;
        if (this.y2Axis !== null) options.axes.y2axis = this.y2Axis;

        options.selectable = this.selectable;

        return options;
    }
}
);


sp.ui.charts.LineChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        this.__super('line', container, options);
    }
}
);

sp.ui.charts.LineChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();

        this.smoothLineJoints = false;
    },

    getJqPlotOptions: function()
    {
        var options = this.__super();

        options.seriesDefaults.renderer = $.jqplot.LineRenderer;
        options.seriesDefaults.rendererOptions.smooth = this.smoothLineJoints;

        return options;
    }
}
);


sp.ui.charts.PieChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        this.__super('pie', container, options);
    }
}
);

sp.ui.charts.PieChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();

        this.showPieDataLabels = true;
        this.pieDataLabels = 'label';
        this.pieDataLabelThreshold = null;
        this.pieStartAngle = null;
    },

    getJqPlotOptions: function()
    {
        var options = this.__super();

        options.seriesDefaults.renderer = $.jqplot.PieRenderer;
        options.seriesDefaults.rendererOptions.showDataLabels = this.showPieDataLabels;
        options.seriesDefaults.rendererOptions.dataLabels = this.pieDataLabels;
        options.seriesDefaults.rendererOptions.sliceMargin = this.sliceMargin;
        options.seriesDefaults.rendererOptions.showDataLabels = this.showDataLabels;
        options.seriesDefaults.rendererOptions.dataLabels = this.dataLabels;

        if (this.pieDataLabelThreshold !== null) options.seriesDefaults.rendererOptions.dataLabelThreshold = this.pieDataLabelThreshold;
        if (this.pieStartAngle !== null) options.seriesDefaults.rendererOptions.startAngle = this.pieStartAngle;

        return options;
    }
}
);


sp.ui.charts.GaugeChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        this.__super('gauge', container, options);
    }
}
);

sp.ui.charts.GaugeChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();

        this.gaugeIntervals = [];
        this.gaugeIntervalColors = [];
    },

    getJqPlotOptions: function()
    {
        var options = this.__super();

        options.seriesDefaults.renderer = $.jqplot.MeterGaugeRenderer;

        if (this.gaugeIntervals.length > 0)
        {
            options.seriesDefaults.rendererOptions.intervals = this.gaugeIntervals;

            if (this.gaugeIntervalColors.length > 0) options.seriesDefaults.rendererOptions.intervalColors = this.gaugeIntervalColors;
        }

        return options;
    }
}
);


sp.ui.charts.BubbleChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        this.__super('bubble', container, options);
    }
}
);

sp.ui.charts.BubbleChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();

        this.autoscaleBubbles = true;
        this.dragable = false;
    },

    getJqPlotOptions: function()
    {
        var options = this.__super();

        options.seriesDefaults.renderer = $.jqplot.BubbleRenderer;
        options.seriesDefaults.rendererOptions.bubbleAlpha = 0.6;
        options.seriesDefaults.rendererOptions.highlightAlpha = 0.8;
        options.seriesDefaults.rendererOptions.autoscaleBubbles = this.autoscaleBubbles;
        options.seriesDefaults.shadow = true;
        options.seriesDefaults.shadowAlpha = 0.05;

        return options;
    }
}
);


sp.ui.charts.BarChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        this.__super('bar', container, options);
    }
}
);

sp.ui.charts.BarChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();

        this.barWidth = 10;
        this.barDirection = 'vertical';
        this.varyBarColors = true;
    },

    getJqPlotOptions: function()
    {
        var options = this.__super();

        options.seriesDefaults.renderer = $.jqplot.BarRenderer;
        options.seriesDefaults.rendererOptions.varyBarColor = this.varyBarColors;
        options.seriesDefaults.rendererOptions.barWidth = this.barWidth;
        options.seriesDefaults.rendererOptions.barDirection = this.barDirection;

        return options;
    }
}
);


sp.ui.charts.WaterfallChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        this.__super('waterfall', container, options);
    }
}
);

sp.ui.charts.WaterfallChartOptions = sp.ui.charts.BarChartOptions.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();
    },

    getJqPlotOptions: function()
    {
        var options = this.__super();

        options.seriesDefaults.rendererOptions.waterfall = true;

        return options;
    }
}
);
