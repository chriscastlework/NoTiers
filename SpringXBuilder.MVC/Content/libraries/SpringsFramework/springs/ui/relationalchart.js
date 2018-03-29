sp.namespace("sp.ui.relationalchart.RelationalChart",
             "sp.ui.relationalchart.RelationalChartElement",
             "sp.ui.relationalchart.OrgChart",
             "sp.ui.relationalchart.OrgChartEvents",
             "sp.ui.relationalchart.RelationalChartOptions",
             "sp.ui.relationalchart.RelationChartElementRenderer",
             "sp.ui.relationalchart.OrganisationChartElement",
             "sp.ui.relationalchart.OrganisationChartElementArrows",
             "sp.ui.relationalchart.OrganisationChartElementOptions"
);


sp.ui.relationalchart.RelationalChart = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(options)
    {
        this.__super();
        this.options = options || new sp.ui.relationalchart.RelationalChartOptions();
        this.snapToGrid = this.options.snapToGrid || false;
        this.canvasWidth = this.options.canvasWidth || $(window).width();
        this.canvasHeight = this.options.canvasHeight || $(window).height();
        this.zoomLevel = this.options.zoomLevel || 1;
        this.idProp = this.options.idProp || "ID";
        this.init();
    },

    init:function()
    {
        this.addClass("sp_relational_chart");
        this.selected = [];
        this.elements = [];
        this.customLayer = this.addElement(this.createElement("div"));
        this.selectionDragLayer = this.addElement(this.createElement("div",{width:this.canvasWidth,height:this.canvasHeight,background:"white",opacity:"0",filter:"alpha(opacity=0)","z-index":1},["selection_area"]));
        this.contentLayer = this.addElement(this.createElement("div",{"z-index":2},["content"]));
        this.gridLayer = this.addElement(this.createElement("div",{position:"absolute", width:this.canvasWidth, height:this.canvasHeight,"z-index":0},["canvas_grid"]));
        this.selectionDrawLayer = this.addElement(this.createElement("div",{width:this.canvasWidth,height:this.canvasHeight,background:"none"},["selection_draw"]));
        $(this.contentLayer).disableSelection();
        this.dragSelect = new sp.ui.dragselect.DragSelect(this.selectionDrawLayer,this.selectionDragLayer);
        this.dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionStart);
        this.dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionComplete);
        this.layers = [{content:this.content}];
        this.dataProvider = new sp.core.data.IndexedDataList();
        this.viewport = this.getGraphic();
        this.dragLine = this.createElement("canvas",{position:"absolute"},["drag_line"],{width:this.canvasWidth*this.zoomLevel,height:this.canvasHeight*this.zoomLevel});
        $(this.getLayer("drag_container")).append(this.dragLine);
        //initialize grid
        this.drawGridLines();
        this.hideGrid();
        if (this.options.drawGrid) this.showGrid();
        this.toggleSnapToGrid(this.snapToGrid);
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
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.ADD,this.onAdd);
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.REMOVE,this.onRemove);
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.EDIT,this.onEdit);
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.SET,this.onDataSet);
        this.dataProvider = dp;
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.ADD,this.onAdd);
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.REMOVE,this.onRemove);
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.EDIT,this.onEdit);
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.SET,this.onDataSet);
        this.refresh();
    },

    clearAll:function()
    {
        for(var i=0; i<this.elements.length; i++)
        {
            this.elements[i].kill();
        }
        $(this.contentLayer).empty();
    },

    refresh:function()
    {
        this.clearAll();
        var data = this.dataProvider.getData();
        for(var i=0; i<data.length; i++)
        {
            this.addBox(data[i][this.idProp]);
        }
        for(var i=0; i<this.elements.length; i++)
        {
            this.elements[i].onChartElementsCreated();
        }
    },

    bringToFront:function(box)
    {
       $(box.getGraphic()).css("z-index",this.getNextHighestIndex(this.contentLayer));
    },

    addBox:function(id)
    {
        var box = this.options.factory.create(this,this.dataProvider, id,this.options.renderer);
        box.addEventListener(this,sp.core.events.MouseEvent.MOUSEDOWN, this.selectElement);
        box.addEventListener(this,sp.core.events.DragEvent.START,this.onStartDrag);
        box.addEventListener(this,sp.core.events.MouseEvent.DOUBLECLICK,this.onDoubleClick);
        if(sp.isOnTablet())
        {
            box.addEventListener(this,sp.core.events.MouseEvent.MOUSEUP, this.selectElement);
        }
        $(this.contentLayer).append(box.getGraphic());
        this.elements.push(box);
        box.refreshDraggerPositions();
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
    },

    onGroupDragStop:function(event)
    {
        for(var i=0; i<this.selected.length; i++)
        {
            this.selected[i].onStopDrag(event);
        }
    },

    onStartDrag:function(event,box)
    {
        var members = this.getSelectedBoxes();

        var group = new sp.core.graphics.DragGroup(members);
        group.start(event.originalEvent.pageX,event.originalEvent.pageY);
        group.addEventListener(this,sp.core.events.DragEvent.DRAG, this.onGroupDrag);
        group.addEventListener(this,sp.core.events.DragEvent.STOP, this.onGroupDragStop);
        for(var i=0; i<this.selected.length; i++)
        {
            this.selected[i].onStartDrag(event);
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
        var box = this.getElementById(event.data[this.idProp]);
        if(box) box.render();
    },

    onDataSet:function(event)
    {
        this.refresh();
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
        if (snap) this.showGrid()
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
        if (targetZoomLevel > 1.5) targetZoomLevel = 1.5;
        if (targetZoomLevel < 0.1) targetZoomLevel = 0.1;
        this.setZoomLevel(targetZoomLevel);

        return {x: edgeCoord.minX*targetZoomLevel - 20, y: edgeCoord.minY*targetZoomLevel - 20};
    },

    setZoomLevel: function (zoomLevel)
    {
        if (zoomLevel<0.1 || zoomLevel>1.5) return false;
        var prevZoomLevel = this.zoomLevel;
        this.zoomLevel = zoomLevel;
        $(this.getGraphic()).find('canvas').
            attr('width', this.canvasWidth* 0.99).
            attr('height', this.canvasHeight* 0.99);
        $(this.selectionDragLayer).
            css('width', this.canvasWidth* 0.99).
            css('height', this.canvasHeight* 0.99);
        $(this.selectionDrawLayer).
            css('width', this.canvasWidth* 0.99).
            css('height', this.canvasHeight* 0.99);
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


sp.ui.relationalchart.OrgChart = sp.ui.relationalchart.RelationalChart.extend
(
{
    __constructor:function(options)
    {
        this.__super(options);
        this.linkSubordinates = false;
    },

    toggleLinkSubordinatesLock: function(lock)
    {
        this.linkSubordinates = lock;
    },

    onGroupDragStop:function(event)
    {
        for(var i=0; i<this.selected.length; i++)
        {
            this.selected[i].onStopDrag(event);
        }

        if (this.linkSubordinates) for(var i=0; i<this.draggedSubordinates.length; i++) this.draggedSubordinates[i].onStopDrag(event);
        this.dispatchEvent(new sp.ui.relationalchart.OrgChartEvents(this, sp.ui.relationalchart.OrgChartEvents.REDRAWELEMENTS));
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
    }
}
);
sp.ui.relationalchart.OrgChartEvents = sp.core.events.Event.extend();
sp.ui.relationalchart.OrgChartEvents.REDRAWELEMENTS = "chart_elements_redraw";
sp.ui.relationalchart.OrgChartEvents.SELECTIONCHANGE = "chart_elements_select";
sp.ui.relationalchart.OrgChartEvents.CHARTZOOM = "chart_zoomed";


sp.ui.relationalchart.RelationalChartOptions = sp.core.data.ValueObject.extend
(
{
    __constructor:function(map)
    {
        this.__super(map);
    },

    setDefaults:function()
    {
        this.factory = new sp.ui.relationalchart.DefaultFactory();
        this.renderer = new sp.ui.relationalchart.RelationChartElementRenderer();
        this.gridSize = 80;
        this.gridColor = '#CCCCCC';
        this.snapToGrid = false;
        this.drawGrid = false;
        this.zoomLevel = 1;
        this.idProp = "ID";
        this.toolbox = {
            zoomIn: true,
            zoomOut: true,
            snapToGrid: true,
            select: true,
            drag: true,
            link: true
        }
    }
}
);

sp.ui.relationalchart.DefaultFactory = Class.extend
(
{
    create:function(parent,model,id,renderer)
    {
        return new sp.ui.relationalchart.RelationalChartElement(parent, model, id, renderer);
    }
}
)

sp.ui.relationalchart.RelationChartElementRenderer = sp.core.graphics.Graphic.extend
(
{
    render:function(element,data)
    {

    }
}
);

sp.ui.relationalchart.RelationalChartElement = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(parent,model,id,renderer)
    {
        this.__super();
        this.parent = parent;
        this.model = model;
        this.renderer = renderer;
        this.id = id || sp.guid();
        this.snapToGrid = parent.snapToGrid || false;
        this.gridSize = parent.gridSize || 80;
        this.canvasWidth = parent.canvasWidth || $(window).width();
        this.canvasHeight = parent.canvasHeight || $(window).height();
        this.zoomLevel = parent.zoomLevel || 1;
        this.idProp = parent.idProp || "ID";
        this.init();
    },

    getID:function()
    {
        return this.id;
    },

    getData:function()
    {
        return this.model.getItemByID(this.getID()) || {};
    },

    init:function()
    {
        this.disableSelection();
        $(this.getGraphic()).css("position","absolute");
        this.content = this.addElement(this.createElement("div",{},["sp_relational_chart_element"]));
        var __this = this;
        $(this.getGraphic()).mousedown(function(event){__this.onMouseDown(event);});
        $(this.getGraphic()).draggable({cursor: 'pointer', scroll: false, start:function(e,ui){__this.__onStartDrag(e,ui);}});
        $(this.getContent()).dblclick(function(e,ui){__this.onDoubleClick(e, ui)});
        this.model.addEventListener(this,sp.core.data.DataEvent.EDIT,this.__onDataChanged);
        this.render();
        this.refreshPosition();
    },

    render:function()
    {
        this.renderer.render(this.content, this.getData());
    },

    refreshDraggerPositions: function()
    {
        //override if necessary
    },

    onDoubleClick:function(event)
    {
        this.dispatchEvent(new sp.core.events.MouseEvent(this,sp.core.events.MouseEvent.DOUBLECLICK,event));
    },

    __onDataChanged:function(event)
    {
        if(event.data[this.idProp]==this.getID())
        {
            this.refreshPosition();
            this.onDataChanged();
        }
    },

    onDataChanged:function()
    {

    },

    refreshDimensions: function ()
    {
        if (this.width) $(this.content).css('width', this.width*this.zoomLevel);
        if (this.minHeight) $(this.content).css('minHeight', this.minHeight*this.zoomLevel);
        if (this.fontSize) $(this.content).css('fontSize', this.fontSize*this.zoomLevel + 'pt');
    },

    refreshPosition:function()
    {
        $(this.getGraphic()).css("left",this.getData().x*this.zoomLevel);
        $(this.getGraphic()).css("top",this.getData().y*this.zoomLevel);
        this.refreshDimensions();
        this.refreshAllLines();
    },

    refreshAllLines: function()
    {
      //override if necessary
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

        // todo refactor?
        if (!this.snapToGrid)
        {
            var newItem = {
                x: xPos/this.zoomLevel,
                y: yPos/this.zoomLevel
            };
            newItem[this.idProp] = this.getID();
            this.model.updateItem(newItem);
        }
        else
        {
            var newCoord = this.getNearestSnapPoint(xPos/this.zoomLevel,yPos/this.zoomLevel,this.gridSize);
            var newItem = {
                    x:newCoord.x,
                    y:newCoord.y
            };
            newItem[this.idProp] = this.getID();
            this.model.updateItem(newItem);
        }
    },

    getNearestSnapPoint: function(x,y,gridSize)
    {
        var nearestX = Math.round(x/gridSize)*gridSize;
        var nearestY = Math.round(y/gridSize)*gridSize;

        return {x:nearestX , y:nearestY};
    },

    onChartElementsCreated:function()
    {
        // overwrite - allows us to carry out actions / rendering which depends on the existence of the other elements...such as line drawing etc.
    },

    getContent:function()
    {
        return this.content;
    },

    getBounds:function()
    {
        var pos = $(this.content).offset();
        return new sp.core.geom.Rectangle(pos.left, pos.top, $(this.content).width(),$(this.content).height());
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
            $(this.content).addClass("selected");
        }
        else
        {
            $(this.content).removeClass("selected");
        }
    },

    getSelected:function()
    {
        return this.__selected;
    },

    onMouseDown:function(event)
    {
       this.dispatchEvent(new sp.core.events.MouseEvent(this,sp.core.events.MouseEvent.MOUSEDOWN,event));
    },

    __onStartDrag:function(event,ui)
    {
        // do not override. to handle a startDrag event, use onStartDrag
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.START,event.originalEvent));
    },

    onStartDrag:function(event)
    {

    },

    onDrag:function(event)
    {

    },

    onStopDrag:function(event)
    {
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.STOP,event.originalEvent));
        this.updatePosition();
    },

    kill:function()
    {
        $(this.getContent()).unbind();
    }
}
);

