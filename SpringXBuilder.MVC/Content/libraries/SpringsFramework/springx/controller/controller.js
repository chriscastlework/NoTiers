sp.namespace("spx.controller.Controller");




spx.controller.Controller = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function(view,model)
        {
            this.__super();
            this.view = view;
            this.model = model;
            this.__init();
        
        },

        __init:function()
        {
            this.model.addEventListener(this,sp.core.data.DataEvent.LOADED, this.onDataLoaded);
        },

        onDataLoaded:function()
        {
            var applicationModel = this.model.getApplicationModel();
            var recordModel = this.model.getRecordModel();
            var refElements = applicationModel.getElements();
            this.elements = [];
            for(var i=0; i<refElements.length; i++)
            {
                var view = this.view.getElement(refElements[i].getID());
                var m = this.getModelForElement(recordModel, refElements[i]);
                this.elements.push(spx.controller.ControllerFactory.create(this,view, refElements[i], m));
            }
        },

        getModelForElement:function(recordModel,refElement)
        {
            var boundModel = recordModel.getElementByID(refElement.getDataSource());
            if(boundModel) return boundModel;
            var m =  (refElement.isAtomic() )? null : recordModel;
            return m;
        },

        getElementByID:function(id)
        {
            if(!id) return;
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return this.elements[i];
        },

        findElementByID:function(id)
        {
            if(!id) return;
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].getID()==id) return this.elements[i];
                var e = this.elements[i].findElementByID(id);
                if(e) return e;
            }
        }
    }
);

spx.controller.AbstractController = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function()
        {
            this.__super();
        },

        getType:function()
        {
            return "AbstractController";
        }
    }
);

spx.controller.ElementController = spx.controller.AbstractController.extend
(
    {
        __constructor:function(parent,view,data,model)
        {
            this.__super();
            this.parent = parent;
            this.view = view;
            this.data = data;
            this.model = model;
            //this.default = this.getDefault();
            if(this.data)
            {
                this.data.addEventListener(this,sp.core.data.DataEvent.LOADED, this.onDataChange);
                this.data.addEventListener(this,sp.core.data.DataEvent.CHANGE, this.onDataChange);
            }
            if (this.model) {
                this.model.addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onModelChange);
            }

            if(this.view) this.view.addEventListener(this,sp.core.events.UIEvent.CHANGE, this.onViewChange);
            this.elements = [];

            this.__init();
        },

        getDefault:function()
        {
            var defaultBinding = this.data.getRawAttribute('default');
            //sp.out("defaultBinding:" + defaultBinding);
            var evaluated = spx.evaluate(defaultBinding, this.data);
            //sp.out("evald" + evaluated);
            return evaluated;
        },

        getModelForElement:function(recordModel,refElement)
        {
            var boundModel = (recordModel && recordModel.getElementByID)? recordModel.getElementByID(refElement.getDataSource()) : null;
            if(boundModel) return boundModel;
            var m =  (refElement.isAtomic() )? null : recordModel;
            return m;
        },

        __init:function()
        {
            this.view.setEnabled(this.data.getEnabled());
            this.view.setVisible(this.data.getVisible());
            var elementData = this.data.getElements();
            for(var i=0; i<elementData.length; i++)
            {
                var view = this.view.getElement(elementData[i].getID());
                var m = this.getModelForElement(this.model,elementData[i]);//this.model)? (elementData[i].getBinding())? this.model.getElementByID(elementData[i].getBinding()) : this.model : null;
                this.elements.push(new spx.controller.ControllerFactory.create(this,view,elementData[i],m));
            }
            this.view.addEventListener(this,sp.core.events.UIEvent.CLICK, this.onClickView);
        },

        getState:function()
        {
            return this.view.getState();
        },

        setState:function(state)
        {
            this.view.setState(state);
        },

        cycleState:function(states)
        {
            this.view.cycleState(states);
        },

        onClickView:function() {
            if(this.data.getAction()) eval(this.data.getAction());
        },

        getBinding:function()
        {
            return this.data.getBinding();
        },

        isAtomic:function()
        {
            return this.data.isAtomic();
        },

        isValueEmpty: function (val)
        {
            //return sp.core.data.DataUtils.isUndefined(val);
            return (val)? false : true;
        },

        onModelChange: function()
        {
            if (this.model && this.model.getData)
            {
                var data = this.model.getData();
                if (this.isValueEmpty(data))
                {
                    try
                    {
                        data = this.getDefaultValue();
                    }
                    catch (e)
                    {

                    }
                }
                this.view.setData(data);
                var context = this.model;
                if (this.model.parent != undefined) {
                    if (this.model.parent.getType() != spx.model.datastructure.FieldTypes.RECORDSET) context = this.model.parent;
                    this.view.setupColors(context);
                }
            }
            else
            {
                try
                {
                    this.view.setData(this.getDefaultValue());
                }
                catch (e) { }
            }
        },

        runAction:function(action)
        {

        },

        onViewChange:function()
        {
            //overwrite as required..
        },

        onDataChange:function()
        {
            //overwrite as required..
        },

        getType:function()
        {
            return "Element";
        },

        getID:function()
        {
            return this.data.getID();
        },

        findElementByID:function(id)
        {
            // differs from getElementByID because it is recursive - will find any descendant
            for(var i=0; i<this.elements.length; i++)
            {
                if(this.elements[i].getID && this.elements[i].getID()==id) return this.elements[i];
                if(this.elements[i].findElementByID)
                {
                    var e = this.elements[i].findElementByID(id);
                    if(e) return e;
                }
            }
        },

        getElementByID:function(id)
        {
            for(var i=0; i<this.elements.length; i++) if(this.elements[i].getID()==id) return this.elements[i];
        },

        setModel:function(model)
        {
            if(this.model) this.model.removeEventListener(this,sp.core.data.DataEvent.CHANGE,this.onModelChange);
            this.model = model;
            if(this.model) this.model.addEventListener(this,sp.core.data.DataEvent.CHANGE,this.onModelChange);

        },

        getDefaultValue: function()
        {
            var defaultBinding = this.data.getRawAttribute('default');
            if (defaultBinding)
            {
                if (this.model && this.model.parent)
                {
                    return spx.evaluate(defaultBinding, this.model.parent);
                }
                else if (this.parent && this.parent.model) //we may not have a binding at all
                {
                    return spx.evaluate(defaultBinding, this.parent.model);
                }
                else
                {
                    return spx.evaluate(defaultBindin);
                }
            }
        },

        toString:function()
        {
            return "[Controller " + this.getType() + " ID:" + this.getID() +"]";
        }

    }
);

spx.controller.ContainerController = spx.controller.ElementController.extend
(
    {
        __init:function()
        {
            this.__super();
            setTimeout(function () {
                spx.setWindowLocation(); // Set the window location if needed
            }, 0);
          
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.CONTAINER;
        }
    }
);

spx.controller.PageSetController = spx.controller.ElementController.extend
(
    {
        __init:function()
        {
            this.__super();
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.PAGESET;
        }
    }
);

spx.controller.PageController = spx.controller.ElementController.extend
(
    {
        __init:function()
        {
            this.__super();
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.PAGE;
        }
    }
);

