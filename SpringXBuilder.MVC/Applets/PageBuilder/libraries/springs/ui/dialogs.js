sp.namespace("sp.ui.dialogs.Dialog",
             "sp.ui.dialogs.DialogEvent",
             "sp.ui.dialogs.PrintDialog",
             "sp.ui.dialogs.MessageDialogOptions",
             "sp.ui.dialogs.MessageDialog",
             "sp.ui.dialogs.ConfirmDialog",
             "sp.ui.dialogs.ErrorDialogOptions",
             "sp.ui.dialogs.ErrorDialog",
             "sp.ui.dialogs.AboutDialog",
             "sp.ui.dialogs.AboutDialogOptions",
             "sp.ui.dialogs.SelectionDialog",
             "sp.ui.dialogs.SelectionDialogOptions");


sp.ui.dialogs.Dialog = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(dialogElement, options)
    {
        if (!dialogElement)
        {
            dialogElement = document.createElement("div");
            $($("body")[0]).append(dialogElement);
        }
        this.__super(dialogElement);
        this.options = this.options || options || {};
        this.dialog = $(dialogElement).dialog(this.getDefaultSettings());
        this.addDialogClass("sp_dialog");
        $(this.getGraphic()).siblings(".ui-dialog-titlebar").find(".ui-dialog-titlebar-close").click($.proxy(this.onCloseButtonClick,this));
        this.data = {};
    },

    getDefaultSettings: function()
    {
        var __this = this;
        var settings = { autoOpen: false, draggable: true, buttons: this.getButtonOptions(), modal: true, resize: function(event, ui) { __this.draw() } };
        var overridden = this.getSettings() || {};
        for (var prop in overridden)
        {
            settings[prop] = overridden[prop];
        }
        return $.extend(settings, this.options);
    },

    addDialogClass:function(cls)
    {
        $(this.dialog).dialog("option","dialogClass",$(this.dialog).dialog("option","dialogClass")+" "+cls);
    },

    getSettings: function()
    {
        return {};
    },

    getButtonOptions: function()
    {
        var locale = sp.core.locale.getLocale();
        var okLabel     = locale.getString('WS_3_1', 'OK');
        var cancelLabel = locale.getString('WS_3_2', 'Cancel');
        var result = {};
        var __this = this;
        result[okLabel] = function() { __this.onOK(); };
        result[cancelLabel] = function() { __this.onCancel(); };

        return result;
    },

    onCloseButtonClick:function(event)
    {
        this.onCancel();
        event.preventDefault();
    },

    onBeforeOK: function()
    {

    },

    onBeforeClose: function()
    {

    },

    onOK: function()
    {
        if(this.onBeforeOK()) return;
        this.dispatchEvent(new sp.ui.dialogs.DialogEvent(this, sp.ui.dialogs.DialogEvent.CLOSE, sp.ui.dialogs.Dialog.OK));
        this.close();
    },

    onCancel: function()
    {
        this.dispatchEvent(new sp.ui.dialogs.DialogEvent(this, sp.ui.dialogs.DialogEvent.CLOSE, sp.ui.dialogs.Dialog.CANCEL));
        this.close();
    },

    close: function()
    {
        $(this.dialog).dialog('close');
        this.data = {};
    },

    open: function(modal)
    {
        this.onOpen();
        $(this.dialog).dialog('open');
       //this.populate();
    },

    onOpen: function()
    {

    },

    setData: function(dat)
    {
        this.data = dat || {};
        this.populate();
    },

    populate: function()
    {
        // overwrite to populate fields with data..
    },

    getData: function()
    {
        return {};
    }
}
);
sp.ui.dialogs.Dialog.OK = "dialog_ok";
sp.ui.dialogs.Dialog.CANCEL = "dialog_cancel";
/* TODO - deprecate method below?... */
sp.ui.dialogs.Dialog.getDialogLayer = function()
{
    if(!sp.ui.dialogs.Dialog.dialogLayer)
    {
        sp.ui.dialogs.Dialog.dialogLayer = document("create")
    }
}

sp.ui.dialogs.DialogEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, result)
    {
        this.__super(target, type);
        this.result = result;
    }
}
);
sp.ui.dialogs.DialogEvent.DISMISS = "dialog_dismiss";
sp.ui.dialogs.DialogEvent.OPEN = "dialog_open";
sp.ui.dialogs.DialogEvent.CLOSE = "dialog_close";


