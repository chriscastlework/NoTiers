sp.namespace('sp.ui.video.test.VideoTest');

sp.ui.video.test.VideoTest = Class.extend
(
{
    run: function()
    {
        var options = new sp.ui.video.VideoPlayerOptions();
        options.url = '/SpringsFramework/test/sample.mp4';
        options.thumbnail = '/SpringsFramework/test/thumbnail.jpg';
        var player = new sp.ui.video.VideoPlayer(options);
        $("#video").append(player.getGraphic());

        var options2 = new sp.ui.video.VideoPlayerOptions();
        options2.url = '/SpringsFramework/test/sample.mp4';
        options2.thumbnail = '/SpringsFramework/test/thumbnail.jpg';
        options2.forceFlash = true;
        var player2 = new sp.ui.video.VideoPlayer(options2);
        $("#video2").append(player2.getGraphic());
    },

    test: function (desc, val1, val2)
    {
        if (val1 === val2)
        {
            console.log('[success] '+desc);
        }
        else
        {
            console.error('[fail] '+desc+' ::: expected '+val2+' but got '+val1);
        }
    }
}
);