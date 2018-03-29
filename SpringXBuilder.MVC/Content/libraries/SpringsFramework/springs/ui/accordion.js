sp.namespace(
    "sp.ui.accordion.Accordion",
    "sp.ui.accordion.AccordionOptions",
    "sp.ui.accordion.AccordionEvent"
);

sp.ui.accordion.Accordion = sp.core.graphics.Graphic.extend
(
{
    data: null,

    __constructor: function(graphic, options)
    {
        this.__super(graphic);
        this.options = new sp.ui.accordion.AccordionOptions(options);
        this.id = sp.guid();
    },

    init: function()
    {
        var __this = this;
        var el = $(this.getGraphic());
        el.addClass('ws-accordion ui-helper-reset '+this.options.accordionClass);
        el.find('h3').click(function()
            {
                var $arrowIcon = $(this).find('span').first();
                var eventType = $arrowIcon.hasClass('ui-icon-triangle-1-s')? sp.ui.accordion.AccordionEvent.UNFOLD : sp.ui.accordion.AccordionEvent.FOLD;
                $arrowIcon.toggleClass('ui-icon-triangle-1-s ui-icon-triangle-1-n');
                $(this).next().toggle('blind');

                __this.dispatchEvent(new sp.ui.accordion.AccordionEvent(__this, eventType, this));
                return false;
            });
        el.find('a').parent().append($('<span class="ui-icon ui-icon-triangle-1-s">'));

        el.find('div.ws-accordion-content-item').click(function()
        {
            __this.dispatchEvent(new sp.ui.accordion.AccordionEvent(__this, sp.ui.accordion.AccordionEvent.ITEMSELECT, this));
            return false;
        });

        if (this.options.scrollable)
        {
            el.css('overflowY', 'auto');
        }
    },

    getHeaderID: function(levelPositions)
    {
        var id = this.id + '-';
        var position = null;
        for (var i = 0, len=levelPositions.length; i<len; i++)
        {
            position = levelPositions[i];
            id += position;
            if (i<len-1) id+= '-';
        }
        return id;
    },

    getHTML: function (data, level, levelPositions)
    {
        if (!level) level = 1;
        if (!levelPositions) levelPositions = [0];

        var header = this.options.createHeaderFunction;

        var html = '';
        for (var i = 0, item = data[i]; i < data.length; i++, item = data[i])
        {
            if (item === undefined) continue;
            if (typeof(levelPositions[level-1]) === "undefined") levelPositions[level-1] = 0;
            levelPositions[level-1] = i;

            var headerID = this.getHeaderID(levelPositions);
            html += '<h3 class="level-' + level + ' ws-accordion-header ui-helper-reset '+this.options.headerClass+'"><a href="#" id="'+headerID+'">' + header(item) + '</a></h3><div class="ws-accordion-content ui-helper-reset level-' + level + ' '+this.options.contentClass+'">';
            if (item.data && item.data[0] && typeof(item.data[0]) === 'string')
            {
                if (!$.isArray(item.data)) item.data = [item.data];
                for (var j= 0, len=item.data.length; j<len; j++)
                {
                    html += '<div class="ws-accordion-content-item ui-helper-reset level-' + level+'">'+item.data[j]+'</div>';
                }
            }
            else
            {
                html += this.getHTML(item.data, level + 1, levelPositions);
            }
            html += '</div>';
        }
        levelPositions.pop();
        return html;
    },

    updateHeaders: function(data, level, levelPositions)
    {
        if (!data) return;
        if (!levelPositions) levelPositions = [];
        var header = this.options.createHeaderFunction;

        for (var i = 0, item = data[i]; i < data.length; i++, item = data[i])
        {
            if (item === undefined) continue;
            if (typeof(levelPositions[level-1]) === "undefined") levelPositions[level-1] = 0;
            levelPositions[level-1] = i;

            $('#'+this.getHeaderID(levelPositions)).text(header(item));
            this.updateHeaders(item.data, level + 1, levelPositions);
        }
        levelPositions.pop();
    },

    refreshHeaders: function()
    {
        this.updateHeaders(this.data, 1);
    },

    setDataProvider: function (data)
    {
        this.data = data;
        var html = this.getHTML(data);
        $(this.getGraphic()).html(html);
        this.init();
    }
}
);

sp.ui.accordion.AccordionOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults: function()
    {
        this.accordionClass = "";
        this.headerClass = "";
        this.contentClass = "";
        this.scrollable = false;
        this.createHeaderFunction = function(item)
        {
            return item.header;
        };
    }
}
);

sp.ui.accordion.AccordionEvent = sp.core.events.Event.extend
(
{
    __constructor: function (target, type, item)
    {
        this.__super(target, type);
        this.item = item;
    }
}
);

sp.ui.accordion.AccordionEvent.FOLD = 'fold';
sp.ui.accordion.AccordionEvent.UNFOLD = 'unfold';
sp.ui.accordion.AccordionEvent.ITEMSELECT = 'itemselect';