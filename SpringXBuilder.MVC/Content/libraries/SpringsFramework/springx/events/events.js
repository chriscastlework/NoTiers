sp.namespace("spx.events.StateEvent");


spx.events.StateEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target,type,state)
    {
        this.__super(target,type);
        this.state = state;
    }
}
);
spx.events.StateEvent.CHANGE = "state_change";

spx.events.TestEvent = sp.core.events.Event.extend
(
    {
        __constructor:function(target,type)
        {
            this.__super(target,type);
        }
    }
);
spx.events.TestEvent.AUTOPOPULATE = "test_autopopulate";
