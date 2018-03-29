sp.namespace("sp.core.graphics.Graphic",
             "sp.core.graphics.create",
             "sp.core.graphics.GraphicOptions",
             "sp.core.graphics.Repeater",
             "sp.core.graphics.CanvasTools");


sp.core.graphics.Graphic = sp.core.events.EventDispatcher.extend
(
{

    __constructor: function(graphic)
    {
        this.__super();
        if (graphic && graphic.jquery) graphic = graphic[0];
        this.__graphic = graphic || document.createElement("div");
    },

    _jqGraphic: function ()
    {
        if (!this._$graphic) this._$graphic = $(this.__graphic);
        return this._$graphic;
    },

    draw: function()
    {
        this._jqGraphic().css("width", this.__width);
        this._jqGraphic().css("height", this.__height);
        return this;
    },

    resize: function(w, h)
    {
        this.__width = w;
        this.__height = h;
        this.draw();
        return this;
    },

    setWidth: function(w)
    {
        this.__width = w;
        this.draw();
        return this;
    },

    getWidth: function()
    {
        return this._jqGraphic().width();
    },

    setHeight: function(h)
    {
        this.__height = h;
        this.draw();
        return this;
    },

    getHeight: function()
    {
        return this._jqGraphic().height();
    },

    setX: function(x)
    {
        this._jqGraphic().css("left", x);
        return this;
    },

    getX: function()
    {
        return this._jqGraphic().position().left;
    },

    setY: function(y)
    {
        this._jqGraphic().css("top", y);
        return this;
    },

    getY: function()
    {
        return this._jqGraphic().position().top;
    },

    getRight:function()
    {
        return this.getX()+this.getWidth();
    },

    setRight:function(val)
    {
        this.setX(val-this.getWidth());
        return this;
    },

    getBottom:function()
    {
        return this.getY()+this.getHeight();
    },

    setBottom:function(val)
    {
        this.setY(val-this.getHeight()) ;
        return this;
    },

    getGraphic: function()
    {
        return this.__graphic;
    },

    create: function(pTag, pOptions)
    {
        return sp.core.graphics.create(pTag, pOptions);
    },

    createElement: function(type, style, classes, attributes, props, html)
    {
        return sp.core.graphics.Graphic.createElement(type, style, classes, attributes, props, html);
    },

    isGraphic:function(val)
    {
        return (val &&  val.getGraphic);
    },

    addElement: function()
    {
        if(arguments.length<1) return;
        for(var i=0; i<arguments.length; i++)
        {
            this._jqGraphic().append(this.isGraphic(arguments[i])? arguments[i].getGraphic() : arguments[i]);
        }
        return arguments[0];
    },

    numChildren:function()
    {
        return this.getChildren().length;
    },

    getChildren:function()
    {
        return this._jqGraphic().children();
    },

    insertElementAtIndex:function(element,index)
    {
        if(index==0)
        {
            this._jqGraphic().prepend(element);
        }
        else if(index>=this.numChildren())
        {
            this._jqGraphic().append(element);
        }
        else
        {
            $(element).insertAfter(this.getChildren().eq(index-1));
        }
    },

    getElement: function(elementID)
    {
        return this._jqGraphic().find("#" + elementID)[0];
    },

    clear:function()
    {
        this._jqGraphic().empty();
        return this;
    },

    show: function()
    {
        this._jqGraphic().show();
        return this;
    },

    hide: function()
    {
        this._jqGraphic().hide();
        return this;
    },

    remove: function()
    {
        this._jqGraphic().remove();
        return this;
    },

    addClass:function(cls)
    {
        this._jqGraphic().addClass(cls);
        return this;
    },

    removeClass:function(cls)
    {
        this._jqGraphic().removeClass(cls);
        return this;
    },

    hasClass:function(cls)
    {
        return this._jqGraphic().hasClass(cls);
    },

    click:function(func)
    {
        this._jqGraphic().click(func);
        return this;
    },

    disableSelection:function()
    {
        this._jqGraphic().disableSelection();
        return this;
    },

    getNextHighestIndex:function(obj)
    {
        var highestIndex = 0;
        var currentIndex = 0;
        var elArray;
        elArray = (obj)? obj.getElementsByTagName('*') : this.getGraphic().getElementsByTagName('*');
        for(var i=0; i < elArray.length; i++)
        {
            if (elArray[i].style) currentIndex = parseFloat($(elArray[i]).css("z-index")) || 1;
            if(!isNaN(currentIndex) && currentIndex > highestIndex) highestIndex = currentIndex;
        }
        return(highestIndex+1);
    },

    contains:function(x,y)
    {
       return (x>this.getX() && x<this.getRight() && y>this.getY() && y<this.getBottom());
    },

    attr: function (attr, val)
    {
        if (attr === 'placeholder')
        {
            this.addPlaceholderSupport(val);
        }
        else
        {
            this._jqGraphic().attr(attr, val);
        }
        return this;
    },

    addPlaceholderSupport: function(placeholderValue)
    {
        var $jqGraphic = $(this.__graphic);
        $jqGraphic.attr('_placeholder', placeholderValue);
        this.hasPlaceholder = true;

        $jqGraphic
            .focus($.proxy(this.onPlaceholderFocus, this))
            .blur($.proxy(this.onPlaceholderBlur, this)).blur();
    },

    onPlaceholderFocus: function()
    {
        var $jqGraphic = $(this.__graphic);
        if ($jqGraphic.val() == "" || $jqGraphic.val() == $jqGraphic.attr("_placeholder")) {
            $jqGraphic.val("");
            $jqGraphic.removeClass("placeholder");
        }
    },

    onPlaceholderBlur: function()
    {
        var $jqGraphic = $(this.__graphic);
        if ($jqGraphic.val() == "" || $jqGraphic.val() == $jqGraphic.attr("_placeholder")) {
            $jqGraphic.addClass("placeholder");
            $jqGraphic.val($jqGraphic.attr("_placeholder"));
        }
        else
        {
            $jqGraphic.removeClass("placeholder");
        }
    },

    setAttribute: function(attr, val)
    {
        return this.attr(attr, val);
    },

    prop: function(prop, val)
    {
        this._jqGraphic().prop(prop, val);
        return this;
    },

    setProperty: function (prop, val)
    {
        return this.prop(prop, val);
    },

    html:function(val)
    {
        this._jqGraphic().html(val);
        return this;
    },

    setHtml: function (val)
    {
        return this.html(val);
    },

    text: function (val)
    {
        this._jqGraphic().text(val);
        return this;
    },

    setText: function (val)
    {
        return this.text(val);
    },
    outerHTML:function()
    {
        return this.__graphic.outerHTML;
    }
}
);
sp.core.graphics.Graphic.createElement = function(type, style, classes, attributes, props, html)
{
    type = type || "div";
    attributes = attributes || {};
    style = style || {};
    classes = sp.core.data.DataUtils.toArray(classes);
    var element = document.createElement(type);
    for (var i = 0; i < classes.length; i++) $(element).addClass(classes[i]);
    for (var prop in style) $(element).css(prop, style[prop]);
    for (var prop in attributes) $(element).attr(prop, attributes[prop]);
    for (var prop in props) $(element).prop(prop, props[prop]);
    if (html) $(element).html(html);
    if (type==="canvas" && !element.getContext && window.G_vmlCanvasManager) window.G_vmlCanvasManager.initElement(element);
    return element;
}

