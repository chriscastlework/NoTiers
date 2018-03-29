sp.namespace("sp.ui.drag.Draggable",
             "sp.ui.drag.Droppable",
             "sp.ui.drag.DragManager",
             "sp.ui.drag.Draggable.Options",
             "sp.ui.drag.Draggable.Options.HelperTypes",
             "sp.ui.drag.Droppable.Options",
             "sp.ui.drag.DragEvent");


sp.ui.drag.DragManager = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function()
        {
            this.__super();
            this.droppables = [];
            this.draggables = [];
        },

        onStartDrag:function(event)
        {
            var droppable = this.getDroppableContainingDraggable(event.target);
            if(droppable) event.target.droppable = droppable;
        },

        onStopDrag:function(event)
        {
            var dropTarget = event.target.dropTarget;
            var droppable = event.target.droppable;
            if(dropTarget)
            {
                if(droppable) droppable.onDragOut(event);
                dropTarget.clearOver();
                dropTarget.accept(event);
                if(event.target.getHelperType()==sp.ui.drag.Draggable.Options.HelperTypes.CLONE) event.target.clearHelper();
                event.target.onDragComplete(true);
            }
            else
            {
                if(droppable && droppable.acceptDispose(event))
                {
                   event.target.clearHelper();
                   droppable.onDragOut(event);
                }
                else
                {
                    event.target.revert();
                }
                event.target.onDragComplete(false);
            }
            this.clearDropTargetScrollIntervals();
        },

        onDrag:function(event)
        {
            if(event.target.dropTarget) event.target.dropTarget.clearOver();
            event.target.dropTarget = null;
            var parentCount = 0;
            for(var i=0; i<this.droppables.length; i++)
            {
                this.droppables[i].clearPlaceHolder();

                if(this.droppables[i].checkDrop(event))
                {
                    var count = this.droppables[i].getDepth();
                    if(count>=parentCount)
                    {
                        event.target.dropTarget = this.droppables[i];
                        parentCount = count;
                    }
                }
            }
            this.clearDropTargetScrollIntervals();
            if(event.target.dropTarget)
            {
                event.target.dropTarget.showOver(event);
                event.target.dropTarget.showPlaceHolder(event);
                this.scrollDropTargetIfNeeded(event);
            }
        },

        // since the draggable helper is attached to the document body, it doesn't scroll the droppable containers,
        // so we have to scroll them manually
        scrollDropTargetIfNeeded:function(event)
        {
            var dropTarget = event.target.dropTarget.target, $dropTarget = $(dropTarget), dropTargetOffset = $dropTarget.offset();
            if (dropTarget.scrollHeight > dropTarget.clientHeight)
            {
                if (event.y > dropTargetOffset.top + $dropTarget.height()*0.8)
                {
                    dropTarget.scrollTop += 20;
                    this.dropTargetVerticalScrollInterval = setInterval(function(){dropTarget.scrollTop += 40}, 200);
                } else if (event.y < dropTargetOffset.top + $dropTarget.height()*0.2)
                {
                    dropTarget.scrollTop -= 20;
                    this.dropTargetVerticalScrollInterval = setInterval(function(){dropTarget.scrollTop -= 40}, 200);
                }
            }
            if (dropTarget.scrollWidth > dropTarget.clientWidth)
            {
                if (event.x > dropTargetOffset.left + $dropTarget.width()*0.8)
                {
                    dropTarget.scrollLeft += 20;
                    this.dropTargetHorizontalScrollInterval = setInterval(function(){dropTarget.scrollLeft += 40}, 200);
                } else if (event.y < dropTargetOffset.left + $dropTarget.width()*0.2)
                {
                    dropTarget.scrollLeft -= 20;
                    this.dropTargetHorizontalScrollInterval = setInterval(function(){dropTarget.scrollLeft -= 40}, 200);
                }
            }
        },

        clearDropTargetScrollIntervals:function()
        {
            if(this.dropTargetHorizontalScrollInterval) clearInterval(this.dropTargetHorizontalScrollInterval);
            if(this.dropTargetVerticalScrollInterval) clearInterval(this.dropTargetVerticalScrollInterval);
        },

        getZScore:function(element)
        {
            var parents = $(element).parents();
        },

        registerDraggable:function(draggable)
        {
            var i = 0;
            while(this.draggables[i])
            {
                if(this.draggables[i].target==draggable.target)
                {
                    this.draggables.splice(i, 1);
                }
                else
                {
                    i++;
                }
            }
            if($.inArray(draggable,this.draggables)==-1)
            {
                draggable.addEventListener(this,sp.ui.drag.DragEvent.START,this.onStartDrag);
                draggable.addEventListener(this,sp.ui.drag.DragEvent.STOP,this.onStopDrag);
                draggable.addEventListener(this,sp.ui.drag.DragEvent.DRAG,this.onDrag);
                this.draggables.push(draggable);
            }
        },

        deregisterDraggable:function(draggable)
        {
            this.draggables.splice( $.inArray(draggable, this.draggables), 1 );
        },

        registerDroppable:function(droppable)
        {
            if($.inArray(this.droppables,droppable)==-1) this.droppables.push(droppable);
        },

        deregisterDroppable:function(droppable)
        {
            this.droppables.splice( $.inArray(droppable, this.droppables), 1 );
        },

        isDraggable:function(target)
        {
            for(var i=0; i<this.draggables.length; i++) if(this.draggables[i].getTarget()==target) return true;
        },

        getDroppableContainingDraggable:function(draggable)
        {
            for(var i=0; i<this.droppables.length; i++)
            {
                if(this.droppables[i].containsElement(draggable.getTarget())) return this.droppables[i];
            }
        },

        toString:function()
        {
            var str = "[DragManager:"
            str += "\nDRAGGABLES:"
            var i;
            for(i=0; i<this.draggables.length; i++)
            {
                str += "\n\t" + this.draggables[i];
            }
            str += "\nDROPPABLES:";
            for(i=0; i<this.droppables.length; i++)
            {
                str += "\n\t" + this.droppables[i];
            }
            str += "]";
            return str;
        }
    }
);
sp.ui.drag.DragManager.getInstance = function()
{
    if(!sp.ui.drag.DragManager.__INSTANCE) sp.ui.drag.DragManager.__INSTANCE = new sp.ui.drag.DragManager();
    return sp.ui.drag.DragManager.__INSTANCE;
};

