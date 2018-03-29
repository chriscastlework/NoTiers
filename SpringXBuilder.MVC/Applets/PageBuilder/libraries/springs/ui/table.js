sp.namespace("sp.ui.table.Table",
             "sp.ui.table.TableHeader",
             "sp.ui.table.TableOptions",
             "sp.ui.table.TableItemRenderer",
             "sp.ui.table.TableSorter",
             "sp.ui.table.TableSortOrder",
             "sp.ui.table.TableEvent");


sp.ui.table.Table = sp.core.events.EventDispatcher.extend
(
{

    __constructor: function(container, options)
    {
        this.__super();
        this.container = container;
        this.options = options || new sp.ui.table.TableOptions();
        this.init();
        this.setDataProvider([]);
        this.guid = sp.guid(12);
        this.selectedRow;
        this.headerCells = [];
        this.doubleClickTimeOut;
        this.sortIndex = -1;
        this.sortOrder;
        $(window).resize($.proxy(this.windowResizeHandler,this));
    },

    windowResizeHandler:function()
    {
        if (this.__resizeTimeout) clearTimeout(this.__resizeTimeout);
        this.__resizeTimeout = setTimeout(this.__adjustHeaderProxied, 300);
    },

    setDataProvider: function(dataProvider)
    {
        this.dataProvider = sp.core.data.DataUtils.toArray(dataProvider);
        this.originalData = this.dataProvider.slice(); //used to restore the original sort order of the data where necessary
        this.data = this.dataProvider.slice();
        this.applyUserSortOrder();
        this.onSort();
        this.draw();
    },

    applyUserSortOrder: function()
    {
        if (!this.options.sortable) return;
        this.data.sort(function(a,b){return a.SORTORDER - b.SORTORDER});
    },

    resize: function(w, h)
    {
        $(this.container).css("height", h);
        this.draw();
    },

    getDataProvider: function()
    {
        return this.dataProvider;
    },

    init: function()
    {
        var __this = this;
        this.rows = [];

        this.header = document.createElement("table");
        this.headerRow = document.createElement("tr");
        $(this.header).append(this.headerRow);
        $(this.header).attr("id", "tableheader_" + sp.guid());
        $(this.header).attr("width", "100%");
        $(this.header).addClass(this.options.headerClass);
        $(this.container).append(this.header);

        this.rowContainer = document.createElement("div");
        $(this.rowContainer).attr("id", sp.guid());
        $(this.rowContainer).css("overflow",  this.options.overflow);
        $(this.rowContainer).css("overflow-x",  this.options.overflowx);
        $(this.rowContainer).css("overflow-y",  this.options.overflowy);
        $(this.rowContainer).css("width", "100%");
        var h = $(this.container).height() - $(this.header).height();
        if (h) $(this.rowContainer).height(h);
        $(this.rowContainer).css("float", "left");
        $(this.container).append(this.rowContainer);

        this.rowTable = document.createElement("table");
        $(this.rowTable).attr("id", "tablerows_" + sp.guid());
        $(this.rowTable).attr("width", "100%");
        $(this.rowContainer).append(this.rowTable);
        $(this.rowContainer).scroll(function(){__this.onScroll()});

        this.drawHeader();

        if (this.options.selectRowOnClick)
        {
            this.addEventListener(this, sp.ui.table.TableEvent.CELLCLICK, function(event){ __this.selectRow(event.row,'singleClick'); });
            this.addEventListener(this, sp.ui.table.TableEvent.CELLDOUBLECLICK, function(event){ __this.selectRow(event.row,'dblClick'); });
        }
    },

    setSelectedIndex: function(index)
    {
        if(this.rows[index]) this.selectRow(this.rows[index]);
    },

    onScroll:function(event)
    {
        this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.SCROLL,{},event));
    },

    getScroll:function()
    {
       return $(this.rowContainer).scrollTop();
    },

    setScroll:function(val)
    {
        $(this.rowContainer).scrollTop(val);
    },

    setSelectedRowByProperty: function(prop, val)
    {
        for (var i = 0; i < this.rows.length; i++)
        {
            var rowData = $(this.rows[i]).data("rowData")
            if (rowData)
            {
                if (rowData[prop] === val)
                {
                    this.selectRow(this.rows[i]);
                    break;
                }
            }
        }
    },

    selectRow: function(row, evtType)
    {
        if (this.selectedRow) $(this.selectedRow).removeClass(this.options.rowClassSelected);
        if (this.selectedRow === row && evtType != 'dblClick') //this way we avoid deselecting the row on dblClick which causes opening unpopulated edit dialogs
        {
            this.selectedRow = null;
            return;
        }
        this.selectedRow = row;
        $(this.selectedRow).addClass(this.options.rowClassSelected);
    },

    deselectAllRows: function()
    {
        this.selectedRow = null;
        var __this = this;
        $(this.rows).each(function(index, value) {
            $(value).removeClass(__this.options.rowClassSelected);
        });
    },

    checkScroll: function()
    {

    },

    refreshLayout: function()
    {
        $(this.header).css("width", this.rowTable.clientWidth);
    },

    drawHeader: function()
    {
        $(this.headerRow).empty();
        this.headerCells = [];
        for (var i = 0; i < this.options.props.length; i++)
        {
            var header = this.options.headerRenderer.render(i, this);

            if (!header.getGraphic)
            {
                alert('[sp.ui.table.Table] ERROR: header renderer must return a sp.core.graphics.Graphic object');
                break;
            }
            var h = header.getGraphic();
            var innerContainer = sp.core.graphics.create('div', {classes: ['table_header_inner_container'], html: $(h).html()});
            $(h).html('');
            header.addElement(innerContainer);

            $(this.headerRow).append(h);
            this.headerCells.push(header);
        }
    },

    onClickHeader: function(event)
    {
        if (!this.options.sortableColumns || this.data.length < 2) return;
        if (this.selectedHeader && this.selectedHeader != event.target) this.selectedHeader.setSortOrder(sp.ui.table.TableSortOrder.NONE);
        this.selectedHeader = event.target;
        this.selectedHeader.setSortOrder(sp.ui.table.TableSortOrder.getNext(event.target.getSortOrder()));
        this.onSort();
    },

    sortByProperty: function(prop, order)
    {
        this.selectedHeader = this.getHeaderCellByProperty(prop);
        if (this.selectedHeader)
        {
            this.selectedHeader.setSortOrder(order || sp.ui.table.TableSortOrder.DESCENDING);
            this.onSort();
        }
    },

    getHeaderCellByProperty: function(prop)
    {
        for (var i = 0; i < this.headerCells.length; i++)
        {
            if (this.headerCells[i].getProperty() == prop) return this.headerCells[i];
        }
    },

    onSort: function()
    {
        if (!this.selectedHeader) return;
        var __prop = this.selectedHeader.getProperty();
        var __order = this.selectedHeader.getSortOrder();
        var __sorter = this.options.sort;
        if (__order == sp.ui.table.TableSortOrder.NONE)
        {
            if (this.originalData) this.data = this.originalData.slice(); //to restore the original sort order of the data
            this.applyUserSortOrder();
        }
        else this.data.sort(function(a,b){return __sorter(a, b, __prop, __order);});
        this.drawRows();
    },

    onClickCell: function(cell, originalEvent, rowIndex, colIndex)
    {
        var row = cell.parentNode;
        var eventType = sp.ui.table.TableEvent.CELLCLICK;
        var event = new sp.ui.table.TableEvent(this,eventType,colIndex,rowIndex,$(cell).data("rowData"),cell,row);
        event.originalEvent = originalEvent;
        this.dispatchEvent(event);
    },

    onDoubleClickCell: function(cell, originalEvent, rowIndex, colIndex)
    {
        var row = cell.parentNode;
        var eventType = sp.ui.table.TableEvent.CELLDOUBLECLICK;
        var event = new sp.ui.table.TableEvent(this,eventType,colIndex,rowIndex,$(cell).data("rowData"),cell,row);
        event.originalEvent = originalEvent;
        this.dispatchEvent(event);
    },

    onMouseDownCell: function(cell, originalEvent, rowIndex, colIndex)
    {
        var row = cell.parentNode;
        var eventType = sp.ui.table.TableEvent.CELLMOUSEDOWN;
        var event = new sp.ui.table.TableEvent(this,eventType,colIndex,rowIndex,$(cell).data("rowData"),cell,row);
        event.originalEvent = originalEvent;
        this.dispatchEvent(event);
    },

    onMouseUpCell: function(cell, originalEvent, rowIndex, colIndex)
    {
        var row = cell.parentNode;
        var eventType = sp.ui.table.TableEvent.CELLMOUSEUP;
        var event = new sp.ui.table.TableEvent(this,eventType,colIndex,rowIndex,$(cell).data("rowData"),cell,row);
        event.originalEvent = originalEvent;
        this.dispatchEvent(event);
    },

    onMouseMoveCell: function(cell, originalEvent, rowIndex, colIndex)
    {
        var row = cell.parentNode;
        var eventType = sp.ui.table.TableEvent.CELLMOUSEMOVE;
        var event = new sp.ui.table.TableEvent(this,eventType,colIndex,rowIndex,$(cell).data("rowData"),cell,row);
        event.originalEvent = originalEvent;
        this.dispatchEvent(event);
    },

    getSelectedRowData: function()
    {
        return (this.selectedRow) ? $(this.selectedRow).data("rowData") : false;
    },

    drawRows: function()
    {
        var __this = this;
        var selectedRowData = this.getSelectedRowData(); // get it before emptying the table, as it is lost then
        for(var i=0;i<this.rows.length; i++)
        {
            $(this.rows[i]).unbind();
        };
        this.rows = [];
        $(this.rowTable).empty()
        for (var i = 0; i < this.data.length; i++)
        {
            var tr = document.createElement("tr");
            for (var n = 0; n < this.options.props.length; n++)
            {
                var td;
                if (td = this.options.itemRenderer.render(null, n, i, this.data, this.options.props[n], this))
                {
                    $(td).addClass(this.options.rowCellClass);
                    $(td).css("width", this.options.widths[n]);
                    $(td).css("max-width", this.options.widths[n]);
                    $(td).css("min-width", this.options.widths[n]);
                    $(td).css("overflow", "hidden");
                    $(td).data("rowData", this.data[i]);
                    $(td).data("columnIndex", n);
                    $(td).data("cellProp", this.options.props[n]);

                    var bindMouseEvents = function(rowIndex, colIndex)
                    {
                        $(td).click(function(event){ __this.onClickCell(this,event,rowIndex,colIndex); });
                        $(td).dblclick(function(event){ __this.onDoubleClickCell(this,event,rowIndex,colIndex); });
                        $(td).mousedown(function(event){ __this.onMouseDownCell(this,event,rowIndex,colIndex); });
                        $(td).mouseup(function(event){ __this.onMouseUpCell(this,event,rowIndex,colIndex); });
                        $(td).mousemove(function(event){ __this.onMouseMoveCell(this,event,rowIndex,colIndex); });

                        $(td).bind('touchstart', function(event){
                            var cellRef = this;
                            __this.onMouseDownCell(this,event,rowIndex,colIndex);
                            if (__this.touchTimeout) clearTimeout(__this.touchTimeout);
                            __this.touchTimeout = setTimeout(function(){ __this.onDoubleClickCell(cellRef,event,rowIndex,colIndex); }, 800);
                        });
                        $(td).bind('touchend', function(event){
                            if (__this.touchTimeout) clearTimeout(__this.touchTimeout);
                            __this.onMouseUpCell(this,event,rowIndex,colIndex);
                        });
                        $(td).bind('touchmove', function(event){ __this.onMouseMoveCell(this,event,rowIndex,colIndex); });
                    };
                    bindMouseEvents(i, n);

                    $(tr).append(td);
                }
            }
            $(tr).data("rowData", this.data[i]);
            $(tr).addClass(this.options.rowClass);

            if(sp.core.data.DataUtils.toBoolean(this.options.inlineDelete))
            {
                $(tr).data("guid",sp.guid());
                $(tr).addClass("deletable");
                var deleteButton = document.createElement("td");
                $(deleteButton).addClass("delete");
                $(deleteButton).data("rowData", this.data[i]);
                $(deleteButton).css("display","none");
                $(tr).data("deleteButton",deleteButton);
                $(deleteButton).click(function(event){__this.onDeleteRow(event)});
                $(tr).mousedown(function(event){
                    $(".deletable .delete").css("display","none");
                    var button = $(this).data("deleteButton");
                    $(button).css("display","block");
                });
                $(tr).append(deleteButton);
            }

            this.rows.push(tr);
            $(this.rowTable).append(tr);
        }
        if (selectedRowData)
        {
            for (var i = 0; i < this.rows.length; i++)
            {
                if (selectedRowData == $(this.rows[i]).data("rowData"))
                {
                    this.selectRow(this.rows[i]);
                    break;
                }
            }
        }
        if (this.options.sortable) $(this.rowTable).find('tbody').sortable(
        {
            helper: function(e, ui) {
                ui.children().each(function() {
                    $(this).width($(this).width());
                });
                return ui;
            },
            stop: $.proxy(this.onSortableStop, this)
        });
    },

    onSortableStop: function()
    {
        var newData = [];
        $(this.rowTable).find("tr").each(function(i,row)
        {
            var item = $(row).data("rowData");
            item.SORTORDER = i;
            newData.push(item);
        });
        this.setDataProvider(newData);
    },

    onDeleteRow:function(event)
    {
        this.dispatchEvent(new sp.core.events.UIEvent(this,sp.core.events.UIEvent.REMOVE,$(event.target).data("rowData"), event));
    },

    hasScrollbar: function()
    {
        var hasScrollbar = this.rowTable.clientHeight > this.rowContainer.clientHeight;
        return hasScrollbar;
    },

    adjustHeader:function()
    {
        var firstRow = $(this.rowTable).find("tr").get(0);
        if (!firstRow) return;
        if (this.rowTable.scrollHeight==0) return; // table is not visible yet

        var referenceCells = $(firstRow).find('td');
        var headerCells = $(this.headerRow).find('td');
        var hasScrollbar = this.rowTable.clientHeight > this.rowContainer.clientHeight;

        if (headerCells.length != referenceCells.length)
        {
            sp.out("Table::adjustHeader header cells count is different than table cells count. Returning");
            return;
        }
        for (var i=0,len=referenceCells.length; i<len; i++)
        {
            var w = $(referenceCells[i]).width();
            if (i==len-1 && hasScrollbar && !sp.isOnTablet()) w += 16;
            $(headerCells[i]).css({minWidth: w, width: w, maxWidth: w});
        }
    },

    draw: function()
    {
        this.adjustHeader();
        this.drawRows();
        if (!this.__adjustHeaderProxied) this.__adjustHeaderProxied = $.proxy(this.adjustHeader, this);
        setTimeout(this.__adjustHeaderProxied, 0);

        var event = new sp.ui.table.TableEvent(this, sp.ui.table.TableEvent.DRAW);
        this.dispatchEvent(event);
    }
}
);

