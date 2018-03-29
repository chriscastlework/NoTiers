sp.namespace("ws.applet.ContactData",
             "ws.applet.ContactDataList",
             "ws.applet.ContactPropertyMap",
             "ws.applet.ContactFilter",
             "ws.applet.ContactType",
             "ws.applet.ContactSearchDialog",
             "ws.applet.ws.applet.ContactDataEvent",
             "ws.applet.ContactSelector");



ws.applet.ContactDataList = sp.core.data.IndexedDataList.extend
(
{
    updateItem: function(item)
    {
        if (this.getItemByProperty("ContactID", item.ContactID)) return;
        this.__super(item);
    }
}
);

ws.applet.ContactData = new ws.applet.ContactDataList();
ws.applet.ContactData.cleanData = function(dat)
{
    var result = [];
    var checkIfExists = function(contactID){ return $(result).filter(function(index, item){ return item.ContactID === contactID}).length > 0 };
    for (var i = 0; i < dat.length; i++) if (dat[i].ContactID && dat[i].ContactName && dat[i].ContactType && !checkIfExists(dat[i].ContactID)) result.push(dat[i]);
    return result;
};
ws.applet.ContactData.getExternalContacts=function()
{
	return this.getContacts(new ws.applet.ContactFilter({ContactType:ws.applet.ContactType.EXTERNAL}));
};
ws.applet.ContactData.getInternalContacts=function()
{
	return this.getContacts(new ws.applet.ContactFilter({ContactType:ws.applet.ContactType.INTERNAL}));
};
ws.applet.ContactData.getContacts=function(filter,propertyMap)
{
	var result = [];
	for(var i=0; i<this.__data.length; i++)
	{
		if(!filter || this.matchesFilter(filter,this.__data[i]))
		{
			var obj = {};
			if(propertyMap)
			{
				for(var prop in propertyMap)
				{
					obj[propertyMap[prop]] = this.__data[i][prop];
				}
			}
			else
			{
				for(var prop in this.__data[i])
				{
					obj[prop] = this.__data[i][prop];
				}
			}
			result.push(obj);
		}
	}
	return result;
};
ws.applet.ContactData.matchesFilter=function(filter,item)
{
	for(var prop in filter)
	{
		if(item[prop]!=filter[prop]) return false;
	}
	return true;
};
ws.applet.ContactData.getContactByID = function(id)
{
	for(var i=0; i<this.__data.length; i++)
	{
		if(this.__data[i].ContactID==id) return $.extend({}, this.__data[i]);
	}
	return null;
};
ws.applet.ContactData.getInitialsByID = function(contactID)
{
	var contact = this.getContactByID(contactID);
	if(!contact) return false;
	if(contact.ContactInitials) return contact.ContactInitials;
	var ns = contact.ContactName;
    var inits="";
    for(var i=0; i<ns.length; i++) if(ns.charCodeAt(i)>=65 && ns.charCodeAt(i)<=90) inits += ns.substr(i,1);
    return inits || ns.substr(0,1);
};
ws.applet.ContactData.getContactSelection = function(type)
{
    var contacts = (type == ws.applet.ContactType.INTERNAL) ? ws.applet.ContactData.getInternalContacts() : (type == ws.applet.ContactType.EXTERNAL) ? ws.applet.ContactData.getExternalContacts() : ws.applet.ContactData.getContacts();
    var options = new sp.core.data.SelectionDataOptions({ labelProp: "ContactName", idProp: "ContactID", clearableSelection: false });
    return new sp.core.data.SelectionData(contacts, options);
};
ws.applet.ContactData.getContactName = function(contactID)
{
	var contact = this.getContactByID(contactID);
	if(contact) return contact.ContactName || "";
	return "";
};
ws.applet.ContactData.getContactTitle = function(contactID)
{
    var contact = this.getContactByID(contactID);
    if (!contact) return "";
    if (typeof(contact.ContactTitle) != 'string') return "";
    return contact.ContactTitle || "";
};
ws.applet.ContactData.getPropertyFromID = function(contactID,prop)
{
	var contact = this.getContactByID(contactID);
	if(contact) return contact[prop] || "";
	return "";
};
ws.applet.ContactData.search = function(appletParams, contactType)
{
    var contactSearchDialog = new ws.applet.ContactSearchDialog(appletParams, contactType);
    contactSearchDialog.open();
};
ws.applet.ContactData.saveXML = function()
{
    var xmlStr = "<Contacts>";
    for (var i = 0; i < this.__data.length; i++)
    {
        xmlStr += "<Contact>";
        for (var prop in this.__data[i])
        {
            xmlStr += sp.utils.XMLUtils.createNode(prop,this.__data[i][prop]);
        }
        xmlStr += "</Contact>";
    }
    xmlStr += "</Contacts>";
    return xmlStr;
};


