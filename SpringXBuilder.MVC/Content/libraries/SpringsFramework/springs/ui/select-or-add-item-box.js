/*
    Using code from Select2 Version: 3.3.2 Timestamp: Mon Mar 25 12:14:18 PDT 2013 Copyright 2012 Igor Vaynberg
    Select2 licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
    Select2 URL: http://ivaynberg.github.io/select2/
*/
sp.namespace(
    "sp.ui.SelectOrAddItemBoxUtils",
    "sp.ui.SelectOrAddItemBoxOptions",
    "sp.ui.SelectOrAddItemBox"
);

(function ($)
{
    if(typeof $.fn.each2 == "undefined")
    {
        $.fn.extend(
        {
            /*
             * 4-10 times faster .each replacement
             * use it carefully, as it overrides jQuery context of element on each iteration
             */
            each2: function (c)
            {
                var j = $([0]),
                    i = -1,
                    l = this.length;
                while (
                ++i < l && (j.context = j[0] = this[i]) && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

$(document).bind("mousemove", function(e)
{
    sp.ui.SelectOrAddItemBoxUtils.lastMousePosition = {
        x: e.pageX,
        y: e.pageY
    };
});
sp.ui.SelectOrAddItemBoxUtils =
{
    KEY: {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow:function(k)
        {
            var KEY = sp.ui.SelectOrAddItemBoxUtils.KEY;
            k = k.which ? k.which : k;
            switch (k)
            {
                case KEY.LEFT:
                case KEY.RIGHT:
                case KEY.UP:
                case KEY.DOWN:
                    return true;
            }
            return false;
        },
        isControl:function(e)
        {
            var k = e.which, KEY = sp.ui.SelectOrAddItemBoxUtils.KEY;
            switch (k)
            {
                case KEY.SHIFT:
                case KEY.CTRL:
                case KEY.ALT:
                    return true;
            }

            if(e.metaKey) return true;

            return false;
        },
        isFunctionKey:function(k)
        {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    installKeyUpChangeEvent:function(element)
    {
        var key = "keyup-change-value";
        element.bind("keydown", function()
        {
            if($.data(element, key) === undefined)
            {
                $.data(element, key, element.val());
            }
        });
        element.bind("keyup", function()
        {
            var val = $.data(element, key);
            if(val !== undefined && element.val() !== val)
            {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    },
    killEvent:function(event)
    {
        event.preventDefault();
        event.stopPropagation();
    },
    killEventImmediately:function(event)
    {
        event.preventDefault();
        event.stopImmediatePropagation();
    },
    indexOf:function(value, array)
    {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) if(sp.ui.SelectOrAddItemBoxUtils.equal(value, array[i])) return i;
        return -1;
    },
    equal:function(a, b)
    {
        if(a === b) return true;
        if(a === undefined || b === undefined) return false;
        if(a === null || b === null) return false;
        if(a.constructor === String) return a + '' === b + ''; // IE requires a+'' instead of just a
        if(b.constructor === String) return b + '' === a + ''; // IE requires b+'' instead of just b
        return false;
    },
    focus:function($el)
    {
        if($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function()
        {
            var el = $el[0],
                pos = $el.val().length,
                range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            if($el.is(":visible") && el === document.activeElement)
            {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if(el.createTextRange)
                {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    },
    installFilteredMouseMove:function(element)
    {
        element.bind("mousemove", function(e)
        {
            var lastpos = sp.ui.SelectOrAddItemBoxUtils.lastMousePosition;
            if(lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY)
            {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    },
    installDebouncedScroll:function(threshold, element)
    {
        var notify = sp.ui.SelectOrAddItemBoxUtils.debounce(threshold, function(e)
        {
            element.trigger("scroll-debounced", e);
        });
        element.bind("scroll", function(e)
        {
            if(sp.ui.SelectOrAddItemBoxUtils.indexOf(e.target, element.get()) >= 0) notify(e);
        });
    },
    debounce:function(quietMillis, fn, ctx)
    {
        ctx = ctx || undefined;
        var timeout;
        return function()
        {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function()
            {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    },
    escapeMarkup:function(markup)
    {
        var replace_map = {
            '\\': '&#92;', '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&apos;', "/": '&#47;'
        };
        return String(markup).replace(/[&<>"'\/\\]/g, function(match){ return replace_map[match[0]] });
    }
};

sp.ui.SelectOrAddItemBoxOptions = sp.core.data.ValueObject.extend
(
{
    setDefaults:function()
    {
        this.idProperty = "ID";
        this.labelProperty = "Label";
    }
}
);

sp.ui.SelectOrAddItemBox = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(model, options)
    {
        this.__super(this.createContainer());
        if (!model) throw "SelectOrAddItemBox error: no model parameter supplied to constructor";
        this.model = model;

        this.enabled = true;
        this.options = options || new sp.ui.SelectOrAddItemBoxOptions();

        this.container = $(this.getGraphic());
        this.dropdown = this.container.find(".sp-select-or-add-item-box-drop");
        this.results = this.container.find(".sp-select-or-add-item-box-results");
        this.search = this.container.find("input.sp-select-or-add-item-box-input");

        this.initializeContainer();
    },
    createContainer:function()
    {
        var container = $(document.createElement("div")).attr({
            "class": "sp-select-or-add-item-box-container"
        }).html([
            "<a href='javascript:void(0)' onclick='return false;' class='sp-select-or-add-item-box-choice' tabindex='-1'>",
            "   <span></span><abbr class='sp-select-or-add-item-box-search-choice-close' style='display:none;'></abbr>",
            "   <div><b></b></div>" ,
            "</a>",
            "<input class='sp-select-or-add-item-box-focusser sp-select-or-add-item-box-offscreen' type='text'/>",
            "<div class='sp-select-or-add-item-box-drop' style='display:none'>" ,
            "   <div class='sp-select-or-add-item-box-search'>" ,
            "       <input type='text' autocomplete='off' class='sp-select-or-add-item-box-input'/>" ,
            "   </div>" ,
            "   <ul class='sp-select-or-add-item-box-results'>" ,
            "   </ul>" ,
            "</div>"].join(""));
        return container[0];
    },
    formatResult:function(result, container, query)
    {
        var markup = [];
        this.markMatch(result[this.options.labelProperty], query.term, markup);
        return markup.join("");
    },
    markMatch:function(text, term, markup)
    {
        var match = text.toUpperCase().indexOf(term.toUpperCase()),
            tl = term.length, escapeMarkup = sp.ui.SelectOrAddItemBoxUtils.escapeMarkup;
        if(match < 0) return markup.push(escapeMarkup(text));
        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='sp-select-or-add-item-box-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    },
    populateResults:function(container, results, query)
    {
        var i, l, result, selectable, disabled, node, label, formatted;

        for (i = 0, l = results.length; i < l; i = i + 1)
        {
            result = results[i];
            disabled = (result.disabled === true);
            selectable = (!disabled) && (result[this.options.idProperty] !== undefined);
            node = $("<li></li>");
            node.addClass("sp-select-or-add-item-box-results-dept-" + 0);
            node.addClass("sp-select-or-add-item-box-result");
            node.addClass(selectable ? "sp-select-or-add-item-box-result-selectable" : "sp-select-or-add-item-box-result-unselectable");
            if(disabled) node.addClass("sp-select-or-add-item-box-disabled");
            label = $(document.createElement("div"));
            label.addClass("sp-select-or-add-item-box-result-label");
            formatted = this.formatResult(result, label, query);
            if(formatted !== undefined) label.html(formatted);
            node.append(label);
            node.data("sp-select-or-add-item-box-data", result);
            container.append(node);
        }
    },
    createSearchChoice:function(term)
    {
        var item = {};
        item[this.options.idProperty] = term;
        item[this.options.labelProperty] = term;
        return item;
    },
    body:function()
    {
        if(!this._bodyCached) this._bodyCached = this.container.closest('body');
        return this._bodyCached;
    },
    bind:function(func)
    {
        var self = this;
        return function(){ return func.apply(self, arguments) };
    },
    initializeContainer:function()
    {
        var selection,
            container = this.container,
            dropdown = this.dropdown,
            search = this.search,
            clickingInside = false;

        // TODO
        this.container.css('width', '200px');

        this.selection = selection = container.find(".sp-select-or-add-item-box-choice");
        this.focusser = container.find(".sp-select-or-add-item-box-focusser");

        this.search.bind("keydown", this.bind(function(e)
        {
            var KEY = sp.ui.SelectOrAddItemBoxUtils.KEY;
            if(!this.enabled) return;
            if(e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN)
            {
                // prevent the page from scrolling
                sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
                return;
            }
            switch (e.which)
            {
                case KEY.UP:
                case KEY.DOWN:
                    this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                    sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
                    return;
                case KEY.TAB:
                case KEY.ENTER:
                    this.selectHighlighted();
                    sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
                    return;
                case KEY.ESC:
                    this.cancel(e);
                    sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
                    return;
            }
        }));

        this.search.bind("blur", this.bind(function()
        {
            // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
            // without this the search field loses focus which is annoying
            if(document.activeElement === this.body().get(0))
            {
                window.setTimeout(this.bind(function()
                {
                    this.search.focus();
                }), 0);
            }
        }));

        this.focusser.bind("keydown", this.bind(function(e)
        {
            var KEY = sp.ui.SelectOrAddItemBoxUtils.KEY;
            if(!this.enabled) return;
            if(e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) return;
            if(e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER)
            {
                this.open();
                sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
                return;
            }
        }));

        sp.ui.SelectOrAddItemBoxUtils.installKeyUpChangeEvent(this.focusser);
        this.focusser.bind("keyup-change input", this.bind(function(e)
        {
            if(this.opened()) return;
            this.open();
            if(this.showSearchInput !== false) this.search.val(this.focusser.val());
            this.focusser.val("");
            sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
        }));

        selection.delegate("abbr", "mousedown", this.bind(function(e)
        {
            if(!this.enabled) return;
            this.clear();
            sp.ui.SelectOrAddItemBoxUtils.killEventImmediately(e);
            this.close();
            this.selection.focus();
        }));

        selection.bind("mousedown", this.bind(function(e)
        {
            clickingInside = true;
            if(this.opened()) this.close();
            else if(this.enabled) this.open();
            sp.ui.SelectOrAddItemBoxUtils.killEvent(e);
            clickingInside = false;
        }));

        dropdown.bind("mousedown", this.bind(function(){ this.search.focus() }));
        selection.bind("focus", this.bind(function(e){ sp.ui.SelectOrAddItemBoxUtils.killEvent(e) }));

        this.focusser.bind("focus", this.bind(function()
        {
            this.container.addClass("sp-select-or-add-item-box-container-active");
        })).bind("blur", this.bind(function()
        {
            if(!this.opened()) this.container.removeClass("sp-select-or-add-item-box-container-active");
        }));
        this.search.bind("focus", this.bind(function()
        {
            this.container.addClass("sp-select-or-add-item-box-container-active");
        }));

        sp.ui.SelectOrAddItemBoxUtils.installFilteredMouseMove(this.results);
        this.dropdown.delegate(".sp-select-or-add-item-box-results", "mousemove-filtered touchstart touchmove touchend", this.bind(this.highlightUnderEvent));

        sp.ui.SelectOrAddItemBoxUtils.installDebouncedScroll(80, this.results);

        sp.ui.SelectOrAddItemBoxUtils.installKeyUpChangeEvent(search);
        search.bind("keyup-change input paste", this.bind(this.updateResults));
        search.bind("focus", function()
        {
            search.addClass("sp-select-or-add-item-box-focused");
        });
        search.bind("blur", function()
        {
            search.removeClass("sp-select-or-add-item-box-focused");
        });

        this.dropdown.delegate(".sp-select-or-add-item-box-results", "mouseup", this.bind(function(e)
        {
            if($(e.target).closest(".sp-select-or-add-item-box-result-selectable").length > 0)
            {
                this.highlightUnderEvent(e);
                this.selectHighlighted(e);
            }
        }));

        // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
        // for mouse events outside of itself so it can close itself. since the dropdown is now outside the sp-select-or-add-item-box's
        // dom it will trigger the popup close, which is not what we want
        this.dropdown.bind("click mouseup mousedown", function(e){ e.stopPropagation() });
    },
    opened:function()
    {
        return this.container.hasClass("sp-select-or-add-item-box-dropdown-open");
    },
    shouldOpen:function()
    {
        if(this.opened()) return false;
        return true;
    },
    open:function()
    {
        if(!this.shouldOpen()) return false;
        window.setTimeout(this.bind(this.opening), 1);
        return true;
    },
    opening:function()
    {
        var cid = this.containerId,
            scroll = "scroll." + cid,
            resize = "resize." + cid,
            orient = "orientationchange." + cid,
            __this = this,
            mask;

        this.clearDropdownAlignmentPreference();
        this.container.addClass("sp-select-or-add-item-box-dropdown-open").addClass("sp-select-or-add-item-box-container-active");
        if(this.dropdown[0] !== this.body().children().last()[0]) this.dropdown.detach().appendTo(this.body());
        this.updateResults();

        // create the dropdown mask if doesnt already exist
        mask = $("#sp-select-or-add-item-box-drop-mask");
        if(mask.length === 0)
        {
            mask = $(document.createElement("div"));
            mask.attr("id", "sp-select-or-add-item-box-drop-mask").attr("class", "sp-select-or-add-item-box-drop-mask");
            mask.hide();
            mask.appendTo(this.body());
            mask.bind("mousedown touchstart", function()
            {
                var dropdown = $("#sp-select-or-add-item-box-drop");
                if(dropdown.length > 0) __this.close();
            });
        }

        // ensure the mask is always right before the dropdown
        if(this.dropdown.prev()[0] !== mask[0]) this.dropdown.before(mask);

        // move the global id to the correct dropdown
        $("#sp-select-or-add-item-box-drop").removeAttr("id");
        this.dropdown.attr("id", "sp-select-or-add-item-box-drop");

        // show the elements
        mask.css(__this._makeMaskCss());
        mask.show();
        this.dropdown.show();
        this.positionDropdown();

        this.dropdown.addClass("sp-select-or-add-item-box-drop-active");
        this.ensureHighlightVisible();

        // attach listeners to events that can change the position of the container and thus require
        // the position of the dropdown to be updated as well so it does not come unglued from the container
        this.container.parents().add(window).each(function()
        {
            $(this).bind(resize + " " + scroll + " " + orient, function()
            {
                $("#sp-select-or-add-item-box-drop-mask").css(__this._makeMaskCss());
                __this.positionDropdown();
            });
        });

        this.focusSearch();
    },
    _makeMaskCss:function()
    {
        return {
            width: Math.max(document.documentElement.scrollWidth, $(window).width()),
            height: Math.max(document.documentElement.scrollHeight, $(window).height())
        };
    },
    clearDropdownAlignmentPreference:function()
    {
        // clear the classes used to figure out the preference of where the dropdown should be opened
        this.container.removeClass("sp-select-or-add-item-box-drop-above");
        this.dropdown.removeClass("sp-select-or-add-item-box-drop-above");
    },
    updateResults:function()
    {
        var search = this.search,
            term = search.val(),
            lastTerm = $.data(this.container, "sp-select-or-add-item-box-last-term");

        // prevent duplicate queries against the same term
        if(lastTerm && sp.ui.SelectOrAddItemBoxUtils.equal(term, lastTerm)) return;

        $.data(this.container, "sp-select-or-add-item-box-last-term", term);

        // if the search is currently hidden we do not alter the results
        if(this.showSearchInput === false || !this.opened()) return;

        search.addClass("sp-select-or-add-item-box-active");

        this.resultsPage = 1;
        this.queryData(term);
    },
    queryData:function(term)
    {
        var filtered = [], i=0, dat = this.model.getData(), len = dat.length;
        if(term === "") return this.onDataQuery({results: dat, term: term});
        for (; i<len; i++)
        {
            if(('' + dat[i][this.options.labelProperty]).toUpperCase().indexOf(('' + term).toUpperCase()) >= 0) filtered.push(dat[i]);
        }
        this.onDataQuery({results: filtered, term: term});
    },
    onDataQuery:function(data)
    {
        var def, // default choice
            results = this.results, search = this.search,
            idProperty = this.options.idProperty;

        // ignore a response if the sp-select-or-add-item-box has been closed before it was received
        if(!this.opened()) return this.search.removeClass("sp-select-or-add-item-box-active");

        // create a default choice and prepend it to the list
        if(data.term !== "")
        {
            def = this.createSearchChoice(search.val(), data.results);
            if($(data.results).filter(function(){ return sp.ui.SelectOrAddItemBoxUtils.equal(this[idProperty], def[idProperty])}).length === 0) data.results.unshift(def);
        }

        results.empty();
        this.populateResults.call(this, results, data.results,
        {
            term: data.term,
            page: this.resultsPage,
            context: null
        });

        this.postprocessResults(data);
        results.scrollTop(0);
        search.removeClass("sp-select-or-add-item-box-active");
        this.positionDropdown();
    },
    positionDropdown:function()
    {
        var offset = this.container.offset(),
            height = this.container.outerHeight(false),
            width = this.container.outerWidth(false),
            dropHeight = this.dropdown.outerHeight(false),
            viewPortRight = $(window).scrollLeft() + $(window).width(),
            viewportBottom = $(window).scrollTop() + $(window).height(),
            dropTop = offset.top + height,
            dropLeft = offset.left,
            enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
            enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
            dropWidth = this.dropdown.outerWidth(false),
            enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
            aboveNow = this.dropdown.hasClass("sp-select-or-add-item-box-drop-above"),
            bodyOffset,
            above,
            css;

        // fix positioning when body has an offset and is not position: static
        if(this.body().css('position') !== 'static')
        {
            bodyOffset = this.body().offset();
            dropTop -= bodyOffset.top;
            dropLeft -= bodyOffset.left;
        }

        // always prefer the current above/below alignment, unless there is not enough room
        if(aboveNow)
        {
            above = true;
            if(!enoughRoomAbove && enoughRoomBelow) above = false;
        } else
        {
            above = false;
            if(!enoughRoomBelow && enoughRoomAbove) above = true;
        }

        if(!enoughRoomOnRight) dropLeft = offset.left + width - dropWidth;

        if(above)
        {
            dropTop = offset.top - dropHeight;
            this.container.addClass("sp-select-or-add-item-box-drop-above");
            this.dropdown.addClass("sp-select-or-add-item-box-drop-above");
        } else
        {
            this.container.removeClass("sp-select-or-add-item-box-drop-above");
            this.dropdown.removeClass("sp-select-or-add-item-box-drop-above");
        }
        css = {
            top: dropTop,
            left: dropLeft,
            width: width
        };
        this.dropdown.css(css);
    },
    ensureHighlightVisible:function()
    {
        var results = this.results,
            children, index, child, hb, rb, y;

        index = this.highlight();
        if(index < 0) return;

        if(index === 0)
        {
            // if the first element is highlighted scroll all the way to the top,
            // that way any unselectable headers above it will also be scrolled
            // into view
            results.scrollTop(0);
            return;
        }

        children = this.findHighlightableChoices();
        child = $(children[index]);
        hb = child.offset().top + child.outerHeight(true);

        rb = results.offset().top + results.outerHeight(true);
        if(hb > rb) results.scrollTop(results.scrollTop() + (hb - rb));
        y = child.offset().top - results.offset().top;

        // make sure the top of the element is visible
        if(y < 0 && child.css('display') != 'none') results.scrollTop(results.scrollTop() + y); // y is negative
    },
    highlight:function(index)
    {
        var choices = this.findHighlightableChoices(),
            choice,
            data;

        if(arguments.length === 0) return sp.ui.SelectOrAddItemBoxUtils.indexOf(choices.filter(".sp-select-or-add-item-box-highlighted")[0], choices.get());
        if(index >= choices.length) index = choices.length - 1;
        if(index < 0) index = 0;

        this.results.find(".sp-select-or-add-item-box-highlighted").removeClass("sp-select-or-add-item-box-highlighted");

        choice = $(choices[index]);
        choice.addClass("sp-select-or-add-item-box-highlighted");

        this.ensureHighlightVisible();
        data = choice.data("sp-select-or-add-item-box-data");
    },
    findHighlightableChoices:function()
    {
        return this.results.find(".sp-select-or-add-item-box-result-selectable:not(.sp-select-or-add-item-box-selected):not(.sp-select-or-add-item-box-disabled)");
    },
    focusSearch:function()
    {
        sp.ui.SelectOrAddItemBoxUtils.focus(this.search);
    },
    cancel: function ()
    {
        if (!this.opened()) return;
        this.close();
        this.focusser.removeAttr("disabled");
        focus(this.focusser);
    },
    close:function()
    {
        if(!this.opened()) return;

        var cid = this.containerId,
            scroll = "scroll." + cid,
            resize = "resize." + cid,
            orient = "orientationchange." + cid;

        // unbind event listeners
        this.container.parents().add(window).each(function()
        {
            $(this).unbind(scroll).unbind(resize).unbind(orient);
        });

        this.clearDropdownAlignmentPreference();

        $("#sp-select-or-add-item-box-drop-mask").hide();
        this.dropdown.removeAttr("id"); // only the active dropdown has the sp-select-or-add-item-box-drop id
        this.dropdown.hide();
        this.container.removeClass("sp-select-or-add-item-box-dropdown-open");
        this.results.empty();
        this.clearSearch();
        this.search.removeClass("sp-select-or-add-item-box-active");
    },
    clearSearch:function()
    {
        this.search.val("");
        this.focusser.val("");
    },
    getValue:function()
    {
        if(!this.value) return '';
        return this.value[this.options.idProperty];
    },
    postprocessResults:function(data, noHighlightUpdate)
    {
        var selected = 0,
            __this = this;
        // find the selected element in the result list
        this.findHighlightableChoices().each2(function(i, elm)
        {
            if(sp.ui.SelectOrAddItemBoxUtils.equal(elm.data("sp-select-or-add-item-box-data")[__this.options.idProperty], __this.getValue()))
            {
                selected = i;
                return false;
            }
        });
        // and highlight it
        if(noHighlightUpdate !== false) this.highlight(selected);
        this.showSearch(true);
    },
    showSearch:function(showSearchInput)
    {
        this.showSearchInput = showSearchInput;
        this.dropdown.find(".sp-select-or-add-item-box-search")[showSearchInput ? "removeClass" : "addClass"]("sp-select-or-add-item-box-search-hidden");
        //add "sp-select-or-add-item-box-with-searchbox" to the container if search box is shown
        $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("sp-select-or-add-item-box-with-searchbox");
    },
    moveHighlight:function(delta)
    {
        var choices = this.findHighlightableChoices(),
            index = this.highlight(),
            choice;

        while (index > -1 && index < choices.length)
        {
            index += delta;
            choice = $(choices[index]);
            if(choice.hasClass("sp-select-or-add-item-box-result-selectable") && !choice.hasClass("sp-select-or-add-item-box-disabled") && !choice.hasClass("sp-select-or-add-item-box-selected"))
            {
                this.highlight(index);
                break;
            }
        }
    },
    highlightUnderEvent:function(event)
    {
        var el = $(event.target).closest(".sp-select-or-add-item-box-result-selectable"),
            choices;
        if(el.length > 0 && !el.is(".sp-select-or-add-item-box-highlighted"))
        {
            choices = this.findHighlightableChoices();
            this.highlight(choices.index(el));
        }
        else if(el.length === 0)
        {
            // if we are over an unselectable item remove all highlights
            this.results.find(".sp-select-or-add-item-box-highlighted").removeClass("sp-select-or-add-item-box-highlighted");
        }
    },
    selectHighlighted:function(options)
    {
        var index = this.highlight(),
            highlighted = this.results.find(".sp-select-or-add-item-box-highlighted"),
            data = highlighted.closest('.sp-select-or-add-item-box-result').data("sp-select-or-add-item-box-data"),
            idProperty = this.options.idProperty;

        if($.grep(this.model.getData(), function(d){ return d[idProperty] == data[idProperty] }).length === 0)
        {
            this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.ADD, data));
        }
        if(data)
        {
            this.highlight(index);
            this.onSelect(data, options);
        }
    },
    onSelect:function(data, options)
    {
        var old = this.value;
        this.value = data;

        this.close();
        if(!options || !options.noFocus)
            this.selection.focus();
        if(!sp.ui.SelectOrAddItemBoxUtils.equal(old, data[this.options.idProperty])) this.triggerChange();
        this.initSelection();
    },
    updateSelection:function(data)
    {
        var container = this.selection.find("span");
        this.selection.data("sp-select-or-add-item-box-data", data);
        container.empty();
        container.append(sp.ui.SelectOrAddItemBoxUtils.escapeMarkup(data[this.options.labelProperty]));
        this.selection.removeClass("sp-select-or-add-item-box-default");
    },
    triggerChange:function()
    {
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE));
    },
    initSelection:function()
    {
        var selected = this.value, __this = this;
        if(selected !== undefined && selected !== null)
        {
            __this.updateSelection(selected);
            __this.close();
        }
    }
}
);