sp.ui.relationalchart.OrganisationChartElement = sp.ui.relationalchart.RelationalChartElement.extend
(
{
    __constructor:function(parent,model,id,renderer,options)
    {
        this.options = options || new sp.ui.relationalchart.OrganisationChartElementOptions();
        this.width = this.options.width || null;
        this.minHeight = this.options.minHeight || null;
        this.fontSize = this.options.fontSize || null;
        this.managerFieldName = this.options.managerFieldName || 'ManagerID';
        this.influenceesFieldName = this.options.influenceesFieldName || 'InfluenceeIDs';
        this.positiveInfluenceesFieldName = this.options.positiveInfluenceesFieldName || 'PositiveInfluenceeIDs';
        this.__super(parent, model, id ,renderer);
    },

    init:function()
    {
        this.__super();
        this.subordinates = [];
        this.influencees = [];
        this.influencers = [];
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
        var __this = this;
        $(this.mdragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(){__this.onStartSelector_Manager();}, drag:function(){__this.onDragSelector_Manager();}, stop:function(){__this.onStopSelector_Manager();}});
        $(this.idragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(e,u){__this.onStartSelector_Influence(e,u);}, drag:function(e,u){__this.onDragSelector_Influence(e,u);}, stop:function(e,u){__this.onStopSelector_Influence(e,u);}});
        $(this.getContent()).droppable({drop:function(event,ui){__this.onDropped(event, ui)}});

        if (this.options.usePositiveInfluencees)
        {
            this.pidragger = this.addElement(this.createElement("div",{position:'absolute'},["dragger","positiveinfluencee"],{id:"pidragger"}));
            $(this.pidragger).data("parentElement",this);
            $(this.pidragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(e,u){__this.onStartSelector_PositiveInfluence(e,u);}, drag:function(e,u){__this.onDragSelector_PositiveInfluence(e,u);}, stop:function(e,u){__this.onStopSelector_PositiveInfluence(e,u);}});

            this.positiveInfluenceLine = this.createElement("canvas",{position:"absolute", top: 0, left: 0},["line","influence"],{width:0,height:0});
            $(this.parent.getLayer("influencees")).append(this.positiveInfluenceLine);
            this.positiveInfluencees = [];
        }

        this.refreshDimensions();
    },


    onStartSelector_PositiveInfluence: function(event, ui)
    {
        this.dragMode = sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.POSITIVEINFLUENCEE;
        $(this.parent.dragLine).css('zIndex', "9999");
        this.initialZIndex = $(this.getGraphic()).css('zIndex');
        $(this.getGraphic()).css('zIndex', "10000");
    },

    onDragSelector_PositiveInfluence: function(event, ui)
    {
        this.onDragSelector_Influence(event, ui);
    },

    onStopSelector_PositiveInfluence: function(event, ui)
    {
        $(this.parent.dragLine).css('zIndex', "");
        $(this.getGraphic()).css('zIndex', this.initialZIndex);
        $(this.pidragger).removeClass().addClass("dragger influencee");
        this.clearLine(this.parent.dragLine);
        this.dragMode = "";
        if(!this.dropTarget)
        {
            this.clearPositiveInfluencees();
        }
        this.dropTarget = null;
    },

    refreshDimensions: function ()
    {
        this.__super();
        var draggersArray = [this.mdragger, this.idragger];
        if (this.options.usePositiveInfluencees) draggersArray.push(this.pidragger);
        $(draggersArray).
            height(this.options.draggerWidth*this.zoomLevel).
            width(this.options.draggerWidth*this.zoomLevel).
            css('top', -1*this.options.draggerWidth*this.zoomLevel + this.options.draggerOffset*this.zoomLevel);
        if (this.options.usePositiveInfluencees)
        {
            $(this.idragger).css('left', $(this.content).outerWidth()/2 - $(this.idragger).outerWidth() * 1.5  - this.options.draggerXOffset);
            $(this.mdragger).css('left', $(this.content).outerWidth()/2 - $(this.mdragger).outerWidth() * 0.5);
            $(this.pidragger).css('left', $(this.content).outerWidth()/2 + $(this.mdragger).outerWidth() * 0.5 + this.options.draggerXOffset);
        }
        else
        {
            $(this.mdragger).css('left', $(this.content).width()/2 - $(this.mdragger).width() + this.options.draggerXOffset);
            $(this.idragger).css('left', $(this.content).width()/2 + this.options.draggerXOffset);
        }
    },

    onDataChanged:function()
    {
        this.refreshAllLines();
    },

    onChartElementsCreated:function()
    {
        this.refreshAllLines();
    },

    getInfluenceeIDs:function()
    {
        var data = this.model.getItemByID(this.getID()) || {};
        return sp.core.data.DataUtils.toArray(data[this.influenceesFieldName]);
    },

    getPositiveInfluenceeIDs:function()
    {
        var data = this.model.getItemByID(this.getID()) || {};
        return sp.core.data.DataUtils.toArray(data[this.positiveInfluenceesFieldName]);
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

    getPositiveInfluencees: function()
    {
        var ids = this.getPositiveInfluenceeIDs();
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
        this.model.updateItem(item);
        this.clearInfluenceeLines();
        this.updateInfluenceLines();
    },

    removePositiveInfluencee:function(box)
    {
        var ids = this.getPositiveInfluenceeIDs();
        sp.utils.ArrayUtils.removeElement(ids, box.getID());
        var item = {};
        item[this.idProp] = this.getID();
        item[this.positiveInfluenceesFieldName] = ids;
        this.model.updateItem(item);
        this.clearPositiveInfluenceeLines();
        this.updatePositiveInfluenceLines();
    },

    getManagerID:function()
    {
        var data = this.getData();
        return data[this.managerFieldName];
    },

    getManager:function()
    {
        return this.parent.getElementById(this.getManagerID());
    },

    getName:function()
    {
        return this.getData().Name || "";
    },

    getInfluencerIDs:function()
    {
        var data = this.model.getData();
        var ids = [];
        for(var i=0; i<data.length; i++)
        {
            var influencees =  sp.core.data.DataUtils.toArray(data[i][this.influenceesFieldName]);
            for(var n=0; n<influencees.length; n++)
            {
                if(influencees[n]==this.getID()) ids.push(data[i][this.idProp]);
            }
        }
        return ids;
    },

    getPositiveInfluencerIDs:function()
    {
        var data = this.model.getData();
        var ids = [];
        for(var i=0; i<data.length; i++)
        {
            var influencees =  sp.core.data.DataUtils.toArray(data[i][this.positiveInfluenceesFieldName]);
            for(var n=0; n<influencees.length; n++)
            {
                if(influencees[n]==this.getID()) ids.push(data[i][this.idProp]);
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

    getPositiveInfluencers:function()
    {
        var ids = this.getPositiveInfluencerIDs();
        var elements = [];
        for(var i=0; i<ids.length; i++)
        {
            elements.push(this.parent.getElementById(ids[i]));
        }
        return elements;
    },

    getSubordinateIDs:function(id)
    {
        var id = id || this.getID();
        var data = this.model.getData();
        var ids = [];
        for(var i=0; i<data.length; i++) if(data[i][this.managerFieldName]&& data[i][this.managerFieldName] == id) ids.push(data[i][this.idProp]);
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
        item[this.idProp] = this.getID();
        item[this.managerFieldName] = '';
        this.model.updateItem(item);
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
        var item = {};
        item[this.idProp] = this.getID();
        item[this.managerFieldName] = '';
        this.model.updateItem(item);
        this.manager = null;
        this.clearManagerLine();
    },

    clearInfluenceeLines:function()
    {
        if (!this.influenceLine) return;
        var context = this.influenceLine.getContext("2d");
        if(context) context.clearRect(0,0,this.influenceLine.width,this.influenceLine.height);
        $(this.influenceLine).css({width:0,height:0,top:0,left:0}).prop('width', 0).prop('height', 0);
    },

    clearPositiveInfluenceeLines:function()
    {
        if (!this.positiveInfluenceLine) return;
        var context = this.positiveInfluenceLine.getContext("2d");
        if(context) this.positiveInfluenceLine.width = this.positiveInfluenceLine.width;
        $(this.positiveInfluenceLine).css({width:0,height:0,top:0,left:0}).prop('width', 0).prop('height', 0);
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

    updatePositiveInfluenceLines:function()
    {
        var influencees = this.getPositiveInfluencees();
        if(!influencees.length || !this.positiveInfluenceLine)
        {
            this.clearPositiveInfluenceeLines();
            return;
        }
        var context = this.positiveInfluenceLine.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.positiveInfluenceLine.width,this.positiveInfluenceLine.height);

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
            $(this.positiveInfluenceLine).css({ width: _width + 2 * p, height: _height + 2 * p, top: _top - p, left: _left - p }).prop('width', _width + 2 * p).prop('height', _height + 2 * p);

            var getLeft = function(l) { return Math.max(1, Math.min(l - _left, _width)); };
            var getTop = function(t) { return Math.max(1, Math.min(t - _top, _height)); };

            for(var i=0; i<influencees.length; i++)
            {
                if(!influencees[i]) continue;
                var ipos = influencees[i].getInfluenceLineInPoint(bpos);
                var styleObj = {fillStyle:this.options.positiveInfluenceeLineFill, strokeStyle:this.options.positiveInfluenceeLineStroke};
                this.options.influenceesLineDrawFunction(this.positiveInfluenceLine,{x:getLeft(bpos.left)+p,y:getTop(bpos.top)+p},{x:getLeft(ipos.left)+p,y:getTop(ipos.top)+p},styleObj);
            }
        }
    },

    getHighestSubordinate:function()
    {
        if(this.subordinates.length==0) return null;
        var highest = null;
        for(var i=0; i<this.subordinates.length; i++)
        {
            if($(this.subordinates[i]).position().top<$(highest).position().top)
            {
                highest = this.subordinates[i];
            }
        }
        return highest;
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

    onStartDrag:function(event)
    {
        this.__super(event);
        if(this.options.hideLinesOnDrag) this.clearLinesOnDragStart();
    },

    onDrag:function(event)
    {
        this.__super(event);
        if(!this.options.hideLinesOnDrag) this.refreshAllLines();
    },

    onStopDrag:function(event)
    {
        this.__super(event);
        this.refreshDimensions();
        this.refreshAllLines();
    },

    clearLinesOnDragStart:function()
    {
        this.clearManagerLine();
        this.clearInfluenceeLines();
        if (this.options.usePositiveInfluencees) this.clearPositiveInfluenceeLines();
        var subordinates = this.getSubordinates();
        for(var i=0; i<subordinates.length; i++) subordinates[i].clearManagerLine();
        var influencers = this.getInfluencers();
        for(var i=0; i<influencers.length; i++) influencers[i].clearInfluenceeLines();
        if (this.options.usePositiveInfluencees)
        {
            var influencers = this.getPositiveInfluencers();
            for(var i=0; i<influencers.length; i++) influencers[i].clearPositiveInfluenceeLines();
        }
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

            context.beginPath();
            context.moveTo(getLeft(bpos.left), getTop(bpos.top));
            var x1 = getLeft(bpos.left);
            var y1 = getTop(mpos.top + 30);
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

        if (this.options.usePositiveInfluencees)
        {

            this.updatePositiveInfluenceLines();
            var influencers = this.getPositiveInfluencers();
            for(var i=0; i<influencers.length; i++) if(influencers[i]) influencers[i].updatePositiveInfluenceLines();
        }
    },

    acceptDrop:function(targetElement)
    {
        var mode = this.getDragMode();
        if(mode==sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.MANAGER)
        {
            if(targetElement)
            {
                var item = {};
                item[this.idProp] = this.getID();
                item[this.managerFieldName] = targetElement.getID();
                this.model.updateItem(item);
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
                item[this.idProp] = this.getID();
                item[this.influenceesFieldName] = influenceeIDs;
                this.model.updateItem(item);
                this.dropTarget = true;
            }else
            {

            }
        }else if(mode==sp.ui.relationalchart.OrganisationChartElement.SelectionTypes.POSITIVEINFLUENCEE)
        {
            if(targetElement)
            {
                var influenceeIDs = this.getPositiveInfluenceeIDs();
                if($.inArray(targetElement.getID(),influenceeIDs)==-1) influenceeIDs.push(targetElement.getID());
                var item = {};
                item[this.idProp] = this.getID();
                item[this.positiveInfluenceesFieldName] = influenceeIDs;
                this.model.updateItem(item);
                this.dropTarget = true;
            }else
            {

            }
        }
    },

    clearInfluencees:function()
    {
        var item = {};
        item[this.idProp] = this.getID();
        item[this.influenceesFieldName] = [];
        this.model.updateItem(item);
        this.clearInfluenceeLines();
    },

    clearPositiveInfluencees: function()
    {
        var item = {};
        item[this.idProp] = this.getID();
        item[this.positiveInfluenceesFieldName] = [];
        this.model.updateItem(item);
        this.clearPositiveInfluenceeLines();
    },

    kill:function()
    {
        $(this.influenceLine).remove();
        $(this.managerLine).remove();
        var influencers = this.getInfluencers();
        for(var i=0; i<influencers.length; i++)
        {
            influencers[i].removeInfluencee(this);
        }

        if (this.options.usePositiveInfluencees)
        {
            $(this.positiveInfluenceLine).remove();
            var influencers = this.getPositiveInfluencers();
            for(var i=0; i<influencers.length; i++)
            {
                influencers[i].removePositiveInfluencee(this);
            }
        }

        var subordinates = this.getSubordinates();
        for(var i=0; i<subordinates.length; i++)
        {
            subordinates[i].removeManager();
        }

    }
}
);

//this element uses arrows instead of triangles for influence lines
sp.ui.relationalchart.OrganisationChartElementArrows = sp.ui.relationalchart.OrganisationChartElement.extend
(
{
    getInfluenceLineInPoint:function(from)
    {
        var pos = this.getPosition();
        var boxHeight = $(this.getContent()).height();
        boxHeight += parseInt($(this.getContent()).css("padding-top"), 10) + parseInt($(this.getContent()).css("padding-bottom"), 10); //Total Padding Width
        boxHeight += parseInt($(this.getContent()).css("margin-top"), 10) + parseInt($(this.getContent()).css("margin-bottom"), 10); //Total Margin Width
        boxHeight += parseInt($(this.getContent()).css("borderTopWidth"), 10) + parseInt($(this.getContent()).css("borderBottomWidth"), 10);
        var boxWidth = $(this.getContent()).width();
        boxWidth += parseInt($(this.getContent()).css("padding-left"), 10) + parseInt($(this.getContent()).css("padding-right"), 10); //Total Padding Width
        boxWidth += parseInt($(this.getContent()).css("margin-left"), 10) + parseInt($(this.getContent()).css("margin-right"), 10); //Total Margin Width
        boxWidth += parseInt($(this.getContent()).css("borderLeftWidth"), 10) + parseInt($(this.getContent()).css("borderRightWidth"), 10);
        var a = Math.abs(from.left - (pos.left + boxWidth/2)); //horizontal distance from center of the box
        var b = Math.abs(from.top - (pos.top + boxHeight/2));  //vertical distance from center of the box
        var sinAngle = a / Math.sqrt(a*a + b*b);

        if (sinAngle >= Math.sin(Math.PI/4))
        {
            if (from.left >= pos.left+boxWidth/2)
            {
                pos.top += boxHeight/2;
                pos.left += boxWidth;
                pos.position = "lr"; //left or right
            }
            else
            {
                pos.top += boxHeight/2;
                pos.position = "lr";
            }

        }
        else if (from.left >= pos.left+boxWidth/2)
        {
            pos.left += boxWidth * 4/5;
            pos.position = "tb"; //top or bottom
            if (from.top >= pos.top+boxHeight/2) pos.top += boxHeight;
        }
        else if (from.left < pos.left+boxWidth/2)
        {
            pos.left += boxWidth * 1/5;
            pos.position = "tb";
            if (from.top >= pos.top+boxHeight/2) pos.top += boxHeight;
        }

        return pos;
    },

    updateInfluenceLines:function() {
        var influencees = this.getInfluencees();
        if (!influencees.length || !this.influenceLine) {
            this.clearInfluenceeLines();
            return;
        }
        var context = this.influenceLine.getContext("2d");
        if (context) {
            context.clearRect(0, 0, this.influenceLine.width, this.influenceLine.height);

            var bpos = this.getInfluenceLineOutPoint();
            var _top = bpos.top,
                _bottom = bpos.top,
                _left = bpos.left,
                _right = bpos.left;

            for (var i = 0; i < influencees.length; i++) {
                if (!influencees[i]) continue;
                var pos = influencees[i].getInfluenceLineInPoint(bpos);
                _top = pos.position == "lr" ? Math.min(_top, pos.top - 100) : Math.min(_top, pos.top);
                _bottom = pos.position == "lr" ? Math.max(_bottom, pos.top + 100) : Math.max(_bottom, pos.top);
                _left = pos.position == "tb" ? Math.min(_left, pos.left - 100) : Math.min(_left, pos.left);
                _right = pos.position == "tb" ? Math.max(_right, pos.left + 100) : Math.max(_right, pos.left);
            }

            var _width = _right - _left;
            var _height = _bottom - _top;

            var p = this.options.influenceCanvasPadding;
            $(this.influenceLine).css({ width: _width + 2 * p, height: _height + 2 * p, top: _top - p, left: _left - p }).prop('width', _width + 2 * p).prop('height', _height + 2 * p);

            var getLeft = function (l) {
                return Math.max(1, Math.min(l - _left, _width));
            };
            var getTop = function (t) {
                return Math.max(1, Math.min(t - _top, _height));
            };

            for (var i = 0; i < influencees.length; i++) {
                if (!influencees[i]) continue;
                var ipos = influencees[i].getInfluenceLineInPoint(bpos);
                var styleObj = {fillStyle: this.options.influenceLineFill, strokeStyle: this.options.influenceLineStroke};
                sp.core.graphics.CanvasTools.drawArrow(this.influenceLine, {x: getLeft(bpos.left)+p, y: getTop(bpos.top)+p}, {x: getLeft(ipos.left)+p, y: getTop(ipos.top)+p}, styleObj);
            }
        }
    },

    updatePositiveInfluenceLines:function()
    {
        var influencees = this.getPositiveInfluencees();
        if(!influencees.length || !this.positiveInfluenceLine)
        {
            this.clearPositiveInfluenceeLines();
            return;
        }
        var context = this.positiveInfluenceLine.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.positiveInfluenceLine.width,this.positiveInfluenceLine.height);

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
            $(this.positiveInfluenceLine).css({ width: _width + 2 * p, height: _height + 2 * p, top: _top - p, left: _left - p }).prop('width', _width + 2 * p).prop('height', _height + 2 * p);

            var getLeft = function(l) { return Math.max(1, Math.min(l - _left, _width)); };
            var getTop = function(t) { return Math.max(1, Math.min(t - _top, _height)); };

            for(var i=0; i<influencees.length; i++)
            {
                if(!influencees[i]) continue;
                var ipos = influencees[i].getInfluenceLineInPoint(bpos);
                var styleObj = {fillStyle:this.options.positiveInfluenceeLineFill, strokeStyle:this.options.positiveInfluenceeLineStroke};
                sp.core.graphics.CanvasTools.drawArrow(this.positiveInfluenceLine,{x:getLeft(bpos.left)+p,y:getTop(bpos.top)+p},{x:getLeft(ipos.left)+p,y:getTop(ipos.top)+p},styleObj);
            }
        }
    }
}
);