sp.core.graphics.create = function (pTag, pOptions)
{
    var tag = 'div';

    if (pTag && typeof(pTag)==='string') tag = pTag;
    else if (!pOptions && pTag && typeof(pTag)==='object') pOptions = pTag;

    var options = new sp.core.graphics.GraphicOptions(pOptions);

    var element = document.createElement(tag);
    var $element = $(element);
    if (options.css && typeof(options.css)==='object') $element.css(options.css);
    if (options.attributes && typeof(options.attributes)==='object')
    {
        var attributess = options.attributes;
        for (var currentAttribute in attributess) $element.attr(currentAttribute, attributess[currentAttribute]);
    }
    if (options.properties && typeof(options.propertes)==='object')
    {
        var properties = options.properties;
        for (var currentProperty in properties) $element.attr(currentProperty, properties[currentProperty]);
    }
    var classes = sp.core.data.DataUtils.toArray(options.classes);
    for (var i = 0; i < classes.length; i++) $element.addClass(classes[i]);
    if (options.html) $element.html(options.html);
    if (options.text) $element.text(options.text);
    if (options.id) $element.attr('id', options.id);

    if (tag==="canvas" && !element.getContext && window.G_vmlCanvasManager) window.G_vmlCanvasManager.initElement(element);

    return new sp.core.graphics.Graphic(element);
}

