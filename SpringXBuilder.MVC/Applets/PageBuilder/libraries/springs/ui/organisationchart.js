sp.namespace("sp.ui.organisationchart.OrganisationChart",
             "sp.ui.organisationchart.OrganisationChartElement");

sp.ui.organisationchart.OrganisationChart = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(graphic)
    {
        this.__super(graphic);
        this.init();
    },

    init:function()
    {
        this.addClass("sp_organisation_chart");
        this.selected = [];
        this.elements = [];
        this.selectionDragLayer = this.addElement(this.createElement("div",{},["selection_area"]));
        this.contentLayer = this.addElement(this.createElement("div",{},["content"]));
        this.customLayer = this.addElement(this.createElement("div"))
        this.selectionDrawLayer = this.addElement(this.createElement("div",{},["selection_draw"]));
        $(this.contentLayer).disableSelection()
        var dragSelect = new sp.ui.dragselect.DragSelect(this.selectionDrawLayer,this.selectionDragLayer);
        dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionStart);
        dragSelect.addEventListener(this,sp.core.events.DragEvent.STOP, this.onDragSelectionComplete);
        this.layers = [{content:this.content}];
        this.dataProvider = new sp.core.data.IndexedDataList();
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
    },

    getLayer:function(id)
    {
        if(this.layers[id]) return this.layers[id];
        this.layers[id] = $(this.customLayer).append(this.createElement("div"));
    },

    setDataProvider:function(dp)
    {
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
            this.addBox(data[i]);
        }
    },

    addBox:function(data)
    {
        var box = new sp.ui.organisationchart.OrganisationChartElement(this,this.dataProvider, data);
        box.addEventListener(this,sp.core.events.MouseEvent.MOUSEDOWN, this.selectElement);
        box.addEventListener(this,sp.core.events.DragEvent.START,this.onStartDrag);
        $(this.contentLayer).append(box.getGraphic());
        this.elements.push(box);
    },

    selectElement:function(event)
    {
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
    },

    onGroupDrag:function(event)
    {
        for(var i=0; i<this.selection.length; i++)
        {
            this.selection[i].refreshLines();
        }
    },

    onStartDrag:function(event,box)
    {
        if(this.hasMultipleSelection() && this.isSelected(event.target))
        {
            var members = this.getSelectedBoxes();
            var group = new sp.core.graphics.DragGroup(members);
            group.start(event.originalEvent.pageX,event.originalEvent.pageY);
            group.addEventListener(this,sp.core.events.DragEvent.DRAG, this.onGroupDrag)
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

    },

    onClickSelectionDragLayer:function()
    {
        this.unselectAll();
    },

    onAdd:function(event)
    {
        this.addBox(event.data);
    },

    onRemove:function(event)
    {
        //sp.out("remove");
    },

    onEdit:function(event)
    {
        //sp.out("edit");
    },

    onDataSet:function(event)
    {
        this.refresh();
    },

    isSelected:function(element)
    {
        for(var i=0; i<this.selected.length; i++) if(this.selected[i]==element) return true;
    }
}
);


