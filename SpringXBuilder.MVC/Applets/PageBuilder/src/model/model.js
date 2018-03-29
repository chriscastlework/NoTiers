sp.namespace("pb.model.Model");



pb.model.Model = sp.core.events.EventDispatcher.extend
({
    __constructor:function()
    {
        this.__super();
        this.page;
        var fields = di.resolve("CRMEntities");
        if(fields.isLoaded())
        {
            this.onSchemaLoaded();
        }
        else
        {
            fields.addEventListener(this,pb.model.LoadEvent.COMPLETE,this.onSchemaLoaded);
        }

        var __this = this;

        //setInterval(__this.maintainSession(), 1000);

    },
    //maintainSession: function () {
    //    var __this = this;
    //    var param = window.appletParameters.getParam;
    //    var url = '/MaintainSession.aspx?';
    //    var u = url + $.param({
    //        RecordId: param('recordid'),
    //        CustomObjectKey: param('customobjectkey'),
    //        CRMKey: param('crmkey')
    //    });
    //    //sp.out("url:" + u);
    //    $.ajax(url + $.param({
    //        RecordId: param('recordid'),
    //        CustomObjectKey: param('customobjectkey'),
    //        CRMKey: param('crmkey')
    //    }),
    //          {
    //              success: function (data, status, jqHXR) {
    //                  //if (!data) data = {};
    //                  //__this.onPageLoad(data, status, null);
    //              },
    //              error: function (jqHXR, status, error) {
    //                  //__this.onPageLoad(null, status, error);
    //              }
    //          }
    //    );
    //},
    getPage:function()
    {
        return this.page;
    },
    onSchemaLoaded:function(event)
    {
        if(!event.success)
        {
            event.currentTarget = this;
            this.dispatchEvent(event);
            return;
        }
        this.loadPageData();
    },
    loadPageData:function()
    {
        var __this = this;
        var param = window.appletParameters.getParam;
        var url = [param('url'), param('fileopen'), '?'].join('');
        var u = url + $.param({
                                RecordId: param('recordid'),
                                CustomObjectKey: param('customobjectkey'),
                                CRMKey: param('crmkey')
                             });
        $.ajax(url+$.param({
            RecordId: param('recordid'),
            CustomObjectKey: param('customobjectkey'),
            CRMKey: param('crmkey')
        }),
              {
                    success: function(data,status,jqHXR)
                    {
                        if(!data) data = {};
                        __this.onPageLoad(data,status,null);
                    },
                    error:   function(jqHXR,status,error)
                    {
                        __this.onPageLoad(null,status,error) ;
                    }
               }
        );
    },
    onPageLoad:function(data,status,error)
    {
        if(!data)
        {
            this.dispatchEvent(new pb.model.LoadEvent(this,pb.model.LoadEvent.COMPLETE,data,false,error));
        }
        else
        {
            //sp.out("LOADED");
            //sp.out(JSON.stringify(data,null," "));
            di.resolve("Fields").loadData(data.userFields || []);
            this.page = new pb.model.Page(data.page || {});
            this.dispatchEvent(new pb.model.LoadEvent(this,pb.model.LoadEvent.COMPLETE,data,true,error));
        }
    },
    save:function()
    {
        var param = function(p) { return window.appletParameters.getParam(p) };

        var saveJson = {
                        page:this.page.getData(),
                        userFields:di.resolve("Fields").getData()
                       };


        saveJson = JSON.stringify(saveJson,null," ");

        sp.out("Saving:" + saveJson);

        var url = param('url') + param('filesave');

        var __this = this;
        $.ajax({
            type: "POST",
            url: url,
            data: {
                RecordId: param('recordid'),
                CustomObjectKey: param('customobjectkey'),
                CRMKey: param('crmkey'),
                JSON: saveJson
            },
            success:function(data,status,jqHXR)
            {
                sp.out("success:" + status);
                __this.onSaveComplete(true,null,data);
            },
            error:function(jqHXR,status,error)
            {
                sp.out("failed:" + status + " error:" + error);
                __this.onSaveComplete(false,error,null);
            }
        });
    },
    onSaveComplete:function(success,error,data)
    {
        sp.out("onSaveComplete, success:" + success +" error:" + error);
        this.dispatchEvent(new pb.model.SaveEvent(this,pb.model.SaveEvent.COMPLETE,success,error));
    }
})

di.register("Model")
    .as(pb.model.Model)
    .asSingleton();