sp.ui.table.TableHeader = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(index, options)
    {
        this.__super();
        this.index = index;
        this.options = options; // is a reference to the parent table's options
        this.sortOrder = sp.ui.table.TableSortOrder.NONE;
        this.init();
    },

    getIndex: function()
    {
        return this.index;
    },

    getProperty:function()
    {
        return this.options.props[this.index];
    },

    init: function()
    {
        this.__graphic = this.createElement("td", { "width": this.options.widths[this.index] , "min-width":this.options.widths[this.index], "max-width":this.options.widths[this.index]}, [this.options.headerCellClass]);
        $(this.getGraphic()).html(this.options.labels[this.index]);
        var __this = this;
        $(this.__graphic).click(function() { __this.onClick() });
    },

    getSortOrder: function()
    {
        return this.sortOrder;
    },

    setSortOrder: function(val)
    {
        this.sortOrder = val;
        $(this.getGraphic()).removeClass("ascending");
        $(this.getGraphic()).removeClass("descending");
        if (this.sortOrder)
        {
            var cls = (this.sortOrder == sp.ui.table.TableSortOrder.ASCENDING) ? "ascending" : (this.sortOrder == sp.ui.table.TableSortOrder.DESCENDING) ? "descending" : "";
            $(this.getGraphic()).addClass(cls);
        }
    },

    onClick: function()
    {
        this.dispatchEvent(new sp.core.events.MouseEvent(this, sp.core.events.MouseEvent.CLICK));
    },

    setText:function(val)
    {
        $(this.getGraphic()).html(val);
    }
}
);

