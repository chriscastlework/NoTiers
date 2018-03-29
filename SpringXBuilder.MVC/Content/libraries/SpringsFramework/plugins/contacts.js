/* Requires

    sp.core.events.EventDispatcher
    sp.ui.dialogs.Dialog
    sp.core.data.SelectionDataOptions
    sp.core.data.SelectionData

*/
sp.namespace("plugins.contacts.ContactData",
             "plugins.contacts.ContactData",
             "plugins.contacts.ContactList",
             "plugins.contacts.ContactTypes");

plugins.contacts.ContactData = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(xml)
        {
            this.__super();
            this.data = {};
            var childNodes = sp.utils.XMLUtils.childNodes($(xml).find("contacts")[0]);
            for(var i=0; i<childNodes.length; i++)
            {
                var contact = new plugins.contacts.Contact(childNodes[i]);
                this.data[contact.getID()] = contact;
            }
            var contactsRecordSet = this.getContactsRecordSet();
            contactsRecordSet.addEventListener(this,sp.core.data.DataEvent.SET,this.onContactsLoaded);
            plugins.contacts.ContactData.__INSTANCE = this;
        },

        onContactsLoaded:function()
        {
            var contactsRecordSet = this.getContactsRecordSet();
            if(contactsRecordSet)
            {
                var savedContacts = contactsRecordSet.getData();
                for (var i = 0; i < savedContacts.length; i++)
                {
                    var contact = this.recordToContact(savedContacts[i]);
                    if(!this.data[contact.getID()]) this.data[contact.getID()] = contact; // resource contacts are 'crm-fresh' and always take precedence
                }
                var DataEvent = sp.core.data.DataEvent;
                this.dispatchEvent(new DataEvent(this, DataEvent.CHANGE));
            }
        },

        contactToRecord:function(contact)
        {
            var record = this.getContactsRecordSet().create();
            record.setData(contact.getData());
            return record;
        },

        recordToContact:function(record)
        {
            var contact = new plugins.contacts.Contact();
            contact.set("id",record.getID());
            contact.set("name",record.getElementValue("name"));
            contact.set("type",record.getElementValue("type") || "e");
            contact.set("firstname", record.getElementValue("firstname") || "");
            contact.set("lastname", record.getElementValue("lastname") || "");
            contact.set("title", record.getElementValue("title") || "");
            contact.set("location", record.getElementValue("location") || "");
            contact.set("account", record.getElementValue("account") || "");
            contact.set("company", record.getElementValue("company") || "");
            return contact;
        },

        addContact:function(contact)
        {
            contact.set("added","true");
            // we override the selected contact with the contact from POST request
            this.data[contact.getID()] = contact;
            this.getContactsRecordSet().add(this.contactToRecord(contact));
            this.dispatchEvent(new sp.core.data.DataEvent(this,sp.core.data.DataEvent.CHANGE));
        },

        getContactsRecordSet:function()
        {
            var recordset = spx.Model.getRecordModel().getElementByID("contacts");
            if(!recordset)
            {
                var xml = sp.utils.XMLUtils.strToXML(
                    "<recordset id='contacts'>" +
                        "<record id='contact'>" +
                            "<field id='name'/>" +
                            "<field id='firstname'/>" +
                            "<field id='lastname'/>" +
                            "<field id='title'/>" +
                            "<field id='location'/>" +
                            "<field id='type'/>" +
                            "<field id='account'/>" +
                            "<field id='company'/>" +
                            "<field id='added'/>" +
                        "</record>" +
                    "</recordset>");
                recordset = new spx.model.datastructure.RecordSet(xml);
                spx.Model.getRecordModel().addElement(recordset);
            }
            return recordset;
        },

        getContacts:function(filter)
        {
            var result = [];
            for(var prop in this.data)
            {
                if(this.data[prop].matchesFilter(filter)) result.push(this.data[prop]);
            };
            return result;
        },

        getContactJSONObjects:function(filter)
        {
            //returns the core hashmaps from each contact object, without the wrapper class and its methods..
            var contacts = this.getContacts(filter);
            var result = [];
            for(var i=0; i<contacts.length; i++) result.push(contacts[i].getData());
            return result;
        },

        getContact:function(id)
        {
            return this.data[id];
        },

        getContactSelection:function(filter)
        {
            var contacts = this.getContactJSONObjects(filter);
            var options = new sp.core.data.SelectionDataOptions({ labelProp: "label", idProp: "id", clearableSelection: false });
            return new sp.core.data.SelectionData(contacts, options);
        },

        search:function(appletParams, contactType)
        {
            var contactSearchDialog = new ws.applet.ContactSearchDialog(appletParams, contactType);
            contactSearchDialog.open();
        },

        toString:function()
        {
            var str = "[Contacts:";
            for (var i = 0; i < this.data.length; i++)
            {
                str += "\n\t" + this.data[i];
            }
            str += "]";
            return str;
        }
    }
);
plugins.contacts.ContactData.getInstance = function()
{
    if(!plugins.contacts.ContactData.__INSTANCE) plugins.contacts.ContactData.__INSTANCE = new plugins.contacts.ContactData();
    return plugins.contacts.ContactData.__INSTANCE;
};