spx.controller.LabelController = spx.controller.ElementController.extend
(
    {
        __init:function()
        {
            this.__super();
            this.setupHyperlink();
            var currentValue = this.data.getValue(); // this is added for my conditional value breaks please don't remove until PV is 100% bug free
            spx.model.Strings.getInstance().assignStringToElement(this.getContainer().getGraphic(), currentValue);
            this.onModelChange();
        },

        getContainer: function()
        {
            return this.hyperlink || this.view;
        },

        setupHyperlink: function()
        {
            //if (this.view.hyperlink) {
              //  this.view.hyperlink.remove();
           // }
            var hyperlink = this.data.getAttribute('href');
            hyperlink = this.populateHyperlink(hyperlink);
            if (hyperlink) {
              //  this.view.hyperlink = 
                this.hyperlink = this.view.addElement(this.view.create('a', { attributes: { onclick: "window.open('" + hyperlink + "', '" + hyperlink + "')" } }));
            }
        },

        populateHyperlink: function(link)
        {
            if (link && link.indexOf('{Id}') > -1)
            {
                var objectContext = this.model ? this.model.parent || this.parent.model : this.parent.model;
                var id = objectContext.getElementValue('CrmID') || objectContext.getElementValue('CrmId') || objectContext.getID();
                if (objectContext) link = link.replace('{Id}', id);
            }
            return link;
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.LABEL;
        },

        onModelChange: function () {
            if (this.model && this.model.getData)
            {
                // Please leave this alone as it don't work it needs changing and it just hard to debug
                var modelData = this.model.getData();
                var defaultValue = this.getDefaultValue();
                var html = sp.utils.XMLUtils.toNumberOfHtmlEscapes((modelData || defaultValue), 1);
                var formatter = this.data.getNumberFormat();
                if(formatter)
                {
                    var num = Number(html) || 0;
                    html = formatter.getFormattedValue(num);
                }
                this.getContainer().html(html);
            }
            else
            {
                // commented the lines below out 27/9 - not sure what the point of repeating the same code in the else statement is..
                // and it was throwing an error...
                //var html = sp.utils.XMLUtils.toNumberOfHtmlEscapes((this.model.getData() || this.getDefaultValue()), 1);
                //sp.out("render cell with data:" + this.model.getData() + " escaped:" + html);
                this.getContainer().html(sp.utils.XMLUtils.toNumberOfHtmlEscapes(this.getDefaultValue(), 1));
            }
            this.__super();

        }
    }
);

spx.controller.ComponentController = spx.controller.ElementController.extend
(
    {
        __init:function()
        {
            this.__super();
            this.onModelChange();
            if(this.model) this.model.addEventListener(this,spx.events.TestEvent.AUTOPOPULATE, this.onAutoPopulate);
            if (this.model && this.model.parent && this.view.colorsSet)
            {
                this.model.parent.addEventListener(this, sp.core.data.DataEvent.CHANGE, this.onColorContextChange);
            }
        },

        onAutoPopulate:function()
        {
            if(this.view && this.view.setData)
            {
                this.view.setData(this.getTestData());
                this.onViewChange();
            }
        },

        getTestData:function()
        {
             return "TEST";
        },

        onViewChange:function()
        {
            if(this.model && this.model.setData) this.model.setData(this.view.getData());
        },

        onDataChange:function()
        {
            var stirngs = 'e'; // TODO ?? what is this? - TW 4/11/16
        },

        /* The method below is an exact replica of the same function in the base class - makes no sense to override...
        onModelChange:function()
        {
            if(this.model && this.model.getData)
            {
                var data =  this.model.getData();
                if (this.isValueEmpty(data))
                {
                    try
                    {
                        data = this.getDefaultValue();
                    }
                    catch(e){}
                }
                this.view.setData(data);

                var context = this.model;
                if (this.model.parent && this.model.parent.getType() != spx.model.datastructure.FieldTypes.RECORDSET) context = this.model.parent;

                this.view.setupColors(context);
            }
            else
            {
                try
                {
                    this.view.setData(this.getDefaultValue());
                }
                catch(e) {}
            }
        },
        */

        onColorContextChange: function() {
            var context = this.model;
            if (this.model.parent.getType() != spx.model.datastructure.FieldTypes.RECORDSET) context = this.model.parent;
            this.view.setupColors(context);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.COMPONENT;
        }
    }
);

spx.controller.TextFieldController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTFIELD;
        }
    }
);

spx.controller.TextAreaController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.TEXTAREA;
        }
    }
);

spx.controller.DateFieldController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DATEFIELD;
        }
    }
);

spx.controller.NumericFieldController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.NUMERICFIELD;
        },

        isValueEmpty:function(val)
        {
            var num = Number(val);
            return (!isNaN(num) && num)? false : true;
        }
    }
);

spx.controller.ComboController = spx.controller.ComponentController.extend
(
    {
        __init:function()
        {
            this.selection = new sp.ui.Selection();
            this.selection.setDataProvider(this.getSelectionData());
            this.selection.addEventListener(this,sp.core.events.SelectionEvent.SELECT,this.onChange);
            this.selection.addEventListener(this,sp.core.events.SelectionEvent.OPEN,this.onOpen);
            this.selection.addEventListener(this,sp.core.events.SelectionEvent.CLOSE,this.onClose);
            this.view.addElement(this.selection.getGraphic());
            this.selection.setEnabled(this.data.getEnabled());
            this.view.setVisible(this.data.getVisible());
            this.__super();
            spx.model.Strings.getInstance().addEventListener(this,sp.core.data.DataEvent.CHANGE, this.onStringChange);
        },

        getSelectionData:function(closed)
        {
            return this.data.getSelectionData();
        },

        onStringChange:function()
        {
          
            this.selection.setDataProvider(this.data.getSelectionData());
        },

        onChange:function(event) {
         
            if(this.model && this.model.setData) this.model.setData(this.getData());
        },

        onModelChange: function()
        {
            if (this.model && this.model.getData) this.setData(this.model.getData());
            this.__super();
        },

        getData:function() {
         
            return this.selection.getSelectedValue();
        },

        setData: function (val) {
        
            this.selection.setSelectedValue(val);
        },

        setEnabled:function(val)
        {
            this.__super(val);
            this.selection.setEnabled(this.__enabled);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.COMBO;
        }
    }
);

spx.controller.CheckboxController = spx.controller.ComponentController.extend
(
    {
        __init: function ()
        {
            this.__super();
            if (this.model!=null)
            this.view.setData(this.model.getData());
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.CHECKBOX;
        },

        isValueEmpty: function(val)
        {
            return sp.core.data.DataUtils.isNullOrEmpty(val);
        }
    }
);

spx.controller.SliderController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.SLIDER;
        }
    }
);

spx.controller.ImageController = spx.controller.ComponentController.extend
(
    {

        __init:function()
        {
            this.__super();
            this.setupHyperlink();
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.IMAGE;
        },

        onModelChange: function()
        {
            if(this.model && this.model.getData())
            {
                this.view.setSrc(this.model.getData());
            }
            else if(this.data && this.data.getSource)
            {
                this.view.setSrc(this.data.getSource())
            }
        },

        setupHyperlink: function()
        {
            var hyperlink = this.data.getAttribute('href');
            if(hyperlink)
            {
                hyperlink = this.populateHyperlink(hyperlink);
                this.view.wrapWithHyperlink(hyperlink);
            }
            //if (hyperlink) this.hyperlink = this.view.addElement(this.view.create('a', { attributes: { onclick: "window.open('" + hyperlink + "', '" + hyperlink + "')" } }));

        },

        populateHyperlink: function(link)
        {
            if (link && link.indexOf('{Id}') > -1)
            {
                var objectContext = this.model ? this.model.parent || this.parent.model : this.parent.model;
                var id = objectContext.getElementValue('CrmID') || objectContext.getElementValue('CrmId') || objectContext.getID();
                if (objectContext) link = link.replace('{Id}', id);
            }
            return link;
        }


    }
);

spx.controller.RadioGroupController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RADIOGROUP;
        }
    }
);

spx.controller.RichTextController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.RICHTEXT;
        }
    }
);