ws.applet.ContactPropertyMap = function(hash)
{
	this.ContactName = "ContactName";
	this.ContactID = "ContactID";
	for(var prop in hash) this[prop] = hash[prop];
};


ws.applet.ContactFilter = function(hash)
{
	this.ContactType = ws.applet.ContactType.EXTERNAL;
	for(var prop in hash) this[prop] = hash[prop];
};


ws.applet.ContactType =
{
	INTERNAL:"I",
	EXTERNAL:"E",
	ALL:"ALL"
};


ws.applet.ContactSearchDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function(appletParams, contactType)
    {
        this.appletParams = appletParams;
        this.contactType = contactType;
        this.__super();
        this.init();
    },

    init: function()
    {
        var locale = sp.core.locale.getLocale();
        
        $(this.getGraphic()).addClass("contactSearchDialog");
        this.inputArea = this.addElement(this.createElement("div", {}, ["inputArea"]));
        this.resultArea = this.addElement(this.createElement("div", {}, ["resultArea"]));
        this.name = this.createElement("input", { type: "text", "margin-right": "4px" }, ["input", "firstname"]);

        var searchLabel = locale.getString('CONTACT_DIALOG_SEARCH', 'Search');

        this.search = this.createElement("input", {}, ["search"], { type: "submit", value: searchLabel });
        this.label = this.createElement("div", {}, ["label"]);
        this.resultTable = this.createElement("div", {'min-height': '150px', 'margin-top': '6px'}, ["result"]);

        var searchForLabel = locale.getString('CONTACT_DIALOG_SEARCH_FOR', 'Search for...');

        $(this.label).html(searchForLabel);
        this.addElement(this.inputArea);
        this.addElement(this.resultArea);
        $(this.inputArea).append(this.label);
        $(this.inputArea).append(this.name);
        $(this.inputArea).append(this.search);
        $(this.resultArea).append(this.resultTable);
        var __this = this;
        $(this.search).click(function() { __this.startSearch() });

        var options = new sp.ui.table.TableOptions();
        options.props = ["ContactFirstName", "ContactLastName", "ContactTitle", "ContactAccount"];

        var firstNameLabel = locale.getString('CONTACT_DIALOG_FIRST_NAME', 'First Name');
        var lastNameLabel  = locale.getString('CONTACT_DIALOG_LAST_NAME', 'Last Name');
        var titleLabel     = locale.getString('CONTACT_DIALOG_TITLE', 'Title');
        var accountLabel   = locale.getString('CONTACT_DIALOG_ACCOUNT', 'Account');

        options.labels = [firstNameLabel, lastNameLabel, titleLabel, accountLabel];
        options.widths = ["25%", "25%", "25%", "25%"];
        this.table = new sp.ui.table.Table(this.resultTable, options);
        this.table.addEventListener(this, sp.core.events.MouseEvent.DOUBLECLICK, this.onClickTable);
        $(this.table.rowContainer).css('max-height', '150px');
    },

    getSelectedContact: function()
    {
        return this.table.getSelectedRowData();
    },

    onBeforeOK: function()
    {
        var c = this.getSelectedContact();
        if (c)
        {
            c.added = true;
            ws.applet.ContactData.updateItem(c);
        }
    },

    onClickTable: function(event)
    {
        this.onOK();
    },

    getSearchString: function()
    {
        return this.encode($(this.name).val());
    },

    getPreloader: function()
    {
        var appInstance = ws.applet.Applet.getInstance();
        var preloaderPath='';
        if (appInstance && typeof(appInstance.getPreloaderPath) == "function")
        {
            preloaderPath = appInstance.getPreloaderPath();
        }
        else
        {
            preloaderPath = "/SpringsFramework/res/images/main/preloader.gif";
        }
        if (!this.preloader) this.preloader = new sp.ui.preloader.Preloader(new sp.ui.preloader.PreloaderOptions({ container: this.getGraphic(), imageURL: preloaderPath, label: sp.core.locale.getString('CONTACT_PRELOADER_TEXT','Searching...')}));
        return this.preloader;
    },

    startSearch: function()
    {
        this.appletParams = this.appletParams || ws.applet.Applet.getInstance().getAppletParameters();
        this.getPreloader().show();
        var comms = new sp.core.comms.Comms(this.appletParams);
        comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSearchResult);
        comms.load(this.appletParams.CONTACTSEARCH, { search: this.getSearchString(), type: this.contactType });
    },

    encode: function(str)
    {
        try
        {
            return encodeURIComponent(str);
        }
        catch(e)
        {

        }
        return escape(str);
    },

    showMessage: function(msg)
    {
        var options = new sp.ui.dialogs.MessageDialogOptions({ message: msg });
        var dialog = new sp.ui.dialogs.MessageDialog(options);
        dialog.open();
    },

    onSearchResult: function(event)
    {
        var DataUtils = sp.core.data.DataUtils;
        this.preloader.hide();
        if (event.success)
        {
            var contacts = DataUtils.toArray(DataUtils.valueAtPath(event.target.parsedData, "Contacts.Contact"));
            this.table.setDataProvider(contacts);
            if (contacts.length)
            {
                var xml = event.target.parsedData.XML;

                var message = xml? xml.Message : '';
                if (message)
                {
                    this.showMessage(message);
                }
            }
            else
            {
                this.showMessage(sp.core.locale.getString('CONTACT_SEARCH_NORESULT'));
            }

        }
        else
        {
            //TODO: Fix this when Log/Error Log are all resolved...
            //ErrorLog.error(sp.core.locale.getString('CONTACT_SEARCH_ERROR'), event.target.parsedData.Message);
            //this.showMessage(sp.core.locale.getString('CONTACT_SEARCH_ERROR'));
        }

    }
}
);