plugins.contacts.Contact = spx.model.DataWrapper.extend
(
    {
        __constructor:function(xml)
        {
            this.__super(xml);
            if(!this.data.id) this.data.id = sp.guid();
            if(!this.data.type) this.data.type = plugins.contacts.ContactTypes.EXTERNAL;
        },

        matchesFilter:function(filter)
        {
           if(!filter) return true;
           for(var prop in filter) if(this.data[prop]!=filter[prop]) return false;
           return true;
        },

        setID:function(id)
        {
            // TODO this will need to be in log / debug ..if(!id) sp.out("A contact was created without a valid id");
            this.data.id = id;
        },

        getID:function()
        {
             return this.data.id;
        },

        getName:function()
        {
          return this.get("name");
        },

        getFirstName:function()
        {
            return this.get("firstname");
        },

        getLastName:function()
        {
            return this.get("lastname");
        },

        getType:function()
        {
            return this.get("type");
        },

        getEmail:function()
        {
            return this.get("email");
        },

        getTitle:function()
        {
            return this.get("title");
        },

        getLocation:function()
        {
            return this.get("location");
        },

        getInitials:function()
        {
            if(this.getProperty("initials")) return this.getProperty("initials");
            var ns = this.getName();
            var inits="";
            for(var i=0; i<ns.length; i++) if(ns.charCodeAt(i)>=65 && ns.charCodeAt(i)<=90) inits += ns.substr(i,1);
            return inits || ns.substr(0,1);
        },

        getDetails: function(details)
        {
            details = (details || 'name').split(',');
            var labels = [];
            for (var i= 0, d=details[i]; i < details.length; i++, d = details[i])
            {
                var label = this.get(d);
                if (label) labels.push(label);
            }
            return labels.join(', ');
        },

        saveXML:function()
        {
            var str = "<contact>";
            for(var prop in this.data)
            {
                str += sp.utils.XMLUtils.getNode(prop, this.data[prop]);
            }
            str += "</contact>";
            return str;
        },

        getData:function()
        {
            var result = {};
            for(var prop in this.data) result[prop] = this.data[prop];
            return result;
        },

        toString:function()
        {
            var str = "[Contact:\t";
            for(var prop in this.data)
            {
                str += "\n\t\t\t" + prop + ":" + this.data[prop]
            }
            str += "\n]";
            return str;
        }
    }
);

