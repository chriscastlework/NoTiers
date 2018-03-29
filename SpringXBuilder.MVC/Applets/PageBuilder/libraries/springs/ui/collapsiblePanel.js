sp.namespace("sp.ui.collapsiblePanel.CollapsiblePanel",
    "sp.ui.collapsiblePanel.CollapsiblePanelOptions");

sp.ui.collapsiblePanel.CollapsiblePanel = sp.core.graphics.Graphic.extend
    (
        {
            __constructor: function (graphic, title, options)
            {
                this.__super(graphic);
                this.title = title;
                this.options = options != null ? options : new sp.ui.collapsiblePanel.CollapsiblePanelOptions();
                this.collapsed = this.options.collapsed;
                this.init();
            },
            init: function ()
            {
                var __this = this;
                $(this.getGraphic()).addClass("collapsiblePanelContainer");
                this.headerContainer = this.createElement("div", {}, ["collapsiblePanelHeaderContainer"]);
                this.addElement(this.headerContainer);
                this.titleLbl = this.createElement("div", {}, ["collapsiblePanelTitle"]);
                $(this.titleLbl).text(this.title);
                $(this.headerContainer).append(this.titleLbl);

                this.collapseBtn = this.createElement("div", {}, ["collapsiblePanelCollapseButton"]);
                $(this.collapseBtn).click(function ()
                {
                    __this.toggleContent();
                });
                this.setCollapseButtonState();
                $(this.headerContainer).append(this.collapseBtn);
                this.setupContent();
            },
            setupContent: function ()
            {
                this.content = this.createElement("div", {}, ["collapsiblePanelContentContainer"]);
                this.addElement(this.content);
                if (this.collapsed)
                {
                    $(this.content).hide();
                    this.contentBuild = false;
                }
                else
                {
                    this.buildContent();
                    this.contentBuilt = true;
                }
            },
            toggleContent: function ()
            {
                if (this.collapsed)
                {
                    this.collapsed = false;
                    $(this.content).show();
                    if (!this.contentBuilt)
                    {
                        this.contentBuilt = true;
                        this.buildContent();
                    }
                }
                else
                {
                    this.collapsed = true;
                    $(this.content).hide();
                }
                this.setCollapseButtonState();
            },
            setCollapseButtonState: function ()
            {
                if (this.collapsed)
                {
                    $(this.collapseBtn).addClass("collapsiblePanelCollapseButtonCollapsed");
                    $(this.collapseBtn).removeClass("collapsiblePanelCollapseButtonExpanded");
                }
                else
                {
                    $(this.collapseBtn).addClass("collapsiblePanelCollapseButtonExpanded");
                    $(this.collapseBtn).removeClass("collapsiblePanelCollapseButtonCollapsed");
                }
            },
            buildContent: function ()
            {
            },
            buildLabelValue: function (label, value, labelClasses, valueClasses)
            {
                var container = this.createElement("div", { width: "100%", margin: "10px", "clear": "right" });
                $(this.content).append(container);
                var titleLbl = this.createElement("div");
                for (var i = 0; i < labelClasses.length; i++)
                    $(titleLbl).addClass(labelClasses[i]);
                $(titleLbl).text(label);
                $(container).append(titleLbl);

                var valueLbl = this.createElement("div");
                for (var i = 0; i < valueClasses.length; i++)
                    $(valueLbl).addClass(valueClasses[i]);
                value = value != null ? value : "";
                if (!/\S/.test(value) || value == "undefined")
                    value = "N/A";
                $(valueLbl).text(value);
                $(container).append(valueLbl);

                return { Container: container, Label: titleLbl, ValueLabel: valueLbl };
            }
        }
    );

sp.ui.collapsiblePanel.CollapsiblePanelOptions = sp.core.data.ValueObject.extend
    (
        {
            __constructor: function (valueMap)
            {
                this.__super(valueMap);
            },
            setDefaults: function ()
            {
                this.collapsed = true;
            }
        }
    );