spx.controller.TableController = spx.controller.ComponentController.extend
(
    {
        __init:function()
        {
            this.elements = [];
            this.columnData = this.getColumnData();
            this.showSummaryRow = this.data.getShowSummary();

            for(var i=0; i<this.columnData.length; i++)
            {
                var el = spx.controller.ControllerFactory.create(this,this.view,this.columnData[i],this.model);
                this.elements.push(el);
            }

            if (this.data.getLookUp())
            {
                var dialogView = new spx.view.SearchDialog();
                this.searchDialog = new spx.controller.SearchDialogController(dialogView,this.data.getSearchOptions());
                this.searchDialog.addEventListener(this,sp.ui.dialogs.DialogEvent.BEFORECLOSE,this.onBeforeAddDialogClose);
                this.searchDialog.addEventListener(this,sp.ui.dialogs.DialogEvent.CLOSE,this.onAddDialogClose);
            }

            var options = this.data.getOptions();
            var __this = this;
            options.itemRenderer = {render:function(cell, columnIndex, rowIndex, data, prop, table){return __this.render(cell, columnIndex, rowIndex, data, prop, table)},
                getData:function(cell, columnIndex, data, prop){return __this.getCellData(cell, columnIndex, data, prop)}};
            options.headerRenderer = new spx.controller.TableController.TableHeaderRenderer();
            options.sort = function(a,b,prop,order){return __this.sort(a, b, prop, order);};
            this.table = new sp.ui.table.Table(this.view.getTable(), options);
            this.table.addEventListener(this,sp.core.events.UIEvent.REMOVE, this.onRemove);

            if (this.data.getCreateButton()) $("#" + this.data.getCreateButton()).click(function () { __this.onCreateButton() });
            if(this.data.getAddButton()) $("#"+this.data.getAddButton()).click(function(){__this.onAddButton()});
            if(this.data.getRemoveButton()) $("#"+this.data.getRemoveButton()).click(function(){__this.onRemoveButton()});


            if(this.model) this.model.addEventListener(this,sp.core.data.DataEvent.ADD,this.onModelAdd);
            if(this.model) this.model.addEventListener(this,sp.core.data.DataEvent.REMOVE,this.onModelRemove);

            this.refreshTable();
        },

        getColumnData:function()
        {
            return $.grep(this.data.getElements(), function(item){ return item.getType() == spx.model.layout.ElementTypes.TABLECOLUMN; });
        },

        getSearchDialogOptions:function(lookupData)
        {
            return {
                dialogFields: lookupData.getAttribute('dialogFields'),
                lookupPath: lookupData.getAttribute('lookupPath')
            };
        },

        hoistItem:function(item)
        {
            /* for some reason, everything returned by the backend has the actual object 'nested inside itself# something like
            this

            {
                Contacts:[
                            {Contact:{CrmId:1,Name:"Pete",Data:etc},
                            {Contact:{CrmId:2,Name:"John",Data:etc..}
                         ]
            }

            This means the front end is littered with code which is trying to 'hoist' the actual data object up a level so it
            can be manipulated. All these places seem to seem hardcode references to 'Contact' or 'Task' objects like this

            if(contact['Contact'] then item = item.Contact

            This code is an attempt to be more generic.

            */

            if(this.getProps(item).length==1)
            {
                //sp.out("one prop, returning item[" + props[0]);
                return item[props[0]];
            }
            return item;

        },

        getProps:function(item)
        {
            var props = [];
            for(var prop in item)
            {
                props.push(prop);
            }
            return props;
        },

        itemIsAlreadyInTable:function(id)
        {
            if (this.model.getElementByFieldValue == undefined) {
                return false;
            }
            var el = this.model.getElementByFieldValue("CrmID",id);
            return (el)? true : false;
        },

        onBeforeAddDialogClose:function(event)
        {
            if (event.result != sp.ui.dialogs.Dialog.OK) return;
            if(!event.target.getSelectedItem()) return;
            if(this.itemIsAlreadyInTable(event.target.getSelectedItem().Id))
            {
                alert("You've already added that item");
                event.stop = true; // stops the dialog closing...
            }
        },

        onAddDialogClose: function(event)
        {
            if (event.result != sp.ui.dialogs.Dialog.OK) return;
            if(!event.target.getSelectedItem()) return;



            var linkData = this.model.refData.getAttribute('linkData');
            var createType = this.model.refData.getAttribute("create");
            var addType = this.model.refData.getAttribute("add");
            var selected = event.target.getSelectedItem();

            if (linkData)
            {
                try
                {
                    // this all hardcoded backend business logic...not very good
                    // needs to be made more generic rather than using the recordId
                    // of the entire page - what if the lookup object isn't specific to
                    // the root element? There could be a section showing the contacts for the
                    // primary deal on an account, for example..
                    linkData = JSON.parse(decodeURIComponent(linkData));

                    var childData = event.target.getSelectedItem();
                    var parentId = spx.AppletParameters.getParam('recordid'); // this is wrong...the parent won't always be the root object..

                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.StandardObjectType', linkData.Relationship.StandardObjectType);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ParentId', parentId);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ChildId', childData.Id);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'UseMethod', 'POST');

                    var str = function (a, b) { return spx.model.Strings.getInstance().getLocalOr(a, b) };
                    pv.Preloader.show(str('SAVING'));

                    if(!this.saveAjax)
                    {
                        this.saveAjax = new sp.core.comms.Comms(spx.AppletParameters, new sp.core.comms.CommsOptions({ dataType: 'json' }));
                        this.saveAjax.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSaveLinkedObjectComplete);
                        this.saveAjax.item = childData // this is not nice, the API should really return the object to be added so it is properly synched, but this will have to do
                    }
                    var saveURL = spx.AppletParameters.getParam('savelinkedobject');
                    this.saveAjax.load(saveURL, {Model: JSON.stringify(linkData)});
                }
                catch(e)
                {
                    console.log('error adding element: ', e);
                }
            }
        },
        onSaveLinkedObjectComplete: function(event)
        {
            // here is where the
            pv.Preloader.hide();
            if (event.success) {
                spx.windowReload();
            }
            else
            {
                alert("There was a problem adding this item. Please check your connections and try again");

            }


        },

        addItem:function(id,itemData)
        {
            var addItemType = this.data.getAddRecordType();
        },

        onModelAdd:function()
        {
            if(this.model) this.refreshTable();
        },

        onModelRemove:function()
        {
            this.refreshTable();
        },

        onRemove:function(event)
        {
            this.model.remove(event.data);
        },

        getTable:function()
        {
            return this.table;
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.TABLE;
        },

        onAddButton:function()
        {
            if(this.searchDialog)
            {
                this.searchDialog.show();
            }
            else
            {
                this.model.add().updateFields({ CrmID: 'NEW_' + sp.guid(), Name: 'New Item' });
            }
        },

        onRemoveButton:function()
        {
            var confirmString = 'Are you sure?';
            var __this = this;
            var linkData = this.model.refData.getAttribute('linkData');
            if (linkData) {
                linkData = JSON.parse(decodeURIComponent(linkData));

                if (linkData.ApiPath === "/AccountContacts/") {
                    confirmString =
              'You are about to remove the selected contact from your page, this action will also remove the contact from the Account. Would you like to proceed?';

                }
            }

            if (confirm(confirmString)) //TODO: springs confirm dialog
            {
                if (linkData)
                {
                    var deleteURL = spx.AppletParameters.getParam('savelinkedobject');

                    var parentId = spx.AppletParameters.getParam('recordid');
                    var crmId = this.table.getSelectedRowData().getElementValue("CrmID");
                    var relationshipId = this.table.getSelectedRowData().getElementValue("RelationshipId");
                    var selectedId = this.table.getSelectedRowData().getID(); // this was uundefined but i could see it in the above - no, this line is the correct way to do it, commented line above back out again TW
                    //this.table.getSelectedRowData().soundOff();

                    var str = function (a, b) { return spx.model.Strings.getInstance().getLocalOr(a, b) };
                    pv.Preloader.show(str('SAVING'));


                    /* NB: Re the ParentId/ChildId below....this is defunct. For SOME records the API required the id of the parent and child
                       in a relationship (eg. DealContact) but other times the childID passed is actually the record being deleted - eg. on a Task in an Account
                       Eventually we should mke this jusr pass one param - the id of the item to be deleted, but for now, that would require a lot of changes in all parts
                       of the application so we will keep thhe Rerlationship structure and childID will always be the record to be deleted...
                       */
                    //var selectedId = this.table.getSelectedRowData().data.CrmID;
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.StandardObjectType', linkData.Relationship.StandardObjectType);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ParentId', parentId);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ChildId', crmId);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.RelationshipId', relationshipId);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'UseMethod', 'DELETE');
                    var deleteAjax = new sp.core.comms.Comms(spx.AppletParameters, new sp.core.comms.CommsOptions({ dataType: 'json' }));
                    deleteAjax.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, function(id){ return function(event){ __this.onDeleteComplete(event, id)}}(selectedId));
                    deleteAjax.load(deleteURL, {Model: JSON.stringify(linkData)});
                }
            }
            //}
            //else
            //{
            //    //TODO = do we need to be able to handle removes for items which dont have linkData defined? Can this happen?...
            //}

        },

        onCreateButton:function() {
            $("<div>My div content</div>").dialog();
        },
        onDeleteComplete: function(event, selectedId)
        {
            pv.Preloader.hide();
            if (event.success)
            {
                this.model.remove(this.model.getElementByID(selectedId));
            }
        },

        render: function(cell,columnIndex,rowIndex,data,prop,table)
        {
            var column = this.getElementByID(prop);
            return column.render(cell,columnIndex,rowIndex,data,table);
        },

        sort:function(rec1,rec2,prop,order)
        {
            var column = this.getElementByID(prop);
            var field1 = rec1.getElementByID(column.getProperty());
            var field2 = rec2.getElementByID(column.getProperty());
            a = field1.getData();
            b = field2.getData();
            switch(this.data.getElement(prop).getType())
            {
                case spx.model.layout.ElementTypes.DATEFIELD:
                case spx.model.layout.ElementTypes.LABEL:
                case spx.model.layout.ElementTypes.TEXTFIELD:
                case spx.model.layout.ElementTypes.TEXTAREA:
                case spx.model.layout.ElementTypes.RICHTEXT:
                case spx.model.layout.ElementTypes.NUMERICFIELD:
                case spx.model.layout.ElementTypes.COMBO:
                case spx.model.layout.ElementTypes.CHECKBOX:
                case spx.model.layout.ElementTypes.SLIDER:
                case spx.model.layout.ElementTypes.RADIOBUTTON:
                case spx.model.layout.ElementTypes.RADIOGROUP:
                default:
                    if (order == sp.ui.table.TableSortOrder.ASCENDING) return (a > b) ? 1 : (a < b) ? -1 : 0;
                    if (order == sp.ui.table.TableSortOrder.DESCENDING) return (a > b) ? -1 : (a < b) ? 1 : 0;
            }
        },

        refreshTable:function()
        {
            if (this.model) this.table.setDataProvider(this.model.getElements());
            if (this.showSummaryRow) this.updateSummaryRow();
        },

        onModelChange: function()
        {
            this.__super();
            if (this.showSummaryRow) this.updateSummaryRow();
        },

        summaryTypeToLabel: function(type)
        {
            switch(type)
            {
                case 'sum': return 'Sum';
                case 'count': return 'Count';
                case 'mean': return 'Mean';
                case 'median': return 'Median';
                case 'mode': return 'Mode';
                case 'range': return 'Range';
                case 'lowest': return 'Lowest';
                case 'highest': return 'Highest';
                default: return type || '';
            }
        },

        updateSummaryRow:function()
        {
            var summaryRowCells = this.getSummaryRowCells();
            for(var i=0; i<this.elements.length; i++)
            {
                var binding = this.elements[i].getBinding() || this.elements[i].data.elements[0] ? this.elements[i].data.elements[0].getBinding() : '';
                this.elements[i].renderSummary(summaryRowCells[i],this.model.getElements(),this.getSummaryRow());
            }
        },

        calculateSummaryData: function()
        {
            var summaryData = this.getSummaryTableData();
            var summaryCalculated = [];
            for (var i = 0; i < this.elements.length; i++)
            {
                var summaryType = this.elements[i].data.getAttribute('summary');
                if (summaryType)
                {
                    summaryCalculated.push({
                        type: summaryType,
                        value: sp.utils.Math.calculate(summaryType, summaryData[i])
                    });

                }
                else
                {
                    summaryCalculated.push(null);
                }
            }
            return summaryCalculated;
        },

        getSummaryTableData: function()
        {
            //against each column index we get the transformed data array.
            var modelElements = this.model.getElements();
            var summaryData = [];

            for (var i = 0; i < this.elements.length; i++)
            {
                var binding = this.elements[i].getBinding() || this.elements[i].data.elements[0] ? this.elements[i].data.elements[0].getBinding() : '';

                if (binding)
                {
                    summaryData[i] = $.map(modelElements, function(el){ return Number(el.getElementValue(binding)) || 0; });
                }
                else
                {
                    summaryData[i] = $.map(modelElements, function (el) { return 0 });
                }
            }
            return summaryData;
        },

        getSummaryRowCells:function()
        {
            return this.getSummaryRow().children();
        },

        getSummaryRow: function()
        {
            var summaryRow = $(this.table.rowTable).find('tr.summary_row');
            if (!summaryRow[0])
            {
                summaryRow = $(sp.core.graphics.create('tr', {classes: ['summary_row table_row']}).getGraphic());
                summaryRow.appendTo(this.table.rowTable);
            }
            return summaryRow;
        }
    }
);