// if data.js isn't loaded, mimic ValueObject so file parsing doesn't stop
if (!sp.core || !sp.core.data || !sp.core.data.ValueObject) {
    sp.namespace("sp.core.data.ValueObject");
    sp.core.data.ValueObject = Class.extend({});
    sp.out("!!!NOTE: Wrong order of declarations in html - graphics.js is declared before data.js");
}
sp.core.graphics.GraphicOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults: function ()
    {
        this.id = null;
        this.css = {};
        this.attributes = {};
        this.properties = {};
        this.classes = [];
        this.html = null;
        this.text = null;
    }
}
)

sp.core.graphics.Repeater = sp.core.graphics.Graphic.extend
(
    {
        __constructor:function(container,render,context)
        {
            this.__super(container);
            this.items = [];
            this.context = context || this;
            this.render = render;
        },

        setDataProvider:function(data)
        {
            this.data = data;
            this.draw();
        },

        draw:function()
        {
            this.clear();
            this.items = []
            for(var i=0; i<this.data.length; i++)
            {
                try
                {
                    this.items.push(this.addElement(this.render.apply(this.context, [this.items[i],this.data[i]])));
                }
                catch(e)
                {
                    sp.out("sp.core.graphics.Repeater EXCEPTION: " + e)
                }
            }
        },

        getItem:function(index)
        {
            return this.items[i] || {};
        },

        getItems:function()
        {
            return this.items;
        }
    }
);

sp.core.graphics.DragGroup = sp.core.events.EventDispatcher.extend
(
{
    __constructor:function(members, containmentContainer)
    {
        this.__super();
        this.containmentContainer = containmentContainer;
        this.members = members;
        this.proxies = [];
        for(var i=0; i<this.members.length; i++)
        {
            this.proxies.push(this.createProxy(this.members[i]));
            $(this.members[i]).css("position","absolute");
            $(this.members[i]).addClass("sp_ui_draggroup_dragging");
        }
    },

    getMembers:function()
    {
        return this.members;
    },

    mouseUp:function(event)
    {
        this.stop();
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.STOP, event));
    },

    mouseMove:function(event)
    {
        if (this.containmentContainer)
        {
            var leftX = $(this.containmentContainer).position().left;
            var leftY = $(this.containmentContainer).position().top;
            var rightX = leftX + $(this.containmentContainer).width();
            var rightY = leftY + $(this.containmentContainer).height();
            for(var i=0; i<this.proxies.length; i++)
            {
                var p = this.proxies[i];

                var leftCoord = event.pageX + p.offset.x;
                if (leftCoord < leftX) leftCoord = leftX;
                var boxWidth = $(p.member).width();
                if(leftCoord > (rightX-boxWidth)) leftCoord = rightX - boxWidth;

                var topCoord = event.pageY + p.offset.y;
                if (topCoord < leftY) topCoord = leftY;
                var boxHeight = $(p.member).height();
                if(topCoord > (rightY-boxHeight)) topCoord = rightY - boxHeight;

                $(p.member).css("left", leftCoord);
                $(p.member).css("top", topCoord);
            }
        }
        else
        {
            for(var i=0; i<this.proxies.length; i++)
            {
                var p = this.proxies[i];
                $(p.member).css("left",event.pageX+p.offset.x);
                $(p.member).css("top",event.pageY+p.offset.y);
            }
        }
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.DRAG, event));
    },

    start:function(x,y)
    {
        this.updateOffsets(x,y);
        var __this = this;
        $(document).mousemove(function(e){__this.mouseMove(e)});
        $(document).mouseup(function(e){__this.mouseUp(e)});
        this.dispatchEvent(new sp.core.events.DragEvent(this,sp.core.events.DragEvent.START));
    },

    updateOffsets:function(x,y)
    {
        x = x || 0;
        y = y || 0;
        for(var i=0; i<this.proxies.length; i++)
        {
            var p = this.proxies[i];
            var position = $(p.member).position();
            p.offset = {x:position.left-x,y:position.top-y};
        }
    },

    stop:function()
    {
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
        for(var i=0; i<this.members.length; i++)
        {
            $(this.members[i]).removeClass("sp_ui_draggroup_dragging");
        }
    },

    createProxy:function(member)
    {
        var p = {};
        p.id = $(member).attr("id");
        p.member = member;
        return p;
    }
}
);


