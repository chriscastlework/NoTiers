sp.namespace('sp.utils.Math');

sp.utils.Math =
{
    sum: function(array)
    {
        var sum = 0;
        for(var i = 0; i < array.length; i++)
        {
            sum += array[i];
        }
        return sum;
    },

    count: function(array, filter)
    {
        if (filter) return $(array).filter(filter).length;
        return array.length;
    },

    mean: function(array)
    {
        var m = sp.utils.Math;
        return m.toFixed(m.sum(array) / (m.count(array) || 1));
    },

    median: function(array)
    {
        var sorted = array.concat([]).sort();
        var length = sorted.length;
        if (length % 2 == 1) return sorted[(length - 1) / 2];
        return sp.utils.Math.mean(sorted.splice(length - 1, 2));
    },

    mode: function(array)
    {
        var m = sp.utils.Math;
        var copy = array.concat([]);
        return copy.sort(function(a, b){
           return m.count(array, function(v){ return v == a; }) -  m.count(array, function(v){ return v == b; })
        }).pop();
    },

    range: function(array)
    {
        var m = sp.utils.Math;
        return m.highest(array) - m.lowest(array);
    },

    lowest: function(array)
    {
        if (array.length == 0) return 0;
        var min = Number.MAX_VALUE;
        for (var i = 0; i < array.length; i++) if (array[i] < min) min = array[i];
        return min;
    },

    highest: function(array)
    {
        if (array.length == 0) return 0;
        var max = Number.MIN_VALUE;
        for (var i = 0; i < array.length; i++) if (array[i] > max) max = array[i];
        return max;
    },

    toFixed: function(val)
    {
        //2 or 2.5 will be returned unchanged
        //2.333333333 will be returned as 2.33
        if (typeof(val) != 'number') return a;
        return Math.round(val * 100)/100;
    },

    calculate: function(operation, array)
    {
        if (typeof(operation) == 'string' && sp.utils.ArrayUtils.isArray(array))
        {
            if (sp.utils.Math.hasOwnProperty(operation) && operation != 'calculate')
            {
                return sp.utils.Math[operation](array);
            }
        }
        return 0;
    }
};