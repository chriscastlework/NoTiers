sp.namespace("sp.ui.TextCounter");

sp.ui.TextCounter = Class.extend
(
{
    __constructor: function(input, options)
    {
        this.input = input;
        this.options = options;

        var textLimit = parseInt(this.options.textLimit);
        var warnAt = parseInt(this.options.warnAt);
		var limitBoxInvisible = Boolean(this.options.limitBoxInvisible);
        if (isNaN(textLimit)) textLimit = 255;
        if (isNaN(warnAt)) warnAt = 50;

        this.options.textLimit = textLimit;
        this.options.warnAt = warnAt;
		this.options.limitBoxInvisible = limitBoxInvisible;
        setTimeout($.proxy(this.init, this), 0);
    },

    init: function()
    {
        $(this.input).parent().css({position: 'relative'});
        this.warnContainer = sp.core.graphics.Graphic.createElement('div', null, ['text_limit_container']);
        $(this.warnContainer).insertBefore(this.input).hide();
        $(this.input).keydown($.proxy(this.onKeyDown, this));
        $(this.input).change($.proxy(this.onKeyDown, this));
        $(this.input).bind('paste', $.proxy(this.onKeyDown, this));
        $(this.input).bind('cut', $.proxy(this.onKeyDown, this));

        this.onKeyDown();
        this.adjustPosition();
    },

    onKeyDown: function()
    {
        var __this = this;
        setTimeout(function(){
            var length = $(__this.input).val().length;
            var limit = __this.options.textLimit;
            var warnAt = __this.options.warnAt;
			var limitBoxInvisible = __this.options.limitBoxInvisible;

            if (!(limitBoxInvisible) && length > limit - warnAt) //limitBoxInvisible bool option to hide limit box if needed
            {
                $(__this.warnContainer).show();
                if (length <= limit)
                {
                    $(__this.warnContainer).text(limit - length).removeClass('exceeded');
                }
                else
                {
                    $(__this.warnContainer).text(length - limit).addClass('exceeded');
                }
            }
            else
            {
                $(__this.warnContainer).hide().text('');
            }
        }, 0);
    },

    adjustPosition: function()
    {
        var $el = $(this.input);
        var $container = $el.parent();
        var left = ($el.position().left + $el.outerWidth()) / $container.width();
        left = Math.max(0, left);
        left = Math.min(1, left);
        left = left * 100 + '%';
        $(this.warnContainer).css({left: left});
    }

}
);