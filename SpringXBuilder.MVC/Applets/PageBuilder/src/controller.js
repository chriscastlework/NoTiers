sp.namespace("pb.controller.ElementControllerFactory",
             "pb.controller.PageController",
             "pb.controller.ElementController",
             "pb.controller.SectionController",
             "pb.controller.TextLabelController");

pb.controller.ElementFactory = Class.extend
({
      __constructor:function()
      {

      },
      createController:function(view,model)
      {
          var Element = pb.model.Element;
          switch(model.type)
          {
              case Element.SECTION:
                  return new pb.controller.SectionController(view,model);
              case Element.TEXTLABEL:
                  return new pb.controller.TextLabelController(view,model);
              case Element.CHECKBOX:
                  return new pb.controller.CheckboxController(view,model);
              default:
                  return new pb.controller.ElementController(view,model);
          }
      }
});

pb.controller.ElementController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(view,model)
    {
        this.__super();
        this.view = view;
        this.model = model;
        this.init();
    },
    toString:function()
    {
       return "[ElementController " + this.model.getID() + "]";
    },
    init:function()
    {
        this.view.addEventListener(this,sp.core.events.SelectionEvent.SELECT,this.onSelect);
        this.draggable = new drag.Draggable(this.view.getGraphic());
        this.draggable.controller = this; // add a payload reference to itself, which we can check for when something is dropped...
        this.draggable.addEventListener(this,drag.DragEvent.START,this.onDragStart);
        this.draggable.addEventListener(this,drag.DragEvent.DROP,this.onDraggableDropped);
    },
    onSelect:function(event)
    {
        var detailsController = di.instance("detailsViewController");
        detailsViewController.presentDetails(this.model);
    },
    onDragStart:function(event)
    {
        //forward the event so containers can handle if needed ..
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    onDraggableDropped:function(event)
    {
        // forward the event so that any parent can handle the data change
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    getView:function()
    {
        return this.view;
    },
    getModel:function()
    {
        return this.model;
    }
});

pb.controller.ContainerElementController = pb.controller.ElementController.extend
({
        __constructor:function(view,model)
        {
            this.__super(view,model);
            var __this = this;
            this.droppable = new drag.DroppableContainer(this.view.getGraphic(),{
                                                                                    willAcceptDrop:function(event){return __this.willAcceptDrop(event)},
                                                                                    getPlaceholder:function(event){return __this.getPlaceholder(event)}
                                                                                });
            this.droppable.addEventListener(this,drag.DragEvent.DROP,this.onDrop);
            this.drawElements();
            this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged());
        },
        drawElements:function()
        {
            this.view.removeAllElements();
            this.elements = [];
            var els = model.getElements();
            if(els.length)
            {
                var modelFactory = di.resolve("ElementModelFactory");
                var viewFactory = di.resolve("ElementViewFactory");
                var controllerFactory = di.resolve("ElementControllerFactory")
                for(var i=0; i<els.length; i++)
                {
                    var model = modelFactory.createElementWithModel(els[i]);
                    var view = viewFactory.createViewForModel(model);
                    var controller = controllerFactory.createController(view,model);
                    controller.addEventListener(this,drag.DragEvent.DROP,this.onElementDraggedOut);
                    controller.addEventListener(this,drag.DragEvent.START,this.onElementStartDrag);
                    this.view.insertElementAtIndex(view.getGraphic(),i);
                    this.elements.push(controller);
                }
            }
        },
        getPlaceholder:function(event)
        {
            if(event.draggable.controller)
            {
                var el = event.draggable.controller.view.clone();
                $(el).fadeTo(0,0.5);
                return el;
            }
            else if(event.draggable.type)
            {
                var factory = di.resolve("ElementModelFactory");
                var dummyModel =  factory.createElementWithType(event.draggable.type);
                var el = this.view.createPlaceholder(event,dummyModel);
                return el;
            }
        },
        willAcceptDrop:function(event)
        {
           return true;
        },
        addElement:function(controller,index)
        {
          for(var i=0; i<this.elements.length; i++)
          {
              if(this.elements[i]==controller)
              {
                  return;
              }
          }
          controller.addEventListener(this,drag.DragEvent.DROP,this.onElementDraggedOut);
          controller.addEventListener(this,drag.DragEvent.START,this.onElementStartDrag);
          this.model.insertElementAtIndex(controller.model,index);
          this.view.insertElementAtIndex(controller.view.getGraphic(),index);
          this.elements.push(controller);
        },
        removeElement:function(controller)
        {
           for(var i=0; i<this.elements.length; i++)
           {
                if(this.elements[i]==controller)
                {
                    this.elements.splice(i,1);
                }
           }
           this.model.removeElement(controller.model);
           controller.removeEventListener(this,drag.DragEvent.DROP,this.onElementDraggedOut);
        },
        onElementDraggedOut:function(event)
        {
            if(event.accepted)
            {
                this.removeElement(event.currentTarget);
            }
            else
            {
                var result = confirm("Are you sure you want to remove this element?");
                if(result)
                {
                    this.removeElement(event.currentTarget);
                    event.currentTarget.view.remove();
                }
            }
        },
        onDrop:function(event)
        {
            if(event.draggable.controller) // then you have re-positioned an existing element..
            {
                this.addElement(event.draggable.controller,event.index);
            }
            else if(event.draggable.type) // otherwise we need to create a new element..
            {
                var modelFactory = di.resolve("ElementModelFactory");
                var viewFactory = di.resolve("ElementViewFactory");
                var controllerFactory = di.resolve("ElementControllerFactory");
                var model = modelFactory.createElementWithType(event.draggable.type);
                var view = viewFactory.createViewForModel(model);
                var controller = controllerFactory.createController(view,model);
                this.addElement(controller,event.index);
            }
        },
        cloneElement:function(event)
        {
            var modelFactory = di.resolve("ElementModelFactory");
            var controllerFactory = di.resolve("ElementControllerFactory");
            var viewFactory = di.resolve("ElementViewFactory");
            var m = event.currentTarget.getModel().getData();
            var model = modelFactory.createElementWithModel(m);
            var view = viewFactory.createViewForModel(model);
            var controller = controllerFactory.createController(view,model);
            var currentTargetView = event.currentTarget.getView().getGraphic();
            $(currentTargetView).before(view.getGraphic());
            controller.draggable.triggerDrag(event.originalEvent,event.ui);
        },
        onElementStartDrag:function(event)
        {
            var childController = event.currentTarget;
            if(event.originalEvent.ctrlKey)
            {
                event.target.cancelDrag();
                this.cloneElement(event);
            }
        }
});

pb.controller.PageController = pb.controller.ContainerElementController.extend
({
        __constructor:function(view,model)
        {
            this.__super(view,model);
            this.draggable.kill(); // we don't want the page to be draggable in this version..
        }
})

pb.controller.SectionController = pb.controller.ContainerElementController.extend
({

});

pb.controller.TextLabelController = pb.controller.ElementController.extend
({

});

pb.controller.CheckboxController = pb.controller.ElementController.extend
({

});

pb.controller.NumericInputController = pb.controller.ElementController.extend
({

});

pb.controller.NumericInputController = pb.controller.ElementController.extend
({

});

pb.controller.PicklistController = pb.controller.ElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
    }
});