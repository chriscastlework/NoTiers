sp.namespace("spx.view.OrgChart");


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

        toString:function()
        {
            return "[OrgChart, options:" + this.options + "]";
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
            //this.selectionDragLayer = this.content.addElement(this.createElement("div",{width:this.canvasWidth,height:this.canvasHeight,background:"white",opacity:"0",filter:"alpha(opacity=0)","z-index":1},["selection_area"]));
            this.contentLayer = this.content.addElement(this.createElement("div",{"z-index":2},["content"]));
            this.customLayer = this.content.addElement(this.createElement("div",{id:"custom_layers"},["custom"]));
            this.gridLayer = this.content.addElement(this.createElement("div",{position:"absolute", width:this.canvasWidth, height:this.canvasHeight,"z-index":0},["canvas_grid"]));
            //this.selectionDrawLayer = this.content.addElement(this.createElement("div",{width:this.canvasWidth,height:this.canvasHeight,background:"none"},["selection_draw"]));
            //$(this.contentLayer).disableSelection();
            this.dragSelect = new sp.ui.dragselect.DragSelect(this.selectionDrawLayer,this.selectionDragLayer);
            this.dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionStart);
            this.dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionComplete);
            this.layers = [{content:this.content}];
            //this.dataProvider = new sp.core.data.IndexedDataList();
            this.dragLine = this.createElement("canvas",{position:"absolute"},["drag_line"],{width:this.canvasWidth*this.zoomLevel,height:this.canvasHeight*this.zoomLevel});
            $(this.getLayer("drag_container")).append(this.dragLine);
            this.viewport = this.getGraphic();

            // set up the lasso selection tool...
            //this.dragLine = this.createElement("canvas",{position:"absolute"},["drag_line"],{width:this.canvasWidth*this.zoomLevel,height:this.canvasHeight*this.zoomLevel});
            //$(this.getLayer("drag_container")).append(this.dragLine);


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
            sp.out("Orgchart getLayer with id:" + id);
            return;
            if(!this.layers[id])
            {
                sp.out("...no layer exists, creating new one");
                var layer = $(this.customLayer).append(this.createElement("div"));
                $(layer).attr("id",id);
                $(layer).css("z-index",z || "");
                $(layer).css("position","absolute");
                $(layer).css("left","0px");
                $(layer).css("top","0px");
                $(layer).css("width","2000px");
                $(layer).css("height","1000px");
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

            this.buildLines();

            //org chart box
            this.subordinates = [];
            this.influencees = [];
            this.dragMode = "";
            this.dropTarget = null; // used to work out if the influence dragger is dropped into empty space. Set to true if a box accepts it..and then check for null value on drop
            //this.mdragger = this.addElement(this.createElement("div",{position:'absolute'},["dragger","manager"],{id:"mdragger"}));
            //this.idragger = this.addElement(this.createElement("div",{position:'absolute'},["dragger","influencee"],{id:"idragger"}));
            //$(this.mdragger).data("parentElement",this);
            //$(this.idragger).data("parentElement",this);
            //this.managerLine = this.createElement("canvas",{position:"absolute"},["line","manager"],{width:0,height:0});
            //this.influenceLine = this.createElement("canvas",{position:"absolute", top: 0, left: 0},["line","influence"],{width:0,height:0});
            //$(this.parent.getLayer("manager")).append(this.managerLine);
            //$(this.parent.getLayer("influencees")).append(this.influenceLine);
            //$(this.mdragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(){__this.onStartSelector_Manager();}, drag:function(){__this.onDragSelector_Manager();}, stop:function(){__this.onStopSelector_Manager();}});
            //$(this.idragger).draggable({revert:true, revertDuration:50, scroll:false, start:function(e,u){__this.onStartSelector_Influence(e,u);}, drag:function(e,u){__this.onDragSelector_Influence(e,u);}, stop:function(e,u){__this.onStopSelector_Influence(e,u);}});
            $(this.getContent()).droppable({drop:function(event,ui){__this.onDropped(event, ui)}});
        },

        createDragger:function(option)
        {
            var dragger = new spx.view.OrgChartLineDragger(this,this.parent,option);
            dragger.addEventListener(this,spx.view.OrgChartDragEvent.START,this.onStartDragger);
            dragger.addEventListener(this,spx.view.OrgChartDragEvent.DRAG,this.onDragDragger);
            dragger.addEventListener(this,spx.view.OrgChartDragEvent.STOP,this.onStopDragger);
            return dragger;
        },

        createConnectionManager:function(option)
        {
            var connectionManager = new spx.view.OrgChartConnectionManager(this,this.parent,option);
            return connectionManager;
        },

        getDraggerById:function(id)
        {
            for(var i=0; i<this.lineDraggers.length; i++)
            {
                if(this.lineDraggers[i].getId()==id) return this.lineDraggers[i];
            }
        },

        getConnectionManagerById:function(id)
        {
            for(var i=0; i<this.connectionManagers.length; i++)
            {
                if(this.connectionManagers[i].getId()==id) return this.connectionManagers[i];
            }
        },

        getBoxCenter:function()
        {
            return $(this.getContent()).position().left + $(this.getContent()).width()/2;
        },

        placeDraggerIcons:function()
        {
            var x = this.getBoxCenter();
            for(var i=0; i<this.lineDraggers.length; i++)
            {
                this.lineDraggers[i].setPosition(20,i);
                //this.connectionManagers.push(this.createConnectionManager(lineOptions[i]));
            }
        },

        buildLines:function()
        {
            var lineOptions = this.parent.options.lines;
            this.lineDraggers = [];
            this.connectionManagers = [];
            var __this = this;

            for(var i=0; i<lineOptions.length; i++)
            {
                this.lineDraggers.push(this.createDragger(lineOptions[i]));
                this.connectionManagers.push(this.createConnectionManager(lineOptions[i]));
            }
            setTimeout($.proxy(this.placeDraggerIcons,this));
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

        onStartDragger:function(event)
        {
            this.dragMode = event.target.getId();
            this.bringToFront();

            if(event.target.getOptions().lineClearsOn == sp.ui.relationalchart.LineClearanceTypes.STARTDRAG)
            {
                var item = {};
                item[this.managerFieldName] = '';
                this.dispatchUIChange(item);
                this.clearManagerLine();
            }
        },

        onStopDragger:function(event)
        {
            this.dragMode = "";
            this.revertZIndex();
            if(!this.dropTarget)
            {
                this.clearInfluencees();
            }
            this.dropTarget = null;
        },

        onDragDragger:function(event)
        {

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

        hasDragger:function(dragger)
        {
            for(var i=0; i<this.lineDraggers.length; i++)
            {
                if(this.lineDraggers[i] == dragger) return true;
            }
        },

        onDropped:function(event, ui)
        {
            var dragger = $(ui.draggable).data("draggerInstance");
            if(this.hasDragger(dragger)) return; // ignore drops triggered by our own draggers...


            var connectionManager = this.getConnectionManagerById(dragger.getId());
            if(connectionManager) connectionManager.addConnection(dragger.getBox());



            //this.dispatchUIChange(item);
            //this.dropTarget = true;




            // TRIGGER A DATA CHANGE /  SAVE



            //sp.out("dropped " + dragger + " on " + this);
         //   var parent = $(ui.draggable).data("parentElement");
            /*if (parent == this) return; // don't accept drops from self
            try
            {
                parent.acceptDrop(this);
            }
            catch(e)
            {
                sp.out("[OrganisationChartElement] cant accept drop:" + e.message);
            }*/
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
        },

        getZIndex:function()
        {
            $(this.getGraphic()).css('zIndex');
        },

        setZIndex:function(z)
        {
            $(this.getGraphic()).css('zIndex', this.initialZIndex);
        },

        bringToFront:function()
        {
            this.lastZIndex = this.getZIndex();
            this.setZIndex(10000);
        },

        revertZIndex:function()
        {
            this.setZIndex(this.lastZIndex);
        }
    }
);

