sp.namespace("sp.ui.preloader.Preloader",
             "sp.ui.preloader.PreloaderOptions");



sp.ui.preloader.Preloader = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(options)
    {
        this.options = options || new sp.ui.preloader.PreloaderOptions();
        this.__graphic = this.createElement("div", {}, [this.options.preloaderClass]);
        $(this.__graphic).css({ width: "100%", height: "100%", position: "absolute", top: "0px", left: "0px", 'z-index': 100000});
        this.mask = this.addElement(this.createElement("div", { width: "100%", height: "100%", position: "fixed", top: "0px", left: "0px" }, [this.options.maskClass]));
        this.content = this.addElement(this.createElement("div", {}, [this.options.contentClass]));
        this.image = this.createElement("div");
        $(this.image).html("<img src='" + this.options.imageURL + "'></img>");
        this.label = this.createElement("div", {}, [this.options.labelClass]);
        $(this.label).html(this.options.label || "");
        $(this.content).append(this.image);
        $(this.content).append(this.label);
        $(this.options.container).append(this.__graphic);
    },

    show: function(label)
    {
        $(this.label).html(label);
        sp.core.graphics.Utils.bringToFront(this.getGraphic());
        $(this.getGraphic()).show();
    },

    hide:function()
    {
        $(this.label).html("");
        $(this.getGraphic()).hide();
    },

    loadImages: function(imagesSourceURL)
    {
        var images = new Array();
        for (var i = 0, img = imagesSourceURL[i]; i < imagesSourceURL.length; i++, img = imagesSourceURL[i])
        {
            if (!img) continue;
            images[i] = new Image();
            images[i].src = img;
        }
    }
}
);

sp.ui.preloader.PreloaderOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.label = "Loading..";
        this.container = document.body;
        this.imageURL = "";
        this.maskClass = "mask";
        this.preloaderClass = "preloader";
        this.contentClass = "content";
        this.labelClass = "label";
    }
}
);
