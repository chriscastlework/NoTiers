//REQUIRES sp, sp.events
if(!sp || !sp.core || !sp.core.events) console.log("[ERROR:Drag package requires sp and sp.core.events packages]");

sp.namespace("drag.DragManager",
        "drag.Draggable",
        "drag.Droppable",
        "drag.DroppableContainer",
        "drag.DragEvent",
        "drag.Sortable");


drag.DragManager = Class.extend
({
    __constructor:function()
    {
        this.droppables = [];
        this.draggables = [];
        this.currentDropTarget;
    },
    registerDraggable:function(draggable)
    {
        for(var i=0; i<this.draggables.length; i++)
        {
            if(this.draggables[i]==draggable) throw new Error("Attempted to register a draggable which is already registered");
        }
        this.draggables.push(draggable);
        return;
    },
    deregisterDraggable:function(draggable)
    {
        for(var i=0; i<this.draggables.length; i++)
        {
            if(this.draggables[i]==draggable)
            {
                this.draggables.splice(i,1);
                return;
            }
        }
        throw new Error("Attempted to unregister a droppable which is not registered");
        return;
    },
    registerDroppable:function(droppable)
    {
        for(var i=0; i<this.droppables.length; i++)
        {
            if(this.droppables[i]==droppable) throw new Error("Attempted to register a droppable which is already registered");
        }
        this.droppables.push(droppable);
        return;
    },
    deregisterDroppable:function(droppable)
    {
        for(var i=0; i<this.droppables.length; i++)
        {
            if(this.droppables[i]==droppable)
            {
                this.droppables.splice(i,1);
                return;
            }
        }
        throw new Error("Attempted to unregister a droppable which is not registered");
        return;
    },
    isInBounds:function(n,h)
    {
        return (n.left >= h.left && n.left <= h.right && n.top <= h.bottom && n.top >= h.top);
    },
    getCandidatesForEvent:function(element,draggable)
    {
        // loops through DOM getting candidates for the event, from lowest descendant upwards...
        var candidates = [];
        var children = $(element).children();
        if($(element).is(draggable.getDragTarget()))
        {
            // prevents a droppable which is also draggable from accepting itself..
            return [];
        }
        var draggablePos  = draggable.getDragTarget().offset()
        for (var i = 0; i < children.length; i++)
        {
            // if this element is not covering the draggable space then its children also shouldn't be so we can skip it
            if(this.isInBounds(draggablePos,children[i].getBoundingClientRect()))
            {
                candidates = candidates.concat(this.getCandidatesForEvent(children[i], draggable));
            }
        }
        var droppable = this.getDroppableForTarget(element);
        if(droppable)
        {
            if(draggable.getGroupID()!=null && droppable.getGroupID()!=draggable.getGroupID())
            {
                // restrict any droppable with a group id to only those droppables which share the same id..
                return candidates;
            }
            if(droppable.checkBounds(draggable))
            {
                candidates.push(droppable);
            }
        }
        return candidates;
    },
    getDroppableForTarget:function(el)
    {
        for(var i=0; i<this.droppables.length; i++)
        {
            if($(this.droppables[i].getTarget()).is(el)) return this.droppables[i];
        }
        return false;
    },
    onDrag:function(draggable,event,ui)
    {
        var children = $("body").children();
        var candidates = [];
        for(var i=0; i<children.length; i++) {
            var can = this.getCandidatesForEvent(children[i],draggable);
            if(can && can.length) candidates = candidates.concat(can);
        }
        for(var i=0; i<candidates.length; i++)
        {
            var accepted = candidates[i].willAcceptDrop(draggable,event,ui).accepted;
            if(accepted)
            {
                if(this.currentDragTarget && this.currentDragTarget != candidates[i])
                {
                    this.currentDragTarget.onDragOut(draggable,event,ui);
                }
                this.currentDragTarget = candidates[i];
                this.currentDragTarget.onDragOver(draggable,event,ui);
                draggable.onDragAccepted(this.currentDragTarget,event,ui);
                return;
            }
        }
        if(this.currentDragTarget)
        {
            this.currentDragTarget.onDragOut(draggable,event,ui);
            delete this.currentDragTarget;
        }
    },
    onDrop:function(draggable,event,ui)
    {
        var children = $("body").children();
        var candidates = [];
        for(var i=0; i<children.length; i++)
        {

            var can = this.getCandidatesForEvent(children[i],draggable);
            if(can && can.length) candidates = candidates.concat(can);
        }
        var accepted;
        for(var i=0; i<candidates.length; i++)
        {
            // if the droppable will accept the event, it will return an event object containing
            // the index position, which then can be passed to the droppable after the
            // draggable has handled its own drop event. This means it doesn't matter if any event handler
            // manipulates the DOM (eg removing the placeholder) - the droppable will still know which position
            // to insert any content at without needing to recalculate the position of the draggable element
            var dropEvent  = candidates[i].willAcceptDrop(draggable,event,ui);
            if(dropEvent.accepted)
            {
                // timing of events is important...we need to trigger the on draggable before the droppable...
                draggable.onDrop(true,null,event,ui);
                candidates[i].onDrop(dropEvent);
                return;
            }
        }
        draggable.onDrop(false,event,ui);
    }
});
drag.DragManager.INSTANCE = new drag.DragManager();
drag.DragManager.getInstance = function()
{
    return drag.DragManager.INSTANCE;
}

