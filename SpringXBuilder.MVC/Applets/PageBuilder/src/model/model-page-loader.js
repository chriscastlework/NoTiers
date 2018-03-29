sp.namespace("pb.model.PageLoader");


pb.model.AppLoader = sp.core.events.EventDispatcher.extend
({
    __constructor:function()
    {

        this.__super();
        this.data = {};
        var __this = this;
        var param = window.appletParameters.getParam;
        var url = [param('url'), param('fileopen'), '?'].join('');
        $.ajax(
            url + $.param({
                RecordId: param('recordid'),
                CustomObjectKey: param('customobjectkey'),
                CRMKey: param('crmkey')
            }),
            {
                success: function(data,status,jqHXR)
                         {
                             __this.onLoad(data,status,jqHXR);
                         },
                error:   function(jqHXR,status,error)
                         {
                             __this.onError(jqHXR,status,error) ;
                         }
            }
        );
    },
    onLoad:function(data,status)
    {
        this.data = data;
        this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.LOADED));
    },
    onError:function(jqHXR,status,error)
    {
        alert("Unable to load ")
    }

});

