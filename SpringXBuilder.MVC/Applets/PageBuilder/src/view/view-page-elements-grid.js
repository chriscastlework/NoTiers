sp.namespace("pb.view.Grid",
             "pb.view.GridColumn");


pb.view.Grid = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.columns = [];
        this.init();
    },
    getDialog:function(obj)
    {
        return this.dialog;
    },
    init:function()
    {
        this.addClass("pb-large pb-grid pb-padding-10");

        var __this = this;

        this.navigationSection = $("<div class='pb-grid-navigation'/>");
        this.gridButton = $("<button>Grid</button>");
        this.gridButton.on("click",function(){__this.toggleView(pb.view.GridViewOptions.COLUMNS)});
        this.dialogButton = $("<button>Dialog</button>");
        this.dialogButton.on("click",function(){__this.toggleView(pb.view.GridViewOptions.DIALOG)});
        this.lookUpButton = $("<button>Search</button>");
        this.lookUpButton.on("click",function(){__this.toggleView(pb.view.GridViewOptions.LOOKUP)});
        this.navigationSection.append(this.gridButton);
      //  this.navigationSection.append(this.dialogButton); hide for live 
        this.navigationSection.append(this.lookUpButton);

        this.columnView = new pb.view.GridColumnView(this.model);
        this.dialog = new pb.view.GridAddNewDialog(this.model.getDialog());
        this.lookUp = new pb.view.LookUp(this.model.getLookUp());

        this.addElement(this.navigationSection);
        this.addElement(this.columnView);
        this.addElement(this.dialog);
        this.addElement(this.lookUp);

        var widthController = new pb.view.ElementWidthController(this._jqGraphic(),this.model.getWidth());
        var heightController = new pb.view.ElementHeightController(this._jqGraphic(),this.model.getHeight());
        heightController.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onHeightChanged);

        this.toggleView(pb.view.GridViewOptions.COLUMNS);

        setTimeout(function(){__this.draw();},500);
    },
    getColumnView:function()
    {
        return this.columnView;
    },
    getLookUp:function()
    {
        return this.lookUp;
    },
    toggleView:function(panel)
    {
        this.columnView.setVisibility(panel==pb.view.GridViewOptions.COLUMNS);
        this.dialog.setVisibility(panel==pb.view.GridViewOptions.DIALOG);
        this.lookUp.setVisibility(panel==pb.view.GridViewOptions.LOOKUP);
    },
    addColumn:function(column,index)
    {
        this.columnView.addColumn(column,index);
    },
    removeColumn:function(column)
    {
        this.columnView.removeColumn(column);
    },
    removeColumnAtIndex:function(index)
    {

    },
    draw:function()
    {
        var lowerEdge = this.getHeight()-this.navigationSection.height();
        this.dialog.setHeight(lowerEdge);
    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="elements")
        {

        }
    },
    onHeightChanged:function(event)
    {
        this.draw();
    }
});
pb.view.GridViewOptions = {
    COLUMNS:"columns",
    DIALOG:"dialog",
    LOOKUP:"lookup"
}

pb.view.GridColumnView = pb.view.Element.extend
({
    __constructor:function(model)
    {
        this.__super(model);
        this.columns = [];
        this.init();
    },
    init:function()
    {
        this.addClass("");
        this.table = $("<table class='pb-grid-preview pb-full-width pb-clearfix'/>");
        this.row = $("<tr></tr>");
        this.table.append(this.row);
        this.addElement(this.table);
        this.setState();
    },
    addColumn:function(column,index)
    {
        this.row.append(column.getGraphic());
        this.columns.push(column);
    },
    removeColumn:function(column)
    {
        column.getView().getGraphic().remove();
    },
    removeColumnAtIndex:function(index)
    {

    },
    setState:function()
    {

    },
    draw:function()
    {

    },
    onModelChanged:function(event)
    {
        this.__super(event);
        if(event.property=="allowEdit" || event.property=="mappedEntity" || event.property=="mappingContext")
        {

        }
    }
});

pb.view.GridColumn = pb.view.Container.extend
({
    __constructor:function(model,index)
    {
        this.__super(model);
        this.index = index;
        this.init();
    },
    toString:function()
    {
        return "[GridColumn, graphic:" + this.__graphic + "]";
    },
    getInitialGraphic:function()
    {
        return $("<td></td>");
    },
    getColumnName:function()
    {
        return this.model.getName() || "Unnamed";
    },
    init:function()
    {
        this._jqGraphic().removeClass();
        this.nameElement = $("<div class='pb-grid-column-name'>"+this.getColumnName()+"</div>");
        this.droppableArea = $("<div class='pb-grid-column-container'></div>");
        this.summaryElement = $("<div class='pb-grid-column-summary'>summary</div>");
        this.addElement(this.nameElement);
        this.addElement(this.droppableArea);
        this.addElement(this.summaryElement);
        this.addClass("pb-grid-column pb-clearfix");
        this.setWidth();
        this.draw();
        this.setSummaryLabel();
        this.setState();
    },
    getSummaryLabel:function()
    {
        var type = this.model.getSummaryOptions().getSummaryType();
        return (type)? "[" + type[0].toUpperCase() + type.substr(1) + "]" : "";
    },
    setSummaryLabel:function()
    {
        this.summaryElement.text(this.getSummaryLabel());
    },
    draw:function()
    {
        /*h = this.toNumber(this._jqGraphic().height());
         sp.out("table cell height:" + h);
         var y = this.nameElement.height();//this.toNumber(this.droppableArea.position().top);
         var margin = this.toNumber(this.droppableArea.css("margin-top"));
         //sp.out("y:" + y + " margin:" + margin + " setting height to:" + (h-y-margin));
         //this.droppableArea.css("height",h);
         */
    },
    getDroppableAreaElement:function()
    {
        return this.droppableArea[0];
    },
    removeAllElements:function()
    {
        this.droppableArea.empty();
        //this.addElement($("<div class='pb-mapcard-title'>"+this.title+"</div>"));
    },
    toNumber:function(num)
    {
        num = Number(num);
        return (num!=num)? 0 : num;
    },
    setHeight:function(h)
    {
        h = this.toNumber(h);
        var y = this.toNumber(this.droppableArea.position().top);
        var margin = this.toNumber(this.droppableArea.css("margin-top"));
        this.droppableArea.css("height",h-y-margin);
    },
    getWidthUnit:function()
    {
        var unit = this.model.getWidthUnit();
        return (unit=="pixels")? "" : "%";
    },
    setWidth:function(w)
    {
        var w = this.model.getWidth();
        var u = this.getWidthUnit();
        if(w==0)
        {
            this._jqGraphic().css("width","0.2%"); // ensures  column never disappears..
            this._jqGraphic().css({opacity:0.3});
        }
        else if(w)
        {
            this._jqGraphic().css("width",w+u);
            this._jqGraphic().css({opacity:1});
        }
    },
    setState:function()
    {
        this.summaryElement.toggle(this.model.getShowSummary());
    },
    onModelChanged:function(event)
    {
        if(event.property=="width" || event.property=="widthUnit")
        {
            this.setWidth();
        }
        if(event.property=="name")
        {
            this.nameElement.text(this.getColumnName());
        }
        if(event.property=="showSummary")
        {
            this.setState();
        }
        if(event.property=="summaryType")
        {
            this.setSummaryLabel();
        }
        this.draw();
    }
});

