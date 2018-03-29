/* Requires
 sp.core.events.EventDispatcher
 */
sp.namespace("plugins.options.ApplicationOptions");


plugins.options.ApplicationOptions = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(xml)
        {
            this.xml = xml;
            plugins.options.ApplicationOptions.__INSTANCE = this;
        },

        getAutoSaveEnabled:function()
        {
            return Boolean(this.getAutoSaveInterval()) && this.getMode() != 'readonly';
        },

        getAutoSaveInterval:function()
        {
            try
            {
                var node =  $(this.xml).find("autosave")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getServerPath:function()
        {
            try
            {
                var node =  $(this.xml).find("serverpath")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getApplicationOptionByName: function(name)
        {
            try
            {
                var node =  $(this.xml).find(name)[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getVersion:function()
        {
            try
            {
                var node =  $(this.xml).find("version")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getMode: function()
        {
            try
            {
                var node =  $(this.xml).find("mode")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        },

        getSplashMessage: function()
        {
            try
            {
                var node =  $(this.xml).find("splashmessage")[0];
                if(node) return $(node).text();
            }
            catch(e)
            {

            }
            return "";
        }
    }
);
plugins.options.ApplicationOptions.getInstance = function()
{
    if(!plugins.options.ApplicationOptions.__INSTANCE) plugins.options.ApplicationOptions.__INSTANCE = new plugins.options.ApplicationOptions();
    return plugins.options.ApplicationOptions.__INSTANCE;
}