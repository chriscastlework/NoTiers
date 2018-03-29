sp.namespace(
    "sp.ui.charts.SunChart",
    "sp.ui.charts.SunChartOptions",
    "sp.ui.charts.sunchart.Label",
    "sp.ui.charts.sunchart.Arrow",
    "sp.ui.charts.sunchart.PostIt",
    "sp.ui.charts.sunchart.EditPostItDialog",
    "sp.ui.charts.sunchart.EditArrowTextDialog",
    "sp.ui.charts.sunchart.EditLabelDialog"
);

sp.ui.charts.SunChartMode =
{
    HIDE: 'hide',
    DELETE: 'delete'
}

sp.ui.charts.SunChartOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    setDefaults: function()
    {
        this.__super();

        this.defaultColumnCount = 4;
        this.defaultRowCount = 4;
        this.mode = sp.ui.charts.SunChartMode.DELETE;
        this.columnLabels = ['Timescale 1', 'Timescale 2', 'Timescale 3', 'Timescale 4'];
        this.rowLabels = ['Stream 1', 'Stream 2', 'Stream 3', 'Stream 4'];
        this.rowColors = ['#90ee90', '#add8e6', '#f08080', '#ffb6c1'];
        this.defaultNewRowColors = ['#90ee90', '#add8e6', '#f08080', '#ffb6c1'];
        this.arrowText = "Description of key account development goals";
        this.addColumnBtnText = "Add column";
        this.addRowBtnText = "Add row";
        this.draggableText = "Drag me!";
        this.newRowText = "New Row";
        this.newColumnText = "New Column";
        this.columnVisibility = [true, true, true, true];
        this.rowVisibility = [true, true, true, true];
        this.axisLimit = 10;
        this.postItChars = 100;
        this.editLabelsOnSingleClick = false;
        this.editPostItInline = false;
        this.editArrowTextInline = false;
        this.offsetX = 50;
        this.offsetY = 50;
        this.maxVerticalLabelLength = 0;
        this.maxHorizontalLabelLength = 0;
    }
}
);

