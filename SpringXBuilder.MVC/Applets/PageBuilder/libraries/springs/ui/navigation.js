sp.namespace("sp.ui.navigation.NavigationMenu");


sp.ui.navigation.NavigationMenu = sp.core.graphics.Graphic.extend
(
{
    __constructor:function(options,dataProvider)
    {
        this.__super();
        this.options = options || new sp.ui.navigation.NavigationMenu.Options();
        this.setDataProvider(dataProvider);
        this.init();
    },

    init:function()
    {
        this.addClass("sp_ui_navigation_menu");
        this.drawContent();
    },

    setDataProvider:function(dp)
    {
        this.dataProvider = dp || new sp.ui.navigation.NavigationMenu.DataProvider();
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.CHANGE, this.drawContent);
        this.drawContent();
    },

    drawContent:function()
    {
        this.clear();
        var dat = this.dataProvider.getData();
        this.ul = this.addElement(this.createElement("ul",{},["top_menu"]));
        for(var i=0; i<dat.length; i++)
        {
            $(this.ul).append(this.addItem(dat[i],true));
        }
        this.build();
    },

    build:function()
    {
        $(this.ul).jMenu(this.options);
    },

    addItem:function(dat,firstLevel)
    {
        var __this = this;
        var li = this.createElement("li");
        var a = this.createElement("a",{},[(firstLevel)? "fNiv" : ""],{},{},dat.Label || "");
        $(a).data("data",dat);
        $(a).click(function(){__this.onClick(this)});
        $(li).append(a);
        if(dat.Item)
        {
            var ul = this.createElement("ul");
            var items = sp.core.data.DataUtils.toArray(dat.Item);
            $(li).append(ul);
            for(var i=0; i<items.length; i++)
            {
                $(ul).append(this.addItem(items[i]));
            }
        }
        return li;
    },

    onClick:function(ui)
    {
        if(!$(ui).hasClass("fNiv")) $(this.ul).jMenu("close");
        this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.CLICK,$(ui).data("data")));
    }
}
);

sp.ui.navigation.NavigationMenu.Options = sp.core.data.ValueObject.extend
(
    {
        setDefaults:function()
        {
            this.ulWidth = 'auto';
            this.absoluteTop = 30;
            this.absoluteLeft = 0;
            this.effects = {effectSpeedOpen : 350,
                            effectSpeedClose : 350,
                            effectTypeOpen : 'slide',
                            effectTypeClose : 'slide',
                            effectOpen : 'linear',
                            effectClose : 'linear'};
            this.TimeBeforeOpening = 200;
            this.TimeBeforeClosing = 200;
            this.animatedText = false;
            this.paddingLeft = 7;
            this.openClick = false;
        }
    }
)


sp.ui.navigation.NavigationMenu.DataProvider = sp.core.events.EventDispatcher.extend
(
    {

        __constructor:function(data)
        {
            this.__super();
            this.data = data || [];
        },

        setData:function(data)
        {
            this.data = data || [];
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
        },

        getData:function()
        {
            return this.data;
        }
    }
)




/************************************************************************
 *************************************************************************
 @Name :       	jMenu - jQuery Plugin
 @Revison :    	1.8
 @Date : 		01/2012
 @Author:     	ALPIXEL - (www.myjqueryplugins.com - www.alpixel.fr)
 @Support:    	FF, IE7, IE8, MAC Firefox, MAC Safari
 @License :		Open Source - MIT License : http://www.opensource.org/licenses/mit-license.php

 **************************************************************************
 *************************************************************************/

/**
 @ IsHovered Plugin
 @ Thanks to Chad Smith fr his isHovered Plugin
 @ source : http://mktgdept.com/jquery-ishovered
 **/
;(function(b,c){b('*').hover(function(){b(this).data(c,1)},function(){b(this).data(c,0)}).data(c,0);b[c]=function(a){return b(a)[c]()};b.fn[c]=function(a){a=0;b(this).each(function(){a+=b(this).data(c)});return a>0}})(jQuery,'isHovered');