spx.view.OrgChartConnectionManager = sp.core.events.EventDispatcher.extend
({
    __constructor:function(box,chart,options)
    {
        this.box = box;
        this.chart = chart;
        this.options = options;
        this.connections = [];
        this.canvas = this.createCanvas();
        this.getLineLayer().append(this.canvas);
        this.lines = [];
    },

    getLineId:function()
    {
        return "connection_" + this.options.id;
    },

    getLineLayer:function()
    {
        return $(this.chart.getLayer(this.getLineId()));
    },

    createCanvas:function()
    {
        var canvas = $("<canvas/>");
        canvas.addClass(this.options.id + " line");
        canvas.css({
            position:"absolute",
            width:0,
            height:0
        });
        return canvas[0];
    },

    getId:function()
    {
        return this.options.id;
    },

    redraw:function()
    {
        for(var i=0; i<this.lines.length; i++)
        {
            this.lines[i].redraw();
        }
    },

    clearLines:function()
    {
        for(var i=0; i<this.lines.length; i++)
        {
            this.lines[i].clear();
        }
    },

    hasConnection:function(connection)
    {
        for(var i=0; i<this.connections.length; i++)
        {
            if(this.connections[i] == connection) return true;
        }
    },

    addConnection:function(box)
    {
         if(this.hasConnection(box)) return;
        this.connections.push(box);
        this.lines.push(new spx.view.OrgChartLine(this.chart,this.box,box,this.options,this.canvas));
        this.redraw();
    }
})