sp.ui.relationalchart.OrganisationChartElement.SelectionTypes = {MANAGER:"manager",INFLUENCEE:"influencee", POSITIVEINFLUENCEE: "positiveinfluencee"};

sp.ui.relationalchart.OrganisationChartElementOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults:function()
    {
        this.width = 120;
        this.minHeight = 80;
        this.fontSize = 10;
        this.draggerWidth = 12;
        this.draggerOffset = 0;
        this.draggerXOffset = 0;
        this.draggerOffsetMiddle = 0;
        this.hideLinesOnDrag = false;
        this.managerFieldName = 'ManagerID'; //necessary by request the evp data structure to remain the same as in flash version; there the field name is "Manager"
        this.influenceesFieldName = 'InfluenceeIDs'; //necessary by request the evp data structure to remain the same as in flash version; there the field name is "Influencees"
        this.influenceLineFill = "rgba(255,0,0,0.5)";
        this.influenceLineStroke = "rgba(255,0,0,0.8)";
        this.influenceesLineDrawFunction = sp.core.graphics.CanvasTools.drawTriangle;
        this.positiveInfluenceeLineFill = "rgba(0,128,0,0.5)";
        this.positiveInfluenceeLineStroke = "rgba(0,128,0,0.8)";
        this.positiveInfluenceesFieldName = "PositiveInfluenceeIDs";
        this.usePositiveInfluencees = false;
        this.influenceCanvasPadding = 0;
        this.xProp = 'x';
        this.yProp = 'y';
    }
}
);

sp.ui.relationalchart.OrganisationChartElementEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, data)
    {
        this.target = target;
        this.type = type;
        this.data = data;
    }
}
);

sp.ui.relationalchart.OrganisationChartElementEvent.ManagerUpdate = 'org_chart_el_manager_updated';
