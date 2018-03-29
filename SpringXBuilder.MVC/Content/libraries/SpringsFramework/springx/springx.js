sp.namespace("spx");


$(document).ready(function()
{
    spx.AppletParameters = new ws.applet.AppletParameters();
    spx.Model = new spx.model.Model(spx.AppletParameters);
    spx.View = new spx.view.View(spx.Model);
    spx.Controller = new spx.controller.Controller(spx.View, spx.Model);

    // if there is a scrollLocation then go to it

});

var currentWindowLocation = -1;


spx.setMomorycurrentWindowLocation = function() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    currentWindowLocation = top;
}

// Using thew scrollLocation parameter will scroll your window to location
spx.setWindowLocation = function () {
    
    var locationParam = 0;

    if (currentWindowLocation < 0) {
        var params = spx.parseQueryString();
        locationParam = params["scrollLocation"];
    } else {
        locationParam = currentWindowLocation;
    }

    window.scrollTo(0, locationParam);
}

// Reloads the window but add url parameter to bring you back tot he same location after running setWindowLocation
spx.windowReload = function() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var fullSearch = spx.removeURLParameter(window.location.search, 'scrollLocation');
    window.location.search = fullSearch + '&scrollLocation=' + top;
}


spx.removeURLParameter = function(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {
        var prefix = encodeURIComponent(parameter) + '=';
        var pars= urlparts[1].split(/[&;]/g);
        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    } else {
        return url;
    }
}



spx.parseQueryString = function () {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
};

spx.escapeRegExp = function (str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

spx.replaceAll = function (str, find, replace) {
    return str.replace(new RegExp(spx.escapeRegExp(find), 'g'), replace);
}


spx.evaluate = function(str, context)
{

    function hasProperty(obj,prop)
    {
        for(var str in obj) if (str == prop) return true;
    }

    if (Object.prototype.toString.call(str) == "[object Number]")
    {
        return str;
    }

    if (str != undefined) {
        if (str[0] == '{' && str[str.length - 1] == '}') {
            var tempstr = spx.replaceAll(str, '{', '');
            tempstr = spx.replaceAll(tempstr, '}', '');
            var curlyBraceResource = spx.model.resources.Resources.getCustomFieldResourceByID(tempstr);
            if (curlyBraceResource != undefined) {
                tempstr = spx.replaceAll(tempstr, tempstr, curlyBraceResource);
                str = tempstr;
            }
        }
    }
  
  


    if(!str) return str;
    //sp.out("Eavluate:" + str + " context:" + context);
    try
    {

        var match = str.match(/^\{[^{}]*(?=\}$)/g);
        if(match)
        {
            match = match[0].substr(1); // strip the first { which will be in the result..

            // sp.out("match:" + match);
            //if we have a context, first check for value there
            if (context)
            {
                if (context.getElementByID)
                {
                    var field = context.getElementByID(match);
                    if (field) return field.getData(str); //we may not have such field

                    if (context.data[match])
                        return context.data[match];
                }
                else if (hasProperty(context,match))
                {
                    //sp.out ( " eval returning:" + field.getData() + ")" );
                    return context[match];
                }
            }

            var resource = spx.model.resources.Resources.getRawResourceByID(match,str);
            if(resource!=undefined) return spx.evaluate(resource, context);

            match = $.isNumeric(match) ? match : '"' + match + '"';
            //sp.out("ABOUT TO EVAL:" + match);
            var result = eval(match);
            //  sp.out("Eavluate to:" + result);
            return result;
        }
        else
        {


            var complexRegEx = /\{[^{}]*\}/g;
            var isComplexExpression = function(s){ var match = s.match(complexRegEx); return Boolean(match) };

            if (isComplexExpression(str))
            {
                var transformed = str.replace(complexRegEx, function (v) {
                    var evaluated = spx.evaluate(v, context);
                    if (evaluated === " ") {
                        return '" "';
                    }
                    return $.isNumeric(evaluated) ? evaluated : '"' + evaluated.trim() + '"';
                });

                // Replace all the CustomFiedNumbers to actual values
                var customFieldsToReplace = transformed.match('(CustomField)(\\d+)');
                if (customFieldsToReplace != null) {
                    var replaceResource1 = spx.model.resources.Resources.getCustomFieldResourceByID(customFieldsToReplace[0]);
                    if (replaceResource1 != undefined)
                        transformed = spx.replaceAll(transformed, customFieldsToReplace[0], replaceResource1);
                    }
            
                // Another fix because context is sometimes just a string when its a label
                var customFieldsToReplace2 = transformed.match('(CustomField)(\\d+)');
                if (customFieldsToReplace2 != null) {
                    if (context != undefined && typeof context == "string")
                        transformed = spx.replaceAll(transformed, customFieldsToReplace[0], context);
                }


                // then run this again as it could still be a custom field
                var customFieldsToReplace3 = transformed.match('(CustomField)(\\d+)');
                if (customFieldsToReplace3 != null) {
                    var replaceResource2 = spx.model.resources.Resources.getCustomFieldResourceByID(customFieldsToReplace[0]);
                    if (replaceResource2 != undefined)
                        transformed = spx.replaceAll(transformed, customFieldsToReplace[0], replaceResource2);
                }

                var result = eval(transformed);
                return result;
            }
        }
        str = str.replace("\\{","{");
    }
    catch(e)
    {
        console.log('error in spx.evaluate: ', e);
    }

    // sp.out("Eavluate to:" + str );

    return str;
};

spx.decode = function(str)
{
    try
    {
        return decodeURIComponent(str);
    }
    catch(e)
    {

    }
    return unescape(str);
};

spx.encode = function(str)
{
    try
    {
        return encodeURIComponent(str);
    }
    catch(e)
    {

    }
    return escape(str);
}