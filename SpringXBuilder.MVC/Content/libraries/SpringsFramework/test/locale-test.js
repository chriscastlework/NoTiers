sp.namespace('sp.core.locale.test.LocaleTest');

sp.core.locale.test.LocaleTest = Class.extend
(
{
    run: function()
    {
        var lang = sp.core.locale.getLocale();
        lang.setTranslationData(this.data('DIALOG_OK', 'OK', 'YES', 'Yes', 'CHANGE_ME', 'NOT CHANGED'));

        this.test('getString with existing key', lang.getString('DIALOG_OK', 'NOT OK!'), 'OK');
        this.test('getString with non-existent key and no default -> undefined', lang.getString('i-dont-exist'), undefined);
        this.test('getString with non-existent key and default', lang.getString('DIALOG_CANCEL', 'Cancel'), 'Cancel');

        lang.setTranslationData(this.data('CHANGE_ME', 'CHANGED', 'DIALOG_CANCEL','Cancel'));
        this.test('update current locale data', lang.getString('DIALOG_CANCEL'), 'Cancel');
        this.test('update current locale data and overwrite values', lang.getString('CHANGE_ME'), 'CHANGED');

        lang = sp.core.locale.LocaleManager.setLocale('es');
        lang.setTranslationData(this.data('YES', 'Si'));
        this.test('set new locale with data', lang.getString('YES'), 'Si');
        this.test('fallback to default locale', lang.getString('DIALOG_OK'), 'OK');

        lang = sp.core.locale.LocaleManager.setLocale('en');
        this.test('back to original locale', lang.getString('YES'), 'Yes');

        this.test('default values', lang.getString('CONFIRM_DIALOG_YES'), "Yes")
    },

    data: function()
    {
        var result = [];
        for (var i= 0, len=arguments.length; i<len; i=i+2)
        {
            var item = {ID: arguments[i], local: arguments[i+1]};
            result.push(item);
        }
        return result;
    },

    test: function(desc, val1, val2)
    {
        if (val1 === val2)
        {
            console.log('[success] '+desc);
        }
        else
        {
            console.error('[fail] '+desc+' ::: expected '+val2+' but got '+val1);
        }
    }
}
);

