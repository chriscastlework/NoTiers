/* Requires
 sp.core.events.EventDispatcher
 */
sp.namespace("plugins.user.UserSettings");



plugins.user.UserSettings = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(xml)
        {
            this.xml = xml;
            plugins.user.UserSettings.__INSTANCE = this;
            var d = this.getDefaultDateFormat();
            if(d) spx.model.format.Date.DEFAULT = d.getFormat();
        },

        setData:function(xml)
        {
            this.xml = xml;
            var d = this.getDefaultDateFormat();
            if(d) spx.model.format.Date.DEFAULT = d.getFormat();
        },

        getUserName:function()
        {
            try
            {
                var node =  $(this.xml).find("username")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getUserID: function()
        {
            try
            {
                var node =  $(this.xml).find("userid")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getLicenseByID:function(id)
        {
            try
            {
                var node =  $(this.xml).find("licenses>*[id='"+id+"']")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
        },

        getUserPromptSettingByID: function(id)
        {
            try
            {
                var node =  $(this.xml).find("userpromptsettings>*[id='"+id+"']")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
        },

        getLanguage:function()
        {
            try
            {
                var node =  $(this.xml).find("language")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
        },

        getUserSettingByName:function(nodename)
        {
            try
            {
                var node =  $(this.xml).find(nodename)[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
        },

        getFiscalYearStart:function()
        {
            try
            {
                var node =  $(this.xml).find("fiscalyearstart")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            var date = new Date();
            var y = (date.getMonth()>3 || (date.getMonth()==3 && date.getDate()>5))? date.getFullYear()+1 : date.getFullYear();
            return y+".4.6";
        },

        getDefaultDateFormatID:function()
        {
            var node = $(this.xml).find("defaultdateformat")[0];
            if(node) return $(node).text();
        },

        getDefaultDateFormat:function()
        {
            var node = $(this.xml).find("defaultdateformat")[0];
            if(node) return spx.model.resources.Resources.getResource($(node).text());
        },

        getDefaultNumberFormatID:function()
        {
            var node = $(this.xml).find("defaultnumberformat")[0];
            if(node) return $(node).text();
        },

        getDefaultNumberFormat:function()
        {
            var node = $(this.xml).find("defaultnumberformat")[0];
            if(node) return spx.model.resources.Resources.getResource($(node).text());
        }
    }
);
plugins.user.UserSettings.getInstance = function()
{
    if(!plugins.user.UserSettings.__INSTANCE) plugins.user.UserSettings.__INSTANCE = new plugins.user.UserSettings();
    return plugins.user.UserSettings.__INSTANCE;
}
