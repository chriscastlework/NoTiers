sp.namespace("spx.controller.OrgChartController");


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
                    var boxView = new spx.view.OrgChartBox(boxData, this.view, modelData[i]); // view
                    var box = spx.controller.ControllerFactory.create(this, boxView, boxData, modelData[i]); // controller

                    //sp.out("modelData[i]:" +modelData[i]);
                    //sp.out("boxView:" + boxView);
                    //sp.out("box:" + box);

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
            //if(this.lookupData)
            //{
            if (confirm('Are you sure?')) //TODO: springs confirm dialog
            {
                var __this = this;
                var linkData = this.model.refData.getAttribute('linkData');
                if (linkData)
                {
                    var deleteURL = spx.AppletParameters.getParam('savelinkedobject');

                    linkData = JSON.parse(decodeURIComponent(linkData));
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
            if(event.success)
            {
                location.reload(true);
                // Commented out 9/11/2016 because DealContacts ... Contacts do not have custom fileds and the save stops working

                //var DataUtils = sp.core.data.DataUtils;
                //var newId = DataUtils.valueAtPath(event, 'target.parsedData.id') || sp.guid();
                //var record = DataUtils.valueAtPath(event, 'target.parsedData.record'); // the backend returns the item which it creates...
                //record.id = sp.guid();
                //record.CrmID = record.Id; // we need to record the CRM id as a property, so that the CRM can find this item on a save, remove etc..
                ////record.id = record.CrmId;
                //var newItem = this.model.create();
                //newItem.setData(record);
                //this.model.add(newItem);
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
            sp.out("Box controller, onViewChange:" + JSON.stringify(event.data));
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