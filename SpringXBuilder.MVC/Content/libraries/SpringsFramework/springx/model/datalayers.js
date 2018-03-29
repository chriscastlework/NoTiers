sp.namespace("spx.model.datalayer.XML");


/* Data layers are designed to decouple the structure of the actual retrieved data record from the framework model. In the example below, we are using a Field/Record/RecordSet structure,  */


spx.model.datalayer.FRRSLayer =
{
    convert:function(xml)
    {
        if(!xml || !xml.nodeName) return {};
        var type = xml.nodeName;
        switch(type)
        {
            case spx.model.datastructure.FieldTypes.FIELD:
                return (xml.firstChild)? xml.firstChild.nodeValue : "";
            case spx.model.datastructure.FieldTypes.RECORD:
                var record = {};
                record.id = xml.getAttribute("id");
                for(var i=0; i<xml.childNodes.length; i++)
                {
                    var node = xml.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        record[node.getAttribute("id")] = this.convert(node);
                    }
                }
                return record;
            case spx.model.datastructure.FieldTypes.RECORDSET:
                var recordset = [];
                for(var i=0; i<xml.childNodes.length; i++)
                {
                    var node = xml.childNodes[i];
                    if(node.nodeName!="#text")
                    {
                        recordset.push(this.convert(node));
                    }
                }
                return recordset;
        }
    }
};