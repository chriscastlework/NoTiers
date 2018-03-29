sp.namespace("sp.core.xml.XML");


sp.core.xml.Node = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(xml)
        {
            this.__xml = //xml
        },

        attribute:function()//string
        {

        },

        attributes:function()
        {

        },

        children:function(nodeName)//NodeList
        {
            //node path optional
            //do not need node list
        },

        firstChild:function(nodeName) // Node
        {

        },

        children:function() // NodeList
        {

        },

        hasComplexContent:function()// Boolean
        {

        },

        appendChild:function(node) // node
        {

        },

        insertChildAfter:function(child, newChild) // Boolean
        {
        },

        insertChildBefore:function(child, newChild) // Boolean
        {

        },

        indexOf:function(node)// int
        {

        },

        length:function() // int
        {

        },

        name:function()//String
        {

        },

        nodeType:function()//String
        {

        },

        parent:function()//node
        {

        },

        prependChild:function(node) // node
        {
           return node;
        },

        replaceChild:function(oldNode,newNode)
        {

            // if oldNode doesn't exist returns false... otherwise true
            return false;
        },

        innerText:function()//String
        {

        },

        serialize:function()
        {
            return {};
        },

        getChildren:function()//NodeList
        {

        },

        copy:function() //Node
        {

        },

        toString:function()//String
        {

        }
    }
);

sp.core.xml.NodeList = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function()
        {
            this.__super();
            this.__elements = [];
        },

        length:function() //int
        {
            return this.__elements.length;
        },

        add:function(node) //Node
        {

        },

        addAt:function(index,node) //Node
        {

        },

        remove:function(node) //Boolean
        {

        },

        removeAt:function(index) //Boolean
        {

        },

        elementAt:function(index) //Node
        {

        },

        getElementsByAttribute:function(attr,val) //NodeList
        {

        },

        getElementsByValue:function(node,val) // NodeList
        {
            // eg. nodeList.getChildByValue("Name","John")
            // would return the first child encountered with <Name>John</Name>
        },

        getElementsByNodeName:function() // NodeList
        {

        }

    }
);