ws.applet.ContactDataEvent = sp.core.events.Event.extend
(
{
    __constructor: function(type, id)
    {
        this.__super(type);
        this.id = id;
    }
}
);
ws.applet.ContactDataEvent.CONTACT_ADDED = "contact_added";
ws.applet.ContactDataEvent.CONTACT_REMOVED = "contact_removed";

ws.applet.ContactSelector = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(graphic, type, cantBeEmpty)
    {
        this.__super(graphic || this.createElement("select"));
        this.type = type || ws.applet.ContactType.EXTERNAL;
        this.cantBeEmpty = cantBeEmpty;
        this.init();
    },

    init: function()
    {
        ws.applet.ContactData.addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onContactsChanged);
        var __this = this;
        $(this.getGraphic()).change(function() { __this.onSelect() });
        this.onContactsChanged();
    },

    getSelection: function()
    {
        return ws.applet.ContactData.getContactSelection(this.type);
    },

    onContactsChanged: function(event)
    {
        var previouslySelectedID = this.getSelectedID();
        this.selection = this.getSelection();
        if (!this.cantBeEmpty) this.selection.prepend({ ContactID: "", ContactName: "" });
        this.selection.prepend({ ContactID: "SEARCH", ContactName: sp.core.locale.getString('CONTACT_DEFAULT_ITEM_SEARCH','SEARCH') });
        $(this.getGraphic()).empty().append(this.selection.getHTML());

        //if we have two contact selectors this will avoid deselecting the value selected in the other selector
        if (sp.utils.ArrayUtils.findElementByProperty(this.selection.data,'ContactID',previouslySelectedID))
        {
            this.setSelectedID(previouslySelectedID);
            return;
        }

        if(!this.cantBeEmpty)
        {
            this.setSelectedID("");
        }
        else
        {
            this.setSelectedID(this.selection.getValue(1));
        }

    },

    onSelect: function()
    {
        this.dispatchEvent(new ws.applet.ContactSelectorEvent(this,ws.applet.ContactSelectorEvent.CONTACT_SELECTED));
        if (this.getSelectedID() == "SEARCH")
        {
            if(!this.cantBeEmpty)
            {
                this.setSelectedID("");
            }
            else
            {
                this.setSelectedID(this.selection.getValue(1));
            }
            var contactSearchDialog = new ws.applet.ContactSearchDialog(ws.applet.Applet.getInstance().getAppletParameters(), this.type);
            contactSearchDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onDialog);
            contactSearchDialog.open();
        }
    },

    onDialog: function(event)
    {
        if (event.result == sp.ui.dialogs.Dialog.OK)
        {
            this.setSelectedID(event.target.getSelectedContact().ContactID);
            this.dispatchEvent(new ws.applet.ContactSelectorEvent(this,ws.applet.ContactSelectorEvent.CONTACT_SELECTED));
        }
    },

    getSelectedID: function()
    {
        return this.getGraphic().value;
    },

    setSelectedID: function(id)
    {
        this.getGraphic().value = id;
    },

    getSelectedName: function()
    {
        return this.selection.valueToLabel(this.getSelectedID());
    },

    setSelectedName: function(name)
    {
        this.getGraphic().value = this.selection.labelToValue(name);
    }
}
);

ws.applet.ContactSelectorEvent = sp.core.events.Event.extend({});
ws.applet.ContactSelectorEvent.CONTACT_SELECTED = "contact_selector_select";
