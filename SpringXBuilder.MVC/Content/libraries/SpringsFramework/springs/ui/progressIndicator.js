sp.namespace("sp.ui.progressIndicator.ProgressIndicator");

sp.ui.progressIndicator.ProgressIndicator = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(Graphic, someCurrent, someTotal, showLabel, showLabelAsPercentage) {
        this.__super(Graphic);
        this.current = someCurrent;
        this.total = someTotal;
        this.showLabel = showLabel;
        this.showLabelAsPercentage = showLabelAsPercentage;
        this.init();
    },

    init: function() {
        this.progressDisplay = this.createElement("div", {}, ["progressDisplay"]);
        $(this.getGraphic()).append(this.progressDisplay);
        this.progressLabel = this.createElement("div", {}, ["progressLabel"]);
        if (this.showLabel) {
            this.progressLabel = this.createElement("div", {}, ["labelBold"]);
            this.setupLabel();
            $(this.getGraphic()).append(this.progressLabel);
        }
    },

    update: function(someCurrent, someTotal) {
        this.current = someCurrent;
        this.total = someTotal;
        this.draw();
    },
    setupLabel: function() { },
    draw: function() { },
    drawIndicator: function() { },
    drawLabel: function(width) {
        if (this.showLabel) {
            var lbl = (this.current + 1) + " / " + (this.total + 1);
            if (this.showLabelAsPercentage)
                lbl = width.toFixed().toString() + "%";
            $(this.progressLabel).text(lbl);
        }
    }
}
);

sp.ui.progressIndicator.ProgressBar = sp.ui.progressIndicator.ProgressIndicator.extend
(
{
    init: function() {
        this.__super();
        $(this.progressDisplay).addClass("progressBar");
    },
    setupLabel: function() {
        $(this.progressLabel).addClass("progressBarLabel");
    },
    draw: function() {
        var width = this.current == 0 ? 0 : ((this.current / this.total) * 100);
        if (isNaN(width)) width = 0;
        if (!isNaN(width)) {
            this.drawIndicator(width);
            this.drawLabel(width);
        }
    },
    drawIndicator: function(width) {
        $(this.progressDisplay).width(width + "%");
    }
}
);