sp.namespace('pv.model');

pv.model.ResourceCleaner = sp.core.events.EventDispatcher.extend
(
{
    className: '',
    dependentClassName: '',
    fieldsToClean: '',

    __constructor:function(xml)
    {
        this.__super();
        if (xml)
        {
            pv.model[this.className].getInstance = $.proxy(function(){ return this }, this);
            this.setData(xml);
        }
        var __this = this;

        //setInterval(__this.maintainSession(), 1000);

    },
    //maintainSession: function() {
    //    var __this = this;
    //    var param = window.appletParameters.getParam;
    //    var url = '/MaintainSession.aspx';
    //    var u = url + $.param({
    //        RecordId: param('recordid'),
    //        CustomObjectKey: param('customobjectkey'),
    //        CRMKey: param('crmkey')
    //    });
    //    $.ajax(url + $.param({
    //        RecordId: param('recordid'),
    //        CustomObjectKey: param('customobjectkey'),
    //        CRMKey: param('crmkey')
    //    }),
    //          {
    //              success: function (data, status, jqHXR) {
    //                  if (!data) data = {};
    //                  __this.onPageLoad(data, status, null);
    //              },
    //              error: function (jqHXR, status, error) {
    //                  __this.onPageLoad(null, status, error);
    //              }
    //          }
    //    );
    //},
    setData: function(xml)
    {
        var DataUtils = sp.core.data.DataUtils;
        var XMLUtils = sp.utils.XMLUtils;
        this.data = xml;
        this.list = DataUtils.toArray(DataUtils.valueAtPath(XMLUtils.xmlToObject(xml), 'list.object'));
        this.isClean = false;
        setTimeout($.proxy(this.cleanData, this), 0);
    },

    cleanData: function()
    {
        if (!this.dependentClassName)
        {
            this.dispatchClean();
            return;
        }

        if (this.dependentClassName && !this.dependent)
        {
            this.dependent = pv.model[this.dependentClassName].getInstance();
        }

        if (this.dependent.isClean && !this.isClean)
        {
            //actual cleaning: transforms .genes.gene = [id1, id2, id3] into .genes = [clean data]
            var DataUtils = sp.core.data.DataUtils;

            for (var i = 0; i < this.list.length; i++)
            {
                var cleanData = [];
                var idsToClean = DataUtils.toArray(DataUtils.valueAtPath(this.list[i], this.fieldsToClean));
                for (var j = 0; j < idsToClean.length; j++)
                {
                    var cleanItem = this.dependent.getElementByID(idsToClean[j]);
                    if (cleanItem) cleanData.push(cleanItem); //invalid ids are omitted
                }
                var cleanDataProperty = this.fieldsToClean.split('.')[0];
                this.list[i][cleanDataProperty] = cleanData;
            }
            this.dispatchClean();
        }
        else
        {
            this.dependent.addEventListener(this, sp.core.data.DataEvent.SET, this.cleanData);
        }
    },

    dispatchClean: function()
    {
        this.isClean = true;
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.SET));
    },

    getElementByID: function(id)
    {
        return sp.utils.ArrayUtils.findElementByProperty(this.list, 'id', id)
    }
}
);