sp.namespace("plugins.dialog.Dialog");

/*
    *********************************
    SpringX Dialog Plug-in
    *********************************
    Defined as an resource having an inner "plugins.dialog.Dialog" tag with the following structure:
    Attributes:
        record - OPTIONAL. Record/RecordSet to which the dialog is bound. 
            Minimal content is 'main'. Example setting:
                record="main.actions" -> linked to the 'actions' recordset, will edit a single action record
        class_name - OPTIONAL. If set will alias the dialog class to the specified class name.
            Example setting:
                class_name="myapplet.ui.FooDialog"
        extend_with - OPTIONAL. If set will extend the generated dialog class with the specified JSON object.
            Overriden methods can be called with this.__super() (see example below)
    Child nodes:
        <options> - OPTIONAL. Every child node is passed as an option to the jqueryUI dialog underneath.
            Options are evaluated for language strings. At the time of writing jqueryUI used is 1.8.
            Here's the API doc: http://api.jqueryui.com/1.8/dialog/
            Options that can be useful are: closeOnEscape dialogClass disabled draggable height
            maxHeight maxWidth minHeight minWidth modal position resizable stack title width zIndex
        <content> - MANDATORY. A springx UI definition for the content of the dialog

    ---------------------------------
    Table controller:
    ---------------------------------
    For tables you can subclass/use the plugins.dialog.DialogTableController class that automatically
    hooks up listeners to the add_button of the table and double clicking on records to open the dialog
    and syncs the data back to the original model on dialog close. Then you can use the additional
    "dialog" property to which you can set a dialog resource id or dialog class name.


    *********************************
    Example usage
    *********************************

    Elaborate example
    ---------------------------------
    1. XML:
    <resource id="board-member-dialog">
        <plugins.dialog.Dialog
            record="main.applet_contacts"
            extend_with="dialog.TestDialogExtensions"
            class_name="dialog.BoardMemberDialog" >
            <options>
                <title>str_test</title>
                <resizable>false</resizable>
                <width>500</width>
            </options>
            <content class="board-member-dialog">
                <container>
                    <label class="field-label left">Contact</label>
                    <field class="field" binding="contact_id" type="combo"
                        controller="plugins.contacts.ContactSelector" />
                </container>
                <container>
                    <label class="field-label left">Is board Member?</label>
                    <field class="field" binding="is_board_member" type="checkbox" />
                </container>
            </content>
        </plugins.dialog.Dialog>
    </resource>

    2. Extension object:
    sp.namespace('dialog.TestDialogExtensions')
    dialog.TestDialogExtensions = {
        getButtonOptions:function()
        {
            var buttons = this.__super()
            buttons["Third button"] = function(){alert('third button clicked')}
            return buttons
        },
        // example validation
        onBeforeOK:function()
        {
            if (!this.getData().getElementValue('contact_id'))
            {
                alert('please select contact')
                return true
            }
        }
    }

    3. Instantiating dialog:
        // all three methods are applicable
        // if class_name was specified:
        this.dialog = new dialog.BoardMemberDialog()
        // using the resorce.createDialog method
        this.dialog = spx.model.resources.Resources.getResourceByID('board-member-dialog').createDialog()
        this.dialog = spx.evaluate('{board-member-dialog}').createDialog()

    4. Example controller using the dialog (custom, not using plugins.dialog.DialogTableController):
    tc.controller.BoardMembersTableController = spx.controller.TableController.extend
    (
    {
        __init:function()
        {
            this.__super();
            this.dialog = new dialog.BoardMemberDialog()
            this.dialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onDialogClose)
            this.table.addEventListener(this, sp.ui.table.TableEvent.CELLDOUBLECLICK, this.onCellDblClick)
        },
        onAddButton:function()
        {
            // new item
            this.dialog.setData(null)
            this.dialog.open()
        },
        onCellDblClick:function(event)
        {
            this.dialog.setData(event.data)
            this.dialog.open()
        },
        onDialogClose:function(event)
        {
            if (!event.result == sp.ui.dialogs.Dialog.DIALOG_OK) return
            var dialogData = event.target.getData()
            var originalRecord = this.model.getElementByID(dialogData.getID())
            var newRecord = originalRecord? null : this.model.create()
            event.target.copyRecordData(dialogData, originalRecord? originalRecord : newRecord)
            if (!originalRecord) this.model.add(newRecord)
        }
    }
    )
    * The same result can be achieved without writing a custom controller by setting the table up like this:
    <table
        dialog="board-member-dialog"  // dialog.BoardMemberDialog also possible
        add_button="add_contact_button"
        id="board_members_table"
        controller="plugins.dialog.DialogTableController"
        binding="applet_contacts" >
        ...


    ---------------------------------
    Simple example
    ---------------------------------
    A dialog that is not bound to a record:
    1. XML
    <resource id="example-dialog">
        <plugins.dialog.Dialog
            extend_with="dialog.ExampleDialogExtension" >
            <content>
                <label class="field-label left">Industry type</label>
                <field class="field" id="example_dialog_combo" type="combo" dataProvider="industry_types" />
            </content>
        </plugins.dialog.Dialog>
    </resource>

    2. Extension object, define a custom getData method so we can get information from the dialog
    dialog.ExampleDialogExtension = {
        getData:function()
        {
            var combo = $(this.getGraphic()).find('#example_dialog_combo select')
            return combo.val()
        }
    }

    3. Usage
    var example = spx.evaluate('{example-dialog}').createDialog()
    example.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, function(e){ alert(e.target.getData()) })
    example.open()

*/
debugger;
plugins.dialog.Dialog = Class.extend
(
    {
        __constructor:function(xml)
        {
            this.xml = xml
            var $xml = $(xml)
            this.$xml = $xml

            this.dialogClass = sp.ui.dialogs.Dialog.extend
            (
            {
                __constructor:function()
                {
                    this.__super()
                },
                getSettings:function()
                {
                    var options = {}
                    $xml.find(">options").children().each(function(i,c)
                    {
                        var itemText = $(c).text()
                        options[c.nodeName] = spx.model.Strings.getInstance().getLocalOr(itemText, itemText)
                        if (itemText=='true' || itemText=='false') options[c.nodeName] = sp.core.data.DataUtils.toBoolean(itemText)
                    })
                    return options;
                },
                copyRecordData:function(original, copy)
                {
                    var isField = function(element) { return element.getType().toLowerCase()==spx.model.datastructure.FieldTypes.FIELD.toLowerCase() }
                    var isRecord = function(element) { return element.getType().toLowerCase()==spx.model.datastructure.FieldTypes.RECORD.toLowerCase() }
                    var isRecordSet = function(element) { return element.getType && element.getType().toLowerCase()==spx.model.datastructure.FieldTypes.RECORDSET.toLowerCase() }
                    var originalIds = {}
                    for (var prop in original.elements)
                    {
                        if (!original.elements.hasOwnProperty(prop)) continue
                        var currentElementOriginal = original.elements[prop]
                        if (isRecordSet(original)) originalIds[currentElementOriginal.getID()] = true
                        var currentElementCopy = copy.elements[prop]
                        if (isField(currentElementOriginal))
                        {
                            currentElementCopy.setData(currentElementOriginal.getData())
                        } else if (isRecordSet(currentElementOriginal) || isRecord(currentElementOriginal))
                        {
                            var haveToAddCopiedItem = false;
                            if (!currentElementCopy)
                            {
                                if (isRecordSet(copy)) currentElementCopy = copy.create();
                                else if (isRecord(copy)) currentElementCopy = spx.model.datastructure.FieldFactory.create(currentElementOriginal.getType(), currentElementOriginal.refData)
                                haveToAddCopiedItem = true;
                            }
                            this.copyRecordData(currentElementOriginal, currentElementCopy)
                            if (haveToAddCopiedItem && isRecordSet(copy)) copy.add(currentElementCopy);
                            else if (haveToAddCopiedItem && isRecord(copy)) copy.addElement(currentElementCopy);
                        }
                    }
                    if (isRecordSet(original))
                    {
                        var idsToRemove = []
                        for (var prop in copy.elements)
                        {
                            if (!copy.elements.hasOwnProperty(prop)) continue
                            if (!originalIds[copy.elements[prop].getID()]) idsToRemove.push(copy.elements[prop].getID())
                        }
                        $.each(idsToRemove, function(i,id){ copy.remove(copy.getElementByID(id)) })
                    }
                    return copy;
                },
                getReferenceRecord:function()
                {
                    var isRecordSet = function(element) { return element.getType().toLowerCase()==spx.model.datastructure.FieldTypes.RECORDSET.toLowerCase() }
                    var recordPath = $xml.attr("record")
                    if (!recordPath) throw ""
                    var recordPathParts = recordPath.split('.')
                    if (recordPathParts[0] != 'main') throw "dialog plugin:: record path must start with 'main' record. current value record=\""+recordPath+"\""
                    var record = spx.Model.getRecordModel()
                    recordPathParts.shift()
                    var currentPath = null
                    while (currentPath = recordPathParts.shift())
                    {
                        var item = record.getElementByID(currentPath)
                        record = item;
                    }
                    if (isRecordSet(record))
                    {
                        // if recordset - get reference record
                        return $(record.refData).find('>record')[0]
                    }
                    return record.refData
                },
                populate:function()
                {
                    this.initialiPopulated = true;
                    this.clear()

                    this.currentModel = null
                    try
                    {
                        var refData = this.getReferenceRecord()
                        var clonedRecord = spx.model.datastructure.FieldFactory.create(spx.model.datastructure.FieldTypes.RECORD, refData)
                        this.copyRecordData(this.data, clonedRecord)
                        this.currentModel = clonedRecord
                    } catch(e) {if(e) {sp.out(e); throw e}}

                    this.currentLayout = new spx.model.layout.Application($xml.find('content')[0]);
                    this.currentView = new spx.view.Container(this.currentLayout)
                    this.addElement(this.currentView)
                    var controller = new spx.controller.ContainerController(null, this.currentView, this.currentLayout, this.currentModel)
                },
                open:function()
                {
                    if (!this.initialiPopulated) this.populate()
                    this.__super();
                },
                getData:function()
                {
                    return this.currentModel
                }
            }
            )

            var dialogClassName = $xml.attr('class_name')
            if (dialogClassName)
            {
                sp.namespace(dialogClassName)
                eval(dialogClassName + ' = this.dialogClass;')
            }
            var extendWith = $xml.attr('extend_with')
            if (extendWith)
            {
                this.extendDialogClass(eval(extendWith))
            }
        },
        extendDialogClass:function(methods)
        {
            var classRef = this.dialogClass
            $.each(methods, function(name,def)
            {
                if (typeof(def)!='function') return
                var original = classRef.prototype[name]
                classRef.prototype[name] = function()
                {
                    var prevSuper = this.__super
                    this.__super = original
                    var res = def.apply(this, arguments)
                    this.__super = prevSuper
                    return res;
                }
            })
        },
        getDialogClass:function()
        {
            return this.dialogClass;
        },
        createDialog:function()
        {
            return new this.dialogClass();
        }
    }
);

