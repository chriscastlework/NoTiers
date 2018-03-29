sp.namespace("pb.model.ModelEvent",
             "pb.model.LoadEvent");


pb.model.ModelEvent = sp.core.events.Event.extend
({
    __constructor:function(target,type,property,from,to,caller)
    {
        this.__super(target,type);
        this.property = property;
        this.from = from;
        this.to = to;
        this.caller = caller;
        this.prevented = false;
    },
    preventDefault:function()
    {
        this.prevented = true;
    },
    isPrevented:function()
    {
        return this.prevented;
    },
    toString:function()
    {
        return "[Event type:" + this.type +" property:" + this.property +" from:" + this.from + " to:" + this.to + "]";
    }
});
pb.model.ModelEvent.CHANGEPROPERTY = "pb_model_property_change";
pb.model.ModelEvent.CHANGE = "pb_model_change";
pb.model.ModelEvent.REMOVE = "pb_model_remove";
pb.model.ModelEvent.ADD = "pb_model_add";
pb.model.ModelEvent.INPUT = "pb_model_input";
pb.model.ModelEvent.WILLCHANGE = "pb_model_willchange";
pb.model.ModelEvent.REMOVEALL = "pb_model_removeall";
pb.model.ModelEvent.REBUILD = "pb_model_rebuild";
//pb.model.ModelEvent.INSERT = "pb_model_event_insert";

pb.model.LoadEvent = sp.core.events.Event.extend
(
    {
        __constructor:function(target,type,data,success,error)
        {
            this.__super(target,type);
            this.currentTarget = this.target;
            this.success = success;
            this.error = error;
            this.data = data;
        },
        toString:function()
        {
            return "[LoadEvent, success:" + this.success  +" status:" + this.status + " error:" + this.error + " data:" + this.data;
        }
    }
);
pb.model.LoadEvent.START = "load_start";
pb.model.LoadEvent.SUCCESS = "load_success";
pb.model.LoadEvent.ERROR = "load_error";
pb.model.LoadEvent.COMPLETE = "load_complete";

pb.model.SaveEvent = sp.core.events.Event.extend
(
    {
        __constructor:function(target,type,success,error)
        {
            this.__super(target,type);
            this.currentTarget = this.target;
            this.success = success;
            this.error = error;
        },
        toString:function()
        {
            return "[SaveEvent, success:" + this.success  +" status:" + this.status + " error:" + this.error;
        }
    }
);
pb.model.SaveEvent.START = "save_start";
pb.model.SaveEvent.SUCCESS = "save_success";
pb.model.SaveEvent.ERROR = "save_error";
pb.model.SaveEvent.COMPLETE = "save_complete";

pb.model.CollectionEvent = sp.core.events.Event.extend
({
    __constructor:function(target,type,item)
    {
        this.__super(target,type);
        this.currentTarget = this.target;
        this.item = item;
    },
    toString:function()
    {
        return "[CollectionEvent]";
    }
});
pb.model.CollectionEvent.ADD = "collection_add";
pb.model.CollectionEvent.REMOVE = "collection_remove";

