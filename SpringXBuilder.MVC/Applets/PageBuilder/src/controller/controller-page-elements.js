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
              case Element.MAP:
                  return new pb.controller.MapController(view,model);
              case Element.TEXTLABEL:
                  return new pb.controller.TextLabelController(view,model);
              case Element.CHECKBOX:
                  return new pb.controller.CheckboxController(view,model);
              case Element.GRID:
                  return new pb.controller.GridController(view,model);
              case Element.GRIDCOLUMN:
                  return new pb.controller.GridColumnController(view,model);
              default:
                  // none of the other elements really have specific functionality so no point subclassing them
                  // just can create a generic base class instance.. if any element needs to be subclassed to add
                  // specific functionality this switch statement should be updated...

                  return new pb.controller.ElementController(view,model);
          }
      }
});
di
    .register("ElementControllerFactory")       // Register with DI framework
    .as(pb.controller.ElementFactory)
    .asSingleton();

pb.controller.ElementController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(view,model)
    {
        this.__super();
        this.view = view;
        this.model = model;
        this.view.addEventListener(this,sp.core.events.SelectionEvent.SELECT,this.onSelect);
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
        this.model.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onRemove);
        this.init();
        this.initDraggable();
    },
    toString:function()
    {
       return "[ElementController " + this.model.getID() + "]";
    },
    init:function()
    {
        // override with any set up items
    },
    initDraggable:function()
    {
        this.draggable = this.getDraggable();
        this.draggable.controller = this; // add a payload reference to itself, which we can check for when something is dropped...
        this.draggable.addEventListener(this,drag.DragEvent.START,this.onDragStart);
        this.draggable.addEventListener(this,drag.DragEvent.DROP,this.onDraggableDropped);
    },
    getDraggable:function()
    {
        return new drag.Draggable(this.view.getGraphic());
    },
    focus:function()
    {
        this.view.triggerSelect();
    },
    onSelect:function(event)
    {
        var detailsController = di.resolve("DetailsViewController");
        detailsController.presentDetails(this.model);
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
    },
    clone:function()
    {
        var model = this.model.clone();
        var view = di.resolve("ElementViewFactory").createViewForModel(model);
        return di.resolve("ElementControllerFactory").createController(view,model);
    },
    onModelChanged:function(event)
    {

    },
    onRemove:function(event)
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE));
    }
});

pb.controller.ContainerElementController = pb.controller.ElementController.extend
({
        __constructor:function(view,model)
        {
            this.__super(view,model);
            var __this = this;
            this.droppable = new drag.DroppableContainer(this.getDroppableAreaElement(),{
                                                            willAcceptDrop:function(event){return __this.willAcceptDrop(event)},
                                                            getPlaceholder:function(event){return __this.getPlaceholder(event)}
                                                        });
            this.droppable.addEventListener(this,drag.DragEvent.DROP,this.onDrop);
            this.elements = [];
            var els = model.getElements(); // TODO this seems a bit over complicated...
            if(els.length)
            {
                this.createElements(els);
            }
            this.model.addEventListener(this,pb.model.ModelEvent.REMOVEALL,this.onRemoveAll);
            this.model.addEventListener(this,pb.model.ModelEvent.REBUILD,this.onRebuild);
        },
        getDroppableAreaElement:function()
        {
            return this.view.getDroppableAreaElement() || this.view.getGraphic();
        },
        createElements:function(els)
        {
            var viewFactory = di.resolve("ElementViewFactory");
            var controllerFactory = di.resolve("ElementControllerFactory");
            for(var i=0; i<els.length; i++)
            {
                // NB: The line below was the original code, but I have replaced it with the line below it. The original line
                // is creating a new model object using the factory, but I believe that the elements returned by the model are
                // already created, and do not need to be created again. Leaving the line in just in case this causes problems
                // in the future and needs to be revisited... 25.5.2016
                //var model = modelFactory.createElementWithModel(els[i]);
                var model = els[i];
                var view = viewFactory.createViewForModel(model);
                var controller = controllerFactory.createController(view,model);
                controller.addEventListener(this,drag.DragEvent.DROP,this.onElementDraggedOut);
                controller.addEventListener(this,drag.DragEvent.START,this.onElementStartDrag);
                controller.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onElementRemove);
                this.view.addChildView(view);
                this.elements.push(controller);
            }
        },
        onRebuild:function()
        {
            this.createElements(this.model.getElements());
        },
        onRemoveAll:function(event)
        {
            this.view.removeAllElements();
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
          this.view.addChildViewAtIndex(controller.view,index);
          this.elements.push(controller);
        },
        onElementRemove:function(event)
        {
            this.removeElement(event.target);
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
           this.view.removeElement(controller.view);
           controller.removeEventListener(this,drag.DragEvent.DROP,this.onElementDraggedOut);
           controller.removeEventListener(this,drag.DragEvent.START,this.onElementStartDrag);
           controller.removeEventListener(this,drag.DragEvent.REMOVE,this.onElementRemove);
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
                event.draggable.controller.focus();
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
                controller.focus(); // highlights the new element and presents its details
            }
        },
        cloneElement:function(event)
        {
            var controller = event.currentTarget.clone();
            var currentTargetView = event.currentTarget.getView().getGraphic();
            $(currentTargetView).before(controller.getView().getGraphic());
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
    willAcceptDrop:function(event)
    {
        return (this.model.getParent().getType()==pb.model.Element.GRIDCOLUMN)? this.model.isEmpty() : true;
    }
});