sp.core.graphics.CanvasTools =
{
    drawTriangle:function(canvas,startPoint,endPoint,styleObj)
    {
        if(!styleObj) styleObj = {};
        styleObj.fillStyle = styleObj.fillStyle || "rgba(255,0,0,0.5)";
        styleObj.strokeStyle = styleObj.strokeStyle || "rgba(255,0,0,0.8)";
        styleObj.strokeWidth = styleObj.strokeWidth || 1;
        styleObj.baseThickness = styleObj.baseThickness || 20;
        var mainAngleInRadians = Math.atan2((startPoint.y-endPoint.y),(startPoint.x-endPoint.x));
        var mainAngleInDegrees = Math.round(mainAngleInRadians*180/Math.PI);
        var leftAngle = -(90-mainAngleInDegrees);
        var rightAngle = (90-mainAngleInDegrees)+mainAngleInDegrees*2;
        var la = leftAngle*(Math.PI/180);
        var ra = rightAngle*(Math.PI/180);
        var bw = styleObj.baseThickness/2;
        var x1 = startPoint.x+(Math.cos(la)*bw);
        var y1 = startPoint.y+(Math.sin(la)*bw);
        var x2 = startPoint.x+(Math.cos(ra)*bw);
        var y2 = startPoint.y+(Math.sin(ra)*bw);
        var context = canvas.getContext("2d");
        if(context)
        {
            context.strokeStyle = styleObj.strokeStyle;
            context.lineWidth = styleObj.strokeWidth;
            context.beginPath();
            context.moveTo(startPoint.x,startPoint.y);
            context.lineTo(x1,y1);
            context.lineTo(endPoint.x,endPoint.y);
            context.lineTo(x2,y2);
            context.lineTo(startPoint.x,startPoint.y);
            context.closePath();
            context.fillStyle = styleObj.fillStyle;
            context.fill();
            context.stroke();
        }
    },

    drawMultipleTriangles: function(canvas, startPoint, endPoint, styleObj, dashArray)
    {
        if(!styleObj) styleObj = {};
        styleObj.strokeStyle = styleObj.strokeStyle || "rgba(255,0,0,1)";
        styleObj.strokeWidth = styleObj.strokeWidth || 1;
        if (!dashArray) dashArray = [12,4];
        var x = startPoint.x;
        var y = startPoint.y;
        var x2 = endPoint.x;
        var y2 = endPoint.y;

        var angle = Math.PI / 4;

        var dashCount = dashArray.length;

        var context = canvas.getContext("2d");
        if(context)
        {
            context.strokeStyle = styleObj.strokeStyle;
            context.fillStyle = styleObj.fillStyle;
            context.lineWidth = styleObj.strokeWidth;
            context.moveTo(x, y);
            var dx = (x2-x);
            var dy = (y2-y);
            var slope = dy/dx;
            if (dx == 0) slope = dy;

            var slopeAngle = Math.atan(slope);

            var distRemaining = Math.sqrt( dx*dx + dy*dy );
            var dashIndex=0;
            var draw=true;
            while (distRemaining>=0.1)
            {
                var dashLength = dashArray[dashIndex++ % dashCount];
                if (dashLength > distRemaining) dashLength = distRemaining;
                var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
                if (dx<0) xStep = -xStep;
                if (draw)
                {
                    /*
                        .C    ^
                       / \    | direction
                     A.---.B  |
                     */

                    var hc = {x: x, y: y};
                    x += xStep;
                    y += slope*xStep;
                    var c = {x: x, y: y};

                    var a = {
                        x: hc.x - dashLength * Math.tan(angle / 2) * Math.sin(slopeAngle),
                        y: hc.y + dashLength * Math.tan(angle / 2) * (dx == 0? 0 : Math.cos(slopeAngle))
                    };

                    var b = {
                        x: hc.x + dashLength * Math.tan(angle / 2) * Math.sin(slopeAngle),
                        y: hc.y - dashLength * Math.tan(angle / 2) * (dx == 0? 0 : Math.cos(slopeAngle))
                    };

                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.lineTo(c.x, c.y);
                    context.closePath();
                    context.stroke();
                    context.fill();
                }
                else
                {
                    x += xStep;
                    y += slope*xStep;
                    context.moveTo(x,y);
                }
                distRemaining -= dashLength;
                draw = !draw;
            }
            context.closePath();
            context.stroke();
        }
    },

    drawDashedLine: function(canvas, startPoint, endPoint, styleObj, dashArray)
    {
        if(!styleObj) styleObj = {};
        styleObj.strokeStyle = styleObj.strokeStyle || "rgba(255,0,0,1)";
        styleObj.strokeWidth = styleObj.strokeWidth || 1;
        if (!dashArray) dashArray = [10,5];
        var x = startPoint.x;
        var y = startPoint.y;
        var x2 = endPoint.x;
        var y2 = endPoint.y;

        if (dashLength==0) dashLength = 0.001; // Hack for Safari
        var dashCount = dashArray.length;

        var context = canvas.getContext("2d");
        if(context)
        {
            context.strokeStyle = styleObj.strokeStyle;
            context.lineWidth = styleObj.strokeWidth;
            context.beginPath();
            context.moveTo(x, y);
            var dx = (x2-x);
            var dy = (y2-y);
            var slope = dy/dx;
            var distRemaining = Math.sqrt( dx*dx + dy*dy );
            var dashIndex=0;
            var draw=true;
            while (distRemaining>=0.1)
            {
                var dashLength = dashArray[dashIndex++ % dashCount];
                if (dashLength > distRemaining) dashLength = distRemaining;
                var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
                if (dx<0) xStep = -xStep;
                x += xStep
                y += slope*xStep;
                draw ? context.lineTo(x,y) : context.moveTo(x,y);
                distRemaining -= dashLength;
                draw = !draw;
            }
            context.closePath();
            context.stroke();
        }
    },

    drawArrow: function(canvas, startPoint, endPoint, styleObj)
    {
        if(!styleObj) styleObj = {};
        var strokeStyle = styleObj.strokeStyle || "rgba(255,0,0,1)";
        var strokeWidth = styleObj.strokeWidth || 1;
        var fillStyle = styleObj.fillStyle || "rgba(255,0,0,1)";
        var theta = styleObj.arrowHeadAngle || Math.PI/6;
        var d = styleObj.arrowHeadLength || 20;
        var a = styleObj.baseThickness || 24;
        var b = styleObj.endThickness || 10;

        // calculate the angle of the line
        var alpha = Math.atan2(endPoint.y-startPoint.y, endPoint.x-startPoint.x);
        // h is the line length of a side of the arrow head
        var h = Math.abs(d/Math.cos(theta));
        //c is how much of the arrowhead shows on both sides of the arrow shaft. The arrowhead base (the line opposite the arrow tip) is c+b+c
        var c = Math.abs(Math.round(h*Math.sin(theta) - b/2));

        if (startPoint.x < endPoint.x)
        {
            var y1 = startPoint.y - a/2;
            var y7 = startPoint.y + a/2;
        }
        else
        {
            var y1 = startPoint.y + a/2;
            var y7 = startPoint.y - a/2;
        }
        if (startPoint.y < endPoint.y)
        {
            var x1 = startPoint.x + a/2;
            var x7 = startPoint.x - a/2;
        }
        else
        {
            var x1 = startPoint.x - a/2;
            var x7 = startPoint.x + a/2;
        }

        var x4 = endPoint.x;
        var y4 = endPoint.y;
        var x3 = endPoint.x - h*Math.sin(Math.PI/2-alpha-theta);
        var y3 = endPoint.y - h*Math.cos(Math.PI/2-alpha-theta);
        var x5 = endPoint.x - h*Math.cos(theta-alpha);
        var y5 = endPoint.y + h*Math.sin(theta-alpha);
        var x2 = x3 - c*Math.sin(alpha);
        var y2 = y3 + c*Math.cos(alpha);
        var x6 = x5 + c*Math.sin(alpha);
        var y6 = y5 - c*Math.cos(alpha);

        var context = canvas.getContext("2d");
        context.strokeStyle = strokeStyle;
        context.lineWidth = strokeWidth;
        context.fillStyle = fillStyle;

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x4, y4);
        context.lineTo(x5, y5);
        context.lineTo(x6, y6);
        context.lineTo(x7, y7);
        context.closePath();
        context.stroke();
        context.fill();
    },

    drawArrow2: function(canvas, startPoint, endPoint, styleObj)
    {
        if(!styleObj) styleObj = {};
        styleObj.strokeWidth = styleObj.strokeWidth || 1;
        styleObj.strokeStyle = styleObj.strokeStyle || "rgba(255,0,0,1)";
        styleObj.fillStyle = styleObj.fillStyle || "rgba(255,0,0,1)";
        styleObj.baseThickness = styleObj.baseThickness || 20;
        styleObj.arrowHeadColor = styleObj.arrowHeadColor || styleObj.strokeStyle;
        var angle = styleObj.arrowAngle || Math.PI/6;
        var d = styleObj.arrowHeadLength || 20;

        var context = canvas.getContext("2d");
        context.strokeStyle = styleObj.strokeStyle;
        context.lineWidth = styleObj.strokeWidth;
        context.fillStyle = styleObj.fillStyle;

        var dist = Math.sqrt((endPoint.x-startPoint.x)*(endPoint.x-startPoint.x)+(endPoint.y-startPoint.y)*(endPoint.y-startPoint.y));
        var ratio = (dist-d/3)/dist;
        var tox, toy, fromx, fromy;
        tox = Math.round(startPoint.x+(endPoint.x-startPoint.x)*ratio);
        toy = Math.round(startPoint.y+(endPoint.y-startPoint.y)*ratio);
        fromx = startPoint.x;
        fromy = startPoint.y;

        // draw the shaft of the arrow
        sp.core.graphics.CanvasTools.drawTriangle(canvas, {x:fromx,y:fromy}, {x:tox, y:toy}, styleObj)

        // calculate the angle of the line
        var lineangle = Math.atan2(endPoint.y-startPoint.y, endPoint.x-startPoint.x);
        // h is the line length of a side of the arrow head
        var h = Math.abs(d/Math.cos(angle));

        // arrow head
        var angle1 = lineangle+Math.PI+angle;
        var topx = endPoint.x+Math.cos(angle1)*h;
        var topy = endPoint.y+Math.sin(angle1)*h;
        var angle2 = lineangle+Math.PI-angle;
        var botx = endPoint.x+Math.cos(angle2)*h;
        var boty = endPoint.y+Math.sin(angle2)*h;
        var cpx = (topx + endPoint.x + botx)/3;
        var cpy = (topy + endPoint.y + boty)/3;
        context.save();
        context.fillStyle = styleObj.arrowHeadColor;
        context.beginPath();
        context.moveTo(topx,topy);
        context.lineTo(endPoint.x,endPoint.y);
        context.lineTo(botx,boty);
        context.quadraticCurveTo(cpx,cpy,topx,topy);
        context.closePath();
        context.fill();
        context.restore();
    }
};