sp.ui.table.TableOptions = function (props,widths,labels)
{

    this.widths = widths || [];
    this.props = props || [];
    this.labels = labels || [];
    this.overflow = "auto";
    this.overflowy = "auto";
    this.overflowx = "hidden";
    this.selectRowOnClick = true;
    this.headerClass = "table_header";
    this.headerCellClass = "table_header_cell";
    this.rowClass = "table_row";
    this.rowCellClass = "table_row_cell";
    this.rowClassSelected = "table_row_selected";
    this.itemRenderer = new sp.ui.table.TableItemRenderer();
    this.headerRenderer = new sp.ui.table.TableHeaderRenderer();
    //TODO - need to remove sorter option entirely from future releases of framework...deprecate in favour of sort function...
    this.sorter = new sp.ui.table.TableSorter();
    this.inlineDelete = false;
    this.sortable = false;
    this.sortableColumns = true;
    this.sortMethods = [];
    this.sort = function(a,b,prop,order)
    {
        if ($.type(a[prop]) === "string")
        {
            var a = a[prop];
            var b = b[prop] || "";
            var caseSensitiveStringSort = function (a, b)
            {
                // sort A a B b C c, etc
                var lowerCaseComparison = a.toLowerCase().localeCompare(b.toLowerCase());
                return lowerCaseComparison==0? (a>b? 1 : (a < b? -1 : 0)) : lowerCaseComparison;
            };

            if (order == sp.ui.table.TableSortOrder.ASCENDING) return caseSensitiveStringSort(a,b);
            if (order == sp.ui.table.TableSortOrder.DESCENDING) return caseSensitiveStringSort(a,b)*-1;
            return 0;
        }
        if (order == sp.ui.table.TableSortOrder.ASCENDING) return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0;
        if (order == sp.ui.table.TableSortOrder.DESCENDING) return (a[prop] > b[prop]) ? -1 : (a[prop] < b[prop]) ? 1 : 0;
        return 0;
    }
    this.addColumn = function(prop,width,lbl)
    {
        this.props.push(prop);
        this.widths.push(width);
        this.labels.push(lbl);
    }
}