sp.ui.charts.SunChart = sp.ui.charts.BaseChart.extend
(
{
    __constructor: function(container, options)
    {
        options = options || new sp.ui.charts.SunChartOptions();
        this.__super('sun', container, options);
    },

    init: function ()
    {
        var lang = sp.core.locale.getLocale();

        // alias jquery wrapper for container for convenience
        this.$container = $(this.container);

        // validate options
        var o = this.options;
        if (o.defaultColumnCount > 4) throw "Can't have more than 4 columns in SunChart.";
        if (o.defaultRowCount > 4) throw "Can't have more than 4 rows in SunChart.";

        // initialize fields
        this.labels = [];
        this.postIts = new sp.core.data.IndexedDataList();
        this.dataProvider = new sp.core.data.IndexedDataList();

        // dialogs
        var sunchart = sp.ui.charts.sunchart;
        this.editPostItDialog = new sunchart.EditPostItDialog(this.options.postItChars);
        this.editPostItDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onPostItEditDialogClose);
        this.editLabelDialog = new sunchart.EditLabelDialog();
        this.editLabelDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onLabelEditDialogClose);
        this.editArrowTextDialog = new sunchart.EditArrowTextDialog();
        this.editArrowTextDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onArrowTextEditDialogClose);
        this.confirmDeleteDialog = new sp.ui.dialogs.ConfirmDialog({message: lang.getString("WS_5_2","Are you sure you want to delete this item? This action cannot be undone.")});
        this.confirmDeleteDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onConfirmDeleteDialogClose);

        // set container class
        this.$container.addClass('sp_ui_sunchart');
    },

    // ----------------------------------------------------------
    // data provider and data change listeners
    // ----------------------------------------------------------

    setDataProvider: function (dataProvider)
    {
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.ADD,this.onAdd);
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.REMOVE,this.onRemove);
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.EDIT,this.onEdit);
        this.dataProvider.removeEventListener(this,sp.core.data.DataEvent.SET,this.onDataSet);
        this.dataProvider = dataProvider;
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.ADD,this.onAdd);
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.REMOVE,this.onRemove);
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.EDIT,this.onEdit);
        this.dataProvider.addEventListener(this,sp.core.data.DataEvent.SET,this.onDataSet);
        this.redraw();
    },

    onAdd: function (event)
    {
        var postit = this.drawPostIt(event.data);
        if (postit.options.editInline)
        {
            var __this = this;
            $(postit.innerDiv).css("visibility","hidden");
            $(postit.textarea.getGraphic()).css("visibility","visible");
            $(postit.textarea.getGraphic()).focus().select();
            $(postit.textarea.getGraphic()).blur(function(){__this.onPostItTextareaLoseFocus(postit)});
        }
    },

    onEdit: function (event)
    {
        var id = event.data.ID;
        var postIt = this.postIts.getItemByProperty('itemID', id);
        postIt.setColor(this.options.rowColors[event.data.row] || 'white');
        postIt.setText(event.data.text);
    },

    onRemove: function (event)
    {
        var id = event.data.ID;
        var postIt = this.postIts.getItemByProperty('itemID', id);
        if (!postIt) return;
        this.postIts.removeItem(postIt);
        postIt.remove();
    },

    onDataSet: function (event)
    {
        this.redraw();
    },

    // ----------------------------------------------------------
    // data provider and data change listeners
    // ----------------------------------------------------------


    // ----------------------------------------------------------
    // drawing
    // ----------------------------------------------------------

    redraw: function ()
    {
        this.draw();
    },

    draw: function ()
    {
        if (!this.canvas) this.createCanvasAndItemOverlay();

        this.$container.css('width', this.options.width);
        this.$container.css('height', this.options.height);

        this.canvasWidth = this.options.width - 2*this.options.offsetX;
        this.canvasHeight = this.options.height - 2*this.options.offsetY;
        this.canvasXOffset= this.options.offsetX;
        this.canvasYOffset = this.options.offsetY;

        $(this.canvas).
            attr('width', this.canvasWidth).
            attr('height', this.canvasHeight).
            css({
                left: this.canvasXOffset,
                top: this.canvasYOffset
            });
        $(this.itemsOverlay).css({
            left: this.canvasXOffset,
            top: this.canvasYOffset,
            width: this.canvasWidth,
            height: this.canvasHeight
        });

        this.drawGrid();
        this.drawLabels();
        this.drawArrow();
        this.drawContent();
        this.drawUI();
    },

    createCanvasAndItemOverlay: function ()
    {
        this.canvas = new sp.core.graphics.Graphic().createElement("canvas");
        this.context = this.canvas.getContext('2d');
        $(this.canvas).addClass('grid_canvas');

        this.itemsOverlay = document.createElement('div');
        $(this.itemsOverlay).addClass('items_overlay');
        $(this.itemsOverlay).droppable({drop: $.proxy(this.onDrop, this)});

        this.$container.droppable({drop: $.proxy(this.onOutsideDrop, this)});

        this.$container.append(this.canvas, this.itemsOverlay);
    },

    drawUI: function ()
    {
        if (this.newPostItDraggable) this.newPostItDraggable.remove();
        if (this.unhideAllButton) this.unhideAllButton.remove();

        var newPostItDraggable = new sp.ui.charts.sunchart.PostIt({
            ID: '___NEW___',
            text: this.options.draggableText
        }, {
            width: this.canvasWidth * 0.1,
            height: this.canvasHeight * 0.1,
            clone: true,
            editInline: false
        }, this);
        newPostItDraggable.addClass('new_postit_draggable');
        this.newPostItDraggable = newPostItDraggable;

        if (this.options.mode === sp.ui.charts.SunChartMode.HIDE &&  this.hasHiddenRowOrColumn())
        {
            var unhideAllButton = $('<a href="#" class="unhide_all sunchart_button">Unhide all</a>');
            unhideAllButton.click($.proxy(this.onUnhideAllClick, this));
            this.unhideAllButton = unhideAllButton;
            this.$container.append(unhideAllButton);
        } else if (this.options.mode === sp.ui.charts.SunChartMode.DELETE)
        {
            var addColumnButton, addRowButton;
            if (!this.addColumnButton)
            {
                addColumnButton = $('<a href="#" class="add_column sunchart_button">' + this.options.addColumnBtnText + '</a>');
                addColumnButton.click($.proxy(this.onAddColumnClick, this));
                this.addColumnButton = addColumnButton;
            }
            if (!this.addRowButton)
            {
                addRowButton = $('<a href="#" class="add_row sunchart_button">' + this.options.addRowBtnText + '</a>');
                addRowButton.click($.proxy(this.onAddRowClick, this));
                this.addRowButton = addRowButton;
            }
            if (addColumnButton || addRowButton)
            {
                this.$container.append(addColumnButton, addRowButton);
            }
        }
        this.$container.append(newPostItDraggable.getGraphic());
        if (!this.bin)
        {
            this.bin = sp.core.graphics.create('div', {classes:['bin']});
            this.$container.append(this.bin.getGraphic());
        }
    },

    drawArrow: function ()
    {
        var __this = this;
        if (this.arrow) this.arrow.remove();

        var arrowWidth = this.canvasWidth*0.2;
        var arrowHeight = this.canvasHeight*0.7;
        var arrow = new sp.ui.charts.sunchart.Arrow(arrowWidth, arrowHeight, this.options.editArrowTextInline);
        if (!this.options.editArrowTextInline)
        {
            arrow.addEventListener(this, sp.core.events.MouseEvent.DOUBLECLICK, this.onArrowDoubleClick);
        }
        else
        {
            $(arrow.textContainer).change(function() {__this.onArrowTextChange(arrow)});
        }
        var arrowTop = (this.options.height - arrowHeight) / 2;
        arrow.setY(arrowTop);
        this.$container.append(arrow.getGraphic());
        if (arrow.placeholder)
        {
            $(arrow.placeholder).css('top', arrowTop);
            this.$container.append(arrow.placeholder);
        }

        this.$container.mousedown($.proxy(this.onMouseDown, this));
        this.$container.mouseup($.proxy(this.onMouseUp, this));

        arrow.setText(this.options.arrowText);
        this.arrow = arrow;
    },

    onMouseUp: function()
    {
        $(this.arrow.placeholder).removeClass('active');
    },

    onMouseDown: function(event)
    {
        if (event.target != this.itemsOverlay)
        {
            if ($(event.target).parent().hasClass('post_it')) this.arrow.onTextBlur();
            $(this.arrow.placeholder).removeClass('active');
            this.arrow.preventDefault = true;
        }
        else
        {
            this.arrow.preventDefault = false;
            $(this.arrow.placeholder).addClass('active');
        }
    },

    drawGrid: function ()
    {
        var context = this.context;
        var columnCount = this.getColumnCount();
        var rowCount = this.getRowCount();

        context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        context.strokeRect(0,0,this.canvasWidth,this.canvasHeight);

        var x = this.canvasWidth*3;
        var y = this.canvasHeight/2;
        var xOffset = 1 / columnCount;

        // columns
        context.beginPath();
        for (var i=0; i<(columnCount-1); i++)
        {
            var radius = this.canvasWidth * (1+(0.5*i));
            radius = this.canvasWidth * (2 + xOffset + i*xOffset);

            context.arc(x,y,radius,0,2*Math.PI);
        }
        context.stroke();

        // rows
        context.beginPath();
        for (var i=1; i<rowCount; i++)
        {
            context.moveTo(0, this.canvasHeight*i*(1/rowCount));
            context.lineTo(this.canvasWidth, this.canvasHeight*i*(1/rowCount));
        }
        context.stroke();
    },

    drawLabels: function ()
    {
        for (var i = 0, label = this.labels[i]; i < this.labels.length; i++, label = this.labels[i])
        {
            if (label && label.remove) label.remove();
        }
        this.labels = [];

        var columnCount = this.getColumnCount();
        var rowCount = this.getRowCount();
        var columnWidth = this.getColumnWidth();
        var rowHeight = this.getRowHeight();

        // columns
        for (var i=0; i<columnCount; i++)
        {
            var label = new sp.ui.charts.sunchart.Label({
                label: this.getColumnLabel(i),
                width: columnWidth,
                type: sp.ui.charts.sunchart.Label.Type.COLUMN,
                index: this.getVisibleColumnRealIndex(i),
                maxLength: this.options.maxHorizontalLabelLength
            });
            this.labels.push(label);
            label.setX(this.canvasXOffset + (this.canvasWidth*(1/columnCount)*i));
            label.setY(this.canvasYOffset - 24);
            this.$container.append($(label.getGraphic()))
        }

        // rows
        for (var i=0; i<rowCount; i++)
        {
            var label = new sp.ui.charts.sunchart.Label({
                label: this.getRowLabel(i),
                width: rowHeight,
                vertical: true,
                type: sp.ui.charts.sunchart.Label.Type.ROW,
                index: this.getVisibleRowRealIndex(i),
                maxLength: this.options.maxVerticalLabelLength
            });
            this.labels.push(label);
            label.setX(this.canvasXOffset - 24);
            label.setY(this.canvasYOffset + (this.canvasHeight*(1/rowCount)*i));
            this.$container.append($(label.getGraphic()))
        }

        for (var i = 0, label = this.labels[i]; i < this.labels.length; i++, label = this.labels[i])
        {
            if (!label) continue;
            if (this.options.editLabelsOnSingleClick)
            {
                label.addEventListener(this, sp.core.events.MouseEvent.CLICK, this.onLabelClick);
            }
            else
            {
                label.addEventListener(this, sp.core.events.MouseEvent.DOUBLECLICK, this.onLabelDoubleClick);
            }
            label.addEventListener(this, sp.core.events.Event.HIDE, this.onLabelHide);
            label.render();
        }
    },

    drawContent: function ()
    {
        $(this.itemsOverlay).empty();
        this.postIts = new sp.core.data.IndexedDataList();
        var data = this.dataProvider.getData();

        for (var i = 0, item = data[i]; i < data.length; i++, item = data[i])
        {
            if (item) this.drawPostIt(item);
        }
    },

    drawPostIt: function (data)
    {
        // don't draw it if column/row is hidden
        if (
            !this.options.columnVisibility[data.column]
                || !this.options.rowVisibility[data.row]
            ) return;

        var columnWidth = this.getColumnWidth();
        var rowHeight = this.getRowHeight();

        var postIt = new sp.ui.charts.sunchart.PostIt(data, {
            height: this.canvasHeight*0.15,
            width: this.canvasWidth*0.15,
            editInline: this.options.editPostItInline,
            charLimit: this.options.postItChars
        }, this);
        postIt.addEventListener(this, sp.core.events.DragEvent.DRAG, this.onPostItDrag);

        var postItTop = this.getRealRowVisibleIndex(data.row) * rowHeight + data.yRatio * rowHeight;
        var postItLeft = this.getRealColumnVisibleIndex(data.column) * columnWidth + data.xRatio * columnWidth;
        postIt.setX(postItLeft);
        postIt.setY(postItTop);
        postIt.setColor(this.options.rowColors[data.row] || "white");
        postIt.setText(data.text);

        if (this.options.editPostItInline)
        {
            postIt.addEventListener(this, sp.core.events.MouseEvent.CLICK, this.onPostItClick);
        }
        else
        {
            postIt.addEventListener(this, sp.core.events.MouseEvent.DOUBLECLICK, this.onPostItDoubleClick);
        }

        $(this.itemsOverlay).append(postIt.getGraphic());

        this.postIts.updateItem(postIt);
        return postIt;
    },

    // ----------------------------------------------------------
    // drawing
    // ----------------------------------------------------------



    // ----------------------------------------------------------
    // event handlers
    // ----------------------------------------------------------

    onOutsideDrop: function (event, ui)
    {
        var id = ui.draggable.data('dataItemId');
        if (id === '___NEW___') return;

        $(ui.draggable).css('opacity','1');
        this.confirmDeleteDialog.setData(id);
        this.confirmDeleteDialog.open();
        this.removeOnDrop = false;
        this.closeBin();
    },

    onConfirmDeleteDialogClose: function(event)
    {
        if (event.result != sp.ui.dialogs.Dialog.OK) return;

        var itemID = event.target.data;
        this.dataProvider.removeItemByID(itemID);
    },

    onDrop: function (event, ui)
    {
        if (this.removeOnDrop)
        {
            this.onOutsideDrop(event, ui);
            return;
        }
        var id = ui.draggable.data('dataItemId');
        if (!id) return;
        var isNewItem = id === '___NEW___';
        var position = ui.helper.position();
        if (isNewItem)
        {
            id = sp.guid();
            position.left -= this.canvasXOffset;
            position.top -= this.canvasYOffset;
        }
        var column = Math.floor(position.left / this.getColumnWidth());
        column = column < 0 ? 0 : column;
        var row = Math.floor(position.top / this.getRowHeight());
        row = row < 0 ? 0 : row;
        var xRatio = (position.left % this.getColumnWidth()) / this.getColumnWidth();
        var yRatio = (position.top % this.getRowHeight()) / this.getRowHeight();


        var updatedItem = {
            ID: id,
            column: this.getVisibleColumnRealIndex(column),
            row: this.getVisibleRowRealIndex(row),
            xRatio: xRatio,
            yRatio: yRatio
        };

        this.dataProvider.updateItem(updatedItem);

        if (isNewItem && !this.options.editPostItInline)
        {
            var savedItem = this.dataProvider.getItemByID(id);
            this.editPostItDialog.setData(savedItem);
            this.editPostItDialog.open();
        }
    },

    onUnhideAllClick: function (event)
    {
        var o = this.options;
        for (var i=0; i<o.defaultColumnCount; i++) o.columnVisibility[i] = true;
        for (var i=0; i<o.defaultRowCount; i++) o.rowVisibility[i] = true;
        this.redraw();
    },

    onAddColumnClick: function (event)
    {
        if (this.options.columnVisibility.length < this.options.axisLimit)
        {
            this.options.columnLabels.push(this.options.newColumnText);
            this.options.columnVisibility.push(true);
            this.redraw();
        }
    },

    onAddRowClick: function (event)
    {
        if (this.options.rowVisibility.length < this.options.axisLimit)
        {
            var pushedIndex = this.options.rowLabels.push(this.options.newRowText) - 1;
            if (!this.options.rowColors[pushedIndex]) this.options.rowColors[pushedIndex] = this.getDefaultRowColor();
            this.options.rowVisibility.push(true);
            this.redraw();
        }
    },

    getDefaultRowColor:function()
    {
        var rowColors = this.options.rowColors;
        var defColors = this.options.defaultNewRowColors;
        var lastColor = rowColors[rowColors.length-1];
        var lastColorIndexInDefaultColors = $.inArray(lastColor, defColors);
        if (lastColorIndexInDefaultColors < 0 || lastColorIndexInDefaultColors == defColors.length-1)
        {
            return defColors[0];
        } else 
        {
            return defColors[lastColorIndexInDefaultColors+1];
        }
    },

    onAxisLimitChange: function(event)
    {
        this.options.axisLimit = event.target.getValue();
    },

    onLabelDoubleClick: function (event)
    {
        this.editLabelDialog.setData(event.target);
        this.editLabelDialog.open();
    },

    onLabelClick: function (event)
    {
        var __this = this;
        var lbl = event.target;
        var $inputField = $(lbl.inputField.getGraphic());
        $inputField.css("visibility","visible");
        $(lbl.canvas).css("visibility","hidden");
        $inputField.focus();
        lbl.inputField.setValue(lbl.label);
        $inputField.blur(function(){__this.onLoseFocus(lbl)});
    },

    onLoseFocus: function(lbl)
    {
        var $inputField = $(lbl.inputField.getGraphic());
        $inputField.unbind('blur');
        $inputField.css("visibility","hidden");
        $(lbl.canvas).css("visibility","visible");

        var labelsArr = lbl.options.type == 'column'? this.options.columnLabels : this.options.rowLabels;
        labelsArr[lbl.options.index] = lbl.inputField.getValue();
        this.redraw();
    },

    onLabelHide: function (event)
    {
        if (!this.hideConfirmDialog)
        {
            var options = new sp.ui.dialogs.MessageDialogOptions({ message: sp.core.locale.getString('WS_5_2', 'Are you sure you want to delete this item? This action cannot be undone.') });
            this.hideConfirmDialog = new sp.ui.dialogs.ConfirmDialog(options);
            this.hideConfirmDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onLabelHideConfirm);
        }
        this.hideConfirmDialog.open();
        this.hideDeleteTarget = event.target;
    },

    onLabelHideConfirm: function(event)
    {
        if (event.result !== sp.ui.dialogs.Dialog.OK) return;
        if (this.options.mode === sp.ui.charts.SunChartMode.HIDE) this.onLabelHideHideMode();
        else if (this.options.mode === sp.ui.charts.SunChartMode.DELETE) this.onLabelHideDeleteMode();
        this.redraw();
    },

    onLabelHideHideMode: function ()
    {
        var label = this.hideDeleteTarget;
        var numberOfVisibleItems = 0;
        var isColumn = label.type === sp.ui.charts.sunchart.Label.Type.COLUMN;
        var visibleItemArr = isColumn? this.options.columnVisibility : this.options.rowVisibility;
        var visibleItemLen = isColumn? this.options.defaultColumnCount : this.options.defaultRowCount;
        for (var i=0; i<visibleItemLen; i++) if (visibleItemArr[i]) numberOfVisibleItems++;
        if (numberOfVisibleItems==1) return;

        visibleItemArr[label.index] = false;
    },

    onLabelHideDeleteMode: function ()
    {
        var label = this.hideDeleteTarget;
        var isColumn = label.type === sp.ui.charts.sunchart.Label.Type.COLUMN;
        var itemsArray = isColumn? this.options.columnLabels : this.options.rowLabels;
        var visibilityArray = isColumn? this.options.columnVisibility : this.options.rowVisibility;
        if (itemsArray.length<2) return;

        var filterProperty = isColumn? 'column' : 'row';
        var itemsToRemove = $(this.dataProvider).filter(function(index, item){return item[filterProperty]===label.index});
        for (var i = 0, item = itemsToRemove[i]; i < itemsToRemove.length; i++, item = itemsToRemove[i])
        {
            if (item) this.dataProvider.removeItem(item);
        }

        itemsArray.splice(label.index, 1);
        visibilityArray.splice(label.index, 1);
    },

    onPostItClick: function (event)
    {
        var __this = this;
        var postit = event.target;
        if($(postit.textarea.getGraphic()).is(':focus')) return;
        var postitData = this.dataProvider.getItemByID(postit.itemID);
        $(postit.innerDiv).css("visibility","hidden");
        var $textarea = $(postit.textarea.getGraphic());
        $textarea.css("visibility","visible");
        postit.textarea.setValue(postitData.text);
        $textarea.focus();
        $textarea.blur(function(){__this.onPostItTextareaLoseFocus(postit)});
    },

    onPostItTextareaLoseFocus: function(postit)
    {
        $(postit.textarea.getGraphic()).unbind('blur');
        $(postit.innerDiv).css("visibility","visible");
        $(postit.textarea.getGraphic()).css("visibility","hidden");
        this.dataProvider.updateItem({
            ID: postit.itemID,
            text: postit.textarea.getValue()
        });
    },

    onPostItDoubleClick: function (event)
    {
        var item = this.dataProvider.getItemByID(event.target.itemID);
        this.editPostItDialog.setData(item);
        this.editPostItDialog.open();
    },

    onPostItEditDialogClose: function (event)
    {
        if (event.result !== sp.ui.dialogs.Dialog.OK) return;
        this.dataProvider.updateItem(event.target.getData());
    },

    onLabelEditDialogClose: function (event)
    {
        if (event.result !== sp.ui.dialogs.Dialog.OK) return;
        var data = event.target.getData();
        var labelsArr = data.labelType == 'column'? this.options.columnLabels : this.options.rowLabels;
        labelsArr[data.labelIndex] = data.label;
        this.redraw();
    },

    onArrowDoubleClick: function (event)
    {
        this.editArrowTextDialog.setData(this.options.arrowText);
        this.editArrowTextDialog.open();
    },

    onArrowTextEditDialogClose: function (event)
    {
        if (event.result !== sp.ui.dialogs.Dialog.OK) return;
        var data = event.target.getData();
        this.options.arrowText = data;
        this.redraw();
    },

    onArrowTextChange: function (arrow)
    {
        this.options.arrowText = $(arrow.textContainer).val();
    },

    onPostItDrag: function(event)
    {
        var $el = event.target.$el;
        var binLeft = this.bin.getX();
        var binRight = this.bin.getRight();
        var binTop = this.bin.getY();
        var binBottom = this.bin.getBottom();

        var elementLeft = $el.position().left + this.canvasXOffset;
        var elementRight = elementLeft + $el.width();
        var elementTop = $el.position().top + this.canvasYOffset;
        var elementBottom = elementTop + $el.height();

        var hitBin =
            binRight > elementLeft &&
            binLeft < elementRight &&
            binTop < elementBottom &&
            binBottom > elementTop;

        if (hitBin)
        {
            this.openBin();
            $(event.target.getGraphic()).css('opacity','0.6');
            this.removeOnDrop = true;
        }
        else
        {
            this.closeBin();
            $(event.target.getGraphic()).css('opacity','1');
            this.removeOnDrop = false;
        }
    },

    // ----------------------------------------------------------
    // event handlers
    // ----------------------------------------------------------


    // ----------------------------------------------------------
    // option and property getters and helpers
    // ----------------------------------------------------------

    hasHiddenRowOrColumn: function ()
    {
        var o = this.options;
        for (var i=0; i<o.defaultColumnCount; i++) if (!o.columnVisibility[i]) return true;
        for (var i=0; i<o.defaultRowCount; i++) if (!o.rowVisibility[i]) return true;
        return false;
    },

    getColumnWidth: function ()
    {
        return this.canvasWidth / this.getColumnCount();
    },

    getRowHeight: function ()
    {
        return this.canvasHeight / this.getRowCount();
    },

    getColumnCount: function ()
    {
        if (this.options.mode === sp.ui.charts.SunChartMode.DELETE) return this.options.columnLabels.length;

        var count = 0;
        var visibilities = this.options.columnVisibility;
        for (var i= 0; i<this.options.defaultColumnCount; i++)
        {
            if (visibilities[i]) count++;
        }
        return count;
    },

    getRowCount: function ()
    {
        if (this.options.mode === sp.ui.charts.SunChartMode.DELETE) return this.options.rowLabels.length;

        var count = 0;
        var visibilities = this.options.rowVisibility;
        for (var i= 0; i<this.options.defaultRowCount; i++)
        {
            if (visibilities[i]) count++;
        }
        return count;
    },

    getVisibleItemRealIndex: function (visibleIndex, visibilityArr)
    {
        var realIndex = 0;
        var currentIndex = 0;
        while (true)
        {
            while (!visibilityArr[realIndex]) realIndex++;

            if (currentIndex==visibleIndex) break;
            currentIndex++;
            realIndex++;
        }
        return realIndex;
    },

    getItemVisibleIndex: function (realIndex, visibilityArr)
    {
        var visibleIndex = 0;
        var currentIndex = 0;
        while (true)
        {
            if (currentIndex == realIndex) break;
            if (visibilityArr[currentIndex]) visibleIndex++;
            currentIndex++;
        }
        return visibleIndex;
    },

    getVisibleColumnRealIndex: function (visibleIndex)
    {
        return this.getVisibleItemRealIndex(visibleIndex, this.options.columnVisibility);
    },

    getVisibleRowRealIndex: function (visibleIndex)
    {
        return this.getVisibleItemRealIndex(visibleIndex, this.options.rowVisibility);
    },

    getRealColumnVisibleIndex: function (realIndex)
    {
        return this.getItemVisibleIndex(realIndex, this.options.columnVisibility);
    },

    getRealRowVisibleIndex: function (realIndex)
    {
        return this.getItemVisibleIndex(realIndex, this.options.rowVisibility);
    },

    getColumnLabel: function (visibleIndex)
    {
        return this.options.columnLabels[this.getVisibleColumnRealIndex(visibleIndex)];
    },

    getRowLabel: function (visibleIndex)
    {
        return this.options.rowLabels[this.getVisibleRowRealIndex(visibleIndex)];
    },

    // ----------------------------------------------------------
    // option getters and helpers
    // ----------------------------------------------------------

    // ----------------------------------------------------------
    // additional functions
    // ----------------------------------------------------------

    openBin: function()
    {
        if (!this.bin.hasClass('open')) this.bin.addClass('open');
    },

    closeBin: function()
    {
        if (this.bin.hasClass('open')) this.bin.removeClass('open');
    }
}
);

