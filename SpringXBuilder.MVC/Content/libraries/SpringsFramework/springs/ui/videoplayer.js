sp.namespace(
    "sp.ui.video.VideoPlayer",
    "sp.ui.video.VideoPlayerOptions"
);

/*
    NOTE: flash player works only when served via a webserver
 */
sp.ui.video.VideoPlayer = sp.core.graphics.Graphic.extend
(
{
    __constructor: function (options)
    {
        this.options = options || new sp.ui.video.VideoPlayerOptions();

        this.playerLocation = options.playerLocation || '/SpringsFramework/res/flash/';
        this.playerPath = this.playerLocation + 'player.swf?v=1.3';

        this.__super();

        var url = this.options.url;
        if (!url) throw "No video url supplied to video control";

        var embedHtml = '';
        if (this.canPlayMp4ViaHtml5() && !this.options.forceFlash)
        {
            embedHtml = this.getHtml5PlayerHtmlCode();
        } else
        {
            embedHtml = this.getFlashPlayerHtmlCode();
        }
        $(this.getGraphic()).html(embedHtml);
    },

    getHtml5PlayerHtmlCode: function ()
    {
        var result = [
            "<video controls ",
                "src='", this.options.url, "' ",
                "width='", this.options.width,"' ",
                "height='", this.options.height,"' "
        ];
        if (this.options.thumbnail) result.push("poster='"+this.options.thumbnail+"' ")
        result.push("/>")

        result = result.join('')
        return result;
    },

    getFlashPlayerHtmlCode: function ()
    {
        var flashVarsValue = "skin="+this.playerLocation+"skins/mySkin.swf"
        if (this.options.thumbnail) flashVarsValue += "&thumbnail="+this.options.thumbnail;
        flashVarsValue += "&video="+this.options.url;

        var flashParams = {
            movie: this.playerPath,
            quality: "high",
            menu: "false",
            scale: "noscale",
            allowfullscreen: "true",
            allowscriptaccess: "always",
            swfliveconnect: "true",
            cachebusting: "false",
            flashvars: flashVarsValue
        };

        var result = [ '<object type="application/x-shockwave-flash" ',
            'data="', this.playerPath, '" ',
            'width="', this.options.width, '" ',
            'height="', this.options.height, '" >'];
        $.each(flashParams, function(k,v){result.push('<param name="'+k+'" value="'+v+'" />')})
        result.push('</object>');
        result = result.join('');
        return result;
    },

    canPlayMp4ViaHtml5: function ()
    {
        var video = document.createElement('video');
        return video.canPlayType && video.canPlayType('video/mp4');
    }

}
)

sp.ui.video.VideoPlayerOptions = sp.ui.charts.BaseChartOptions.extend
(
{
    setDefaults: function()
    {
        this.__super();

        this.forceFlash = false;
        this.thumbnail = '';
        this.url = '';
        this.width = '320';
        this.height = "240";
    }
}
);