sp.ui.table.TableItemRenderer = Class.extend
(
{
    render: function(cell, columnIndex, rowIndex, data, prop, table)
    {
        if (!cell) cell = document.createElement("td");
        $(cell).html(data[rowIndex][prop] || "&nbsp");
        return cell;
    },

    getData: function(cell, columnIndex, data, prop)
    {

    }
}
);

sp.ui.table.TableHeaderRenderer = Class.extend
(
{
    render: function(columnIndex, table)
    {
        var header = new sp.ui.table.TableHeader(columnIndex, table.options);
        header.addEventListener(table, sp.core.events.MouseEvent.CLICK, table.onClickHeader);
        return header;
    }
}
);

sp.ui.table.TableSorter = Class.extend
(
{
    /*sort: function(data, prop, order)
    {
        function sortProp(a, b)
        {
            if (order == sp.ui.table.TableSortOrder.ASCENDING) return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0;
            if (order == sp.ui.table.TableSortOrder.DESCENDING) return (a[prop] > b[prop]) ? -1 : (a[prop] < b[prop]) ? 1 : 0;
            return 0;
        }
        data.sort(sortProp);
        return data;
    }*/
    sort:function(a,b,prop,order)
    {
        if (order == sp.ui.table.TableSortOrder.ASCENDING) return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0;
        if (order == sp.ui.table.TableSortOrder.DESCENDING) return (a[prop] > b[prop]) ? -1 : (a[prop] < b[prop]) ? 1 : 0;
        return 0;
    }
}
);

sp.ui.table.TableEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target,type,colIndex,rowIndex,data,cell,row)
    {
        this.__super(target,type);
        this.originalEvent = null;
        this.colIndex = colIndex;
        this.rowIndex = rowIndex
        this.data = data;
        this.cell = cell;
        this.row = row;
    }
}
);

sp.ui.table.TableEvent.CELLCLICK = 'cellclick';
sp.ui.table.TableEvent.CELLDOUBLECLICK = 'celldoubleclick';
sp.ui.table.TableEvent.CELLMOUSEDOWN = 'cellmousedown';
sp.ui.table.TableEvent.CELLMOUSEUP = 'cellmouseup';
sp.ui.table.TableEvent.CELLMOUSEMOVE = 'cellmousemove';
sp.ui.table.TableEvent.DRAW = 'tabledraw';

sp.ui.table.TableSortOrder =
{
    ASCENDING: 1,
    DESCENDING: 2,
    NONE:0,
    getNext:function(val)
    {
     return (val==this.ASCENDING)? this.DESCENDING : (val==this.DESCENDING)? this.NONE : this.ASCENDING;
    }

};