sp.ui.charts.sunchart.PostIt = sp.core.graphics.Graphic.extend
(
{
    __constructor: function (data, options, parent)
    {
        this.defaultOptions = {
            width: 50,
            height: 24,
            clone: false,
            editInline: false,
            charLimit: 100
        };

        this.parent = parent;
        this.ID = sp.guid();
        this.itemID = data.ID;
        this.data = data;
        this.__super();
        this.options = $.extend({}, this.defaultOptions, options);
        this.$el = $(this.getGraphic());
        this.draw();
    },

    setColor: function (color)
    {
        this.$el.css('backgroundColor', color);
        return this;
    },

    setText: function (text)
    {
        text = text || "";
        if (!this.options.editInline)
        {
            this.$el.text(text);
        }
        else
        {
            $(this.innerDiv).html(text.replace(/\n/g, '<br/>'));
        }

        return this;
    },

    draw: function ()
    {
        var data = this.data;
        var $el = this.$el;
        var __this = this;

        this.setText(data.text);
        $el.data('dataItemId', data.ID);
        $el.attr('id', 'postit_'+data.ID)
        $el.addClass('post_it');

        $el.draggable({
            scroll: false,
            revert:'invalid',
            revertDuration:50,
            helper: this.options.clone? 'clone' : 'original',
            drag: $.proxy(this.onDrag, this),
            start: function(event,ui){ if(__this.options.clone) $(ui.helper).html(""); }
        });

        $el.css({
            height: this.options.height,
            width: this.options.width,
            position: 'absolute'
        });

        if (this.options.editInline)
        {
            this.innerDiv = document.createElement('div');
            $(this.innerDiv).css({
                position: 'absolute',
                width: $el.width(),
                height: $el.height(),
                background: 'none',
                cursor: 'default'
            });
            $el.append(this.innerDiv);

            this.textarea = new sp.ui.inputs.MultiInput({type: sp.ui.inputs.MultiInputTypes.TEXTAREA});
            var $textarea = $(this.textarea.getGraphic());
            $textarea.keypress($.proxy(this.onKeyPress, this));
            $textarea.css({
                position: 'absolute',
                width: $el.width(),
                height: $el.height(),
                background: 'none',
                border: 'none',
                visibility: 'hidden',
                resize: 'none'
            });
            $el.append(this.textarea.getGraphic());

            $el.click($.proxy(this.dispatchClick, this));
        }

        $el.dblclick($.proxy(this.dispatchDoubleClick, this));
    },

    onKeyPress: function(event)
    {
        if (event.charCode !== 0 && $(this.textarea.getGraphic()).val().length  + 1 > this.options.charLimit) {return false}
    },

    onDrag: function(event, ui)
    {
        this.updateCurrentColor(ui.helper);
        var DragEvent = sp.core.events.DragEvent;
        this.dispatchEvent(new DragEvent(this, DragEvent.DRAG));
    },

    updateCurrentColor: function(uihelper)
    {
        var row = 0;
        if (this.options.clone)
        {
            row = Math.floor((uihelper.position().top-this.parent.canvasYOffset) / this.parent.getRowHeight());
        }
        else
        {
            row = Math.floor(uihelper.position().top / this.parent.getRowHeight());
        }
        $(uihelper).css('backgroundColor', this.parent.options.rowColors[row] || "white");
    },

    dispatchClick: function (originalEvent)
    {
        var MouseEvent = sp.core.events.MouseEvent;
        this.dispatchEvent(new MouseEvent(this, MouseEvent.CLICK, originalEvent));
    },

    dispatchDoubleClick: function (originalEvent)
    {
        var MouseEvent = sp.core.events.MouseEvent;
        this.dispatchEvent(new MouseEvent(this, MouseEvent.DOUBLECLICK, originalEvent));
    }
}
);

