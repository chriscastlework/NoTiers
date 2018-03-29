sp.namespace("sp.core.events.EventDispatcher",
             "sp.core.events.Event",
             "sp.core.events.MouseEvent",
             "sp.core.events.SelectionEvent",
             "sp.core.events.UIEvent",
             "sp.core.events.ButtonEvent");


sp.core.events.EventDispatcher = Class.extend
(
{
	
	__constructor:function()
	{
		this.__eventListeners = [];
	},
	
	addEventListener:function(listener,type,callback)
	{
        if(type==undefined) sp.out("UNDEFINED EVENT ADDED");
        if(this.hasEventListener(listener,type,callback)) return;
		this.__eventListeners.push({listener:listener,
									type:type,
									callback:callback});
	},
	
	removeEventListener:function(listener,type,callback)
	{
		for(var i=0; i<this.__eventListeners.length; i++)
		{
			if(this.__eventListeners[i].listener == listener && this.__eventListeners[i].type == type && this.__eventListeners[i].callback == callback)
			{
				this.__eventListeners.splice(i,1);
				return true;
			}
		}
		return false;
	},

    removeAllEventListenersOfType:function(listener,type)
    {
        for(var i=0; i<this.__eventListeners.length; i++)
        {
            if(this.__eventListeners[i].listener == listener && this.__eventListeners[i].type == type)
            {
                this.__eventListeners.splice(i,1);
            }
        }
    },

	hasEventListener:function(listener,type,callback)
	{
		for(var i=0; i<this.__eventListeners.length; i++) if(this.__eventListeners[i].listener == listener && this.__eventListeners[i].type == type && this.__eventListeners[i].callback == callback) return true;
		return false;
	},
	
	dispatchEvent:function(event)
	{
        for(var i=0; i<this.__eventListeners.length; i++) if(this.__eventListeners[i].type == event.type) this.__eventListeners[i].callback.apply(this.__eventListeners[i].listener,[event]);
    },

    listListeners:function()
    {
        for(var i=0; i<this.__eventListeners.length; i++) sp.out("\t" + i + " type:" + this.__eventListeners[i].type + " callback:" + this.__eventListeners[i].callback);
    },

    forwardEvent:function(event)
    {
        event.currentTarget = this;
        this.dispatchEvent(event);
    }
	
}
);

sp.core.events.Event = Class.extend
(
{
    __constructor: function(target, type)
    {
        this.target = target;
        this.type = type;
    }
}
);
sp.core.events.Event.SORT = "sort";
sp.core.events.Event.SHOW = "show";
sp.core.events.Event.HIDE = "hide";
sp.core.events.Event.CHANGE = "change";

sp.core.events.MouseEvent = sp.core.events.Event.extend
(
{
	__constructor:function(target,type,originalEvent)
	{
	    this.__super(target, type);
		this.originalEvent = originalEvent; // NB: when extending any sort of built-in event, it is helpful to include the original event. Set this property directly to avoid breaking the flow of arguments into the standard event constructor.
	}
}
);
sp.core.events.MouseEvent.MOUSEDOWN = "mousedown";
sp.core.events.MouseEvent.MOUSEUP = "mouseup";
sp.core.events.MouseEvent.CLICK = "click";
sp.core.events.MouseEvent.MOUSEOVER = "rollover";
sp.core.events.MouseEvent.MOUSEOUT = "rollout";
sp.core.events.MouseEvent.DOUBLECLICK = "doubleclick";

sp.core.events.ButtonEvent = sp.core.events.MouseEvent.extend
(
{
    __constructor: function(target, type, id)
    {
        this.__super(target, type);
        this.id = id;
    }
}
);
sp.core.events.DragEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target,type,originalEvent,from,to)
    {
        this.__super(target,type);
        this.originalEvent = originalEvent;
        this.from = from || {x:null, y:null};
        this.to = to || {x:null,y:null};
    }
}
);
sp.core.events.DragEvent.DRAG = "drag_drag";
sp.core.events.DragEvent.START = "drag_start";
sp.core.events.DragEvent.STOP = "drag_stop";

sp.core.events.SelectionEvent = sp.core.events.Event.extend
(
    {
        __constructor: function(target, type, selection, originalEvent)
        {
            this.__super(target, type);
            this.selection = selection;
            this.originalEvent = originalEvent;
            this.selection = selection;
        }
    }
);
sp.core.events.SelectionEvent.SELECT = "select";
sp.core.events.SelectionEvent.OPEN = "open";
sp.core.events.SelectionEvent.CLOSE = "close";


sp.core.events.UIEvent = sp.core.events.Event.extend
(
    {
        __constructor: function(target, type, data, originalEvent)
        {
            this.__super(target, type);
            this.originalEvent = originalEvent;
            this.data = data;
        }
    }
);

sp.core.events.UIEvent.FOCUS = "ui_focus";
sp.core.events.UIEvent.CLICK = "ui_click";
sp.core.events.UIEvent.DOUBLECLICK = "ui_double_click";
sp.core.events.UIEvent.ADD = "ui_add";
sp.core.events.UIEvent.REMOVE = "ui_remove";
sp.core.events.UIEvent.MOVE = "ui_move";
sp.core.events.UIEvent.OPEN = "ui_open";
sp.core.events.UIEvent.CLOSE = "ui_close";
sp.core.events.UIEvent.CHANGE = "ui_change";
sp.core.events.UIEvent.SCROLL = "ui_scroll";