sp.ui.drag.Draggable = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(target,options)
        {
            this.__super();
            this.__enabled = true;
            this.id = sp.guid();
            this.target = target;
            $(this.target).on('selectstart dragstart', function(evt){ evt.preventDefault(); return false; });
            this.options = options || new sp.ui.drag.Draggable.Options();
            this.mouseOffset = {x:0,y:0};
            this.init();
            $(this.target).addClass("draggable");
            $(this.target).find("input, textarea, select").mousedown(function(event){event.stopPropagation();});
        },

        enable:function(val)
        {
            if(!this.__enabled)
            {
                var __this = this;
                $(this.target).on("mousedown",null,function(event,ui){__this.onMouseDown(event, ui)});
                this.__enabled = true;
            }
        },

        disable:function()
        {
            if(this.__enabled)
            {
                $(this.target).off("mousedown");
                this.__enabled = false;
            }
        },

        getEnabled:function()
        {
            return this.__enabled;
        },

        kill:function()
        {
            sp.ui.drag.DragManager.getInstance().deregisterDraggable(this);
            $(this.target).off();
        },

        getTarget:function()
        {
            return this.target;
        },

        init:function()
        {
            sp.ui.drag.DragManager.getInstance().registerDraggable(this);
            var __this = this;
            $(this.target).on("mousedown",null,function(event,ui){__this.onMouseDown(event, ui)});
        },

        createHelper:function()
        {
            var helper = (this.options.helper==sp.ui.drag.Draggable.Options.HelperTypes.CLONE)?  $(this.target).clone()[0]: this.target;
            $(helper).children().bind('dragstart', function(event) { event.preventDefault(); });
            return helper;
        },

        getHelperType:function()
        {
            return this.options.helper;
        },

        getHelper:function()
        {
            return this.helper;
        },

        onMouseDown:function(event,ui)
        {
            event.stopPropagation();
            var __this = this;
            this.startPos = {x:event.pageX,
                             y:event.pageY};
            $(document).on("mouseup."+this.id,function(event,ui){__this.onMouseUp(event, ui)});
            $(document).on("mousemove."+this.id,function(event,ui){__this.onMouseMove(event, ui)});
        },

        onMouseMove:function(event,ui)
        {
            var distance = Math.abs(event.pageX-this.startPos.x+event.pageY-this.startPos.y);
            if(distance>this.options.tolerance)
            {
                $(document).off("mousemove."+this.id);
                $(document).off("mouseup."+this.id);
                this.startDrag(event, ui);
            }
        },

        onMouseUp:function(event,ui)
        {
            var __this = this;
            $(document).off("mouseup."+this.id);
            $(document).off("mousemove."+this.id);
        },

        startDrag:function(event,ui)
        {
            this.dispatchEvent(new sp.ui.drag.DragEvent(this,sp.ui.drag.DragEvent.START,event.x,event.y));
            //record original settings..
            this.originalParent = $(this.target).parent();
            this.startPosition = {"left":$(this.target).offset().left,"top":$(this.target).offset().top};
            var __this = this;
            this.helper = this.createHelper();
            $(this.helper).addClass("sp_draggable_dragging");
            $(this.helper).css(this.startPosition);
            $(this.helper).css('position', 'absolute');
            $("body").append($(this.helper));
            //$(this.target).offset(this.startPosition);
            $(document).on("mouseup."+this.id, function(event,ui){__this.onDragUp(event, ui)});
            $(document).on("mousemove."+this.id, function(event,ui){__this.onMouseDrag(event, ui)});
        },

        onDragUp:function(event,ui)
        {
            $(document).off("mouseup."+this.id);
            $(document).off("mousemove."+this.id);
            $(this.helper).removeClass("sp_draggable_dragging");
            this.dispatchEvent(new sp.ui.drag.DragEvent(this,sp.ui.drag.DragEvent.STOP,$(this.helper).offset().left, $(this.helper).offset().top));
        },

        onMouseDrag:function(event,ui)
        {
            $(this.helper).offset({"left":event.pageX,
                                   "top":event.pageY});
            this.dispatchEvent(new sp.ui.drag.DragEvent(this,sp.ui.drag.DragEvent.DRAG,$(this.helper).offset().left, $(this.helper).offset().top));
        },

        revert:function()
        {
            if(this.getHelperType()==sp.ui.drag.Draggable.Options.HelperTypes.SELF)
            {
                var start = {"left":$(this.helper).offset().left,"top":$(this.helper).offset().top};
                $(this.originalParent).append(this.helper);
                $(this.helper).css("left","auto");
                $(this.helper).css("top","auto");
                /* Can't get the animated code below to work.... come back to it later*/
                /*$(this.target).css("position","absolute");
                 var end = {"left":$(this.target).offset().left,"top":$(this.target).offset().top};
                 $(this.target).offset({"left":start.left, "top":start.top});
                 $(this.target).animate({left:end.left, top:end.top},300,this.onRevertComplete);
                 //$(this.target).offset({"left":end.left, "top":end.top});
                 */
            }
            else
            {
                this.clearHelper();
            }
        },

        clearHelper:function()
        {
            $(this.helper).remove();

        },

        onDragComplete:function(accepted)
        {
            //if(!accepted || this.options.helper == sp.ui.drag.Draggable.Options.HelperTypes.CLONE)
            //{
                //$(this.helper).remove();
            //}
            $(this.helper).removeAttr("style");
        },

        onRevertComplete:function()
        {
            $(this.helper).removeAttr("style");
        },

        toString:function()
        {
            return "[Draggable id:" + this.id + " target:" + $(this.target).html() + "]";
        }
    }
);

