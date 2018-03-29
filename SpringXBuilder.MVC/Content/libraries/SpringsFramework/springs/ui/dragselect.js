sp.namespace("sp.ui.dragselect.DragSelect");


sp.ui.dragselect.DragSelect = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(drawTarget,clickTarget)
    {
        this.__super(drawTarget);
        this.clickTarget = clickTarget;
        $(this.clickTarget).disableSelection();
        this.enabled = false;
        this.enable();
    },

    enable: function()
    {
        if (!this.enabled)
        {
            var __this = this;
            if (sp.isOnTablet())
            {
                $(this.clickTarget).bind('touchstart', function(event){
                    //don't start dragging immediately if a user wants to scroll the page (start on long press)
                    if (__this.touchTimeout) clearTimeout(__this.touchTimeout);
                    __this.touchTimeout = setTimeout( function(){
                        $(__this.clickTarget).unbind('touchmove');
                        __this.onMouseDown(event);
                    }, 500 );
                    $(__this.clickTarget).bind('touchmove', function() {
                        if (__this.touchTimeout) clearTimeout(__this.touchTimeout);
                        $(__this.clickTarget).unbind('touchmove');
                    });
                });
            }
            else
            {
                $(this.clickTarget).mousedown(function(event){__this.onMouseDown(event);});
            }

            this.enabled = true;
        }

    },

    disable: function()
    {
        if (this.enabled)
        {
            $(this.clickTarget).unbind('mousedown');
            $(this.clickTarget).unbind('touchstart');
            this.enabled = false;
        }
    },

    draw:function()
    {
        var tPos = $(this.clickTarget).offset();
        var rect = this.getSelectedArea();
        $(this.outline).offset({left:rect.left(), top:rect.top()});
        $(this.outline).width(rect.width());
        $(this.outline).height(rect.height());
    },

    onMouseDown:function(event)
    {
        if (event.pageX === undefined) event.pageX = event.originalEvent.touches[0].pageX;
        if (event.pageY === undefined) event.pageY = event.originalEvent.touches[0].pageY;
        this.start(event.pageX,event.pageY);
        this.mousePos = {x:event.pageX,y:event.pageY};
        this.draw();
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.START,event));
    },

    start:function(x,y)
    {
        if(this.outline!=null) this.kill();
        this.startPos = {x:x, y:y};
        this.outline = this.addElement(this.createElement("canvas",{position:"absolute",width:"0px",height:"0px"},["sp_ui_dragselect"]));
        var __this = this;
        if (sp.isOnTablet())
        {
            document.addEventListener("touchmove", this.preventDefaultHandler, false);
            $(document).bind('touchmove', function(event){__this.onMouseMove(event);});
            $(document).bind('touchend',function(event){__this.onMouseUp(event);});
        }
        else
        {
            $(document).mousemove(function(event){__this.onMouseMove(event);});
            $(document).mouseup(function(event){__this.onMouseUp(event);});
        }
    },

    preventDefaultHandler: function(event)
    {
        event.preventDefault();
    },

    onMouseMove:function(event)
    {
        if (event.pageX === undefined && event.pageY === undefined)
        {
            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        }
        this.mousePos = {x:event.pageX,y:event.pageY};
        this.draw();
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.DRAG,event));
    },

    getSelectedArea:function()
    {
        var rect = new sp.core.geom.Rectangle(Math.min(this.startPos.x,this.mousePos.x),
                                              Math.min(this.startPos.y,this.mousePos.y));
        rect.right(Math.max(this.startPos.x,this.mousePos.x));
        rect.bottom(Math.max(this.startPos.y,this.mousePos.y));
        return rect;
    },

    onMouseUp:function(event)
    {
        this.kill();
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.STOP,event));
    },

    kill:function()
    {
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
        $(document).unbind('touchmove');
        $(document).unbind('touchend');
        document.removeEventListener("touchmove", this.preventDefaultHandler);
        $(this.outline).remove();
    },

    getSelectedElements:function(method,div)
    {
        if(!div) div = this.__graphic;
        var elements = $(div).children();

        var selected = [];
        var selectedArea = this.getSelectedArea();
        for(var i=0; i<elements.length; i++)
        {
            var div = elements[i];
            var pos = $(div).offset();
            var rect = new sp.core.geom.Rectangle(pos.left,pos.top,$(div).width(),$(div).height());
            var bool = (method == sp.ui.dragselect.DragSelectMethod.TOUCH)? selectedArea.intersects(rect) : selectedArea.contains(rect);
            if(bool) selected.push(elements[i]);
        }
        return selected;
    }
}
);