sp.ui.organisationchart.OrganisationChartElement = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(parent,model,data)
    {
        this.__super();
        this.model = model;
        this.data = data || {ID:sp.guid()};
        this.init();
    },

    init:function()
    {
        this.id = sp.guid();
        this.manager = null;
        this.subordinates = [];
        this.influencees = [];
        this.influencers = [];
        this.dragMode = "";
        this.dropTarget = null; // used to work out if the influence dragger is dropped into empty space. Set to true if a box accepts it..and then check for null value on drop

        this.disableSelection();

        this.box = this.addElement(this.createElement("div",{},["box"]));
        this.mdragger = this.addElement(this.createElement("div",{},["dragger","manager"]));
        this.idragger = this.addElement(this.createElement("div",{},["dragger","influencee"]));

        this.managerLine = this.createElement("canvas",{width:"auto",height:"auto"},["line","manager"]);
        this.influenceline = this.createElement("canvas",{width:"auto",height:"auto"},["line","influence"]);
        this.influenceDragLine = this.createElement("canvas",{width:"auto",height:"auto"},["drag_line","influence"]);
        this.managerDragLine = this.createElement("canvas",{width:"auto",height:"auto"},["drag_line","manager"]);

        var __this = this;
        $(this.getGraphic()).mousedown(function(event){__this.onMouseDown(event);});
        $(this.getGraphic()).draggable({opacity:1, cursor: 'pointer', drag:function(e,ui){__this.onDrag(e,ui);}, start:function(e,ui){__this.onStartDrag(e,ui);}, stop:function(e,ui){__this.onStopDrag(e,ui);}});
        //$(this.box).dblclick(function(){__this.onDoubleClick()});
        //$(this.box).droppable({drop:function(event,ui){ui.draggable.attr('listener').acceptDrop(event.target);}});
        $(this.mdragger).draggable({revert:true, revertDuration:50, start:function(){__this.onStartManagerDragger();}, drag:function(){__this.updateManagerDraggerLine();}, stop:function(){__this.onStopManagerDragger();}});
        $(this.idragger).draggable({revert:true, revertDuration:50, start:function(){__this.onStartInfluenceDragger();}, drag:function(){__this.updateInfluenceDraggerLine();}, stop:function(){__this.onStopInfluenceDragger();}});

        $(this.getGraphic()).css("position","absolute");
        $(this.getGraphic()).css("left",this.data.x+"px");
        $(this.getGraphic()).css("top",this.data.y+"px");

    },

    getBounds:function()
    {
        var pos = $(this.box).offset();
        return new sp.core.geom.Rectangle(pos.left, pos.top, $(this.box).width(),$(this.box).height());
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
            $(this.box).addClass("selected");
        }
        else
        {
            $(this.box).removeClass("selected");
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

    onStartDrag:function(event,ui)
    {
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.START,event.originalEvent));
    },

    onStopDrag:function(event,ui)
    {
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.STOP,event.originalEvent));
        this.model.updateItem({x:ui.offset.left,
                               y:ui.offset.top,
                               ID:this.data.ID});
    },

    onDrag:function(event,ui)
    {

    },

    onStartInfluenceDragger:function()
    {
        this.dragMode = "INFLUENCE";
        //this.removeManager();
    },

    onStopInfluenceDragger:function()
    {
        this.dragMode = "";
        this.dropTarget = null;
    },

    updateInfluenceDraggerLine:function()
    {
        var context = this.dline.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.dline.width,this.dline.height);
            context.beginPath();
            var dpos = $(this.idragger).position();
            dpos.left += $(this.idragger).width()/2;
            dpos.top += $(this.idragger).height();
            var bpos = $(this.box).position();
            var xo = ($(this.box).width())/2;
            context.moveTo(bpos.left+xo,bpos.top);
            context.lineTo(dpos.left+bpos.left,dpos.top+bpos.top);
            context.strokeStyle = "rgb(0,0,0)";
            context.stroke();
        }
    },

    onStartManagerDragger:function()
    {
        this.dragMode = "MANAGER";
    },

    onStopManagerDragger:function()
    {
        this.dragMode = "";
        this.dropTarget = null;
    },

    updateManagerDraggerLine:function()
    {
        var context = this.dline.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.dline.width,this.dline.height);
            context.beginPath();
            var dpos = $(this.mdragger).position();
            dpos.left += $(this.mdragger).width()/2;
            dpos.top += $(this.mdragger).height();
            var bpos = $(this.box).position();
            var xo = ($(this.box).width())/2;
            context.moveTo(bpos.left+xo,bpos.top);
            context.lineTo(dpos.left+bpos.left,dpos.top+bpos.top);
            context.strokeStyle = "rgb(0,0,0)";
            context.stroke();
        }
    },

    kill:function()
    {
        $(this.box).unbind();
    }
}
);