sp.ui.drag.Draggable.Options = sp.core.data.ValueObject.extend
(
    {
        __constructor: function(valueMap)
        {
            this.__super(valueMap);
        },

        setDefaults:function()
        {
            this.helper = sp.ui.drag.Draggable.Options.HelperTypes.SELF;
            this.opacity = 1;
            this.tolerance = 10;
        }
    }
);
sp.ui.drag.Draggable.Options.HelperTypes =
{
    SELF:"self",
    CLONE:"clone"
}

sp.ui.drag.Droppable = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(target,options)
        {
            this.__super();
            this.target = target;
            this.options = options || new sp.ui.drag.Droppable.Options();
            this.init();
        },

        init:function()
        {
            sp.ui.drag.DragManager.getInstance().registerDroppable(this);
        },

        kill:function()
        {
            sp.ui.drag.DragManager.getInstance().deregisterDroppable(this);
        },

        zIndex:function()
        {
            return $(this.target).css("z-index") || 0;
        },

        getBounds:function()
        {
            var bounds = $(this.target).offset();
            bounds.bottom = bounds.top+$(this.target).height();
            bounds.right = bounds.left+$(this.target).width();
            return bounds;
        },

        isInside:function(x,y)
        {
            var bounds = this.getBounds();
            return (x>bounds.left && x<bounds.right && y>bounds.top && y<bounds.bottom)? true : false;
        },

        showPlaceHolder:function(event)
        {
            var x = event.x;
            var y = event.y;
            if(this.placeHolder) $(this.placeHolder).remove();
            this.placeHolder = this.options.createPlaceHolder(event.target, event);//sp.core.graphics.Graphic.createElement("div",{},["sp_draggable_placeholder"]);//
            $(this.placeHolder).css("float","left");
            $(this.placeHolder).css("position","relative");
            $(this.placeHolder).css("top","0px");
            $(this.placeHolder).css("left","0px");
            this.insertAtCoords(this.placeHolder,x, y);
        },

        clearPlaceHolder:function()
        {
            if(this.placeHolder!=null)
            {
                $(this.placeHolder).remove();
                this.placeHolder = null;
            }
        },

        checkDrop:function(event)
        {
            var x = event.x;
            var y = event.y;
            if(this.isInside(x, y))
            {
                return this.options.acceptDrop(event.target, event);
            }
        },

        insertAtCoords:function(element,x,y)
        {
            var inserted;
            var children = this.target.childNodes;
            for(var i=0; i<children.length; i++)
            {
                if(children[i]!=this.placeHolder)
                {
                    var cx = $(children[i]).offset().left;
                    var cy = $(children[i]).offset().top;
                    if(x<cx || y<cy)
                    {
                        $(element).insertBefore(children[i]);
                        inserted = true;
                        break;
                    }
                }
            }
            if(!inserted) $(this.target).append($(element));
        },

        accept:function(event)
        {
            this.clearPlaceHolder();
            var helper;
            if(event.target.getHelperType()==sp.ui.drag.Draggable.Options.HelperTypes.CLONE)
            {
                helper = this.options.createAcceptedContent(event.target, event);
            }
             else
             {
                helper = event.target.getHelper();
             }
             if(helper)
             {
                this.insertAtCoords(helper, event.x, event.y);
                this.dispatchEvent(new sp.ui.drag.DropEvent(this, sp.ui.drag.DropEvent.DRAGIN, event.target, helper, event))
             }
        },

        acceptDispose:function(event)
        {
            return this.options.dropHandler.acceptDispose(event.target, event);
        },

        onDropOut:function()
        {
            this.dispatchEvent(new sp.ui.drag.DropEvent(this, sp.ui.drag.DropEvent.DROPOUT, event.target, helper, event))
        },

        onDragOut:function(event)
        {
            this.dispatchEvent(new sp.ui.drag.DropEvent(this, sp.ui.drag.DropEvent.DRAGOUT, event.target, null, event, event.target.dropTarget))
        },

        showOver:function()
        {
            $(this.target).addClass("sp_draggable_over");
        },

        clearOver:function()
        {
            $(this.target).removeClass("sp_draggable_over");
        },

        getDepth:function()
        {
            return $(this.target).parents().length;
        },

        getTarget:function()
        {
            return this.target;
        },

        containsElement:function(element)
        {
            var children = this.target.childNodes;
            for(var i=0; i<children.length; i++)
            {
                if(children[i]==element) return true;
            }
        },

        deleteOnDragOut:function()
        {
            return this.options.deleteOnDragOut;
        },

        toString:function()
        {
            return "[Droppable (" + $(this.target).html() + ")]";
        }
    }
);

