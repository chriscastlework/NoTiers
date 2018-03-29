sp.namespace("sp.utils.ArrayUtils");



sp.utils.ArrayUtils =
{

    indexOfElementByProperty: function(arr, prop, val)
    {
        if (!arr || !prop) return;
        for (var i = 0; i < arr.length; i++) if (arr[i][prop] == val) return i;
    },

    findElementByProperty: function(arr, prop, val)
    {
        if (!arr || !prop) return;
        var i = this.indexOfElementByProperty(arr, prop, val);
        if (i != undefined) return arr[i];
    },

    removeElementAt: function(arr, i)
    {
        if (!arr) return;
        arr.splice(i, 1);
    },

    removeElement: function(arr, el)
    {
        if (!arr) return;
        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i] == el)
            {
                arr.splice(i, 1);
                break;
            }
        }
    },

    removeElementByProperty: function(arr, prop, val)
    {
        if (!arr || !prop) return;
        var i = this.indexOfElementByProperty(arr, prop, val);
        if (i != undefined) this.removeElementAt(arr, i);
    },

    isArray: function(val)
    {
        return (val.splice) ? true : false;
    },

    indexOf:function(arr,val)
    {
        if (!arr) return;
        for (var i = 0; i < arr.length; i++) if (arr[i]== val) return i;
        return -1;
    }

};