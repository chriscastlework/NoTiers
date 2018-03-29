sp.namespace("sp.utils.XMLUtils");



sp.utils.XMLUtils =
{
    isEmptyString: function(obj)
    {
        if (typeof(obj) !== 'string') return false;
        return $.trim(obj) == '';
    },

    xmlToObject: function(xml, func)
    {
        //if func is specified, all values are delegated to func before insertion - eg. if translation is required..
        if (!xml) return {};
        var obj = "";
        if (xml.attributes != null && xml.attributes.length > 0)
        {
            obj = {};
            for (var n = 0; n < xml.attributes.length; n++)
            {
                var decodedNodeValue = this.unescape(xml.attributes[n].nodeValue || "");
                if (func) decodedNodeValue = func(decodedNodeValue);
                decodedNodeValue = this.escapeToHTML(decodedNodeValue);
                if ($.trim(decodedNodeValue.toLowerCase()) == 'undefined') decodedNodeValue = '';
                obj[xml.attributes[n].nodeName] = decodedNodeValue;
            }
        }
        if (xml.hasChildNodes())
        {
            if (this.isEmptyString(obj)) obj = {};
            for (var i = 0; i < xml.childNodes.length; i++)
            {
                var node = xml.childNodes[i];
                if (node.nodeName == "#text")
                {
                    //text larger than 4k gets split in several child text nodes in some browsers (FF).
                    //So to get the full text and not just the first 4k, the node needs to be normalized.
                    if (node.textContent && node.textContent.length>4000 && xml.normalize) { xml.normalize(node) };
                    var txt = node.text || node.textContent || "";
                    if (this.hasContent(txt))
                    {
                        var decodedText = this.unescape(txt);
                        if (func) decodedText = func(decodedText);
                        decodedText = this.escapeToHTML(decodedText);
                        if ($.trim(decodedText.toLowerCase()) == 'undefined') decodedText = '';
                        return decodedText;
                    }
                    else
                    {
                        // then it's either whitespace, or it was empty - empty nodes will be 'undefined'. this gets around some browsers' treatment of white space
                    }
                }
                else
                {
                    var child;
                    if (obj[node.nodeName])
                    {
                        if (!obj[node.nodeName].splice) obj[node.nodeName] = [obj[node.nodeName]];
                        child = this.xmlToObject(node, func);
                        obj[node.nodeName].push(child);
                    }
                    else
                    {
                        child = this.xmlToObject(node, func);
                        obj[node.nodeName] = child;
                    }
                }
            }
        }
        if (!this.isEmptyString(obj))  obj.innerXML = this.xmlToStr(xml);
        return obj;
    },

    getNodesByAttributeValue:function(xml,attr,val)
    {
        return $(xml).find("["+attr+"='"+val+"']");
    },

    getNodeByAttributeValue:function(xml,attr,val)
    {
        var result = this.getNodesByAttributeValue(xml, attr, val);
        if(result.length) return result[0];
    },

    getContentOfNodeByAttribute:function(xml,attr,val)
    {
        var node = this.getNodeByAttributeValue(xml, attr, val);
        return (node)? $(node).text() : "";
    },

    firstChild:function(xml)
    {
        for (var i = 0; i < xml.childNodes.length; i++) {
            if (xml.childNodes[i].nodeName != "#text") {
                return xml.childNodes[i];
            }
        }
    },

    childNodes:function(xml)
    {
        var nodes = [];
        if(!xml) return nodes;
        if(xml.childNodes) for(var i=0; i<xml.childNodes.length; i++) if(xml.childNodes[i].nodeName!="#text") nodes.push(xml.childNodes[i]);
        return nodes;
    },

    removeWhiteSpace: function(xml)
    {
        if (!xml) return;
        try
        {
            var loopIndex;
            for (loopIndex = 0; loopIndex < xml.childNodes.length; loopIndex++)
            {
                var currentNode = xml.childNodes[loopIndex];
                if (currentNode.nodeType == 1)
                {
                    this.removeWhiteSpace(currentNode);
                }
                if (!(/\S/.test(currentNode.nodeValue)) && (currentNode.nodeType == 3))
                {
                    xml.removeChild(xml.childNodes[loopIndex--]);
                }
            }
        }
        catch (e)
        {
            Log.write("Error removing white space:" + e);
        }
    },

    escape: function(val)
    {
        if (typeof(val) == 'undefined' || val == null) return '';
        if (typeof(val) == 'object') val = val.__nodeValue || '';
        val = val.toString();

        try{
            return encodeURIComponent(val).replace(/'/g, '%27');
        }
        catch(e)
        {
            return escape(val);
        }
    },

    unescape: function(val)
    {
        if (typeof(val) == 'undefined' || val == null) return '';
        if (typeof(val) == 'object') val = val.__nodeValue || '';
        val = val.toString();
        try{
            return decodeURIComponent(val);
        }
        catch(e)
        {
            return unescape(val);
        }
    },

    hasContent: function(str)
    {
        return /[^\s]/.test(str);
    },

    escapeToHTML: function (val) {
        if (typeof(val) == 'undefined' || val == null) return '';
        if (typeof(val) == 'object') val = val.__nodeValue || '';
        val = val.toString();
        return val
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    unescapeFromHTML: function (val)
    {
        if (typeof(val) == 'undefined' || val == null) return '';
        if (typeof(val) == 'object') val = val.__nodeValue || '';
        val = val.toString();
        return val
            .replace(/&amp;/g , '&')
            .replace(/&gt;/g  , '>')
            .replace(/&lt;/g  , '<')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#39;/g, "'");
    },

    createNode: function(node, val, attr)
    {
        if (typeof(val) == 'object')
        {
            val = val || {};
            val = val.__nodeValue || '';
        }
        if (node === 'innerXML') return '';
        val = sp.core.data.DataUtils.valueOrEmpty(val);
        val = this.unescapeFromHTML(val);
        val = this.escape(val);
        var attributes = '';
        attr = attr || {};
        for(var prop in attr) attributes += ' ' + this.createAttribute(prop, attr[prop]);
        return "<" + node + attributes + ">" + val + "</" + node + ">";
    },

    createAttribute: function(attribute, val)
    {
        if (typeof(val) == 'object') val = val.__nodeValue || '';
        if (!attribute || attribute === 'innerXML') return '';
        val = sp.core.data.DataUtils.valueOrEmpty(val);
        val = this.unescapeFromHTML(val);
        val = this.escape(val);
        return attribute + "=\"" + val + "\"";
    },

    encode: function(string)
    {
        string = String(string || "");
        string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);
            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // public method for url decoding
    decode: function(utftext)
    {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length)
        {

            c = utftext.charCodeAt(i);
            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    },

    xmlToStr: function(xmlNode)
    {
        if (xmlNode == undefined)
        {
            sp.out("xmlNode is undefined and will always throw and error");
            return "";
        }
        //sp.out("xmlToStr:" + xmlNode);
        try
        {
            return (new XMLSerializer()).serializeToString(xmlNode);
        }
        catch (e)
        {
            try
            {
                return xmlNode.xml;
            }
            catch (e)
            {
                sp.out("Unable to retrieve xml as string");
            }
        }
        return "";
    },

    createEmptyXMLDoc:function()
    {
        // this can be done with $.parseXML so only necessary if you want to avoid jquery
        var xmlDoc;
        if (window.DOMParser)
        {
            parser=new DOMParser();
            xmlDoc=parser.parseFromString("","text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML();
        }
        return xmlDoc;
    },

    strToXML:function(str)
    {
        var xmlDoc;
        if (window.DOMParser)
        {
            try
            {
                parser=new DOMParser();
                xmlDoc=parser.parseFromString(str,"text/xml");
            }
            catch(e)
            {
                sp.out("Error:" + e);
            }
        }
        else // Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(str);
        }
        return xmlDoc.firstChild;
    },

    createEmptyXMLNode:function(node)
    {
        node = node || "empty"
        return sp.utils.XMLUtils.createEmptyXMLDoc().createElement(node);
    },

    mergeXML:function(na, nb)
    {
        if(na.nodeType == 3 || !nb) return na;
        nb = nb.cloneNode();
        if(na.attributes) for(var i=0; i<na.attributes.length; i++) nb.setAttribute(na.attributes[i].name, na.attributes[i].value);
        if(!na.childNodes) return nb;
        for(var i=0; i<na.childNodes.length;i++)
        {
            var a = na.childNodes[i];
            var b = (a.nodeName=="#text")? nb.firstChild : nb.getElementsByTagName(a.nodeName)[0];
            var c = sp.utils.XMLUtils.mergeXML(a, b);
            if(c) if(!b || !nb.replaceChild(c, b)) nb.appendChild(c);
        }
        return nb;
    },

    mergeXMLReplacingMultipleNodes:function(na, nb)
    {
        // todo this is a quick and dirty take on the function above to handle where nodes of the same tag name are present..
        // ultimately the merger should be a class which takes options to determine behaviour like this...
        na = na.cloneNode(true);
        if(na.nodeType == 3 || !nb) return na;
        nb = nb.cloneNode(true);
        if(na.attributes) for(var i=0; i<na.attributes.length; i++) nb.setAttribute(na.attributes[i].name, na.attributes[i].value);
        if(!na.childNodes) return nb;

        if(na.childNodes.length)
        {
            while (nb.firstChild) nb.removeChild(nb.firstChild);
            var contents = $(na).contents().toArray();
            for(var i= 0, item=contents[i]; i < contents.length; i++, item = contents[i])
            {
                if (item !== undefined) nb.appendChild(item);
            }
        }
        return nb;
    },

    mergeAttributes:function(na,nb)
    {
        if(!na || !nb) return;
        nb = nb.cloneNode();
        if(na.attributes) for(var i=0; i<na.attributes.length; i++) nb.setAttribute(na.attributes[i].name, na.attributes[i].value);
        return nb;
    },

    replaceNodes:function(na,nb)
    {
        if(!na || !nb) return;
        na = na.cloneNode();
        nb = nb.cloneNode();
        if(!na.childNodes) return nb;
        while (nb.firstChild)  nb.removeChild(nb.firstChild);
        for(var i=0; i<na.childNodes.length;i++) nb.appendChild(na.childNodes[i]);
        return nb;
    },

    toNumberOfHtmlEscapes: function(str, targetNumberOfHtmlEscapes)
    {
        if (!str || typeof(str) != 'string') return str;
        var currentNumberOfHtmlEscapes = sp.utils.XMLUtils.getNumberOfHTMLEscapes(str);
        if (currentNumberOfHtmlEscapes == targetNumberOfHtmlEscapes) return str;
        if (currentNumberOfHtmlEscapes > targetNumberOfHtmlEscapes)
        {
            while(currentNumberOfHtmlEscapes > targetNumberOfHtmlEscapes)
            {
                str = sp.utils.XMLUtils.unescapeFromHTML(str);
                currentNumberOfHtmlEscapes--;
            }
        }
        else
        {
            while(currentNumberOfHtmlEscapes < targetNumberOfHtmlEscapes)
            {
                str = sp.utils.XMLUtils.escapeToHTML(str);
                currentNumberOfHtmlEscapes++;
            }
        }
        return str;
    },

    getNumberOfHTMLEscapes: function(str)
    {
        var num = 0;
        var unescaped;
        while ((unescaped = sp.utils.XMLUtils.unescapeFromHTML(str)) != str && num < 10) //just in case, we probably won't have 10 times escaped strings
        {
            str = unescaped;
            num++;
        }
        return num;
    }

}