sp.ui.dragselect.DragSelectMethod = {TOUCH:"touch",
                                     CONTAIN:"contain"};



/*
sp.ui.dragselect.DragSelect = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(clickLayer,drawLayer)
    {
        this.__super(drawLayer);
        this.clickLayer = clickLayer;
        this.init();
    },

    init:function()
    {
        var __this = this;
        $(this.clickLayer).mousedown(function(e){__this.onMouseDown(e);});
    },

    clear:function()
    {
        var context = this.canvas.getContext("2d");
        if(context) context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },

    onMouseDown:function(e)
    {
        if(this.canvas!=null) this.kill();
        this.start = {x:e.pageX, y:e.pageY};
        this.canvas = this.addElement(this.createElement("canvas"));
        $(this.canvas).width($(this.clickLayer).width());
        $(this.canvas).height($(this.clickLayer).height());
        var __this = this;
        $(document).mousemove(function(e){__this.onMouseMove(e);});
        $(document).mouseup(function(e){__this.onMouseUp(e);});
    },

    onMouseMove:function(e)
    {
        this.mousePos = {x:e.pageX,y:e.pageY};
        this.draw();
    },

    getSelectedArea:function()
    {
        return {left:this.start.x,top:this.start.y,right:this.mousePos.x,bottom:this.mousePos.y};
    },

    onMouseUp:function(e)
    {
        this.kill();
        this.onSelect(this.getSelectedArea());
    },

    kill:function()
    {
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
        this.clear();
        $(this.canvas).remove();
    }

}
);



function DragSelect(clickLayer,drawLayer)
{

    this.clear = function()
    {
        var context = this.canvas.getContext("2d");
        if(context)
        {
            context.clearRect(0,0,this.canvas.width,this.canvas.height);
        }
    }

    this.draw = function()
    {
        this.clear();
        var context = this.canvas.getContext("2d");
        if(context)
        {
            var tPos = $(this.clickLayer).offset();
            context.beginPath();
            var sx = this.start.x-tPos.left;
            var sy = this.start.y-tPos.top;
            var x = this.mousePos.x;
            var y = this.mousePos.y;
            context.strokeRect(sx,sy,x-tPos.left-sx,y-tPos.top-sy);
            context.strokeStyle = "rgb(255,0,0)";
            context.stroke();
        }
    }

    this.onMouseDown = function(e)
    {
        if(this.canvas!=null) this.kill();
        this.canvas = $(this.drawLayer).append(document.createElement("canvas"));
        this.canvas.width = $(this.clickLayer).width();
        this.canvas.height = $(this.clickLayer).height();
        this.canvas.__lasso_listener = this;
        document.__lasso_listener = this;
        $(document).mousemove(function(e){this.__lasso_listener.onMouseMove(e);});
        $(document).mouseup(function(e){this.__lasso_listener.onMouseUp(e);});
        this.start = {x:e.pageX, y:e.pageY};
    }

    this.onMouseMove = function(e)
    {
        this.mousePos = {x:e.pageX,y:e.pageY};
        this.draw();
    }

    this.getSelectedArea = function()
    {
        return {left:this.start.x,top:this.start.y,right:this.mousePos.x,bottom:this.mousePos.y};
    }

    this.onMouseUp = function(e)
    {
        this.kill();
        this.onSelect(this.getSelectedArea());
        $(document).unbind('mouseup');
        $(document).unbind('mousemove');
    }

    this.kill = function()
    {
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
        this.clear();
        $(this.canvas).remove();
    }

    this.clickLayer = clickLayer;
    this.drawLayer = drawLayer;
    this.init();

}
*/