drag.Draggable = sp.core.events.EventDispatcher.extend
({
    __constructor:function(target,options)
    {
        this.__super();
        this.target = target;
        this.options = this.getDefaultOptions(options);
        this.guid = sp.guid();
        this.originalStyling;
        this.guid = sp.guid();
        this.dragTarget;
        this.init();
    },
    getTolerance:function()
    {
      return (options.tolerance!=undefined)? options.tolerance : 5;
    },
    toString:function()
    {
        return "[Draggable " + this.guid + "]";
    },
    init:function()
    {
        drag.DragManager.getInstance().registerDraggable(this);
        this.listenForMouseDown();
    },
    kill:function()
    {
        drag.DragManager.getInstance().deregisterDraggable(this);
        $(this.getHandle()).off(this.getEventWithNamespace("mousedown"));
        $(document).off(this.getEventWithNamespace("mousemove"));
        $(document).off(this.getEventWithNamespace("mouseup"));
    },
    cancelDrag:function()
    {
        $(document).off(this.getEventWithNamespace("mousemove"));
        $(document).off(this.getEventWithNamespace("mouseup"));
        this.revert();
        this.listenForMouseDown();
    },
    getEventWithNamespace:function(event)
    {
        return event+"."+this.guid;
    },
    getDefaultOptions:function(o)
    {
        var options = {
            revert:true,
            clone:false,
            helper:null,
            groupID:null,
            handle:null
        };
        if(o) for(var prop in o) options[prop] = o[prop];
        return options;
    },
    getGroupID:function()
    {
        return this.options.groupID;
    },
    getPlaceholder:function()
    {
        var clone =  $(this.dragTarget).clone();
        var cssObject = $(this.dragTarget).prop("style");
        cssObject.removeProperty("position");
        return clone;
    },
    createDragTarget:function()
    {
        this.originalStyling = this.getOriginalStyleProperties();
        var target;
        if(this.options.getPlaceholder)
        {
            target = this.options.getPlaceholder();
        }
        else
        {
            target = (this.options.clone)? $(this.target).clone().fadeTo(0,0.5) : $(this.target).detach();
        }
        $(document.body).append(target);
        $(target).css("position","absolute");
        $(target).width(this.originalStyling.width);
        $(target).height(this.originalStyling.height);
        $(target).zIndex(10000);//TODO make this more sophisticated...magic number is going to cause problems
        $(target).offset(this.originalStyling.offset);
        return target;
    },
    cleanDragTarget:function()
    {
        //remove any styling added as a result of the drag..
        $(this.dragTarget).css("position",this.originalStyling.position);
        $(this.dragTarget).zIndex(this.originalStyling.z);
        $(this.dragTarget).css("left","");
        $(this.dragTarget).css("top","");
        //$(this.dragTarget).css("width",this.originalStyling.cssWidth);
        //$(this.dragTarget).css("height",this.originalStyling.cssHeight);
    },
    getOriginalStyleProperties:function()
    {
        return {position:$(this.target).css("position"),
            offset:$(this.target).offset(),
            parent:$(this.target).parent(),
            previousSibling:$(this.target).prev(),
            z:$(this.target).zIndex()
            //width:$(this.target).width(),
            //height:$(this.target).height(),
            //cssWidth:$(this.target).css("width"),
            //cssHeight:$(this.target).css("height")
        };
    },
    onMouseDown:function(event,ui)
    {
        event.stopImmediatePropagation();
        event.stopPropagation();
        if(document.selection)
        {
            document.selection.empty();
        }
        else if(window.getSelection)
        {
            window.getSelection().removeAllRanges();
        }
        $(this.getHandle()).off(this.getEventWithNamespace("mousedown"));
        this.startCoords = {x:event.pageX,y:event.pageY};
        this.isDragging = false;
        var  __this = this;
        $(document).on(this.getEventWithNamespace("mousemove"),function(e,ui){__this.onMouseMove(e,ui)});
        $(document).on(this.getEventWithNamespace("mouseup"),function(e,ui){__this.onMouseUp(e,ui)});
    },
    drag:function(event,ui)
    {
        $(this.dragTarget).offset({left:event.pageX+this.offset.left,top:event.pageY+this.offset.top});
        drag.DragManager.getInstance().onDrag(this,event,ui);
        this.dispatchEvent(new drag.DragEvent(this,drag.DragEvent.DRAG,this.dragTarget,null,this,event));
    },
    triggerDrag:function(event,ui)
    {
        event.stopImmediatePropagation();
        event.stopPropagation();
        $(this.getHandle()).off(this.getEventWithNamespace("mousedown"));
        if(document.selection)
        {
            document.selection.empty();
        } else if(window.getSelection)
        {
            window.getSelection().removeAllRanges();
        }
        this.isDragging = true;
        this.dragTarget = this.createDragTarget();
        this.offset = {
            left:$(this.dragTarget).offset().left-event.pageX,
            top:$(this.dragTarget).offset().top-event.pageY
        };
        var  __this = this;
        $(document).on(this.getEventWithNamespace("mousemove"),function(e,ui){__this.onMouseMove(e,ui)});
        $(document).on(this.getEventWithNamespace("mouseup"),function(e,ui){__this.onMouseUp(e,ui)});
    },
    startDrag:function(event,ui)
    {
        this.isDragging = true;
        this.dragTarget = this.createDragTarget();
        this.offset = {
            left:$(this.dragTarget).offset().left-event.pageX,
            top:$(this.dragTarget).offset().top-event.pageY
        };
        var  __this = this;
        this.dispatchEvent(new drag.DragEvent(this,drag.DragEvent.START,this.dragTarget,null,this,event));
    },
    onMouseMove:function(event,ui)
    {
        event.stopImmediatePropagation();
        event.stopPropagation();
        if(this.isDragging)
        {
            this.drag(event,ui);
        }
        else
        {
            if(Math.abs(event.pageX-this.startCoords.x)+Math.abs(event.pageY-this.startCoords.y)>2)
            {
                this.startDrag(event,ui);
            }
        }
    },
    onMouseUp:function(event,ui)
    {
        event.stopImmediatePropagation();
        event.stopPropagation();
        $(document).off(this.getEventWithNamespace("mousemove"));
        $(document).off(this.getEventWithNamespace("mouseup"));
        this.listenForMouseDown();
        if(this.isDragging)
        {
            drag.DragManager.getInstance().onDrop(this,event,ui);
            this.dispatchEvent(new drag.DragEvent(this,drag.DragEvent.STOP,this.dragTarget,null,this,event));
        }
        this.isDragging = false;
        this.startCoords = null;
    },
    getHandle:function()
    {
        if(!this.handle) this.handle = this.options.handle || this.target; // prevents handle being changed once it is passed to the constructor, otherwise it could be changed after the event handlers are assigned and mess things up..
       return this.handle;
    },
    listenForMouseDown:function()
    {
        var __this = this;
        $(this.getHandle()).on(this.getEventWithNamespace("mousedown"),function(e,ui){__this.onMouseDown(e,ui)});
    },
    getDragTarget:function()
    {
        return this.dragTarget;
    },
    getTarget:function()
    {
        return this.target;
    },
    getDragElementBounds:function()
    {
        var pos = $(this.dragTarget).offset();
        return {
            top:pos.top,
            left:pos.left,
            right:pos.left+$(this.dragTarget).width(),
            bottom:pos.top+$(this.dragTarget).height()
        }
    },
    getOffset:function()
    {
        return $(this.dragTarget).offset();
    },
    shouldRemoveOnDrop:function()
    {
        return this.options.clone || this.options.getPlaceholder;
    },
    onDrop:function(accepted,event,ui)
    {
        if(accepted)
        {
            if(this.shouldRemoveOnDrop()) this.revert();
        }
        else
        {
            this.revert();
        }
        this.dispatchEvent(new drag.DragEvent(this,drag.DragEvent.DROP,this.getTarget(),null,this,event,accepted));

    },
    onDragAccepted:function(droppable)
    {
        // called by DragManager if a drag event is accepted...
    },
    revert:function()
    {
        if($(this.dragTarget).is(this.target))
        {
            if(this.originalStyling.previousSibling.length)
            {
                $(this.originalStyling.previousSibling).after($(this.target).detach());
            }
            else
            {
                $(this.originalStyling.parent).prepend($(this.target).detach());
            }
            $(this.target).css("position",this.originalStyling.position);
            $(this.target).zIndex(this.originalStyling.zIndex);
            if(this.originalStyling.position=="absolute" || this.originalStyling.position=="relative")
            {
                $(this.target).offset(this.originalStyling.offset);
            }
        }else
        {
             $(this.dragTarget).remove();
        }

    }
});