spx.controller.TableController.TableHeaderRenderer = sp.ui.table.TableHeaderRenderer.extend
(
    {

        render:function(columnIndex, table)
        {
            var header = this.__super(columnIndex, table);
            spx.model.Strings.getInstance().assignStringToElement(header.getGraphic(),table.options.labels[columnIndex]);
            return header;
        }
    }
);

spx.controller.TableColumnController = spx.controller.ComponentController.extend
(
    {
        __init:function()
        {

        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.TABLECOLUMN;
        },

        getProperty:function()
        {
            try
            {
                return this.data.getField().getDataSource();
            }
            catch(e)
            {

            }
            return "";
        },

        render:function(cell,columnIndex,rowIndex,data,table)
        {

            /*var elementData = this.data.getElements();
            for(var i=0; i<elementData.length; i++)
            {
                var view = this.view.getElement(elementData[i].getID());
                var m = this.getModelForElement(this.model,elementData[i]);//this.model)? (elementData[i].getBinding())? this.model.getElementByID(elementData[i].getBinding()) : this.model : null;
                this.elements.push(new spx.controller.ControllerFactory.create(this,view,elementData[i],m));
            }
            this.view.addEventListener(this,sp.core.events.UIEvent.CLICK, this.onClickView);
            */

            if (!cell) cell = document.createElement("td");
            $(cell).css("width", this.data.getWidth());
            $(cell).css("background-color", this.data.getBackground());
            var prop = this.getProperty();
            var rowData = data[rowIndex];
            var val = (rowData && prop && rowData.getElementByID)? rowData.getElementByID(prop) : "";
            var field = this.view.create(this.data.getElementByBinding(prop));
            try
            {
                var m = rowData.getElementByID(prop);
                m = this.getModelForElement(data[rowIndex],this.data.getElementByBinding(prop));
                var el = this.data.getElementByBinding(prop);
                var controller = spx.controller.ControllerFactory.create(this,field,el ,m);
                //sp.out("CREATE grid cell, field:" + field + " model:" + m + " controller:" + controller);
                $(cell).append(field.getGraphic());
            }
            catch(e)
            {
                sp.out("  [TableColumnController, error rendering column prop:" + prop + " e:" + e.message);
            }
            return cell;
        },

        renderSummary:function(cell,data,row) // Add 
        {
            cell = cell || this.createSummaryCell(row); 
            var prop = this.getProperty();

            var columnVals = [];
            for(var i=0; i<data.length; i++)
            {
                var el =  data[i].getElementByID(prop);
                columnVals.push(el? el.getData() : null);
            }
            var summaryType = this.data.getAttribute('summary');
            //if (!summaryType) {
            //    $(cell).removeClass('pb-summary');
            //}
            var summaryVal = new spx.controller.TableSummary(columnVals,summaryType).getValue();
            if($.isNumeric(summaryVal))
            {
                var format = new sp.core.numeric.NumberFormatter();
                summaryVal = format.getFormattedNumber(summaryVal);
            }
            $(cell).text(summaryVal);
            return cell;
        },

        createSummaryCell:function(row)
        {
            var  cell = $("<td class='pb-summary table_row_cell'></td>");
            $(row).append(cell);
            return cell;
        }

    }
);

