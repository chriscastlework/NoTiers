sp.namespace("sp.ui.charts.RadarChart");

sp.ui.charts.RadarChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        options = options || new sp.ui.charts.RadarChartOptions();
        this.__super('radar', container, options);
    },

    init: function ()
    {
        this.infoButtons = [];
        this.stampers = [];
        this.refData = [];
    },

    createCanvas: function ()
    {
        this.canvas = new sp.core.graphics.Graphic().createElement("canvas");
        $(this.canvas).attr("width", this.options.width).attr("height", this.options.height);
        $(this.container).append(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.context.textBaseline = 'middle';
    },

    computeCanvasAndLegendDimensions: function ()
    {
        this.chartCanvasWidth = this.options.width-2*this.options.xMargins - 2*this.options.xPadding;
        this.chartCanvasHeight = this.options.height-2*this.options.yMargins - 2*this.options.yPadding;
        var centerDimensionX = this.chartCanvasWidth - this.options.maxLegendWidth - 2*this.options.legendMargins;
        var centerDimensionY = this.chartCanvasHeight;
        var center = this.getCenter(centerDimensionX, centerDimensionY);
        center.x+=this.options.xMargins + this.options.xPadding;
        center.y+=this.options.yMargins + this.options.yPadding;
        this.center = center;
        var maxChartWidth = this.chartCanvasWidth -this.options.maxLegendWidth - 2*this.options.legendMargins;
        var fontSize = parseInt(this.options.dataFont.split("p")[0]);
        var maxChartHeight = this.chartCanvasHeight - 2 * (fontSize + 6); //this is to fit in the top and bottom labels
        this.radius = this.getRadius(maxChartWidth, this.chartCanvasHeight-24);
        if (this.options.maxLegendWidth > this.chartCanvasWidth/2)
        {
            this.options.drawLegend = false;
            sp.out("The defined maxLegendWidth is too big. Drawing legend canceled.");
        }
        else
        {
            this.maxLegendWidth = this.options.maxLegendWidth - 2*this.options.legendMargins;
            this.maxLegendHeight = this.chartCanvasHeight - 2*this.options.legendMargins;
        }
    },

    draw: function ()
    {
        if (!this.canvas) this.createCanvas();
        this.computeCanvasAndLegendDimensions();

        $(this.container).css('width', this.options.width);
        $(this.container).css('height', this.options.height);
        $(this.container).css('padding', this.options.yPadding + 'px '+ this.options.xPadding + 'px');
        $(this.canvas)
            .attr('height', this.options.height)
            .attr('width', this.options.width);

        this.context.clearRect(0,0,this.options.width,this.options.height);

        this.drawGrid();
        this.drawContent();
        if (this.options.drawLegend) this.drawLegend();
    },

    redraw: function ()
    {
        this.draw();
    },

    getCenter: function (width, height)
    {
        return {x: width/2, y: height/2};
    },

    getRadius: function (width, height)
    {
        return Math.min(width, height) / 2;
    },

    getPointFromAngle: function (point, angle, radius)
    {
        var rads = (angle-90)*Math.PI/180;
        return {
            x: point.x+(radius*Math.cos(rads)),
            y: point.y+(radius*Math.sin(rads))
        }
    },

    positionLabel: function (text, point, center)
    {
        var labelPosition = {x: point.x, y: point.y};
        var labelDimensions = this.context.measureText(text);
        var maxX = this.options.width - this.getLegendWidth() - 2*this.options.legendMargins;


        if (labelPosition.x < center.x) labelPosition.x -= (labelDimensions.width + 15);
        if (labelPosition.x > center.x) labelPosition.x += 10;

        labelPosition.y += labelPosition.y >= center.y ? 10 : -10;

        if (labelPosition.x<0)
        {
            labelPosition.deviation = Math.abs(labelPosition.x);
            labelPosition.x=0;
        }
        if (labelPosition.x+labelDimensions.width > maxX) labelPosition.x = maxX - labelDimensions.width - 10;

        if (labelPosition.x == center.x)
        {
//            previous version of calculating, in case we need to revert
//            labelPosition.x -= labelDimensions.width + 30;
//            labelPosition.y += labelPosition.y > center.y? -20 : 10;
            var fontSize = parseInt(this.options.dataFont.split("p")[0]);
            if (labelPosition.y > center.y)
            {
                labelPosition.x -= labelDimensions.width/2 + (this.options.showStampers ? 15 : 0);
                labelPosition.y += (fontSize + 2);
            }
            else
            {
                labelPosition.x -= labelDimensions.width/2 + (this.options.showStampers ? 15 : 0);
                labelPosition.y -= (fontSize + 2);
            }
        }

		if(!this.options.labelsCustomPosition){
			labelPosition.x += 20;
		}else{
			this.labelsCustomPosition( labelPosition, center );
		}

		if(!this.options.labelsInDialogPosition){
			labelPosition.x += 20;
		}else{
			this.labelsInDialogPosition( labelPosition, center );
		}

        return labelPosition;
    },

    getButtonPosition: function(text, labelPosition)
    {
        var textLength = this.context.measureText(text).width;
        if (textLength > 100) textLength = 100;

        var left = labelPosition.x + this.options.xPadding/1.5 + 'px';
        var top = labelPosition.y + 'px';
        return {left: left, top: top, width: textLength};
    },

    drawGrid: function ()
    {
        var context = this.context;
        var center = this.center;
        var radius = this.radius;

        var arrLabels = this.options.dataSetItemLabels;
        var arrNumLabels = this.options.tickMarkLabels;

        var points = this.getPoints();

        context.strokeStyle = 'gray';
        context.font = this.options.dataFont;
        for (var i=0; i<points.length; i++)
        {
            var point = points[i][points[i].length-1];
            context.beginPath();
            context.moveTo(center.x, center.y);
            context.lineTo(point.x, point.y);
            context.stroke();

            var labelPosition = this.positionLabel(arrLabels[i], point, center);
            if (this.options.wrapLabels)
            {
                if (labelPosition.deviation && labelPosition.x < this.center.x)
                {
                    this.wrapText(context, arrLabels[i], labelPosition.x, labelPosition.y, radius/2-labelPosition.deviation, 12);
                }
                else
                {
                    this.wrapText(context, arrLabels[i], labelPosition.x, labelPosition.y, radius/2, 12);
                }

            }
            else
            {
                context.fillText(arrLabels[i], labelPosition.x, labelPosition.y);
            }

            if (this.options.showInfoButtons)
            {
                if (this.infoButtons[i]) $(this.infoButtons[i]).remove();

                var infoButton = document.createElement('div');
                var buttonPosition = this.getButtonPosition(arrLabels[i], labelPosition);
                $(infoButton).addClass('info_button');
                $(infoButton).css({left: buttonPosition.left, top: buttonPosition.top});
                var refData = this.refData[i] || [];
                $(infoButton).data('refData', refData);
                $(infoButton).data('label', arrLabels[i]);
                var __this = this;
                $(infoButton).click(function(){ __this.dispatchEvent(new sp.ui.charts.RadarCHartEvent(this, sp.ui.charts.RadarCHartEvent.SHOWDETAILS)); });
                $(this.container).append(infoButton);
                this.infoButtons[i] = infoButton;
            }
            if (this.options.showStampers)
            {
                if (this.stampers[i]) $(this.stampers[i]).remove();
                var stamperPosition = this.getButtonPosition(arrLabels[i], labelPosition);
                var stamper = document.createElement('div');
                $(stamper).addClass('stamper');
                $(this.container).append(stamper);

                var flaggable = new infoteam.ui.FlaggableText('');
                $(stamper).append(flaggable.getGraphic());

                var value = 0;
                if (this.refData[i])
                {
                    value = parseInt(this.refData[i].Flag) || 0;
                    flaggable.setFlag(value);
                    flaggable.ID = this.refData[i].ID;
                }
                flaggable.addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onFlagChange);

                var width = buttonPosition.width + 55;
                $(stamper).css({left: stamperPosition.left, top: stamperPosition.top, width: width});

                this.stampers[i] = stamper;
            }
        }

        for (var i=0; i<points.length; i++)
        {
            for (var n=0; n<points[i].length; n++)
            {
                var start = (i>0)? points[i-1][n] : points[points.length-1][n];
                var end = points[i][n];

                context.beginPath();
                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
                context.stroke();
            }
        }

        for (var i=0; points.length > 0 && i<points[0].length; i++)
        {
            var point = points[0][i];

            var label = arrNumLabels[i];
            var labelDimensions = context.measureText(label);
            context.fillStyle='white';
            context.beginPath();
            context.arc(point.x, point.y, 5, 0, 2*Math.PI);
            context.fill();
            context.fillStyle='black';
            context.fillText(label, point.x-labelDimensions.width/2, point.y);
        }
    },

    wrapText: function (context, text, x, y, maxWidth, lineHeight)
    {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if(testWidth > maxWidth) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    },

    onFlagChange: function(event)
    {
        var target = event.target;
        this.dispatchEvent(new sp.ui.charts.RadarCHartEvent(this, sp.ui.charts.RadarCHartEvent.FLAGCHANGE, {id: target.ID, flagId: target.getValue()}))
    },

    getPoints: function()
    {
        var center = this.center;
        var radius = this.radius;
        var arrLabels = this.options.dataSetItemLabels;
        var arrNumLabels = this.options.tickMarkLabels;

        var angle = 360/arrLabels.length;
        var rStep = radius / (arrNumLabels.length - 1);

        var points = [];

        for (var i=0; i<arrLabels.length; i++)
        {
            var p = [];
            var a = i*angle;

            for (var n=0; n<arrNumLabels.length; n++)
            {
                var r = n * rStep;
                var point = this.getPointFromAngle({x: center.x, y: center.y}, a, r);
                p.push(point);
            }
            points.push(p);
        }

        return points;
    },

    getSeries: function (seriesIndex)
    {
        return this.series[seriesIndex];
    },

    setDataProvider: function (data, refData)
    {
        this.series = data;
        this.refData = refData;
    },

    setSeries: function (seriesIndex, series)
    {
        if (!this.series) this.series = [];
        this.series[seriesIndex] = series;
    },

    drawContent: function ()
    {
        var arrLabels = this.options.dataSetItemLabels;
        var minVal = this.options.minValue;
        var maxVal = this.options.maxValue;

        var angle = 360 / arrLabels.length;
        var context = this.context;
        var center = this.center;
        var radius = this.radius;

        context.font = this.options.dataFont;
        var dSets = this.options.dataSets;
        for (var i=0; i<dSets.length; i++)
        {
            var series = this.getSeries(i);
            if (!series) continue;
            var color = dSets[i].color || 'black';

            var r = radius * (series[series.length-1]/maxVal);
            var point = this.getPointFromAngle(center, (angle*-1), r);

            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(point.x, point.y);
            for (var n = 0; n < series.length; n++)
            {
                r = radius * (series[n] / maxVal);
                point = this.getPointFromAngle(center, (angle * n), r);
                context.lineTo(point.x, point.y);
            }
            context.stroke();
        }
    },

    getLegendWidth: function ()
    {
        return this.options.legendWidth || this.maxLegendWidth;
    },

    drawLegend: function ()
    {
        var context = this.context;

        var legendHeight = this.options.legendHeight || this.maxLegendHeight;
        var legendWidth = this.getLegendWidth() - this.options.xPadding;
        var legendMargin = this.options.legendMargins;

        var yStep = (legendHeight) / this.options.dataSets.length - 1;
        var legendX = (this.options.width - legendMargin - legendWidth);
        var legendY = (this.options.height - legendHeight) / 2;
        if (!this.options.legendCentered) legendY = (this.options.yMargins + this.options.yPadding + this.options.legendMargins);
        context.strokeStyle = 'black';
        context.strokeRect(legendX, legendY, legendWidth, legendHeight);
        context.font = this.options.legendFont;

        var boxSide = this.options.legendBoxSide;
        var y = legendY;
        for (var i = 0; i < this.options.dataSets.length; i++)
        {
            var label = this.options.dataSets[i].label;
            context.fillStyle = this.options.dataSets[i].color || 'white';
            context.strokeStyle = 'black';
            var rowCenterY = y + (yStep / 2);
            var rowX = legendX + (boxSide / 2);
            context.fillRect(rowX, rowCenterY - boxSide / 2, boxSide, boxSide);
            context.strokeRect(rowX, rowCenterY - boxSide / 2, boxSide, boxSide);

            context.fillStyle = 'black';
            context.textBaseline = 'middle';
            context.fillText(label, rowX + boxSide * 1.5, rowCenterY);

            y += yStep;
        }
    },

	labelsCustomPosition: function( labelPosition, center ){
		// Labels for points that are located in more than 75% by X (X cordinate)
		if (labelPosition.x > 1.75*center.x){
			labelPosition.x += 35;
		}else{ // Other points labels X cordinate
			labelPosition.x += 20;
		}

		// Labels for points that are located in less than -90% by Y (Y cordinate)
		if (labelPosition.y < 0.10*center.y){
			labelPosition.y += 7;
		}
		// Labels for points that are located in less than (-10:+10%) by Y (Y cordinate)
		if (labelPosition.y > 0.90*center.y && labelPosition.y < 1.1*center.y){
			labelPosition.y += 5;
		}

		return labelPosition;
	},

	labelsInDialogPosition: function( labelPosition, center ){
		labelPosition.x += 0;

		// Labels for points that are located in more than 75% by X (X cordinate)
		if (labelPosition.x > 1.75*center.x){
			labelPosition.x -= 40;
		}
		// Labels for points that are located in less than -25% by Y (Y cordinate)
		if (labelPosition.y < 0.25*center.y){
			labelPosition.x += 35;
			labelPosition.y += 5;
		}

		// Labels for points that are located between (+50:+65%) by X (X cordinate)
		if (labelPosition.x > 1.50*center.x && labelPosition.x < 1.65*center.x){
			// Top Label
			if(labelPosition.y > center.y){
				labelPosition.x -= 20;
			}else{
			// Bottom Label
				labelPosition.x -= 5;
			}
		}

		return labelPosition;
	}
}
);

sp.ui.charts.RadarChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    setDefaults: function()
    {
        this.__super();

        this.dataSets = [];
        this.dataSetItemLabels = [];
        this.tickMarkLabels = ['0', '10'];
        this.minValue = 0;
        this.maxValue = 10;
        this.xMargins = 10;
        this.yMargins = 10;
        this.xPadding = 5;
        this.yPadding = 5;
        this.dataFont = '8pt sans-serif';
        this.wrapLabels = true;
		this.labelsCustomPosition = false;
		this.labelsInDialogPosition = false;

        this.drawLegend = true;
        this.legendWidth = 0;
        this.maxLegendWidth = 200;
        this.legendHeight = 0;
        this.legendCentered = true;
        this.legendMargins = 20;
        this.legendFont = '10pt sans-serif';
        this.legendBoxSide = 16;
    }
}
);

sp.ui.charts.RadarCHartEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, data)
    {
        this.__super(target, type);
        this.data = data;
    }
}
);

sp.ui.charts.RadarCHartEvent.SHOWDETAILS = 'show_chart_details';
sp.ui.charts.RadarCHartEvent.FLAGCHANGE = 'flag_change';