drag.Droppable = sp.core.events.EventDispatcher.extend
({
    __constructor:function(target,options)
    {
        this.__super();
        this.target = target;
        this.options = this.getDefaultOptions(options);
        this.guid = sp.guid();
        drag.DragManager.getInstance().registerDroppable(this);
    },
    toString:function()
    {
        return "[Droppable " + this.guid + "  - target:" + this.target + "]";
    },
    getDefaultOptions:function(o)
    {
        var options = {
            revert:true,
            clone:false,
            helper:null,
            groupID:null
        };
        if(o) for(var prop in o) options[prop] = o[prop];
        return options;
    },
    //LOGIC
    checkBounds:function(draggable,method)
    {
        if($(draggable.target).is(this.target)) return;
        var draggableBounds = draggable.getDragElementBounds();
        var bounds = this.getBounds();
        var over = false;
        //TODO expose all methods...
        if(method=="fit")
        {

        }
        else if(method=="overlap")
        {

        }
        over = (draggableBounds.left>=bounds.left && draggableBounds.left<=bounds.right && draggableBounds.top>=bounds.top && draggableBounds.top<=bounds.bottom);
        //if(!over) $(this.target).removeClass("drag-over");
        return over;
    },
    addElementAtIndex:function(index,el)
    {
        if(index==0)
        {
            $(this.target).prepend(el);
        }
        else if(index<=this.numChildren()-1)
        {
            var child = this.getChildren().eq(index)[0];
            $(child).before(el);
        }
        else
        {
            $(this.target).append(el);
        }
        return el;
    },
    getGroupID:function()
    {
        return this.options.groupID;
    },
    getTarget:function()
    {
        return this.target;
    },
    getTargetZ:function()
    {
        return $(this.target).zIndex();
    },
    getBounds:function()
    {
        var pos = $(this.target).offset();
        return {
            top:pos.top,
            left:pos.left,
            right:pos.left+$(this.target).width(),
            bottom:pos.top+$(this.target).height()
        }
    },
    indexOfElement:function(el)
    {
        // can't get jquery index() to return anything except -1 so easier to write a simple method
        var children = $(this.target).children(":not(.drag-placeholder)").get();
        for(var i=0; i<children.length; i++)
        {
            if($(children[i]).is(el)) return i;
        }
        return -1;
    },
    getIndexForDropEvent:function(draggable)
    {
        // given a draggable, compute the relevant index in the parent to place dropped content or placeholder..
        var point = draggable.getOffset();
        var el,bounds;
        var children = this.getChildren().get();
        for(var i=0; i<children.length; i++) // first check from last to first...
        {
            el = children[i];
            bounds = this.getBoundsForElement(el);
            if(point.top<=bounds.top) return this.indexOfElement(el);
            if(point.left<=bounds.left && point.top<bounds.bottom) return this.indexOfElement(el);
        }
        return children.length;
    },
    getChildren:function()
    {
        return $(this.target).children(":not(.drag-placeholder)");
    },
    numChildren:function()
    {
        return this.getChildren().length;
    },
    getBoundsForElement:function(el)
    {
        var w = $(el).width();
        var h = $(el).height();
        var offset = $(el).offset();
        return {left:offset.left,
            right:offset.left+w,
            top:offset.top,
            bottom:offset.top+h};
    },
    willAcceptDrop:function(draggable,event,ui)
    {
        var event = new drag.DragEvent(this,drag.DragEvent.DROP,draggable.getDragTarget(),this.getIndexForDropEvent(draggable),draggable,event);
        event.accepted = (this.options.willAcceptDrop)? this.options.willAcceptDrop(event) : true;
        return event;
    },
    onDragOver:function(draggable,event,ui)
    {
        var event  = new drag.DragEvent(this,drag.DragEvent.OVER,draggable.getDragTarget(),this.getIndexForDropEvent(draggable),draggable,event);
        this.dispatchEvent(event);
    },
    onDragOut:function(draggable,event,ui)
    {
        var event  = new drag.DragEvent(this,drag.DragEvent.OUT,draggable.getDragTarget(),null,draggable,event);
        this.dispatchEvent(event);
    },
    onDrop:function(event)
    {
        var draggable = event.draggable;
        draggable.cleanDragTarget();
        var event  = new drag.DragEvent(this,drag.DragEvent.DROP,draggable.getDragTarget(),event.index,draggable,event);
        this.dispatchEvent(event);
    }
});