//TODO probably this should be somewhere in the model, but in a hurry and not sure where  best place would be...is there a utils?
spx.controller.TableSummary = Class.extend
({
    __constructor:function(vals,type)
    {
        this.vals = vals || [];
        this.type = type;
    },
    hasValues:function()
    {
        return this.vals.length>0;
    },
    isNumber:function(val)
    {
      return !isNaN(Number(val));
    },
    toNumber:function(val)
    {
        return (this.isNumber(val))? Number(val) : 0;
    },
    sum:function()
    {
        var sum = 0;
        for(var i=0; i<this.vals.length; i++) sum += this.toNumber(this.vals[i]);
        return sum;
    },
    count:function()
    {
        return this.vals.length;
    },
    mean:function()
    {
        return (!this.sum() || !this.count())? 0 : this.sum()/this.count();
    },
    median:function()
    {
        return _.median(this.vals);
    },
    max:function()
    {
        if(!this.hasValues()) return;
        var min = this.toNumber(this.vals[0]);
        for(var i=0; i<this.vals.length; i++)
        {
            if(this.toNumber(this.vals[i]) > min) min = this.toNumber(this.vals[i]);
        }
        return min;
    },
    min:function()
    {
        if(!this.hasValues()) return;
        var min = this.toNumber(this.vals[0]);
        for(var i=0; i<this.vals.length; i++)
        {
            if(this.toNumber(this.vals[i]) < min) min = this.toNumber(this.vals[i]);
        }
        return min;
    },
    range:function()
    {
        return this.max() - this.min();
    },
    mode:function()
    {
        if(!this.hasValues()) return [];
        var max = 0, counts = {}, result = [];
        for(var i=0; i<this.vals.length; i++)
        {
            if(counts[this.vals[i]]==undefined) counts[this.vals[i]] = 0;
            if(++counts[this.vals[i]] > max) max = counts[this.vals[i]];
        }
        if(max<2) return [];
        for(var prop in counts) if(counts[prop] == max) result.push(prop);
        return result;
    },
    getValue:function()
    {
        switch (this.type)
        {
            case spx.controller.TableSummary.SUM:
                return this.sum(this.vals);
            case spx.controller.TableSummary.MEAN:
                return this.mean(this.vals);
            case spx.controller.TableSummary.MEDIAN:
                return this.median(this.vals);
            case spx.controller.TableSummary.MODE:
                var mode = this.mode(this.vals);
                var str = "";
                for(var i=0; i<mode.length; i++)
                {
                    str += (i>0)? "," + mode[i] : mode[i];
                }
                return str;
            case spx.controller.TableSummary.RANGE:
                return this.range(this.vals);
            case spx.controller.TableSummary.LOWEST:
                return this.min(this.vals);
            case spx.controller.TableSummary.HIGHEST:
                return this.max(this.vals);
            case spx.controller.TableSummary.COUNT:
                return this.count(this.vals);
        }
        return "";
    }

})
spx.controller.TableSummary.SUM = "sum";
spx.controller.TableSummary.COUNT = "count";
spx.controller.TableSummary.MEAN = "mean";
spx.controller.TableSummary.MEDIAN = "median";
spx.controller.TableSummary.MODE = "mode";
spx.controller.TableSummary.RANGE = "range";
spx.controller.TableSummary.LOWEST = "minimum";
spx.controller.TableSummary.HIGHEST = "highest";


spx.controller.RepeaterController = spx.controller.ComponentController.extend
(
    {
        __init:function()
        {
            this.build();
        },

        build:function()
        {
            this.view.clear();
            var modelData = this.model.getElements();
            var elementData = this.data.getElements();
            for(var i=0; i<modelData.length; i++)
            {
                for(var n=0; n<elementData.length; n++)
                {
                    var v = this.view.create(elementData[n]);
                    var el = spx.controller.ControllerFactory.create(this,v,elementData[n],modelData[i]);
                }
                this.elements.push(el);
            }
        },

        onDataChange:function()
        {
            this.build();
        },

        onModelChange:function()
        {
            this.build();
        },


        getType:function()
        {
            return spx.model.layout.ElementTypes.REPEATER;
        }
    }
);

spx.controller.ButtonController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.BUTTON;
        }
    }
);

spx.controller.DialogController = spx.controller.ComponentController.extend
(
    {
        getType:function()
        {
            return spx.model.layout.ElementTypes.DIALOG;
        }
    }
);

spx.controller.RecordViewController = spx.controller.ElementController.extend
(
    {
        __init:function()
        {
            this.elements = [];
            var elementData = this.data.getElements();
            for(var i=0; i<elementData.length; i++)
            {
                var view = this.view.getElement(elementData[i].getID());
                this.elements.push(new spx.controller.ControllerFactory.create(this,view,elementData[i],null));
            }
            this.setIndex(0);
        },

        next:function()
        {
            this.setIndex(this.index+1);
        },

        previous:function()
        {
            this.setIndex(this.index-1);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.RECORDVIEW;
        },

        showRecordID:function(id)
        {
            this.setIndex(this.model.indexOfElementByID(id));
        },

        setIndex:function(index)
        {
            this.index = Math.max(0,Math.min(index,this.model.length()));
            this.refresh();
        },

        refresh:function()
        {
            var record = this.model.getElementAt(this.index);
            if(record)
            {
                for(var i=0; i<this.elements.length; i++)
                {
                    var m = (this.elements[i].getBinding())? record.getElementByID(this.elements[i].getBinding()) : record;
                    this.elements[i].setModel(m);
                    this.elements[i].onModelChange();
                }
            }
        }

    }
);

spx.controller.Filter = sp.core.events.EventDispatcher.extend
(
    {
        __constructor:function()
        {
            this.__super();
        }
    }
);

spx.controller.LookupController = spx.controller.ComponentController.extend
({

    __constructor: function(parent,view,data,model)
    {
        this.__super(parent,view,data,model);
        this.view.getSearchButton().click($.proxy(this.onSearchButtonClick, this));
        var dialogView = new spx.view.SearchDialog(this.data);
        this.dialog = new spx.controller.SearchDialogController(dialogView,this.data.getSearchOptions());
        this.dialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onDialogClose);
        this.view.setText(this.getDisplayValue());

        var linkData = this.model.refData.getAttribute('linkData');
        if(linkData)
        {
            sp.out("Found link data on a lookup, creting relationship controller");
            this.relationshipController = new spx.controller.RelationshipController(linkData);
            this.relationshipController.addEventListener(this,sp.core.comms.CommsEvent.COMPLETE,this.onRelationshipUpdated);
        }
    },

    onSearchButtonClick:function()
    {
        this.dialog.show();
    },

    /*onDialogClose:function(event)
    {
        if (event.result != sp.ui.dialogs.Dialog.OK) return;
        var selectedItem = event.target.getSelectedItem();
        var binding = this.data.getBinding();
        if(!selectedItem) return;
        this.model.setData(selectedItem.Id || "");
        if(this.getRelatedField()) this.getRelatedField().setData(selectedItem);
        this.view.setText(this.getDisplayValue());
    },*/

    onDialogClose:function(event)
    {

        sp.out("onSearch, relatinshipController:" + this.relationshipController)

        if (event.result != sp.ui.dialogs.Dialog.OK) return;
        var selectedItem = event.target.getSelectedItem();
        if(!selectedItem) return;

       if(this.relationshipController)
       {
           if(this.model && this.model.parent && this.model.parent.getElementValue)
           {
               var linkData = this.model.refData.getAttribute('linkData');
               linkData = JSON.parse(decodeURIComponent(linkData));
               var relationshipId = this.model.parent.data[this.model.refData.nextElementSibling.id].RelationshipId; // get the relationship id as this is needed to delete in vr

               // then we have a lookup controlling a custom relationship and we therefore need
               // to upsert a relationship definition on the host data
               var childId = selectedItem.Id;
               var parentId = this.model.parent.data.CrmID;// getElementValue("CrmID");
               var StandardObjectType = linkData.Relationship.StandardObjectType
               
               var str = function (a, b) { return spx.model.Strings.getInstance().getLocalOr(a, b) };
               pv.Preloader.show(str('SAVING'));

               this.relationshipController.update("PUT", parentId, childId, StandardObjectType, relationshipId);

               spx.windowReload();
               //location.reload(); // changed so that the page hold position
           }
           else
           {
               // then something is wrong - this look up is not bound to a field on a record
               // so we can't create a relationship between that record and whatever item was
               // selected by the lookup...
               // this seems very inelegant, and there must be a better way to handle this, but
               // we have to mess about with parent models because the lookup itself is bound to the
               // field  representing the id of the thing we are relating to, not to the record
           }


       }
       else
       {
           // otherwise we are just dealing with a foreign key which needs to be upated when
           // we next do a save..
           var binding = this.data.getBinding();
           this.model.setData(selectedItem.Id || "");
           if(this.getRelatedField()) this.getRelatedField().setData(selectedItem);
           this.view.setText(this.getDisplayValue());
       }
    },

    onRelationshipUpdated:function(event)
    {
        pv.Preloader.hide();
    },

    getRelatedField:function()
    {
        // not sure what this does, it's the original code. seems to be looking on the parent
        // for a record with the relevant field id...seems ok but probably should be part of the controller..
        if (this.relatedField)
        {
            return this.relatedField;
        }
        else
        {
            var relatedFieldName = this.data.getRelatedField();
            sp.out("related field name:" + relatedFieldName);
            if (relatedFieldName)
            {
                sp.out("model:" + this.model);
                this.relatedField = this.model.findSibling(relatedFieldName);
                if(!this.relatedField)
                {
                    //if we can't find the field on the parent, then keep moving up the hierarchy until we find it..
                    var result = this.model.findCousin(relatedFieldName);
                    if(result) this.relatedField = result;

                }
                return this.relatedField;
            }
        }
    },

    getDisplayValue: function()
    {
        sp.out("-------------------------------------------------------------");
        var displayField = this.data.getAttribute('displayField');
        var relatedField = this.getRelatedField();
        sp.out("this.model:" + this.model + "  displayField:" + displayField + " relatedField:" + relatedField);

        if (displayField && relatedField)
        {
            var evald = spx.evaluate('{' + displayField + '}', relatedField.data) || '';
            // if we have a related field, this means we are, for example, updating AccountID but the value
            // to display is a property of the Account object...
            // so we need to find the relevant object, which should be another property of the parent of this field..

            return evald;
        }
        else if(displayField)
        {
            // if there isn't a related field...i don't think we should be trying to render this...?
            if(this.model && this.model.parent)
            {
                return spx.evaluate('{' + displayField + '}', this.model) || '';
            }
        }
        return '';
    }

});

