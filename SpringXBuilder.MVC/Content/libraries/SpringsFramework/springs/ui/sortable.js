sp.namespace("sp.ui.sortable.SortableElement",
             "sp.ui.sortable.SortableElementDataProvider",
             "sp.ui.sortable.SortableContainer",
             "sp.ui.sortable.SortableContainerDataProvider");



sp.ui.sortable.SortableElement = sp.core.graphics.Graphic.extend
(
    {
        __constructor:function(model)
        {
            this.__super();
            this.model = model || new sp.ui.sortable.SortableElementDataProvider();
            $(this.getGraphic()).data("parent",this);
            this.addClass("sp_ui_sortable_element");
        },

        getID:function()
        {
            return this.model.getID();
        },

        toString:function()
        {
            return "[SortableElement]";
        }
    }
);

sp.ui.sortable.SortableContainer = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(model,options)
    {
        this.__super();
        this.model = model || new sp.ui.sortable.SortableContainerDataProvider();
        this.options = options || new sp.ui.sortable.SortableContainerOptions();
        this.__init();
    },

    __init:function()
    {
        this.addClass("sp_ui_sortable_container");
        this.addClass(this.options.className);
        var __this = this;
        $(this.getGraphic()).sortable({ forceHelperSize:true,
                                        revert:20,
                                        scroll:false,
                                        scrollSensitivity:400,
                                        tolerance:"fit",
                                        remove:function(event,ui){__this.onRemove(event, ui)},
                                        start:function(event,ui){ui.item.data("__accepted",false)},
                                        over:function(event,ui){__this.onOver(event, ui);},
                                        out:function(event,ui){__this.onOut(event, ui);},
                                        receive:function(event,ui){__this.onReceived(event, ui)},
                                        beforeStop:function(event,ui){__this.onBeforeStop(event, ui)},
                                        delay:this.options.delay
                                      });

        if(this.options.groupID)
        {
            this.addClass(this.options.groupID);
            $(this.getGraphic()).sortable({connectWith:"."+this.options.groupID});
        }

        $(this.getGraphic()).droppable({greedy:true, tolerance:"touch"}).bind("drop",function(event,ui){return __this.onDropped(event, ui);});
        this.elements = [];
        this.model.addEventListener(this,sp.core.data.DataEvent.ADD, this.onAddElement);
        this.model.addEventListener(this,sp.core.data.DataEvent.REMOVE, this.onRemoveElement);
        var loadedElements = this.model.getElements();
        for(var i=0; i<loadedElements.length; i++)
        {
            var element = this.createElement(loadedElements[i]);
            if(element)
            {
                $(this.getGraphic()).append(element.getGraphic());
                this.elements.push(element);
            }
        }
        this.layout();
    },

    onRemove:function(event,ui)
    {
        //sp.out("[SortableContainer] onRemove");
        var element;
        try
        {
            element = ui.item.data("parent");
        }
        catch(e)
        {

        }
        if(element) this.model.moveElementOut(ui.item.data("parent").model);
    },

    onOver:function(event,ui)
    {
        //sp.out("[SortableContainer, ONOVER model:" + this.model.getName() + " ui:" + ui)
        ui.item.data("__accepted",true)
    },

    onOut:function(event,ui)
    {
        //sp.out("[SortableContainer, ONOUT model:" + this.model.getName() + " ui:" + ui)
        ui.item.data("__accepted",false)
    },

    onReceived:function(event,ui)
    {
        //sp.out("[Sortable Container RECEIVED, model:" + this.model.getName() + " onReceived:" + ui);
        var element;
        try
        {
            element = ui.item.data("parent");
        }
        catch(e)
        {

        }
        if(element) this.model.moveElementIn(element.model);
    },

    onBeforeStop:function(event,ui)
    {
        //sp.out("[SortableContainer ONBEFORESTOP model:" + this.model +" ] onBeforeStop item:" + ui.item + " accepted:" + ui.item.data("__accepted"));
        var element;
        try
        {
            element = ui.item.data("parent");
        }
        catch(e)
        {

        }
        if(element && this.options.removeOnDragOut && !ui.item.data("__accepted")) this.model.removeElement(ui.item.data("parent").getID());
    },

    onDropped:function(event,ui)
    {
        //sp.out("[SortableContainer " + this.model.getName() + " ONDROPPED ui:" + ui);
        try
        {
            var accepted = ui.item.data("__accepted",true);
            //sp.out("accepted :" + accepted);
            if(accepted) return;
        }
        catch(e)
        {

        }
        return !this.model.checkDrop(event, ui);
    },

    createElement:function(data)
    {
        return this.options.createElement(data);
    },

    onAddElement:function(event)
    {
        var element = this.createElement(event.data);
        if(element)
        {
          $(this.getGraphic()).append(element.getGraphic());
          this.dispatchEvent(new sp.ui.sortable.SortableContainerEvent(this,sp.ui.sortable.SortableContainerEvent.ADD,element));
          //$(element.getGraphic()).data("type",event.data.type);
          this.elements.push(element);
          this.layout();
        }
    },

    onRemoveElement:function(event)
    {
        var element = this.getElementByID(event.data.getID());
        if(element)
        {
            sp.utils.ArrayUtils.removeElement(this.elements, element);
            element.remove();
            this.layout();
        }
    },

    layout:function()
    {
        if(this.options.layout) this.options.layout(this.getElementGraphics());
    },

    getElementGraphics:function()
    {
        var result = [];
        for(var i=0; i<this.elements.length; i++)
        {
            result.push(this.elements[i].getGraphic());
        }
        return result;
    },

    getElementByID:function(id)
    {
        for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID && this.elements[i].getID()==id) return this.elements[i];
    },

    getID:function()
    {
        return this.model.getID();
    },

    toString:function()
    {
        return "[SortableContainer " + this.model.getName() + "]";
    }

}
);