/** jMenu Plugin **/
(function($){

    $.jMenu = {
        /**************/
        /** OPTIONS **/
        /**************/
        defaults: {
            ulWidth : 'auto',
            absoluteTop : 30,
            absoluteLeft : 0,
            effects : {
                effectSpeedOpen : 350,
                effectSpeedClose : 350,
                effectTypeOpen : 'slide',
                effectTypeClose : 'slide',
                effectOpen : 'linear',
                effectClose : 'linear'
            },
            TimeBeforeOpening : 200,
            TimeBeforeClosing : 200,
            animatedText : false,
            paddingLeft: 7,
            openClick : false
        },

        /*****************/
        /** Init Method **/
        /*****************/
        init:function(target,options){
            /* vars **/
            this.target = target;
            opts = $.extend({}, $.jMenu.defaults, options);
            $(this.target).find('a:not(.fNiv)').each(function(){
                var $thisChild = $(this);

                /* Add css - arrow right */
                if($.jMenu._IsParent($thisChild))
                    $thisChild.addClass('isParent');

                /* Add the animation on hover **/
                if(opts.animatedText)
                    $.jMenu._animateText($thisChild);

                /* Actions on hover */
                if(!opts.openClick)
                    $thisChild.bind({
                        mouseover:function(){
                            $.jMenu._hide($thisChild);
                            $.jMenu._showNextChild($thisChild);
                        }
                    });
                else
                    $thisChild.bind({
                        click:function(){
                            $.jMenu._hide($thisChild);
                            $.jMenu._showNextChild($thisChild);
                        }
                    });
            });

            /* Actions on parents links */
            if(!opts.openClick)
                $(this.target).find('li a.fNiv').bind({
                    mouseover:function(){
                        var $this = $(this);
                        var $child = $this.next();
                        ULWidth = $.jMenu._returnUlWidth($this);
                        //$.jMenu._closeList($(this.target).find("ul"));
                        $.jMenu._killAll();
                        if($child.is(':hidden'))
                            $.jMenu._showFirstChild($this);
                    }
                });
            else
                $(this.target).find('li a.fNiv').bind({
                    click:function(e){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        var $this = $(this);
                        var $child = $this.next();
                        ULWidth = $.jMenu._returnUlWidth($this);
                        $.jMenu._closeList($(this.target).find("ul"));
                        if($child.is(':hidden'))
                            $.jMenu._showFirstChild($this);
                    }
                });
            /* Close all when mouse  leaves */
            $(this.target).bind({
                mouseleave : function(){
                    setTimeout(function(){$.jMenu._closeAll();},opts.TimeBeforeClosing);
                }
            });
        },


        /****************************
         *****************************
         jMenu Methods Below
         *****************************
         ****************************/

        /** Show the First Child Lists **/
        _showFirstChild:function(el){

            if($.jMenu._IsParent(el))
            {
                var SecondList = el.next();

                if(SecondList.is(":hidden"))
                {
                    var position = el.position();

                    SecondList
                        .css({
                        top : position.top + opts.absoluteTop,
                        left : position.left + opts.absoluteLeft,
                        width : ULWidth
                    })
                        .children().css({
                            width: ULWidth
                        });

                    $.jMenu._show(SecondList);
                }
            }
            else
                return false;
        },

        /** Show all others Child lists except the first list **/
        _showNextChild:function(el){
            if($.jMenu._IsParent(el))
            {
                var ChildList = el.next();
                if(ChildList.is(":hidden"))
                {
                    var position = el.position();

                    ChildList
                        .css({
                        top : position.top,
                        left : position.left + ULWidth,
                        width : ULWidth
                    })
                        .children().css({
                            width:ULWidth
                        });
                    $.jMenu._show(ChildList);

                }
            }
            else
                return false;
        },


        /**************************************/
        /** Short Methods - Generals actions **/
        /**************************************/
        _hide:function(el){
            if($.jMenu._IsParent(el) && !el.next().is(':hidden'))
                $.jMenu._closeList(el.next());
            else if(($.jMenu._IsParent(el) && el.next().is(':hidden')) || !$.jMenu._IsParent(el))
                $.jMenu._closeList(el.parent().parent().find('ul'));
            else
                return false;
        },

        _show:function(el) {
            switch(opts.effects.effectTypeOpen)
            {
                case 'slide':
                    el.stop(true, true).delay(opts.TimeBeforeOpening).slideDown(opts.effects.effectSpeedOpen, opts.effects.effectOpen);
                    break;
                case 'fade':
                    el.stop(true, true).delay(opts.TimeBeforeOpening).fadeIn(opts.effects.effectSpeedOpen, opts.effects.effectOpen);
                    break;
                default :
                    el.stop(true, true).delay(opts.TimeBeforeOpening).show();
            }
        },

        _closeList:function(el) {
            switch(opts.effects.effectTypeClose)
            {
                case 'slide':
                    el.stop(true,true).slideUp(opts.effects.effectSpeedClose, opts.effects.effectClose);
                    break;
                case 'fade':
                    el.stop(true,true).fadeOut(opts.effects.effectSpeedClose, opts.effects.effectClose);
                    break;
                default :
                    el.hide();
            }

        },

        _closeAll:function(){
            if(!$(this.target).isHovered()) {
                $(this.target).find('ul').each(function(){
                    $.jMenu._closeList($(this));
                });
            }
        },

        _killAll:function()
        {
            $(this.target).find('ul').each(function()
            {
                $(this).hide();
            });
        },

        _IsParent:function(el) {
            if(el.next().is('ul')) return true;
            else return false;
        },

        _returnUlWidth:function(el) {
            switch(opts.ulWidth) {
                case "auto" :
                    ULWidth = parseInt(el.parent().outerWidth());
                    break;
                default :
                    ULWidth = parseInt(opts.ulWidth);
            }
            return ULWidth;
        },

        _animateText:function(el) {
            var paddingInit = parseInt(el.css('padding-left'));

            el.hover(function(){
                $(this)
                    .stop(true,true)
                    .animate({
                        paddingLeft: paddingInit + opts.paddingLeft
                    }, 100);
            }, function(){
                $(this)
                    .stop(true,true)
                    .animate({
                        paddingLeft:paddingInit
                    }, 100);
            });
        },

        _isReadable:function(){
            if($("a.fNiv").length > 0)	return true;
            else return false;
        },

        _error:function(){
            alert('Please, check you have the \'.fNiv\' class on your first level links.');
        }
    };

    var methods =
    {
        close:function()
        {
            $.jMenu._killAll();
        }
    }

    jQuery.fn.jMenu = function(method)
    {
        if ( methods[method] )
        {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === 'object' || ! method )
        {
            $.jMenu.init(this,method );
        }
        else
        {
            $.error( 'Method ' +  method + ' does not exist on jQuery.jMenu' );
        }
    };
})(jQuery);