sp.namespace("spx.model.layout.OrgChart");

// defines the data structure
spx.model.layout.OrgChart = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHART;
        },

        getConnectionOptions:function()
        {
            var connectionOptions = this.data.getAttribute("connection-options");
            if(connectionOptions)
            {
                var resource = spx.model.resources.Resources.getResourceByID(connectionOptions);
                if(resource) return resource;
            }
            return new spx.model.layout.OrgChartConnectionOptions();
        },

        getSearchOptions:function()
        {
            var lookup = this.getElement("lookup");
            return new spx.model.layout.SearchOptions(  this.getLookUpPath(),
                lookup.getDialogFields(),
                lookup.getDialogFieldNames());
        },

        getLookUpPath:function()
        {
            var lookup = this.getElement("lookup");
            return lookup.getLookUpPath() || "";
        },

        getAssociatedFieldId:function()
        {
            return this.getAttribute("associatedFieldId") || "";
        },

        getRelatedField:function()
        {
            return this.getAttribute("relatedField");
        }
    }
);

spx.model.layout.OrgChartBox = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTBOX;
        }
    }
);

spx.model.layout.OrgChartDialog = spx.model.layout.CompoundElement.extend
(
    {
        __constructor:function(data)
        {
            this.__super(data);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTDIALOG;
        }
    }
);

spx.model.layout.OrgChartConnectionOptions =  Class.extend
({
    __constructor:function(xml)
    {
        //this.data = sp.utils.XMLUtils.xmlToObject(xml);
        //sp.out("new OrgChartConnectionOptions:" + JSON.stringify(this.data));

        var connections = $(xml).find('connections>connection').toArray();
        this.connections = [];

        for(var i=0; i<connections.length; i++)
        {
            this.connections.push(new spx.model.layout.OrgChartLineOption(connections[i]));
        }

    },

    toString:function()
    {
        return "[OrgChartConnectionOptions]"
    },

    getConnections:function()
    {
        return this.connections;
    },

    getConnectionById:function(id)
    {
        for(var i=0; i<this.connections.length; i++)
        {
            if(this.connections[i].getId()==id) return this.connections[i];
        }
    }

});

spx.model.layout.OrgChartLineOption = Class.extend
({
    __constructor:function(data)
    {
        this.data =  sp.utils.XMLUtils.xmlToObject(data);
        this.data.id = this.data.id || sp.guid();
        this.setDefaults();

    },

    getId:function()
    {
        return this.data.id;
    },

    setDefaults:function()
    {
        this.id = "line"+sp.guid(4);
        this.name = "line";
        this.description = "Indicates a generic line..";
        this.fill = "rgba(202,202,202,0.5)",
            this.stroke = "rgba(155,155,155,0.8)",
            this.thickness = 1;
        this.type = spx.model.RelationalChartLineTypes.DEFAULT;
        this.lineDrawFunction = sp.core.graphics.CanvasTools.drawMultipleTriangles;
    },

    getRemovalStrategy:function()
    {
        return this.data.removalStrategy || spx.model.RelationalChartRemovalStrategyOptions.STOP;
    },

    getLineDrawFunction:function()
    {
         switch(this.getType())
        {
            case spx.model.RelationalChartLineTypes.ORGANISATION:
               return sp.core.graphics.CanvasTools.drawReportingLine;
            case spx.model.RelationalChartLineTypes.INFLUENCE:
                return sp.core.graphics.CanvasTools.drawMultipleTriangles;
            default:
                return sp.core.graphics.CanvasTools.drawArrow;
        }
    },

    getType:function()
    {
        return this.data.type || spx.model.RelationalChartLineTypes.DEFAULT;
    },

    getDraggerColor:function()
    {
        return this.data.draggerColor || this.data.color;
    },

    getLineColor:function()
    {
        return this.data.color  || 0xCCCCCC;
    },

    getFillColor:function()
    {
        return 0xFF0000;
    },

    getLineThickness:function()
    {
        return parseInt(this.data.thickness)  || 1;
    },

    getClass:function()
    {
        return this.data.class || "";
    }
});

// Not all implemented
spx.model.RelationalChartLineTypes =
{
    "DEFAULT":"",
    "ORGANISATION":"organisation",
    "INFLUENCE":"influence",
    "ARROW":"arrow",
    "DOUBLEARROW":"doublearrow"
}
spx.model.RelationalChartRemovalStrategyOptions =
{
    START:"start",
    STOP:"stop"
}

