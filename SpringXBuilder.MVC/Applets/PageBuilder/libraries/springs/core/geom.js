sp.namespace("sp.core.geom.Rectangle");

sp.core.geom.Rectangle = Class.extend
(
    {
        __constructor:function(left,top,width,height)
        {
            this.__left = left || 0;
            this.__top = top || 0;
            this.__width = width || 0;
            this.__height = height || 0;
        },

        top:function(val)
        {
            if(val!=undefined) this.__top = val;
            return this.__top;
        },

        left:function(val)
        {
            if(val!=undefined) this.__left = val;
            return this.__left;
        },

        width:function(val)
        {
            if(val!=undefined) this.__width = val;
            return this.__width;
        },

        height:function(val)
        {
            if(val!=undefined) this.__height = val;
            return this.__height;
        },

        bottom:function(val)
        {
            if(val!=undefined) this.__height = val-this.top();
            return this.left()+this.width();
        },

        right:function(val)
        {
            if(val!=undefined) this.__width = val-this.left();
            return this.top()+this.height();
        },

        intersects:function(rect)
        {
            rect = sp.core.geom.Rectangle.objToRectangle(rect);
            return (this.left()<rect.right() && this.top()<rect.bottom() && this.right()>rect.left() && this.bottom()>rect.top());
        },

        contains:function(rect)
        {
            rect = sp.core.geom.Rectangle.objToRectangle(rect);
            return (this.left()<=rect.left() && this.right()>=rect.right() && this.top()<=rect.top() && this.bottom()>=rect.bottom());
        },

        containsPoint:function(x,y)
        {
            return (this.left()<=x && this.right()>=x && this.top()<=y && this.bottom()>=y);
        },

        toString:function()
        {
            return "[Rect:" + this.top() +"," + this.left() + " " + this.right() + "," + this.bottom() + "]";
        }
    }
);

sp.core.geom.Rectangle.objToRectangle = function(obj)
{
    if(obj.contains!=undefined) return obj;
    return new sp.core.geom.Rectangle(obj.left, obj.top,obj.width, obj.height);
}

sp.core.geom.Point = Class.extend
(
    {
        __constructor:function(left,top)
        {
            this.left = left || 0;
            this.top = top || 0;
        },

        toLocal:function(context)
        {
            var co = $(context).offset();
            return new sp.core.geom.Point(this.left-co.left,this.top-co.top);
        },

        toString:function()
        {
            return "[Point " + this.left + "," + this.top +"]";
        }
    }
);
sp.core.geom.Point.fromTarget = function(target)
{
    var point = new sp.core.geom.Point();
    try
    {
        var pos = $(target).offset();
        point.left = pos.left;
        point.top = pos.top;
    }
    catch(e)
    {
        sp.out("sp.core.geom.Point, fromTarget, Error:" + e.message);
    }
    return point;
}