sp.ui.dialogs.PrintDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function(dialogElement, title, refData)
    {
        this.title = title;
        this.refData = sp.core.data.DataUtils.toArray(refData);
        this.__super(dialogElement);
        this.init();
    },

    getDefaultSettings: function()
    {
        var settings = { autoOpen: false, draggable: true, buttons: this.getButtonOptions(), modal: true, title:this.title };
        var overridden = this.getSettings() || {};
        for (var prop in overridden)
        {
            settings[prop] = overridden[prop];
        }
        return settings;
    },

    init: function()
    {
        this.container = this.addElement(this.createElement("div", { id: "printDialogContainer" }, ["printDialogContainer"]));
        this.options = [];
        this.checkboxes = [];
        for (var i = 0; i < this.refData.length; i++)
        {
            var option = this.createOption(this.refData[i]);
            $(this.container).append(option);
            this.options.push(option);
        }
    },

    createOption: function(dat)
    {
        var div = this.createElement("div", {}, ["printOption"], { id: dat.ID });
        var selector = null;
        if (dat.RBG != null)
        {
            selector = this.createElement("input", {}, [], { type: "radio", name: dat.RBG });
        }
        else
        {
            selector = this.createElement("input", {}, [], { type: "checkbox" });
            $(selector).prop("defaultValue", dat.checked);
            if ($(selector).prop("defaultValue")) $(selector).attr("checked", "checked");
            $(selector).change(function()
            {
                var chk = $(this);
                var nested = chk.next('div');
                if (chk.attr('checked') == 'checked')
                {
                    var par1 = chk.parent("div").parent("div").parent("div").last();
                    par1.children(":checkbox").first().attr({ checked: "checked" });
                    var par2 = chk.parent("div").parent("div").parent("div").parent("div").parent("div").last();
                    par2.children(":checkbox").first().attr({ checked: "checked" });
                    var par3 = chk.parent("div").parent('div').parent("div").parent("div").parent("div").parent("div").parent("div").last();
                    par3.children(":checkbox").first().attr({ checked: "checked" });
                    nested.find(":checkbox").attr({ checked: "checked" });
                }
                else
                {
                    nested.find(":checkbox").attr({ checked: false });
                }
            });
        }
        $(div).prop("checkbox", selector);
        $(div).append(selector);
        $(div).append(dat.Label);
        var refData = sp.core.data.DataUtils.toArray(dat.Option);
        if (refData.length)
        {
            var odiv = this.createElement("div", {}, ["subSection"]);
            for (var i = 0; i < refData.length; i++)
            {
                var option = this.createOption(refData[i]);
                $(odiv).append(option);
                this.options.push(option);
            }
        }
        $(div).append(odiv);
        this.checkboxes.push(selector);
        return div;
    },

    onOpen: function()
    {
        for (var i = 0; i < this.checkboxes.length; i++)
        {
            if (sp.core.data.DataUtils.toBoolean($(this.checkboxes[i]).prop("defaultValue")))
            {
                $(this.checkboxes[i]).attr("checked", "checked");
            }
            else
            {
                $(this.checkboxes[i]).removeAttr("checked");
            }
        }
    },

    getData: function()
    {
        var result = [];
        for (var i = 0; i < this.options.length; i++)
        {
            var option = this.options[i];
            result.push({ ID: $(option).prop("id"), checked: ($(option.checkbox).attr("checked")) ? true : false });
        }
        return result;
    },

    getXML: function()
    {
        var result = this.getData();
        var xmlStr = "";
        for (var i = 0; i < result.length; i++)
        {
            xmlStr += "<Option id='" + result[i].ID + "' checked='" + result[i].checked + "'/>";
        }
        return xmlStr;
    }
}
);

sp.ui.dialogs.MessageDialogOptions = sp.core.data.ValueObject.extend
(
{
    __constructor:function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults:function()
    {
        this.message = "";
        this.icon = "";
        this.contentClass = "messageDialogContent";
    }
}
);