drag.DroppableContainer = drag.Droppable.extend
({
    __constructor:function(target,options)
    {
        this.__super(target,options);
        this.currentNextChild;
        this.placeholder;
    },
    toString:function()
    {
        return "[DroppableContainer " + this.guid + "  - target:" + this.target + "]";
    },
    removePlaceholder:function()
    {
        if(this.placeholder)
        {
            $(this.placeholder).remove();
            delete this.placeholder;
        }
    },
    getPlaceholder:function(event)
    {
        if(this.options.getPlaceholder)
        {
            var el = this.options.getPlaceholder(event);
            if(el)
            {
                $(el).addClass("drag-placeholder");
                $(el).css("position","");

                //$(el).css("position:","absolute");
                //$(el).css("float","left");
                return el;
            }
        }
        var el = $("<div></div>");
        $(el).addClass("drag-placeholder");
        //$(el).css("position:","absolute");
        //$(el).css("float","left");
        return el;
    },
    onDragOver:function(draggable,event,ui)
    {
        var index = this.getIndexForDropEvent(draggable);
        var event =  new drag.DragEvent(this,drag.DragEvent.OVER,draggable.getDragTarget(),index,draggable,event);
        if(!this.placeholder) this.placeholder = this.getPlaceholder(event);
        this.addElementAtIndex(index,this.placeholder);
        this.dispatchEvent(event);
    },
    onDragOut:function(draggable,event,ui)
    {
        this.removePlaceholder();
        this.__super(draggable,event,ui);
    },
    onDrop:function(event)
    {
        this.__super(event);
        this.removePlaceholder();
    }
});

