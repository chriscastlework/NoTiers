sp.namespace('sp.core.locale',
             'sp.core.locale.Locale',
             'sp.core.locale.TranslationData',
             'sp.core.locale.LocaleManager',
             'sp.core.locale.LocaleManagerImplementation');

sp.core.locale.DEFAULT_LOCALE = 'en';

sp.core.locale.TranslationData = Class.extend
(
{
    __constructor: function(data)
    {
        this.data = {};
        this.setData(data);
    },

    setData: function(data)
    {
        for (var i= 0, item=data[i]; i < data.length; i++, item = data[i])
        {
            if (!item || item.ID === undefined) continue;
            this.data[item.ID] = item.local || '';
        }
    },

    getString: function(id)
    {
        return this.data[id];
    }
}
);

sp.core.locale.Locale = Class.extend
(
{
    __constructor: function(localeName)
    {
        this.name = localeName;
        this.translationData = null;
        this.fallbackToDefaultLocale = true;
        this.datepickerLocalization = null;

        this.setDefaultData();
    },

    getName: function()
    {
        return this.name;
    },

    setDefaultData: function()
    {
        // check if default data is loaded
        var localeData = sp.core.lang[this.getName()];
        if (localeData) this.setData(localeData)
    },

    setFallbackToDefaultLocale: function(bool)
    {
        this.fallbackToDefaultLocale = bool;
    },

    setData: function(data)
    {
        // todo
        this.setTranslationData(data.translations);
    },

    setTranslationData: function(data)
    {
        if (this.translationData)
        {
            this.translationData.setData(data);
        }
        else
        {
            this.translationData = new sp.core.locale.TranslationData(data);
        }
    },

    getString: function(id, or)
    {
        var str = this.translationData.getString(id);
        if (str === undefined || str === null)
        {
            if (or !== undefined && or !== null) return or;
            if (this.fallbackToDefaultLocale && this.name !== sp.core.locale.DEFAULT_LOCALE)
            {
                return sp.core.locale.LocaleManager.getDefaultLocale().getString(id);
            }
        }
        return str;
    },

    getDatepickerLocalization: function()
    {
        return this.datepickerLocalization;
    },

    setDatepickerLocalization: function(obj)
    {
        this.datepickerLocalization = obj;
    }
}
);


sp.core.locale.LocaleManagerImplementation = Class.extend
(
{
    __constructor: function()
    {
        this.currentLocale = null;
        this.locales = {};
        this.defaultLocale = null;

        var defaultLocale = new sp.core.locale.Locale(sp.core.locale.DEFAULT_LOCALE);
        this.defaultLocale = defaultLocale;
        this.setLocale(this.defaultLocale);
    },

    getDefaultLocale: function()
    {
        return this.defaultLocale;
    },

    setLocale: function(localeOrLocaleName)
    {
        if (typeof(localeOrLocaleName) === 'string') return this.setLocaleByString(localeOrLocaleName);
        if (typeof(localeOrLocaleName) === 'object') return this.setLocaleByObject(localeOrLocaleName);
    },

    setLocaleByString: function(localeName, data)
    {
        var locale = this.locales[localeName] || new sp.core.locale.Locale(localeName);

        return this.setLocaleByObject(locale, data);
    },

    setLocaleByObject: function(locale)
    {
        this.locales[locale.getName()] = locale;
        this.currentLocale = locale;
        return locale;
    },

    getLocale: function(localeName)
    {
        if (localeName)
        {
            return this.locales[localeName];
        }
        return this.currentLocale;
    }
}
);

sp.core.locale.LocaleManager = new sp.core.locale.LocaleManagerImplementation();

sp.core.locale.getLocale = function(localeName)
{
    return sp.core.locale.LocaleManager.getLocale(localeName);
};

sp.core.locale.getString = function(id, or)
{
    return sp.core.locale.getLocale().getString(id, or);
};