sp.ui.charts.sunchart.Arrow = sp.core.graphics.Graphic.extend
(
{
    __constructor: function (arrowWidth, arrowHeight, editInline)
    {
        this.__super();
        this.$el = $(this.getGraphic());

        if (editInline)
        {
            this.placeholder = this.create('div', {classes:['arrow_placeholder']}).getGraphic();
            $(this.placeholder).mouseup($.proxy(this.onPlaceholderMouseUp, this));
        }

        this.arrowWidth = arrowWidth;
        this.arrowHeight = arrowHeight;
        this.inlineEdit = editInline || false;

        this.render();
    },

    onPlaceholderMouseUp: function()
    {
        if (this.preventDefault)
        {
            this.preventDefault = false;
            return;
        }
        this.$el.css('z-index', '102');
        this.textContainer.focus();
        this.textContainer.blur($.proxy(this.onTextBlur, this));
        return false;
    },

    onTextBlur: function()
    {
        this.$el.css('z-index', '99');
        $(this.placeholder).removeClass('active');
    },

    setText: function (text)
    {
        var arrowHeight = this.arrowHeight;
        var arrowWidth = this.arrowWidth;
        var $textContainer = this.textContainer;

        if ($textContainer.is('textarea'))
        {
            $textContainer.val($.trim(text));
            $textContainer.height(0);
            var _h = Math.min($textContainer[0].scrollHeight, 100);
            $textContainer.height(_h);
            $textContainer.css({marginTop : - _h / 2});

            $textContainer.change(function(){
                $textContainer.height(0);
                var _h = Math.min($textContainer[0].scrollHeight, 100);
                $textContainer.height(_h);
                $textContainer.css({marginTop : - _h / 2});
            });
        }
        else
        {
            $textContainer.html(text);
            var textContainerTopPosition = (arrowHeight - $textContainer.height())/2;
            if (textContainerTopPosition > 0.2*arrowHeight) $textContainer.css('top', textContainerTopPosition);
        }
    },

    render: function ()
    {
        var $el = this.$el;
        var $ph = $(this.placeholder);

        var arrowHeight = this.arrowHeight;
        var arrowWidth = this.arrowWidth;

        $el.addClass("arrow_container");
        $el.css({
            position: 'absolute',
            right: 0,
            height: arrowHeight,
            width: arrowWidth
        });

        if (this.inlineEdit)
        {
            $ph.css({
                position: 'absolute',
                right: 0.2*arrowWidth,
                width: 0.62*arrowWidth,
                height: arrowHeight
            });
        }

        var arrowCanvas = new sp.core.graphics.Graphic().createElement("canvas");
        $(arrowCanvas).
            css({position: 'absolute', left: 0, top: 0}).
            attr('width', arrowWidth).
            attr('height', arrowHeight);
        $el.append(arrowCanvas);

        if (this.inlineEdit)
        {
            var textContainer = $('<textarea />').css(
                {
                    position: 'absolute',
                    width: 0.6*arrowWidth,
                    minHeight: '20px',
                    maxHeight: '100px',
                    lineHeight: '20px',
                    padding: 0,
                    left: 0.15*arrowWidth,
                    top: '50%',
                    marginTop: '-10px',
                    textAlign: 'center',
                    resize: 'none',
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    overflow: 'hidden'
                });
        }
        else
        {
            var textContainer = $('<div />').css(
                {
                    position: 'absolute',
                    width: 0.8*arrowWidth,
                    height: 0.6*arrowHeight,
                    left: 0,
                    top: 0.2*arrowHeight,
                    textAlign: 'center'
                });
        }
        $el.append(textContainer);
        this.textContainer = textContainer;

        textContainer.dblclick($.proxy(this.dispatchDoubleClick, this));
    },

    dispatchDoubleClick: function (originalEvent)
    {
        var MouseEvent = sp.core.events.MouseEvent;
        this.dispatchEvent(new MouseEvent(this, MouseEvent.DOUBLECLICK, originalEvent));
    },

    remove: function()
    {
        if (this.placeholder) $(this.placeholder).remove();
        this.__super();
    }
}
)