sp.ui.sortable.SortableContainerOptions = sp.core.data.ValueObject.extend
(
    {
        setDefaults:function()
        {
            this.groupID = "";
            this.className = ""; // any class to be applied to the sortable container
            this.removeOnDragOut = false;
            this.delay = 50;
            this.createElement = function(data)
            {
                // called when the model adds an item...
                return new sp.ui.sortable.SortableElement(data);
            };
        }
    }
)

sp.ui.sortable.SortableContainerEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target,type,element)
    {
        this.__super(target,type);
        this.element = element;
    }
}
);
sp.ui.sortable.SortableContainerEvent.ADD = "sortable_container_add";
sp.ui.sortable.SortableContainerEvent.REMOVE = "sortable_container_remove";
sp.ui.sortable.SortableContainerEvent.MOVE = "sortable_container_add";
sp.ui.sortable.SortableContainerEvent.KILL = "sortable_container_kill";


sp.ui.sortable.SortableElementDataProvider = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(data)
        {
            this.__super();
            this.data = data || {};
            this.data.id = this.data.ID || sp.guid();
            this.__id = sp.guid(4);
        },

        getID:function()
        {
            return this.data.id;
        },

        kill:function()
        {
            this.dispatchEvent(new sp.ui.sortable.SortableContainerEvent(this,sp.ui.sortable.SortableContainerEvent.KILL, this));
        }
    }
);

sp.ui.sortable.SortableContainerDataProvider = sp.ui.sortable.SortableElementDataProvider.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
            this.elements = [];
        },

        addElement:function(element)
        {
            //sp.out("[SortableContainerDataProvider] addElement, elements:" + this.elements);
            this.elements.push(element);
            element.addEventListener(this,sp.ui.sortable.SortableContainerEvent.KILL, this.onKillElement);
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.ADD,element));
        },

        onKillElement:function(event)
        {
            this.removeElement(event.element.getID());
        },

        removeElement:function(id)
        {
            var element = this.getElementByID(id);
            if(element)
            {
                this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.REMOVE,element));
                sp.utils.ArrayUtils.removeElement(this.elements, element);

            }
        },

        removeAll:function()
        {
            this.elements = [];
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
        },

        moveElementOut:function(element)
        {
            // called when a section is moved to another stage...need to remove from list, but not raise the REMOVE event...
            //sp.out(this + " move element out");
            sp.utils.ArrayUtils.removeElement(this.elements, element);
        },

        moveElementIn:function(element)
        {
            //sp.out(this +" move element in");
            this.elements.push(element);
        },

        getElementByID:function(id)
        {
            for(var i=0; i<this.elements.length; i++)
            {
                //sp.out("elements["+i+"]:" + this.elements[i]);
                if(this.elements[i].getID && this.elements[i].getID()==id) return this.elements[i];
            }
        },

        checkDrop:function(event,ui)
        {
            // called when an item is dropped on the container - decide whether to add an element or alter the data in any way
            // return a value to determine whether or not the even will bubble up - true for bubble, false for not.
            return false;
        },

        getElements:function()
        {
            return this.elements;
        }

    }

);