plugins.dialog.DialogTableController = spx.controller.TableController.extend
(
{
    __init:function()
    {
        this.__super();
        this.dialog = this.getDialog()
        this.dialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onDialogClose)
        this.table.addEventListener(this, sp.ui.table.TableEvent.CELLDOUBLECLICK, this.onCellDblClick)
    },
    getDialog:function()
    {
        var dialogRef = $(this.data).attr('dialog')
        if (!dialogRef) throw "plugins.dialog.DialogTableController:: no 'dialog' attribute set"
        var resource = spx.model.resources.Resources.getResourceByID(dialogRef)
        if (resource && resource.createDialog) return resource.createDialog()
        try
        {
            return eval("new "+dialogRef+"()")
        } catch(e)
        {
            throw(e)
        }
        return null;
    },
    refreshTable:function()
    {
        if (!this.refreshSuspended) this.__super()
    },
    onAddButton:function()
    {
        // new item
        this.dialog.setData(null)
        this.dialog.open()
    },
    onCellDblClick:function(event)
    {
        this.dialog.setData(event.data)
        this.dialog.open()
    },
    onDialogClose:function(event)
    {
        if (!event.result == sp.ui.dialogs.Dialog.DIALOG_OK) return
        this.refreshSuspended = true
        var dialogData = event.target.getData()
        var originalRecord = this.model.getElementByID(dialogData.getID())
        var newRecord = originalRecord? null : this.model.create()
        event.target.copyRecordData(dialogData, originalRecord? originalRecord : newRecord)
        this.refreshSuspended = false
        if (!originalRecord) this.model.add(newRecord)
        this.refreshTable()
    }
}
)