drag.Sortable = drag.DroppableContainer.extend
({
    __constructor:function(target,options)
    {
        this.__super(target,options);
        this.options.groupID = this.options.groupID || sp.guid();
        this.draggables = [];
        this.refresh();
    },
    refresh:function()
    {
        for(var i=0; i<this.draggables.length; i++)
        {
            this.draggables[i].kill();
        }
        this.draggables = [];
        var __this = this;
        $(this.target).children().each(function()
        {
            __this.draggables.push(new drag.Draggable(this,{groupID:__this.options.groupID}));
        });
    },
    toString:function()
    {
        return "[Sortable id:" + this.guid + "]";
    },
    willAcceptDrop:function(draggable,event,ui)
    {
        var event = this.__super(draggable,event,ui);
        event.accepted = event.accepted || (draggable.getGroupID()==this.getGroupID());
        return event;
    },
    onDrop:function(event)
    {
        var draggable = event.draggable;
        var from = {w:$(draggable.getDragTarget()).width(),
                    h:$(draggable.getDragTarget()).height()};
        var index = this.getIndexForDropEvent(draggable);
        this.__super(event);
        this.removePlaceholder();
        var el = this.addElementAtIndex(index,$(draggable.getDragTarget()).detach());
        var to = {w:$(el).width(),
                  h:$(el).height()};
        $(el).hide().fadeIn();
    },
    getPlaceholder:function(event)
    {
        var el = $(event.element).clone() || $("<div></div>");
        $(el).addClass("drag-placeholder");
        $(el).css("position","");
        $(el).fadeTo(0,0.5);
        return el;
    },
    setGroupID:function(id)
    {
        this.options.groupID = id;
    }
});

drag.DragEvent = sp.core.events.Event.extend
(
    {
        __constructor:function(target,type,element,index,draggable,originalEvent,accepted)
        {
            this.__super(target,type);
            this.element = element;
            this.draggable = draggable;
            this.index = index;
            this.originalEvent = originalEvent;
            this.accepted = accepted;
        },
        toString:function()
        {
            return "[DragEvent, type:" + this.type + " element:" + this.element + " index:" +  this.index + " draggable:" + this.draggable + " originalEvent:" + this.originalEvent;
        }
    }
)
drag.DragEvent.START = "drag_start";
drag.DragEvent.DRAG = "drag";
drag.DragEvent.STOP = "drag_stop";
drag.DragEvent.OVER = "drag_over";
drag.DragEvent.OUT = "drag_out";
drag.DragEvent.DROP = "drag_drop";