pb.controller.GridController = pb.controller.ElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);

        var dialogModel = this.model.getDialog();
        var dialogView = this.view.getDialog();
        this.dialogController = new pb.controller.DialogController(dialogView,dialogModel);

        var lookUpModel = this.model.getLookUp();
        var lookUpView = this.view.getLookUp();
        this.lookUpController = new pb.controller.CollectionLookUpController(lookUpView,lookUpModel);
       // this.view.appendDialog(dialogView);

        this.model.getGridColumnOptions().addEventListener(this,pb.model.CollectionEvent.ADD,this.onAddColumn);
        this.model.getGridColumnOptions().addEventListener(this,pb.model.CollectionEvent.REMOVE,this.onRemoveColumn);
        this.loadColumns();
    },
    loadColumns:function()
    {
        this.columns = [];
        var columns = this.model.getGridColumnOptions().getItems();
        for(var i=0; i<columns.length; i++)
        {
            var view = new pb.view.GridColumn(columns[i]);
            var controller = new pb.controller.GridColumnController(view,columns[i]);
            this.columns.push(controller);
            this.view.addColumn(view);
        }
    },
    onModelChanged:function(event)
    {
        if(event.property=="options")
        {

        }
    },
    onAddColumn:function(event)
    {
        var view = new pb.view.GridColumn(event.item);
        var controller = new pb.controller.GridColumnController(view,event.item);
        this.columns.push(controller);
        this.view.addColumn(view);
    },
    getColumn:function(object)
    {
        for(var i=0; i<this.columns.length; i++)
        {
            if(this.columns[i].getModel()==object) return this.columns[i];
        }
    },
    onRemoveColumn:function(event)
    {
        var column = this.getColumn(event.item);
        this.view.removeColumn(column);
    }
});

pb.controller.GridColumnController = pb.controller.ContainerElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
        this.draggable.kill(); // we don't want the grid column to be draggable in this version..
    },
    willAcceptDrop:function(event)
    {
        // depending on whether the element being dropped is an existing element being repositioned or an icon...
        var type = (event.draggable.controller)? event.draggable.controller.model.getType() : event.draggable.type;
        return (([22,13,24,14].indexOf(type)==-1) && this.model.isEmpty());// no maps, grids, charts or lists...
    }
})

pb.controller.MapController = pb.controller.ElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
    },
    init:function()
    {
        var lookupModel = this.model.getLookUp();
        this.lookupView = new pb.view.CollectionLookUp(lookupModel);
        this.lookupController = new pb.controller.CollectionLookUpController(this.lookupView,lookupModel);
        this.view.appendLookUp(this.lookupView);

        var cardModel = this.model.getCardDetails();
        var cardView = new pb.view.MapCard(cardModel,"CARD");
        this.cardController = new pb.controller.MapCardController(cardView,cardModel);
        this.view.appendCardDetails(cardView);
        //this.cardController.addEventListener(this,drag.DragEvent.DROP,this.onCardDropElement);

        var dialogModel = this.model.getDialog();
        var dialogView = new pb.view.MapCard(dialogModel,"DIALOG");
        this.dialogController = new pb.controller.MapCardController(dialogView,dialogModel);
        this.view.appendDialogDetails(dialogView);


        this.view.onModelChanged();

    },
    getDraggable:function()
    {
        return new drag.Draggable(this.view.getGraphic(),{handle:this.lookupView.getGraphic()});
    },
    onCardDropElement:function(event)
    {
        //this.dialogController.onDrop(event);
    }

});

pb.controller.CollectionLookUpController = pb.controller.ElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
        this.draggable.kill(); // we don't want the lookup to be draggable..
        this.view.onBlur(); // undoes it being automatically selected by superclass
    },
    toString:function()
    {
        return "[MapLookUpController " + this.model.getID() + "]";
    },
    init:function()
    {
        this.view.addEventListener(this,sp.core.events.SelectionEvent.SELECT,this.onSelect);
    }
})

pb.controller.MapCardController = pb.controller.ContainerElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
        this.draggable.kill(); // we don't want the map card to be draggable in this version..
        this.view.onBlur(); // undoes it being automatically selected by superclass
    },
    willAcceptDrop:function(event)
    {
        // depending on whether the element being dropped is an existing element being repositioned or an icon...
        var type = (event.draggable.controller)? event.draggable.controller.model.getType() : event.draggable.type;
        return (type!=22);
    }
})

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

pb.controller.LookUpController = pb.controller.ElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
    }
});

pb.controller.DialogController = pb.controller.ContainerElementController.extend
({
    __constructor:function(view,model)
    {
        this.__super(view,model);
        this.model.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onModelChanged);
    },
    onModelChanged:function(event)
    {
        if(event.property=="elements")
        {
            this.view.removeAllElements();
            var els = this.model.getElements();
            if(els.length)
            {
                this.createElements(els);
            }
        }
    }
});