spx.controller.RelationshipController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(linkData)
    {
        this.__super();
        this.linkData = linkData;
    },
    update:function(method,parentId,childId,standardObjectType,relationshipId)
    {
        var __this = this;
        var linkData = JSON.parse(decodeURIComponent(this.linkData)); // makes a new copy each time...

        var upsertURL = spx.AppletParameters.getParam('savelinkedobject'); // savelinkedobject url is used for upserting as well..

        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.StandardObjectType', standardObjectType);
        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ParentId', parentId);
        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ChildId', childId);
        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.RelationshipId', relationshipId);
        sp.core.data.DataUtils.setValueAtPath(linkData, 'UseMethod', "PUT");

        var ajax = new sp.core.comms.Comms(spx.AppletParameters, new sp.core.comms.CommsOptions({ dataType: 'json' }));
        ajax.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE,this.onCommsComplete);
        ajax.load(upsertURL, {Model: JSON.stringify(linkData)});
    },
    onCommsComplete:function(event)
    {
        this.dispatchEvent(new sp.core.comms.CommsEvent(this,sp.core.comms.CommsEvent.COMPLETE));
    }
});


spx.controller.SearchDialogController = sp.core.events.EventDispatcher.extend
({
    __constructor:function(view,searchOptions)
    {
        this.__super();
        this.view = view;
        this.searchOptions = searchOptions;
        this.view.getSearchButton().click($.proxy(this.onSearchButtonClick, this));
        this.view.addEventListener(this,sp.ui.dialogs.DialogEvent.CLOSE,this.onCloseView);
        this.view.addEventListener(this,sp.ui.dialogs.DialogEvent.BEFORECLOSE,this.onBeforeCloseView);
        this.resultTable = new sp.ui.table.Table(this.view.getTableGraphic().getGraphic(), this.getTableOptions());
        this.preloader = new sp.ui.preloader.Preloader(new sp.ui.preloader.PreloaderOptions({ container: this.view.getSearchArea().getGraphic(), imageURL: "./res/images/main/preloader.gif" }));
        this.preloader.hide();
    },

    getTableOptions: function()
    {
        var fields = this.searchOptions.getFields();
        var labels = this.searchOptions.getFieldNames() || fields;
        var widths = this.getTableFieldWidths(fields);
        return new sp.ui.table.TableOptions(fields,widths,labels);
    },

    getTableFieldWidths:function(fields)
    {
        // column widths are not configurable in PageBuilder, so we just
        // divide the table width evenly by the number of fields..
        return $.map(fields, function(){ return Math.floor(100 / (fields.length || 1)); });
    },

    show:function()
    {
        this.view.open();
    },

    hide:function()
    {
        this.view.close();
    },

    getSelectedItem: function()
    {
        return this.resultTable.getSelectedRowData();
    },

    onSearchButtonClick:function()
    {
        var searchTerm = this.view.getSearchTerm();
        if(searchTerm) this.search(searchTerm);
    },

    onBeforeCloseView:function(event)
    {
        // forwards the event. important to forward it, so that the controller can call stop on it...
        var newEvent = new sp.ui.dialogs.DialogEvent(this,sp.ui.dialogs.DialogEvent.BEFORECLOSE,event.result);
        this.dispatchEvent(newEvent);
        event.stop = newEvent.stop // set the stop property on the original event to let it pick up anything which told it to stop...
    },

    onCloseView:function(event)
    {
        // called when the user presses OK, close or cancel...
        var event = new sp.ui.dialogs.DialogEvent(this,sp.ui.dialogs.DialogEvent.CLOSE,event.result);
        event.selectedItem = this.getSelectedItem();
        this.dispatchEvent(event);
    },

    getCommsObject:function()
    {
        // if a comms object has already been created, then re-use it, otherwise create new and assign it to the comms variable
        if(!this.comms)
        {
            this.comms = new sp.core.comms.Comms(spx.AppletParameters, new sp.core.comms.CommsOptions({ dataType: 'json' }));
            this.comms.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSearchComplete)
        }
        return this.comms;
    },

    search:function(searchTerm)
    {
        var url = spx.AppletParameters.getParam('CONTACTSEARCH'); // this always returns "Search.aspx" just a bad name
        var data = {
            lookupPath: this.searchOptions.getUrl(),
            searchTerm: searchTerm
        };
        this.preloader.show();
        this.getCommsObject().load(url, data);
    },

    onSearchComplete:function(event)
    {
        this.preloader.hide();

        var searchResult = sp.core.data.DataUtils.toArray(event.target.parsedData);
        if(searchResult.length)
        {
            this.resultTable.setDataProvider(searchResult);
        }
        else
        {
            alert("Your search didn't find any items. Please try again.");
        }
    }

/*




    addFilter:function(func)
    {
        this.filters.push(func);
    },

    filterValues:function(vals,filter)
    {
        // TODO needs error checking / handling... currently assumes filters will be valid functions...
        var __this = this;
        var result = [];
        for(var i=0; i<vals.length; i++)
        {
            if (filter(vals[i])) result.push(vals[i]);
        }
        return result;
    },

    filterSearchResult:function(vals)
    {
        for(var i=0; i<this.filters.length; i++)
        {
            vals = this.filterValues(vals,this.filters[i]);
        }
        return vals;
    },

    onSearchComplete: function(event)
    {

        this.preloader.hide();

        var searchResult = sp.core.data.DataUtils.toArray(event.target.parsedData);
        if(searchResult.length)
        {
            this.resultTable.setDataProvider(searchResult);
        }
        else
        {
            alert("Your search didn't find any items. Please try again.");
        }
    }*/
})

spx.controller.ChartController = spx.controller.ComponentController.extend
(
{
    __init: function()
    {
        this.__super();
        this.view.drawChart(this.getChartOptions());
        this.onModelChange();
    },

    getChartOptions: function()
    {
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: this.getChartType()
            },
            title: { text: '' },
            tooltip: this.getTooltipFormat(),
            plotOptions: this.getPlotOptions(),
            series: this.getSeries(),
            xAxis: this.getXAxis(),
            yAxis: this.getYAxis()
        }
    },

    getXAxis: function()
    {
        return {
            type: 'category'
        };
    },

    getYAxis: function()
    {
        var yLabel = this.data.getAttribute('field');
        return {
            title: {
                text: yLabel
            }
        }
    },

    getSeries: function()
    {
        return [{
            name: '',
            colorByPoint: true
        }];
    },

    getPlotOptions: function()
    {
        return {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        };
    },

    getChartType: function()
    {
        return 'column';
    },

    getTooltipFormat: function()
    {

    },

    getType: function()
    {
        return spx.model.layout.ElementTypes.CHART;
    },

    onModelChange: function()
    {
        this.view.setData(this.getChartData());
    },

    getChartData: function()
    {
        var field = this.data.getAttribute('field');
        var groupBy = this.data.getAttribute('groupBy');
        var groupByLabel = this.data.getAttribute('groupByLabel');

        var valueMap = {};

        var elements = this.model.getElements();

        for (var i = 0; i < elements.length; i++)
        {
            var element = elements[i];
            var value = Number(element.getElementValue(field)) || 0;
            var key = element.getElementValue(groupBy);
            var label = element.getElementValue(groupByLabel);

            if (valueMap[key])
            {
                valueMap[key]['value'] += value;
            }
            else
            {
                valueMap[key] = { label: label, value: value };
            }
        }

        var data = [];

        for(var key in valueMap)
        {
            data.push({
                name: valueMap[key].label,
                y: valueMap[key].value
            });
        }
        return data;
    }
});

