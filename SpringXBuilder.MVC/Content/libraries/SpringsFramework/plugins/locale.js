/* Requires
    sp.core.locale
*/
sp.namespace(
    "plugins.locale.Locale"
);

/* Overrides values in sp.core.locale (for old framework localization stuff). Sample xml:
<resource id="locale_strings">
    <!-- springs -->
    <plugins.locale.Locale>
        <string id="DIALOG_OK">xxOk</string>
        <string id="DIALOG_CANCEL">xxCancel</string>
    </plugins.locale.Locale>
</resource>
 */
plugins.locale.Locale = Class.extend
(
    {
        __constructor:function(xml)
        {
            if (xml)
            {
                var translationData = [];
                $(xml).find('string').each(function(i,string)
                {
                    translationData.push({ID:string.getAttribute('id'), local:$(string).text()});
                });
                if (sp.core.locale.getLocale()) sp.core.locale.getLocale().setTranslationData(translationData);
            }
        }
    }
)
