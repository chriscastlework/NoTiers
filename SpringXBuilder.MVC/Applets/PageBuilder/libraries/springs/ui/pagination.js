sp.namespace(
            "sp.ui.pagination.Pagination",
            "sp.ui.pagination.PaginationOptions",
            "sp.ui.pagination.PaginationRenderer",
            "sp.ui.pagination.PaginationRadioButtonRenderer",
            "sp.ui.pagination.PaginationCheckboxRenderer",
            "sp.ui.pagination.PaginationArrayDataProvider",
            "sp.ui.pagination.PaginationRemoteDataProvider"
);

sp.ui.pagination.Pagination = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(graphic, options) {
        this.__super(graphic);
        this.options = options != null ? options : new sp.ui.pagination.PaginationOptions();
        this.addElement(this.options.renderer.getGraphic());
        this.init();
    },
    init: function() {
        this.pageIndex = 0;
        this.buildNavigation();
    },
    buildNavigation: function() {
        var __this = this;
        this.navigationContainer = this.createElement("div");
        this.addElement(this.navigationContainer);
        this.previousButton = this.createElement("div", {}, ["button", "previousButton", "floatLeft"]);
        $(this.previousButton).click(function() {
            __this.previousPage();
        });
        $(this.previousButton).text("Prev");
        $(this.navigationContainer).append(this.previousButton);
        $(this.previousButton).hide();
        this.pageLabel = this.createElement("div", {}, ["labelBold", "floatLeft"]);
        $(this.navigationContainer).append(this.pageLabel);
        this.nextButton = this.createElement("div", {}, ["button", "previousButton", "floatLeft"]);
        $(this.nextButton).click(function() {
            __this.nextPage();
        });
        $(this.nextButton).text("Next");
        $(this.navigationContainer).append(this.nextButton);
        this.addElement(this.navigationContainer);
        $(this.navigationContainer).hide();
    },
    setPageIndex: function(idx) {
        if (idx >= 0) {
            var direction = idx > this.pageIndex ? "FORWARD" : "BACKWARD";
            this.pageIndex = idx;
            $(this.pageLabel).text((this.pageIndex + 1).toString());
            var array = this.getArrayToRender();
            if (array.length > 0) {
                if (array.length < this.options.limit) $(this.pageLabel).hide();
                else $(this.pageLabel).show();
                this.options.renderer.render(array);
                $(this.navigationContainer).show();
                $(this.nextButton).show();
                $(this.previousButton).show();
                if (idx == 0)
                    $(this.previousButton).hide();
            }
            else if (direction == "FORWARD")
                $(this.nextButton).hide();
            else if (direction == "BACKWARD")
                $(this.previousButton).hide();
            if (array.length < this.options.limit)
                $(this.nextButton).hide();
        }
    },
    getArrayToRender: function() {
        var sIdx = this.pageIndex * this.options.limit;
        return this.options.dataProvider.getData(sIdx, this.options.limit);
    },
    nextPage: function() {
        this.setPageIndex(this.pageIndex + 1);
    },
    previousPage: function() {
        this.setPageIndex(this.pageIndex - 1);
    },
    reset: function() {
        this.options.dataProvider.dataArray = new Array();
        $(this.options.renderer.getGraphic()).empty();
        $(this.navigationContainer).hide();
    }
}
);
sp.ui.pagination.PaginationOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults: function() {
        this.limit = 15;
        this.renderer = new sp.ui.pagination.PaginationRenderer();
        //this.dataProvider = new sp.ui.pagnaton.PaginationArrayDataProvider();
    }
}
);
sp.ui.pagination.PaginationRenderer = sp.core.graphics.Graphic.extend
(
{
    __constructor: function() {
        this.__super(null);
        this.id = "ABC";
    },
    render: function(DataArray) { }
}
);

sp.ui.pagination.IPaginationDataProvider = Class.extend
(
{
    __constructor: function() {
        this.dataArray = new Array();
    },
    getData: function(sIdx, Length) {
        return this.dataArray();
    }
}
);
sp.ui.pagination.PaginationArrayDataProvider = sp.ui.pagination.IPaginationDataProvider.extend
(
{
    getData: function(sIdx, Length) {
        return this.dataArray();
    }
}
);
sp.ui.pagination.PaginationRemoteDataProvider = sp.ui.pagination.IPaginationDataProvider.extend
(
{
    __constructor: function() {
        this.__super();
        this.criteria = null;
    },
    getData: function(sIdx, Length) {
        return this.dataArray();
    }
}
);

sp.ui.pagination.PaginationEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, control, data) {
        this.__super(target, type);
        this.control = control;
        this.data = data;
    }
}
);
sp.ui.pagination.PaginationEvent.ITEMSELECTED = "itemselected";