/* Using the code below, it is possible to determine the droppable's treatment of dropped objects
    in various ways:
    1. Pass an options object to the Droppable defining functions for acceptDrop, createPlaceHolder and createAcceptedContent
    2. Pass an options object with a dropHandler object specified, which extends DroppHandler and overrides methods as necessary
    3. Pass a reference to the instantiating class itself, and override the methods.

    The advantage of option 2. is that overridden methods can call the __super method if they want to, and avoid having to create the relevant
    objects from scratch.
 */
sp.ui.drag.Droppable.Options = sp.core.data.ValueObject.extend
(
    {
        setDefaults:function()
        {
            this.dropHandler = new sp.ui.drag.Droppable.DropHandler();
            this.deleteOnDragOut = false;
        },

        acceptDrop:function(draggable, originalEvent)
        {
            return this.dropHandler.acceptDrop(draggable, originalEvent);
        },

        createPlaceHolder:function(draggable, originalEvent)
        {
            return this.dropHandler.createPlaceHolder(draggable, originalEvent);
        },

        createAcceptedContent:function(draggable, originalEvent)
        {
            return this.dropHandler.createAcceptedContent(draggable, originalEvent);
        }
    }
);
sp.ui.drag.Droppable.DropHandler = sp.core.graphics.Graphic.extend
(
    {
        __constructor:function(droppable)
        {
            this.droppable = droppable;
            this.__super();
        },

        acceptDrop:function(draggable, originalEvent)
        {
            return true;
        },

        acceptDispose:function(draggable,orginalEvent)
        {
            return false;
        },

        createPlaceHolder:function(draggable, originalEvent)
        {
            var placeholder = $(draggable.getHelper()).clone()[0];
            $(placeholder).addClass("sp_draggable_placeholder");
            return placeholder;
        },

        createAcceptedContent:function(draggable,event)
        {
            var helper = $(draggable.getHelper()).clone()[0];
            if(!sp.ui.drag.DragManager.getInstance().isDraggable(helper))
            {
                var options = new sp.ui.drag.Draggable.Options({helper:sp.ui.drag.Draggable.Options.HelperTypes.SELF});
                var dr = new sp.ui.drag.Draggable(helper,options);
            }
            $(helper).css("float","left");
            $(helper).css("position","relative");
            $(helper).css("top","0px");
            $(helper).css("left","0px");
            return helper;
        }
    }
);

sp.ui.drag.DragEvent = sp.core.events.Event.extend
(
    {
        __constructor:function(target,type,x,y,dropTarget)
        {
            this.__super(target,type);
            this.x = x;
            this.y = y;
            this.dropTarget = null;
        },

        toString:function()
        {
            return "[DragEvent, type:" + this.type +" ]";
        }
    }
);
sp.ui.drag.DragEvent.START = "drag_start";
sp.ui.drag.DragEvent.STOP = "drag_stop";
sp.ui.drag.DragEvent.DRAG = "drag_drag";

sp.ui.drag.DropEvent = sp.core.events.Event.extend
(
    {
        __constructor:function(target,type,draggable,ui,event,destination)
        {
            this.__super(target,type);
            this.draggable = draggable;
            this.originalEvent = event;
            this.ui = ui;
            this.destination = destination;
        },

        toString:function()
        {
            return "[DropEvent, type:" + this.type +" ]";
        }
    }
);
sp.ui.drag.DropEvent.DRAGIN = "drag_in";
sp.ui.drag.DropEvent.DRAGOUT = "drag_out";
sp.ui.drag.DropEvent.DRAGOVER = "drag_over";
