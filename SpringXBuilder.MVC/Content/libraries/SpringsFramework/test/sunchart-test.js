sp.namespace('sp.ui.charts.test.SunChartTest');

sp.ui.charts.test.SunChartTest = Class.extend
(
{
    run: function()
    {
        var opts = new sp.ui.charts.SunChartOptions();
        opts.width = 800;
        opts.height = 480;
        opts.columnVisibility = [true, true, true, true]
        opts.rowVisibility = [true, true, true, true]
        var chart = new sp.ui.charts.SunChart($('#chartcontainer'), opts);

        var testData = new sp.core.data.IndexedDataList();
        testData.updateItem({
            ID: sp.guid(),
            text: 'test text',
            column: 0,
            row: 0,
            xRatio: 0.5,
            yRatio: 0.5
        });
        testData.updateItem({
            ID: sp.guid(),
            text: 'test2text',
            column: 1,
            row: 3,
            xRatio: 0.1,
            yRatio: 0.1
        });
        testData.updateItem({
            ID: sp.guid(),
            text: 'other',
            column: 3,
            row: 2,
            xRatio: 0.1,
            yRatio: 0.1
        });

        chart.setDataProvider(testData)
        chart.draw();
        this.chart = chart;

        this.testInitialDraw()
        this.testModelItemAdd();
    },

    testInitialDraw: function ()
    {
        this.test("After initial draw, there are 3 postits on the canvas", $(this.chart.itemsOverlay).find('.post_it').length, 3)
    },

    testModelItemAdd: function ()
    {
        this.chart.dataProvider.updateItem({
            ID: sp.guid(),
            text: 'new item',
            column: 2,
            row: 0,
            xRatio: 0.5,
            yRatio: 0.5
        })


        this.test("After adding item to model, there are 4 postits on the canvas", $(this.chart.itemsOverlay).find('.post_it').length, 4)
    },

    resize: function ()
    {
        this.chart.options.width = 600;
        this.chart.options.height = 320;
        this.chart.redraw();
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