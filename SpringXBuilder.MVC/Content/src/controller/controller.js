sp.namespace('pv.controller');

pv.controller.MainController = spx.controller.ElementController.extend
(
{
    __init: function () {
        this.__super();
        spx.Model.onSave = $.proxy(this.onModelSaved, this);
        this.view.setVisible(true);
        pv.Preloader.hide();
        this.buttonController = this.getElementByID("buttons");
        if (!this.buttonController || !this.buttonController.hasSaveButton()) {
            spx.Model.addEventListener(this, sp.core.data.DataEvent.SAVE, this.onModelSaveRequest);

        }
        else {
            this.model.removeEventListener(this, sp.core.data.DataEvent.CHANGE, this.onModelChange);
            this.buttonController.addEventListener(this, pv.controller.ButtonEvent.SAVE, this.onClickSave);
        }
    },

    onClickSave: function () {
        this.onModelSaveRequest();
        spx.Model.save();
    },

    onModelSaveRequest: function () {
        var str = function (a, b) { return spx.model.Strings.getInstance().getLocalOr(a, b) };
        pv.Preloader.show(str('SAVING'));
    },

    onModelSaved: function (event) {
        pv.Preloader.hide();
        this.view.init();
        this.__init();
        //spx.windowReload(); // Commenting back in this line will cause the whole page to reload which is slow! Page Builder PB-623
    },

    onModelChange: function (event) {
        //if we have multiple consecutive model changes, send only a single request after a small delay
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(function () {
            spx.Model.save();
        }, 100);
    }
}
);

pv.controller.ButtonController = spx.controller.ElementController.extend
({
    __init: function () {
        this.__super();
        this.saveButton = this.view.getElement("save").getGraphic();
        var __this = this;
        $(this.saveButton).on("click", function () { __this.onSaveButtonClick() })
    },

    toString: function () {
        return "ButtonController";
    },

    hasSaveButton: function () {
        return (this.saveButton) ? true : undefined;
    },

    onSaveButtonClick: function (event) {
        this.dispatchEvent(new sp.core.events.MouseEvent(this, pv.controller.ButtonEvent.SAVE));
    }
});

pv.controller.ButtonEvent = sp.core.events.Event.extend
({

});
pv.controller.ButtonEvent.SAVE = "save";

//extend springX controllers
spx.controller.TableController.prototype.sort = function (rec1, rec2, prop, order) {
    var column = this.getElementByID(prop);
    var field1 = rec1.getElementByID(column.getProperty());
    var field2 = rec2.getElementByID(column.getProperty());
    var a = field1.getData();
    var b = field2.getData();

    var columnData = this.data.getElement(prop);

    var columnType = columnData.getType();
    if (columnType === spx.model.layout.ElementTypes.TABLECOLUMN && columnData.elements.length > 0) {
        columnType = columnData.elements[0].getType();
    }

    switch (columnType) {
        case spx.model.layout.ElementTypes.DATEFIELD:
            if (a) a = new sp.core.date.Date(a).date;
            if (b) b = new sp.core.date.Date(b).date;
            break;
        case spx.model.layout.ElementTypes.NUMERICFIELD:
            a = Number(a) || 0;
            b = Number(b) || 0;
            break;
        case spx.model.layout.ElementTypes.CHECKBOX:
            a = sp.core.data.DataUtils.toBoolean(a);
            b = sp.core.data.DataUtils.toBoolean(b);
            break;
    }
    if (order === sp.ui.table.TableSortOrder.ASCENDING) return (a > b) ? 1 : (a < b) ? -1 : 0;
    if (order === sp.ui.table.TableSortOrder.DESCENDING) return (a > b) ? -1 : (a < b) ? 1 : 0;
};


pv.controller.CastlesTest = spx.controller.ContainerController.extend({
    __init: function () {
        this.__super();
        sp.out("Running castles test");
    },
    runMe: function () {
        sp.out("Button clicked");
        var example = spx.evaluate('{example-dialog}').createDialog()
        example.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, function(e) { alert(e.target.getData()) });
        example.open()
    },
    onClickView: function (data) {
        debugger;
        this.runMe();
    },
});

debugger;

sp.namespace('dialog.ExampleDialogExtension');

dialog.ExampleDialogExtension = {
    getData: function () {
        var combo = $(this.getGraphic()).find('#example_dialog_combo select')
        return combo.val()
    }
}