sp.ui.dialogs.MessageDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function(options)
    {
        this.__super(null, options);
        this.options = options || new sp.ui.dialogs.MessageDialogOptions();
        this.init();
    },

    init: function()
    {
        this.content = this.addElement(this.createElement("div", {}, [this.options.contentClass], { id: "content" }));
        if (this.options.icon)
        {
            this.icon = this.createElement("img", {}, [], { id: "icon", src: this.options.icon });
            $(this.content).append(this.icon);
        }
        this.message = this.createElement("div", {}, [], { id: "message" });
        $(this.message).html(this.options.message);
        $(this.content).append(this.message);
    },

    getSettings: function()
    {
        var locale = sp.core.locale.getLocale();
        return { title: this.options.title || locale.getString('WS_5_4', 'Warning!')};
    },

    getButtonOptions: function()
    {
        //var __this = this;
        //return { "OK": function() { __this.onOk(); } }
        return {};
    }
}
);

sp.ui.dialogs.ConfirmDialog = sp.ui.dialogs.MessageDialog.extend
(
{
    __constructor: function(options)
    {
        this.__super(options);
    },

    getSettings: function()
    {
        var locale = sp.core.locale.getLocale();
        return { title: this.options.title || locale.getString('WS_5_4', 'Warning!')};
    },

    getButtonOptions: function()
    {
        var locale = sp.core.locale.getLocale();
        var yesLabel = locale.getString('WS_3_4', 'YES');
        var noLabel  = locale.getString('WS_3_5', 'NO');

        var result = {};
        var __this = this;
        result[yesLabel] = function() { __this.onOK(); };
        result[noLabel] = function() { __this.onCancel(); };

        return result;
    }
}
);

sp.ui.dialogs.ErrorDialogOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.__super();
        this.error = "";
        this.errorContentClass = "errorContent";
    }
}
);

sp.ui.dialogs.ErrorDialog = sp.ui.dialogs.MessageDialog.extend
    (
{
    __constructor: function(options)
    {
        this.__super(options);
    },

    init: function()
    {
        var locale = sp.core.locale.getLocale();

        this.__super();
        this.errorMessage = this.createElement("div", {}, [this.options.errorContentClass]);
        var __this = this;
        this.link = this.createElement("a", {}, [], { href: "#" });
        var moreLabel = locale.getString('ERROR_DIALOG_MORE', 'More...');
        $(this.link).html(moreLabel);
        $(this.link).click(function() { __this.onClickErrorLink() });
        $(this.errorMessage).append(this.link);
        var para = this.createElement("p");
        $(para).html(this.options.error);
        $(this.errorMessage).append(para);
        $(this.content).append(this.errorMessage);
    },

    onClickErrorLink: function()
    {
        var locale = sp.core.locale.getLocale();
        var moreLabel = locale.getString('ERROR_DIALOG_MORE', 'More...');
        var lessLabel = locale.getString('ERROR_DIALOG_LESS', 'Less...');

        if ($(this.errorMessage).hasClass("open"))
        {
            $(this.link).html(moreLabel);
            $(this.errorMessage).removeClass("open");
        }
        else
        {
            $(this.link).html(lessLabel);
            $(this.errorMessage).addClass("open");
        }
    }
}
);

sp.ui.dialogs.AboutDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function(options)
    {
        this.options = options || new sp.ui.dialogs.AboutDialogOptions();
        this.__super();
        this.init();
    },

    init: function()
    {
        this.__super();
        var opt = this.options;

        if (opt.logo.src != '')
        {
            var attrs = {};
            for (prop in opt.logo)
            {
                attrs[prop] = opt.logo[prop];
            }
            this.logo = this.addElement(this.create("img", { attributes: attrs }));
        }

        this.content = this.addElement(this.createElement("div", {padding: '10px 5px'}));
        var html = opt.product + '<br>' + opt.version + '<br><br>' + opt.message + '<br><br>' + opt.copyrightMessage;
        $(this.content).html(html);
    },

    getSettings: function()
    {
        return { title: this.options.title, width: this.options.width, height: this.options.height};
    },

    getButtonOptions: function()
    {
        var locale = sp.core.locale.getLocale();
        var ok = locale.getString('WS_3_1', 'OK');
        var buttons = {};
        var __this = this;
        buttons[ok] = function() { __this.onOK(); };
        return buttons;
    },

    onOK: function()
    {
        this.close();
    }
}
);