sp.ui.charts.sunchart.Label = sp.core.graphics.Graphic.extend
(
{
    __constructor: function (options)
    {
        this.defaultOptions = {
            label: null,
            width: 200,
            height: 24,
            vertical: false,
            type: sp.ui.charts.sunchart.Label.Type.COLUMN,
            index: 0,
            maxLength: 0
        };
        this.__super();
        this.options = $.extend({}, this.defaultOptions, options);

        this.index = this.options.index;
        this.type = this.options.type;
        this.label = this.options.label;

        this.$el = $(this.getGraphic());
    },

    render: function ()
    {
        var o = this.options;
        var $el = this.$el;

        var orientation = o.vertical? 'vertical' : 'horizontal';
        $el.addClass('sunchart_label ' + orientation);
        $el.empty();

        var canvasW = o.vertical? o.height : o.width;
        var canvasH = o.vertical? o.width : o.height;

        $el.width(canvasW);
        $el.height(canvasH);

        this.canvas = new sp.core.graphics.Graphic().createElement("canvas");
        $(this.canvas).attr("width", canvasW).attr("height", canvasH);
        $el.append(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.context.textBaseline = 'middle';
        var context = this.context;
        context.textAlign = "center";
        context.font = "12pt sans-serif";
        if (o.vertical)
        {
            context.translate(0, canvasH);
            context.rotate(-Math.PI/2);
        }
        this.context.fillText(sp.utils.XMLUtils.unescapeFromHTML(o.label), o.width/2, o.height/2);

        var hideIcon = $("<a class='hide_button' href='#'>&nbsp;</a>").attr('title','Hide');
        var hideIconPositionDeterminingDimension = o.vertical? canvasW : canvasH;
        var hideIconPosition = {};
        hideIconPosition[o.vertical? "left" : "right"] = (hideIconPositionDeterminingDimension-16)/2;
        hideIconPosition.top = (hideIconPositionDeterminingDimension-16)/2;
        hideIcon.css(hideIconPosition);

        var inputFieldDeterminingDimension = o.vertical? canvasH : canvasW;
        this.inputField = new sp.ui.inputs.MultiInput();
        var $inputField = $(this.inputField.getGraphic());
        $inputField.width(inputFieldDeterminingDimension - 20);
        var inputFieldMargin = {};
        if (o.vertical)
        {
            inputFieldMargin['margin-top'] = 8;
        }
        else
        {
            inputFieldMargin['margin-left'] = 8;
        }
        if (o.maxLength > 0) $inputField.attr('maxlength', o.maxLength);
        $inputField.css('position','absolute');
        $inputField.css(inputFieldMargin);
        $inputField.css('z-index','9999');
        $inputField.css("visibility","hidden");

        $el.append(hideIcon);
        $el.append(this.inputField.getGraphic());

        $el.click($.proxy(this.dispatchClick, this));
        $el.dblclick($.proxy(this.dispatchDoubleClick, this));
        hideIcon.click($.proxy(this.dispatchHide, this));
    },

    dispatchDoubleClick: function (originalEvent)
    {
        var MouseEvent = sp.core.events.MouseEvent;
        this.dispatchEvent(new MouseEvent(this, MouseEvent.DOUBLECLICK, originalEvent));
    },

    dispatchClick: function (originalEvent)
    {
        var MouseEvent = sp.core.events.MouseEvent;
        this.dispatchEvent(new MouseEvent(this, MouseEvent.CLICK, originalEvent));
    },

    dispatchHide: function (originalEvent)
    {
        originalEvent.stopPropagation();
        var Event = sp.core.events.Event;
        this.dispatchEvent(new Event(this, Event.HIDE));
    }
}
);
sp.ui.charts.sunchart.Label.Type =
{
    COLUMN: 'column',
    ROW: 'row'
}

sp.ui.charts.sunchart.EditPostItDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function (charLimit)
    {
        this.__super();
        this.renderControls();
        this.charLimit = charLimit;
    },

    renderControls: function()
    {
        var $el = $(this.getGraphic());
        $el.addClass('sp_ui_sunchart_edit_postit_dialog');
        this.textarea = document.createElement('textarea');
        $(this.textarea).keypress($.proxy(this.onKeyPress, this));
        $el.append(this.textarea);
    },

    getSettings: function ()
    {
        return {
            title: "Edit Post It",
            width: 300,
            height: 200
        }
    },

    setData: function (data)
    {
        this.itemID = data.ID;
        $(this.textarea).val(data.text);
    },

    getData: function ()
    {
        return {
            ID: this.itemID,
            text: $(this.textarea).val()
        }
    },

    onKeyPress: function(event)
    {
        if (event.charCode !== 0 && $(this.textarea).val().length  + 1 > this.charLimit) {return false}
    }
}
)