spx.controller.BarChartController = spx.controller.ChartController.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.BARCHART;
    },

    getSeries: function()
    {
        return [{
            name: this.data.getAttribute('groupByLabel'),
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }];
    },

    getPlotOptions: function()
    {
        return {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        };
    },

    getChartType: function()
    {
        return 'column';
    },

    getTooltipFormat: function()
    {
        return { pointFormat: '' };
    },

    getChartData: function()
    {
        var data = this.__super();
        var chartData = [];
        for (var i = 0; i < data.length; i ++)
        {
            var itm = data[i];
            chartData.push([itm.name, itm.y]);
        }
        return chartData;
    }
}
);

spx.controller.LineChartController = spx.controller.ChartController.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.LINECHART;
    },

    getSeries: function()
    {
        return [{
            name: this.data.getAttribute('groupByLabel'),
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }];
    },

    getPlotOptions: function()
    {
        return {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        };
    },

    getChartType: function()
    {
        return 'line';
    },

    getTooltipFormat: function()
    {
        return { pointFormat: '' };
    },

    getChartData: function()
    {
        var data = this.__super();
        var chartData = [];
        for (var i = 0; i < data.length; i ++)
        {
            var itm = data[i];
            chartData.push([itm.name, itm.y]);
        }
        return chartData;
    }
}
);

spx.controller.AreaChartController = spx.controller.ChartController.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.AREACHART;
    },

    getSeries: function()
    {
        return [{
            name: this.data.getAttribute('groupByLabel'),
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }];
    },

    getPlotOptions: function()
    {
        return {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        };
    },

    getChartType: function()
    {
        return 'area';
    },

    getTooltipFormat: function()
    {
        return { pointFormat: '' };
    },

    getChartData: function()
    {
        var data = this.__super();
        var chartData = [];
        for (var i = 0; i < data.length; i ++)
        {
            var itm = data[i];
            chartData.push([itm.name, itm.y]);
        }
        return chartData;
    }
}
);

spx.controller.PieChartController = spx.controller.ChartController.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.PIECHART;
    },

    getSeries: function()
    {
        return [{
            name: this.data.getAttribute('fieldLabel'),
            colorByPoint: true
        }];
    },

    getPlotOptions: function()
    {
        return {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        };
    },

    getChartType: function()
    {
        return 'pie';
    },

    getTooltipFormat: function()
    {
        return { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' };
    }
}
);

spx.controller.UnsupportedController = spx.controller.ElementController.extend
(
{
    getType: function()
    {
        return spx.model.layout.ElementTypes.UNSUPPORTED;
    }
}
);

spx.controller.OrgChartController = spx.controller.ComponentController.extend
(
    {
        __init:function()
        {
            this.build();
            this.view.addEventListener(this,sp.core.events.UIEvent.CLICK, this.onClickView);
            if(this.model) this.model.addEventListener(this,sp.core.data.DataEvent.ADD,this.onModelAdd);
        },

        onModelAdd: function(e)
        {
            this.build();
        },

        build:function()
        {
            this.view.clearAll(true);
            var modelData = this.model.getElements();
            var elementData = this.data.getElements();
            var boxData = $.grep(elementData, function(el){ return el.getType() == spx.model.layout.ElementTypes.ORGCHARTBOX })[0];
            var dialogData = $.grep(elementData, function(el){ return el.getType() == spx.model.layout.ElementTypes.ORGCHARTDIALOG })[0];
            this.lookupData = $.grep(elementData, function(el){ return el.getType() == spx.model.layout.ElementTypes.LOOKUP })[0];

            if (this.lookupData)
            {
                //this.lookupView = new spx.view.Lookup(lookupData, this.view, this.model);
                //this.lookupController = spx.controller.ControllerFactory.create(this, this.lookupView, lookupData, null);
                var dialogView = new spx.view.SearchDialog();
                this.searchDialog = new spx.controller.SearchDialogController(dialogView,this.data.getSearchOptions());
                this.searchDialog.addEventListener(this,sp.ui.dialogs.DialogEvent.CLOSE,this.onAddDialogClose);

                this.view.addEventListener(this, sp.core.events.UIEvent.ADD, this.onAddClicked);
                this.view.addEventListener(this, sp.core.events.UIEvent.REMOVE, this.onRemoveClicked);
                this.view.toggleAddRemoveButtons(true);



            }
            else
            {
                this.view.toggleAddRemoveButtons(false);
            }

            for(var i=0; i<modelData.length; i++)
            {
                if (boxData)
                {
                    var boxView = new spx.view.OrgChartBox(boxData, this.view, modelData[i]);
                    var box = spx.controller.ControllerFactory.create(this, boxView, boxData, modelData[i]);
                    this.elements.push(box);
                    this.view.addBox(boxView);
                    if (dialogData)
                    {
                        var dialogView = new spx.view.OrgChartDialog(dialogData);
                        var dialog = spx.controller.ControllerFactory.create(this, dialogView, dialogData, modelData[i]);
                        box.dialog = dialog;
                        box.elements.push(dialog);
                        box.view.addElement(dialogView);
                    }
                }
            }
            //quick fix
            var __this = this;
            this.view.hide();
            setTimeout(function(){
                __this.view.show();
                __this.view.refresh();
            }, 0);
        },

        getSearchDialogOptions:function(lookupData)
        {
            return {
                dialogFields: lookupData.getAttribute('dialogFields'),
                lookupPath: lookupData.getAttribute('lookupPath')
            };
        },

        onAddClicked:function()
        {
            if(this.searchDialog)
            {
                this.searchDialog.show();
            }
            else
            {
                this.model.add().updateFields({ CrmID: 'NEW_' + sp.guid(), Name: 'New Item' });
            }
        },

        onRemoveClicked:function()
        {
            var confirmString = 'Are you sure?';
            var __this = this;
            var linkData = this.model.refData.getAttribute('linkData');
            if (linkData) {
                linkData = JSON.parse(decodeURIComponent(linkData));

                if (linkData.ApiPath === "/AccountContacts/") {
                    confirmString =
              'You are about to remove the selected contact from your page, this action will also remove the contact from the Account. Would you like to proceed?';

                }
            }

            if (confirm(confirmString)) //TODO: springs confirm dialog
            {
                if (linkData)
                {
                    var deleteURL = spx.AppletParameters.getParam('savelinkedobject');

                    var parentId = spx.AppletParameters.getParam('recordid');

                    var str = function (a, b) { return spx.model.Strings.getInstance().getLocalOr(a, b) };
                    pv.Preloader.show(str('SAVING'));

                    var selected = this.view.getSelected();
                    for(var i = 0; i < selected.length; i++)
                    {
                        var selectedId = selected[i];
                        var selectedItem = this.model.getElementByID(selectedId);
                        var relationshipId = selectedItem.getElementValue("RelationshipId");
                        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.StandardObjectType', linkData.Relationship.StandardObjectType);
                        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ParentId', parentId);
                        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ChildId', selectedId);
                        sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.RelationshipId', relationshipId);
                        sp.core.data.DataUtils.setValueAtPath(linkData, 'UseMethod', 'DELETE');

                        var deleteAjax = new sp.core.comms.Comms(spx.AppletParameters, new sp.core.comms.CommsOptions({ dataType: 'json' }));
                        deleteAjax.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, function(id){ return function(event){ __this.onDeleteComplete(event, id)}}(selectedId));
                        deleteAjax.load(deleteURL, {Model: JSON.stringify(linkData)});
                    }
                }
            }
            //}
            //else
            //{
            //    //TODO = do we need to be able to handle removes for items which dont have linkData defined? Can this happen?...
            //}

        },

        onAddDialogClose: function(event)
        {
            if (event.result != sp.ui.dialogs.Dialog.OK) return;
            if(!event.target.getSelectedItem()) return;

            var linkData = this.model.refData.getAttribute('linkData');
            var createType = this.model.refData.getAttribute("create");
            var addType = this.model.refData.getAttribute("add");
            var selected = event.target.getSelectedItem();

            if (linkData)
            {
                try
                {
                    // this all hardcoded backend business logic...not very good
                    // needs to be made more generic rather than using the recordId
                    // of the entire page - what if the lookup object isn't specific to
                    // the root element? There could be a section showing the contacts for the
                    // primary deal on an account, for example..
                    linkData = JSON.parse(decodeURIComponent(linkData));

                    var childData = event.target.getSelectedItem();
                    var parentId = spx.AppletParameters.getParam('recordid'); // this is wrong...the parent won't always be the root object..
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.StandardObjectType', linkData.Relationship.StandardObjectType);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ParentId', parentId);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'Relationship.ChildId', childData.Id);
                    sp.core.data.DataUtils.setValueAtPath(linkData, 'UseMethod', 'POST');

                    if(!this.saveAjax)
                    {

                        this.saveAjax = new sp.core.comms.Comms(spx.AppletParameters, new sp.core.comms.CommsOptions({ dataType: 'json' }));
                        this.saveAjax.addEventListener(this, sp.core.comms.CommsEvent.COMPLETE, this.onSaveLinkedObjectComplete);
                        this.saveAjax.item = childData // this is not nice, the API should really return the object to be added so it is properly synched, but this will have to do
                    }
                    var str = function (a, b) { return spx.model.Strings.getInstance().getLocalOr(a, b) };

                    pv.Preloader.show(str('SAVING'));
                    var saveURL = spx.AppletParameters.getParam('savelinkedobject');

                    this.saveAjax.load(saveURL, {Model: JSON.stringify(linkData)});
                }
                catch(e)
                {
                    console.log('error adding element: ', e);
                }
            }
        },

        onSaveLinkedObjectComplete: function(event)
        {
            pv.Preloader.hide();
            if(event.success) {
                spx.windowReload();
            }
            else
            {
                alert("There was a problem adding this item. Please check your connections and try again");

            }

        },

        onDeleteComplete: function(event, selectedId)
        {
            pv.Preloader.hide();
            if (event.success)
            {
                var box = this.view.getElementById(selectedId);
                if (box) this.view.removeBox(box);
                var record = this.model.getElementByID(selectedId);
                if (record) this.model.remove(record);
            }
        },

        onClickView: function(e)
        {
            if (e.originalEvent.target == this.view.getGraphic()) this.closeAllDialogs();
        },

        closeAllDialogs: function()
        {
            for(var i = 0; i < this.elements.length; i++)
            {
                var box = this.elements[i];
                if (box.dialog) box.dialog.close();
            }
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHART;
        }
    }
);

