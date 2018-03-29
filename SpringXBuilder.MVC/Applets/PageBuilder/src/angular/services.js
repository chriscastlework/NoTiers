app.factory("log",[function()
{
    return function(str)
    {
        console.log(str);
    }
}])

app.factory("refData",["log",function(log)
{
    var Element = pb.model.Element;
    var tools = [
                    {description:"Represents a collection of related elements. Use it to indicate how you want elements to be grouped on the page Drag other elements into the section as needed.",name:"section",id:Element.SECTION,imgPath:"res/icons-tools/icon_section.png"},
                    {description:"Displays a label on the page. Labels are not editable.",name:"label",id:Element.TEXTLABEL,imgPath:"res/icons-tools/icon_textlabel.png"},
                    {description:"Allows the user to enter text. Can be used for single line text entry or larger areas of free text.",name:"text input",id:Element.TEXTINPUT,imgPath:"res/icons-tools/icon_textinput.png"},
                    {description:"Allows the user to enter a number. Number inputs can be configured to allow a specific range.",name:"number input",id:Element.NUMERIC,imgPath:"res/icons-tools/icon_numeric.png"},
                    {description:"Displays a list of values for the user to choose from.",name:"picklist",id:Element.PICKLIST,imgPath:"res/icons-tools/icon_picklist.png"},
                    {description:"Allows the user to toggle a value on or off.",name:"checkbox",id:Element.CHECKBOX,imgPath:"res/icons-tools/icon_checkbox.png"},
                    {description:"Allows the user to select a date from a calendar.",name:"date selector",id:Element.DATEPICKER,imgPath:"res/icons-tools/icon_datepicker.png"},
                    {description:"Displays a non-interactive image on the page.",name:"image",id:Element.IMAGE,imgPath:"res/icons-tools/icon_image.png"},
                    //{description:"Allows the user to select one of a range of possible options.",name:"set of radio buttons",id:Element.RADIOBUTTONS,imgPath:"res/icons-tools/icon_radio.png"},
                    {description:"Allows the user to select a value from a range by dragging a slider.",name:"slider",id:Element.SLIDER,imgPath:"res/icons-tools/icon_slider.png"},
                    //{description:"Displays a list of items in a vertical container. The list can be configured to show specific details for each item.",name:"list",id:Element.LIST,imgPath:"res/icons-tools/icon_list.png"},
                    {description:"Displays a list of items in a grid with rows and columns.",name:"grid of items",id:Element.GRID,imgPath:"res/icons-tools/icon_grid.png"},
                    //{description:"Displays a chart showing sets of data.",name:"data chart",id:Element.CHART,imgPath:"res/icons-tools/icon_charts.png"},
                    {description:"Displays data in a relational map using 'cards'.",name:"map",id:Element.MAP,imgPath:"res/icons-tools/icon_map.png"},
                    {description:"Allows the user to look up an object like a contact, or task",name:"lookup",id:Element.LOOKUP,imgPath:"res/icons-tools/icon_lookup.png"}

                    //{description:"Allows the user to trigger an action.",name:"button",id:Element.BUTTON,imgPath:"res/icons-tools/icon_charts.png"},
                    //{description:"Provides a text input area which accepts tagged items.",name:"tagged text",id:Element.TAGGEDTEXT,imgPath:"res/icons-tools/icon_charts.png"}, // TODO is this separate element type or an option?
                    //{description:"Allows the user to select a color.",name:"color picker",id:Element.COLORPICKER,imgPath:"res/icons-tools/icon_charts.png"}

    ];

    function getTools()
    {
        return tools;
    }
    function getToolByID(id)
    {
        for(var i=0; i<tools.length; i++)
        {
            if(tools[i].id==id) return tools[i];
        }
    }

    return {
                getTools:getTools,
                getToolByID:getToolByID
            };
}]);

app.factory("appletParameters", function ()
{
    var params = {
        url: '../../',
        fileopen: 'pagebuilder/load',
        filesave: 'pagebuilder/save',
        crmkey: ''
    };

    var raw = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function ()
    {
        var decode = function(s)
        {
            try
            {
                return decodeURIComponent(s.split("+").join(" "));
            }
            catch (exeption)
            {
                return unescape(s.split("+").join(" "));
            }
        };
        raw[decode(arguments[1]).toLowerCase()] = decode(arguments[2]);
    });

    function getParam(param)
    {
        if (typeof (param) != 'string') return '';
        return raw[param.toLowerCase()] || params[param.toLowerCase()] || "";
    }

    return window.appletParameters = { getParam: getParam };
});