sp.ui.charts.sunchart.EditLabelDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function ()
    {
        this.__super();
        this.renderControls();
    },

    renderControls: function()
    {
        var $el = $(this.getGraphic());
        $el.addClass('sp_ui_sunchart_edit_label_dialog');
        this.input = document.createElement('input');
        $el.append(this.input);
    },

    getSettings: function ()
    {
        return {
            title: "Edit Label",
            width: 300,
            height: 150
        }
    },

    setData: function (label)
    {
        this.labelIndex = label.index;
        this.labelType = label.type;
        $(this.input).val(label.label);
    },

    getData: function ()
    {
        return {
            labelIndex: this.labelIndex,
            labelType: this.labelType,
            label: $(this.input).val()
        }
    }
}
)

sp.ui.charts.sunchart.EditArrowTextDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function ()
    {
        this.__super();
        this.renderControls();
    },

    renderControls: function()
    {
        var $el = $(this.getGraphic());
        $el.addClass('sp_ui_sunchart_edit_arrow_dialog');
        this.textarea = document.createElement('textarea');
        $el.append(this.textarea);
    },

    getSettings: function ()
    {
        return {
            title: "Edit Arrow Text",
            width: 300,
            height: 200
        }
    },

    setData: function (text)
    {
        $(this.textarea).val(text);
    },

    getData: function ()
    {
        return $(this.textarea).val();
    }
}
);