spx.controller.OrgChartBoxController = spx.controller.ComponentController.extend
(
    {

        __init: function()
        {
            this.__super();
            this.view.addEventListener(this, sp.core.events.MouseEvent.DOUBLECLICK, this.onDoubleClick);
            this.refreshPosition();
        },

        onViewChange: function(event)
        {
            this.model.updateFields(event.data);
            event.target.refreshAllLines();
        },

        onDoubleClick: function()
        {
            if (this.dialog) this.dialog.open();
        },

        refreshPosition: function()
        {
            this.view.refreshPosition();
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTBOX;
        }
    }
);

spx.controller.OrgChartDialogController = spx.controller.ComponentController.extend
(
    {
        __init: function()
        {
            this.__super();
            this.view.addEventListener(this, sp.core.events.UIEvent.CLOSE, this.close);
        },

        onViewChange: function(event)
        {
            this.model.updateFields(event.data);
        },

        open: function()
        {
            this.view.setVisible(true); //TODO: centering is currently done via css, but we may need to center on open with javascript as the dialog height is not fixed
        },

        close: function()
        {
            this.view.setVisible(false);
        },

        getType:function()
        {
            return spx.model.layout.ElementTypes.ORGCHARTDIALOG;
        }
    }
);


spx.controller.ControllerFactory =
{
    create:function(parent,view,data,model)
    {
        // the lines below were originally in a try catch (see below..) but this made them almosti impossible to detect, or debug
        // so I have removed them from the try catch because I am not sure it adds any value
        if(data.getController())
        {
            var controller = eval("new " + data.getController()  +"(parent,view,data,model)");
            if(controller) return controller;
        }
        try
        {


        }
        catch(e)
        {

        }
        //sp.out(" getting controller for type:"  + data.getType());
        switch(data.getType())
        {
            case spx.model.layout.ElementTypes.CONTAINER:
                return new spx.controller.ContainerController(parent,view,data,model);
            case spx.model.layout.ElementTypes.COMPONENT:
                return new spx.controller.ComponentController(parent,view,data,model);
            case spx.model.layout.ElementTypes.PAGESET:
                return new spx.controller.PageSetController(parent,view,data,model);
            case spx.model.layout.ElementTypes.PAGE:
                return new spx.controller.PageController(parent,view,data,model);
            case spx.model.layout.ElementTypes.BUTTON:
                return new spx.controller.ButtonController(parent,view, data, model);
            case spx.model.layout.ElementTypes.LABEL:
                return new spx.controller.LabelController(parent,view,data,model);
            case spx.model.layout.ElementTypes.TEXTFIELD:
                return new spx.controller.TextFieldController(parent,view,data,model);
            case spx.model.layout.ElementTypes.TEXTAREA:
                return new spx.controller.TextAreaController(parent,view,data,model);
            case spx.model.layout.ElementTypes.NUMERICFIELD:
                return new spx.controller.NumericFieldController(parent,view,data,model);
            case spx.model.layout.ElementTypes.DATEFIELD:
                return new spx.controller.DateFieldController(parent,view, data, model);
            case spx.model.layout.ElementTypes.COMBO:
                return new spx.controller.ComboController(parent,view,data,model);
            case spx.model.layout.ElementTypes.CHECKBOX:
                return new spx.controller.CheckboxController(parent,view,data,model);
            case spx.model.layout.ElementTypes.SLIDER:
                return new spx.controller.SliderController(parent,view,data,model);
            case spx.model.layout.ElementTypes.TABLE:
                return new spx.controller.TableController(parent,view,data,model);
            case spx.model.layout.ElementTypes.TABLECOLUMN:
                return new spx.controller.TableColumnController(parent,view,data,model);
            case spx.model.layout.ElementTypes.IMAGE:
                return new spx.controller.ImageController(parent,view,data,model);
            case spx.model.layout.ElementTypes.RADIOGROUP:
                return new spx.controller.RadioGroupController(parent,view,data,model);
            case spx.model.layout.ElementTypes.RICHTEXT:
                return new spx.controller.RichTextController(parent,view,data,model);
            case spx.model.layout.ElementTypes.DIALOG:
                return new spx.controller.DialogController(parent,view,data,model);
            case spx.model.layout.ElementTypes.RECORDVIEW:
                return new spx.controller.RecordViewController(parent,view,data,model);
            case spx.model.layout.ElementTypes.FILTER:
                return new spx.controller.Filter(parent, view, data, model);
            case spx.model.layout.ElementTypes.REPEATER:
                return new spx.controller.RepeaterController(parent, view, data, model);
            case spx.model.layout.ElementTypes.ORGCHART:
                return new spx.controller.OrgChartController(parent, view, data, model);
            case spx.model.layout.ElementTypes.ORGCHARTBOX:
                return new spx.controller.OrgChartBoxController(parent, view, data, model);
            case spx.model.layout.ElementTypes.ORGCHARTDIALOG:
                return new spx.controller.OrgChartDialogController(parent, view, data, model);
            case spx.model.layout.ElementTypes.LOOKUP:
                return new spx.controller.LookupController(parent, view, data, model);
            case spx.model.layout.ElementTypes.CHART:
                return new spx.controller.ChartController(parent, view, data, model);
            case spx.model.layout.ElementTypes.BARCHART:
                return new spx.controller.BarChartController(parent, view, data, model);
            case spx.model.layout.ElementTypes.LINECHART:
                return new spx.controller.LineChartController(parent, view, data, model);
            case spx.model.layout.ElementTypes.AREACHART:
                return new spx.controller.AreaChartController(parent, view, data, model);
            case spx.model.layout.ElementTypes.PIECHART:
                return new spx.controller.PieChartController(parent, view, data, model);
            case spx.model.layout.ElementTypes.UNSUPPORTED:
                return new spx.controller.UnsupportedController(parent, view, data, model);
        }
    }
};