spx.view.OrgChartLine = sp.core.events.EventDispatcher.extend
({
    __constructor:function(chart,from,to,options,canvas)
    {
        this.chart = chart;
        this.canvas = canvas;
        this.from = from;
        this.to = to;
        this.options = options;
        this.redraw();
    },

    toString:function()
    {
        return "[Line from:" + this.from + " to:" + this.to + " id:" + this.options.id + "]";
    },

    getLineInPoint:function(coords)
    {
        return this.to.getInfluenceLineInPoint(coords);
    },

    getLineOutPoint:function()
    {
        return this.from.getInfluenceLineOutPoint();
    },

    redraw:function()
    {

        sp.out(this + " redrawing canvas:" + this.canvas);
        this.clear();

        var context = this.canvas.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.canvas.width,this.canvas.height);

            var bpos = this.getLineOutPoint();

            var _top = bpos.top,
                _bottom =  bpos.top,
                _left = bpos.left,
                _right = bpos.left;

            var pos = this.getLineInPoint(bpos);
            _top = pos.position=="lr" ? Math.min(_top, pos.top-100) : Math.min(_top, pos.top);
            _bottom = pos.position=="lr" ? Math.max(_bottom, pos.top+100) : Math.max(_bottom, pos.top);
            _left = pos.position=="tb" ? Math.min(_left, pos.left-100) : Math.min(_left, pos.left);
            _right = pos.position=="tb" ? Math.max(_right, pos.left+100) : Math.max(_right, pos.left);


            var _width = _right - _left;
            var _height = _bottom - _top;

           // var p = this.options.influenceCanvasPadding;
           // $(this.influenceLine).css({ width: _width + 2 * p, height: _height + 2 * p, top: _top - p, left: _left - p }).prop('width', _width + 2 * p).prop('height', _height + 2 * p);

            var p = 0;


            var getLeft = function(l) { return Math.max(1, Math.min(l - _left, _width)); };
            var getTop = function(t) { return Math.max(1, Math.min(t - _top, _height)); };

            var ipos = this.getLineInPoint(bpos);
            var styleObj = {fillStyle:this.options.fill, strokeStyle:this.options.stroke};

            sp.out("Drawing from:" + JSON.stringify(bpos) + " to:" + JSON.stringify(ipos));

            this.options.lineDrawFunction(this.canvas,{x:getLeft(bpos.left)+p,y:getTop(bpos.top)+p},{x:getLeft(ipos.left)+p,y:getTop(ipos.top)+p},styleObj);

        }
    },

    clear:function()
    {

    }

})