sp.ui.dialogs.AboutDialogOptions = sp.core.data.ValueObject.extend
(
{
    __constructor:function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults:function()
    {
        var locale = sp.core.locale.getLocale();
        this.title = locale.getString('WS_2_9', 'About');
        this.width = 400;
        this.height = 300;
        this.logo = { 'src': '', 'alt': '', 'title': '' };
        this.version = '1.0';
        this.product = locale.getString('ABOUT_DIALOG_PRODUCT', 'White Springs Applet');
        this.message = '';
        var today = new Date();
        var defaultCopyright = 'Copyright &copy; 2012-' + today.getFullYear() + ' White Springs. All rights reserved.<br>www.white-springs.com';
        this.copyrightMessage = locale.getString('ABOUT_DIALOG_COPYRIGHT', defaultCopyright);
    }
}
);

sp.ui.dialogs.SelectionDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function(refData, options)
    {
        this.__super();
        this.selectionData = sp.core.data.DataUtils.toArray(refData);
        this.options = options || new sp.ui.dialogs.SelectionDialogOptions();
        this.init();
    },

    init: function()
    {
        this.selectedValues = [];
        this.notSelected = [];
        this.items = [];
        this.labels = [];

        this.table = this.addElement(this.createElement("table"));
        this.populate();
    },

    populate: function()
    {
        var __this = this;
        var opt = this.options;
        this.items = [];
        this.labels = [];

        $(this.table).empty();

        for (var i=0; i<this.selectionData.length; i++)
        {
            var tr = this.createElement("tr", {}, [opt.rowClass]);
            $(this.table).append(tr);

            var tdItem = this.createElement("td", {}, [opt.itemClass]);
            var domElId = 'selection_dialog_item_' + i + '_' + sp.guid();
            var checkboxItem = this.createElement('input', {}, [], {'type':'checkbox', 'value':this.selectionData[i][opt.idProp], 'id': domElId});
            this.items.push(checkboxItem);
            $(checkboxItem).change(function(){__this.onChange()});
            $(tdItem).append(checkboxItem);
            $(tr).append(tdItem);

            var tdLabel = this.createElement("td", {}, [opt.labelClass]);
            var checkboxLabel = this.createElement('label', {}, [], {'for': domElId});
            $(checkboxLabel).html(this.selectionData[i][opt.labelProp] || "&nbsp;");
            this.labels.push(this.selectionData[i][opt.labelProp] || "");
            $(tdLabel).append(checkboxLabel);
            $(tr).append(tdLabel);
        }
    },

    setSelectionData: function(data)
    {
        this.selectionData = sp.core.data.DataUtils.toArray(data);
        this.populate();
    },

    getSettings: function()
    {
        return { title: this.options.title || "Please select", resizable: this.options.resizable || false};
    },

    onChange: function()
    {
        var __this = this;
        this.selectedValues = [];
        this.selectedItemLabels = [];
        this.notSelected = [];

        $.each(__this.items, function(indx,item)
        {
            $(this).attr('disabled',false);
            if($(this).is(':checked'))
            {
                __this.selectedValues.push($(this).val());
                __this.selectedItemLabels.push(__this.labels[indx]);
            }
            else
            {
                __this.notSelected.push(this);
            }
        });

        if (this.selectedValues.length >= this.options.maxSelectedItems)
        {
            $.each(__this.notSelected, function(){
                $(this).attr('disabled',true);
            });
        }
    },

    setAsChecked: function(checkedItemsIDs)
    {
        var __this = this;
        var checkedItemsIDs = checkedItemsIDs || [];
        $.each(__this.items, function(cbIdx,checkbox){
            var checkboxValue = $(checkbox).val();
            for(var i=0, len=checkedItemsIDs.length; i<len; i++)
            {
                if (checkboxValue==checkedItemsIDs[i])
                {
                    $(checkbox).prop('checked',true);
                    return;
                }
            }
            $(checkbox).prop('checked', false);
        });
        this.onChange();
    },

    getData: function()
    {
        return this.selectedValues;
    },

    getSelectedItemLabels: function()
    {
        return this.selectedItemLabels;
    }
}
);

sp.ui.dialogs.SelectionDialogOptions = sp.core.data.ValueObject.extend
(
{
    __constructor:function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults:function()
    {
        this.maxSelectedItems = 1;
        this.idProp = "ID";
        this.labelProp = "Label";
        this.rowClass = "selection_dialog_table_row";
        this.itemClass = "selection_dialog_checkbox_cell";
        this.labelClass = "selection_dialog_label_cell";
    }
}
);