plugins.contacts.ContactSearchDialog = sp.ui.dialogs.Dialog.extend
(
    {
        __constructor: function(appletParams, options)
        {
            this.appletParams = appletParams;
            this.options = options;
            this.__super();
            this.init();
        },

        init: function()
        {
            var str = function(a,b) {return spx.model.Strings.getInstance().getLocalOr(a,b)};

            $(this.getGraphic()).addClass("contactSearchDialog");
            this.inputArea = this.addElement(this.create("div", {classes: ["inputArea"]}));
            this.resultArea = this.addElement(this.create("div", {classes: ["resultArea"], css:{'min-height': '180px'}}));

            this.inputArea.addElement(this.createElement("div", {}, ["label"], null, null, str('WS_4_12', 'First Name')));
            this.name = this.inputArea.addElement(this.createElement("input", { type: "text", "margin-right": "4px" }, ["input", "search_firstname"]));

            this.inputArea.addElement(this.createElement("div", {}, ["label"], null, null, str('WS_4_13', 'Last Name')));
            this.lastName = this.inputArea.addElement(this.createElement("input", { type: "text", "margin-right": "4px" }, ["input", "search_lastname"]));

            this.inputArea.addElement(this.createElement("div", {}, ["label"], null, null, str('WS_4_14', 'Account')));
            this.account = this.inputArea.addElement(this.createElement("input", { type: "text", "margin-right": "4px" }, ["input", "search_account"]));

            this.search = this.inputArea.addElement(this.createElement("button", {}, ["search"], null, null, str('WS_4_5', 'Search')));

            this.resultTable = this.resultArea.addElement(this.createElement("div", {'margin-top': '6px', float: 'left', width: '100%'}, ["result"]));
            this.messageContainer = this.createElement("div", {'margin-top': '6px', 'text-align': 'center', float: 'left', width: '100%'});
            $(this.resultArea.getGraphic()).append(this.messageContainer);

            var __this = this;
            $(this.search).click(function() { __this.startSearch() });

            var options = new sp.ui.table.TableOptions();
            options.props = ["ContactFirstName", "ContactLastName", "ContactTitle", "ContactAccount", "ContactLocation"];
            options.labels = [
                str('WS_4_12', 'First Name'),
                str('WS_4_13', 'Last Name'),
                str('WS_4_15', 'Title'),
                str('WS_4_14', 'Account'),
                str('WS_4_16', 'Location')
            ];
            options.widths = ["20%", "20%", "20%", "20%", "20%"];
            this.table = new sp.ui.table.Table(this.resultTable, options);
            this.table.addEventListener(this, sp.core.events.MouseEvent.DOUBLECLICK, this.onClickTable);
            $(this.table.rowContainer).css('max-height', '250px');
        },

        getSettings: function()
        {
            return {title: spx.model.Strings.getInstance().getLocalOr("WS_4_3","Search for a new contact"), width: 400, height: 500};
        },

        getSelectedContact: function()
        {
            return this.table.getSelectedRowData();
        },

        onBeforeOK: function()
        {
            var c = this.getSelectedContact();
            if (!c) return;
            var XMLUtils = sp.utils.XMLUtils;
            var contact = new plugins.contacts.Contact(null);
            contact.data.id = c.ContactID;
            contact.data.name = XMLUtils.toNumberOfHtmlEscapes(c.ContactName, 0);
            contact.data.firstname = XMLUtils.toNumberOfHtmlEscapes(c.ContactFirstName, 0);
            contact.data.lastname = XMLUtils.toNumberOfHtmlEscapes(c.ContactLastName, 0);
            contact.data.location = XMLUtils.toNumberOfHtmlEscapes(c.ContactLocation, 0);
            contact.data.title = XMLUtils.toNumberOfHtmlEscapes(c.ContactTitle, 0);
            contact.data.account = XMLUtils.toNumberOfHtmlEscapes(c.ContactAccount, 0);
            contact.data.company = XMLUtils.toNumberOfHtmlEscapes(c.ContactCompany, 0);
            contact.data.type = XMLUtils.toNumberOfHtmlEscapes(c.ContactType.toLowerCase(), 0);

            plugins.contacts.ContactData.getInstance().addContact(contact);
        },

        onClickTable: function(event)
        {
            this.onOK();
        },

        getSearchString: function()
        {
            return $(this.name).val();
        },

        getPreloader: function()
        {
            var preloaderPath = this.options.getPreloader();
            if (!this.preloader) this.preloader = new sp.ui.preloader.Preloader(new sp.ui.preloader.PreloaderOptions({ container: this.getGraphic(), imageURL: preloaderPath }));
            return this.preloader;
        },

        startSearch: function()
        {
            this.getPreloader().show();
            var crmKey = this.appletParams.CRMKEY || '';
            this.appletParams.CRMKEY = crmKey.replace(/~~/g,'<').replace(/!!/g, '>');
            var comms = new sp.core.comms.Comms(this.appletParams);
            comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSearchResult);
            var search = $(this.name).val();
            var lastname = $(this.lastName).val();
            var account = $(this.account).val();
            var type = this.options.getType().toUpperCase();
            var url = this.appletParams.CONTACTSEARCH + '?search=' + spx.encode(search) + '&type=' + type;
            if (lastname) url += '&lastname=' + spx.encode(lastname);
            if (account) url += '&accountname=' + spx.encode(account);

            comms.load(url);
        },

        showMessage: function(msg)
        {
            $(this.messageContainer).text(msg);
        },

        showMessageInDialog: function(msg)
        {
            var options = new sp.ui.dialogs.MessageDialogOptions({ message: msg });
            var dialog = new sp.ui.dialogs.MessageDialog(options);
            dialog.open();
        },

        onOpen: function()
        {
            this.showMessage('');
        },

        onSearchResult: function(event)
        {
            var str = function(a,b) {return spx.model.Strings.getInstance().getLocalOr(a,b)};
            var DataUtils = sp.core.data.DataUtils;
            this.preloader.hide();
            this.showMessage('');
            if (event.success)
            {
                var contacts = DataUtils.toArray(DataUtils.valueAtPath(event.target, 'parsedData.Contacts.Contact'));
                this.table.setDataProvider(contacts);
                if (contacts.length)
                {
                    var xml = event.target.parsedData.XML;

                    var message = xml? xml.Message : '';
                    if (message) this.showMessageInDialog(message);
                }
                else
                {
                    this.showMessage(str('WS_7_3','No contacts found.'));
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

plugins.contacts.ContactDataEvent = sp.core.events.Event.extend
(
    {
        __constructor: function(type, id)
        {
            this.__super(type);
            this.id = id;
        }
    }
);
plugins.contacts.ContactDataEvent.CONTACT_ADDED = "contact_added";
plugins.contacts.ContactDataEvent.CONTACT_REMOVED = "contact_removed";

plugins.contacts.ContactSelector = spx.controller.ComboController.extend
(
    {
        __init:function()
        {
            this.options = spx.model.resources.Resources.getResourceByID(this.data.getAttribute("options")) || new plugins.contacts.ContactSelectorOptions();
            this.details = (this.data.getAttribute('details') || 'name').split(',');
            plugins.contacts.ContactData.getInstance().addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onContactDataChange);
            this.__super();
        },

        onContactDataChange: function()
        {
            this.selection.setDataProvider(this.getSelectionData());
        },

        onChange:function()
        {
            if(this.selection.getSelectedValue()=="SEARCH")
            {
                this.selection.setSelectedValue("");
                var contactSearchDialog = new plugins.contacts.ContactSearchDialog(spx.AppletParameters, this.options);
                contactSearchDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onDialog);
                contactSearchDialog.open();
            }
            else
            {
                if(this.model && this.model.setData) this.model.setData(this.getData());
            }
        },

        onDialog: function(event)
        {
            if (event.result == sp.ui.dialogs.Dialog.OK)
            {
                if(this.model && this.model.setData)
                {
                    this.model.setData(event.target.getSelectedContact().ContactID);
                }
                else
                {
                    this.setData(event.target.getSelectedContact().ContactID);
                }
                this.dispatchEvent(new ws.applet.ContactSelectorEvent(this,ws.applet.ContactSelectorEvent.CONTACT_SELECTED));
            }
        },

       getSelectionData:function()
       {
           var filter = {};
           if (this.options.getType() && this.options.getType() != 'all') filter.type = this.options.getType()
           var selectionData = plugins.contacts.ContactData.getInstance().getContactSelection(filter);
           var __this = this;
           $.each(selectionData.data, function(index, item){
               var details = $.map(__this.details, function(prop){ return item[prop] || ''; });
               details = $(details).filter(function(index, item){ return item != ''; }).toArray();
               item.label = details.join(', ');
           });

           selectionData.prepend({label:"",id:""});
           selectionData.prepend({label:spx.model.Strings.getInstance().getLocalOr("WS_4_5", "Search"), id:"SEARCH"});
           return selectionData;
       }
    }
);

plugins.contacts.ContactSelectorOptions = spx.model.DataWrapper.extend
(
    {
        __constructor:function(xml)
        {
            this.__super(xml);
        },

        getType:function()
        {
            return this.get("type");
        },

        getDisplayProperties:function()
        {
            return this.get("displayproperties");
        },

        getSearchLabel:function()
        {
            return this.get("searchlabel");
        },

        getPreloader:function()
        {
            return this.get("preloader");
        },

        createContactString:function(contact)
        {

        }
    }
);

plugins.contacts.ContactTypes =
{
    EXTERNAL:"e",
    INTERNAL:"i",
    ALL:""
};

plugins.contacts.ContactSelectorEvent = sp.core.events.Event.extend({});
plugins.contacts.ContactSelectorEvent.CONTACT_SELECTED = "contact_selector_select";