spx.view.OrgChartLineDragger = sp.core.events.EventDispatcher.extend
({
    __constructor:function(box,chart,options)
    {
        this.__super();
        this.box = box;
        this.chart = chart;
        this.options = options;
        this.build();
    },

    setPosition:function(origin,order)
    {
        // given an origin (x) and an order (negative or positive) draw itself in the relevant place
        var w = this.dragger.width();
         var x = origin + (order*w) - (w/2);
        this.dragger.css("left",x+"px");
    },

    toString:function()
    {
        return "[Line dragger:" + this.options.id +"]";
    },

    build:function()
    {
        var __this = this;
        this.dragger = this.createDragger(this);
        this.box.addElement(this.dragger);
        this.line = this.createLineCanvas();
        this.getLineLayer().append(this.line);
    },

    getLineId:function()
    {
        return "dragger_line_" + this.options.id;
    },

    getLineLayer:function()
    {
        return $(this.chart.getLayer("drag_container"));
    },

    createLineCanvas:function()
    {
        var canvas = $("<canvas width='2000px' height='1000px'/>");
        canvas.addClass(this.options.id + " line");
        canvas.css({
            position:"absolute",
            left:"0px",
            top:"0px"
        });
        return canvas[0];
    },

    getDraggerClass:function()
    {
        return this.options.class + " " + this.options.id + " dragger";
    },

    getId:function()
    {
        return this.options.id;
    },

    getBox:function()
    {
        return this.box;
    },

    getOptions:function()
    {
        return this.options;
    },

    createDragger:function(listener)
    {
        var dragger = $("<div/>");
        dragger.addClass(this.getDraggerClass());
        dragger.css({
            position:"absolute"
        });
        dragger.data("draggerInstance",this);
        dragger.draggable({revert:true, revertDuration:50, scroll:false, start:function(e,u){listener.onStartDrag(e,u);}, drag:function(e,u){listener.onDrag(e,u);}, stop:function(e,u){listener.onStopDrag(e,u);}});
        return dragger;
    },

    setLineLayerZIndex:function(index)
    {
        // brings the layer which the lines are drawn in to the front, so line appear over any boxes...
        $(this.getLineLayer()).css("zIndex",index);
    },

    onStartDrag:function(event,ui)
    {
        this.dispatchEvent(new spx.view.OrgChartDragEvent(this,spx.view.OrgChartDragEvent.START,this.options.id));
    },

    onDrag:function(event,ui)
    {
        this.setLineLayerZIndex(9999);
        var context = this.line.getContext("2d");
        if(context)
        {
            var $dragger = $(ui.helper);
            context.clearRect(0,0,this.line.width,this.line.height);
            context.beginPath();
            var dpos = $dragger.offset();
            dpos.left += $dragger.width()/2;
            dpos.top += $dragger.height()/2;
            var bpos = $(this.box.getContent()).offset();
            var xo = ($(this.box.getContent()).width())/2;
            var o = $(this.line).offset();
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
        this.dispatchEvent(new spx.view.OrgChartDragEvent(this,spx.view.OrgChartDragEvent.DRAG,this.options.id));

    },

    onStopDrag:function(event,ui)
    {
        var context = this.line.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.line.width,this.line.height);
        }
        this.setLineLayerZIndex("");
        $(this.dragger).removeClass().addClass(this.getDraggerClass()); // removes any classes added by the drag functionality and adds back any standard ones required
         //this.dragMode = "";
        // if(!this.dropTarget)
        // {
        //     this.clearInfluencees();
        // }
        // this.dropTarget = null;
        /**/
        this.dispatchEvent(new spx.view.OrgChartDragEvent(this,spx.view.OrgChartDragEvent.STOP,this.options.id));

    }


})



spx.view.OrgChartDragEvent = sp.core.events.Event.extend
({
    __constructor:function(target,type,id)
    {
        this.__super(target,type);
        this.id = id;
    }
});
spx.view.OrgChartDragEvent.START = "start";
spx.view.OrgChartDragEvent.DRAG = "drag";
spx.view.OrgChartDragEvent.STOP = "stop";


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
